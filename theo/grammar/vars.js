/*
(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!
*/

var out = null;
var svg = null;
var txtGrammar = null;
var txtVars = null;
var numDerivate = null;
var numMaxLen = null;
var btnParse = null;
var btnDraw = null;
var btnDerivate = null;
var btnLatex = null;
var btnGramToAutom = null;
var btnCheckAutom = null;
var btnCheckGrammar = null;
var txtWord = null;
var btnParseAutom = null;
var btnDerivateLeft = null;
var btnSyntaxLatex = null;
var txtTreeWord = null;
var btnCheckUnique = null;
var grParse = {};
var producedWords = {};
var automParse = {};
var wordProcuctions = [];
var lastLevelProduced = [];
var thisLevel = 0;
var lastDerivMode = -1;//0: normal, 1: left

function init() {
    out = document.getElementById("outText");
    svg = document.getElementById("svg");
    txtGrammar = document.getElementById("grammar");
    txtVars = document.getElementById("txtVars");
    btnParse = document.getElementById("btnParse");
    btnDraw = document.getElementById("btnDraw");
    btnDerivate = document.getElementById("btnDerivate");
    btnLatex = document.getElementById("btnLatex");
    numDerivate = document.getElementById("numDerivate");
    numMaxLen = document.getElementById("numMaxLen");
    btnGramToAutom = document.getElementById("btnGramToAutom");
    btnCheckAutom = document.getElementById("btnCheckAutom");
    txtWord = document.getElementById("txtWord");
    btnCheckGrammar = document.getElementById("btnCheckGrammar");
    btnParseAutom = document.getElementById("btnParseAutom");
    btnDerivateLeft = document.getElementById("btnDerivateLeft");
    btnSyntaxLatex = document.getElementById("btnSyntaxLatex");
    txtTreeWord = document.getElementById("txtTreeWord");
    btnCheckUnique = document.getElementById("btnCheckUnique");

    btnDraw.disabled = "disabled";
    btnDerivate.disabled = "disabled";
    btnLatex.disabled = "disabled";
    btnGramToAutom.disabled = "disabled";
    btnCheckAutom.disabled = "disabled";
    btnCheckGrammar.disabled = "disabled";
    txtGrammar.addEventListener("change", grammarChange);
    txtVars.addEventListener("change", grammarChange);
    btnParse.addEventListener("click", parse);
    btnDraw.addEventListener("click", draw);
    btnDerivate.addEventListener("click", function () {
        var anzDeriv = parseInt(numDerivate.value);
        if (!(anzDeriv > 0)) {
            anzDeriv = 1;
        }
        var maxLen = parseInt(numMaxLen.value);
        if (!(maxLen > -1)) {
            maxLen = -1;
        }
        derivate(anzDeriv, maxLen);
    });
    btnLatex.addEventListener("click", toLatex);
    btnGramToAutom.addEventListener("click", grmmarToAutomata);
    btnCheckAutom.addEventListener("click", checkWordAutom);
    btnCheckGrammar.addEventListener("click", checkWordGrammar);
    btnParseAutom.addEventListener("click", parseAutomata);
    btnDerivateLeft.addEventListener("click", function () {
        var anzDeriv = parseInt(numDerivate.value);
        if (!(anzDeriv > 0)) {
            anzDeriv = 1;
        }
        var maxLen = parseInt(numMaxLen.value);
        if (!(maxLen > -1)) {
            maxLen = -1;
        }
        leftDerivation(anzDeriv, maxLen);
    });
    btnSyntaxLatex.addEventListener("click", syntaxLatex);
    btnCheckUnique.addEventListener("click", displayUnique);
}