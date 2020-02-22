/*
(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!
*/

var gui = {};
var grParse = {};
var producedWords = {};
var automParse = {};
var automMemory = null;
var wordProcuctions = [];
var lastLevelProduced = [];
var regex = null;
var thisLevel = 0;
var lastDerivMode = -1;//0: normal, 1: left

function init() {
    var allElems = document.getElementsByTagName("*");
    for (var i = 0; i < allElems.length; i++) {
        gui[allElems[i].id] = allElems[i];
    }

    setEnableParser(true);
    setEnableSyntaxTree(false);
    setEnableAutomata(false);
    setEnableGrammar(false);
    setEnableToAutomata(false);
    setEnabledRegex(false);

    gui.txtGrammar.addEventListener("change", grammarChange);
    gui.txtVars.addEventListener("change", grammarChange);
    gui.btnParse.addEventListener("click", parse);
    gui.btnDraw.addEventListener("click", draw);
    gui.btnDerivate.addEventListener("click", function () {
        derivate(loadDerivateParams());
    });
    gui.btnLatex.addEventListener("click", toLatex);
    gui.btnGramToAutom.addEventListener("click", grmmarToAutomata);
    gui.btnCheckAutom.addEventListener("click", checkWordAutom);
    gui.btnCheckGrammar.addEventListener("click", checkWordGrammar);
    gui.btnParseAutom.addEventListener("click", parseAutomata);
    gui.btnDerivateLeft.addEventListener("click", function () {
        leftDerivation(loadDerivateParams());
    });
    gui.btnSyntaxLatex.addEventListener("click", syntaxLatex);
    gui.btnCheckUnique.addEventListener("click", displayUnique);
    gui.btnStringGrammar.addEventListener("click", grammarToString);
    gui.btnJsonGrammar.addEventListener("click", stringToGrammar);
    gui.btnStringAutom.addEventListener("click", automataToString);
    gui.btnJsonAutom.addEventListener("click", stringToAutomata);
    gui.btnStringSyntaxTree.addEventListener("click", syntaxTreeToString);
    gui.btnJsonSyntaxTree.addEventListener("click", stringToSyntaxTree);
    gui.btnCopyClipboard.addEventListener("click", copyOutToClipboard);
    gui.btnNfaDfa.addEventListener("click", nfaToDfa);
    gui.btnProductautomata.addEventListener("click", productAutomata);
    gui.btnParseRegex.addEventListener("click", saveRegex);
    gui.btnCheckRegex.addEventListener("click", checkRegex);
    gui.btnRegexToAutomata.addEventListener("click", regexToAutomata);
    gui.btnRegexCreate.addEventListener("click", regexCreateWords);
    gui.btnRegEx.addEventListener("click", automataToRegex);

    window.onbeforeunload = saveFieldData;
    loadFieldData();
}

function setEnableParser(on) {
    if (on) {
        gui.btnParse.disabled = "";
        gui.btnParseAutom.disabled = "";
        gui.btnJsonGrammar.disabled = "";
        gui.btnJsonAutom.disabled = "";
        gui.btnParseRegex.disabled = "";
    } else {
        gui.btnParse.disabled = "disabled";
        gui.btnParseAutom.disabled = "disabled";
        gui.btnJsonGrammar.disabled = "disabled";
        gui.btnJsonAutom.disabled = "disabled";
        gui.btnParseRegex.disabled = "disabled";
    }
}

function setEnableGrammar(on) {
    if (on) {
        gui.btnCheckUnique.disabled = "";
        gui.btnDerivate.disabled = "";
        gui.btnDerivateLeft.disabled = "";
        gui.btnCheckGrammar.disabled = "";
        gui.btnStringGrammar.disabled = "";
    } else {
        gui.btnCheckUnique.disabled = "disabled";
        gui.btnDerivate.disabled = "disabled";
        gui.btnDerivateLeft.disabled = "disabled";
        gui.btnCheckGrammar.disabled = "disabled";
        gui.btnStringGrammar.disabled = "disabled";
    }
}

function setEnableAutomata(on) {
    if (on) {
        //gui.btnDraw.disabled = "";
        gui.btnLatex.disabled = "";
        gui.btnCheckAutom.disabled = "";
        gui.btnStringAutom.disabled = "";
        gui.btnNfaDfa.disabled = "";
        gui.btnProductautomata.disabled = "";
        gui.btnRegEx.disabled = "";
    } else {
        gui.btnDraw.disabled = "disabled";
        gui.btnLatex.disabled = "disabled";
        gui.btnCheckAutom.disabled = "disabled";
        gui.btnStringAutom.disabled = "disabled";
        gui.btnNfaDfa.disabled = "disabled";
        gui.btnProductautomata.disabled = "disabled";
        gui.btnRegEx.disabled = "disabled";
    }
}

function setEnableSyntaxTree(on) {
    if (on) {
        gui.btnSyntaxLatex.disabled = "";
        gui.btnStringSyntaxTree.disabled = "";
        //gui.btnJsonSyntaxTree.disabled = "";
    } else {
        gui.btnSyntaxLatex.disabled = "disabled";
        gui.btnStringSyntaxTree.disabled = "disabled";
        gui.btnJsonSyntaxTree.disabled = "disabled";
    }
}

function setEnableToAutomata(on) {
    if (on) {
        gui.btnGramToAutom.disabled = "";
    } else {
        gui.btnGramToAutom.disabled = "disabled";
    }
}

function setEnabledRegex(on) {
    if (on) {
        gui.btnCheckRegex.disabled = "";
        gui.btnRegexToAutomata.disabled = "";
        gui.btnRegexCreate.disabled = "";
    } else {
        gui.btnCheckRegex.disabled = "disabled";
        gui.btnRegexToAutomata.disabled = "disabled";
        gui.btnRegexCreate.disabled = "disabled";
    }
}

function setEnableOnlyParser() {
    setEnableAutomata(false);
    setEnableGrammar(false);
    setEnableSyntaxTree(false);
    setEnableToAutomata(false);
    setEnableParser(true);
}

function loadDerivateParams() {
    var anzDeriv = parseInt(numDerivate.value);
    if (!(anzDeriv > 0)) {
        anzDeriv = 1;
    }
    var maxLen = parseInt(numMaxLen.value);
    if (!(maxLen > -1)) {
        maxLen = -1;
    }
    return [anzDeriv, maxLen];
}

function copyOutToClipboard() {
    gui.out.select();
    gui.out.setSelectionRange(0, 999999);
    document.execCommand("copy");
}

function saveFieldData(e) {
    localStorage.setItem("txtVars", gui.txtVars.value);
    localStorage.setItem("txtGrammar", gui.txtGrammar.value);
}

function loadFieldData() {
    gui.txtVars.value = localStorage.getItem("txtVars");
    gui.txtGrammar.value = localStorage.getItem("txtGrammar");
    if (gui.txtVars.value == "" && gui.txtGrammar.value == "") {
        sampleGrammar();
    }
}