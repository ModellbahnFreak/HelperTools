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

    btnDraw.disabled = "disabled";
    btnDerivate.disabled = "disabled";
    btnLatex.disabled = "disabled";
    btnGramToAutom.disabled = "disabled";
    txtGrammar.addEventListener("change", grammarChange);
    txtVars.addEventListener("change", grammarChange);
    btnParse.addEventListener("click", parse);
    btnDraw.addEventListener("click", draw);
    btnDerivate.addEventListener("click", derivate);
    btnLatex.addEventListener("click", toLatex);
    btnGramToAutom.addEventListener("click", grmmarToAutomata);
}