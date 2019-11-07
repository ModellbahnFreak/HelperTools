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
var grParse = {};
var producedWords = [];
var automParse = {};

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

    btnDraw.disabled = "disabled";
    btnDerivate.disabled = "disabled";
    btnLatex.disabled = "disabled";
    btnGramToAutom.disabled = "disabled";
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
}