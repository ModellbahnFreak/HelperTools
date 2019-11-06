var out = null;
var svg = null;
var txtGrammar = null;
var txtVars = null;
var numDerive = null;
var numMaxLen = null;
var btnParse = null;
var btnDraw = null;
var btnDerive = null;
var btnLatex = null;
var grParse = {};
var producedWords = [];

function init() {
    out = document.getElementById("outText");
    svg = document.getElementById("svg");
    txtGrammar = document.getElementById("grammar");
    txtVars = document.getElementById("txtVars");
    btnParse = document.getElementById("btnParse");
    btnDraw = document.getElementById("btnDraw");
    btnDerive = document.getElementById("btnDerive");
    btnLatex = document.getElementById("btnLatex");
    numDerive = document.getElementById("numDerive");
    numMaxLen = document.getElementById("numMaxLen");

    btnDraw.disabled = "disabled";
    btnDerive.disabled = "disabled";
    btnLatex.disabled = "disabled";
    txtGrammar.addEventListener("change", grammarChange);
    txtVars.addEventListener("change", grammarChange);
    btnParse.addEventListener("click", parse);
    btnDraw.addEventListener("click", draw);
    btnDerive.addEventListener("click", derive);
    btnLatex.addEventListener("click", toLatex);
}