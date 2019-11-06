var out = null;
var svg = null;
var txtGrammar = null;
var txtVars = null;
var numDerive = null;
var btnParse = null;
var btnDraw = null;
var btnDerive = null;
var btnLatex = null;
var grParse = {};
var producedWords = [];

function grammarChange() {
    btnParse.disabled = "";
}

function parse() {
    var variables = txtVars.value;
    var grStr = txtGrammar.value;

    grParse["variables"] = variables.replace(/,/g, ";").trim().split(";");
    if (grParse.variables.length <= 0) { parseErr(); return; }
    grParse["start"] = grParse.variables[0];

    grStr = grStr.replace(/,/g, ";");
    grStr = grStr.replace(/>/g, "");
    grStr = grStr.trim();
    var grList = grStr.split(";");

    grList.forEach(function (rule) {
        var ruleList = rule.trim().split("-");
        if (ruleList.length == 2) {
            var leftSide = ruleList[0].trim();
            var rightSide = ruleList[1].trim();
            var variants = rightSide.split("|");
            variants.forEach(function (to) {
                if (addToGrammar(leftSide, to) == -1) {
                    return;
                }
            });
        }
    });

    out.innerHTML = "Parsed grammar: <br>" + grammarToStr();
    producedWords = [grParse.start];

    btnParse.disabled = "disabled";
    btnDraw.disabled = "";
    btnDerive.disabled = "";
    btnLatex.disabled = "";
}

function addToGrammar(left, right) {
    if (!grParse.hasOwnProperty("rules")) {
        grParse["rules"] = [];
    }
    var isAdded = false;
    grParse.rules.forEach(function (rule) {
        if (rule.hasOwnProperty("from") && rule.hasOwnProperty("to")) {
            if (rule.from == left) {
                rule.to.forEach(function (rightSide) {
                    if (rightSide.hasOwnProperty("str")) {
                        if (rightSide.str == right) {
                            isAdded = true;
                        }
                    } else {
                        parseErr("There is a right side withot String");
                        return -1;
                    }
                });
                if (!isAdded) {
                    rule.to.push({ "str": right });
                    isAdded = true;
                }
            }
        } else {
            parseErr("There is a rule without from or to");
            return -1;
        }
    });
    if (!isAdded) {
        grParse.rules.push(
            {
                "from": left,
                "to": [
                    { "str": right }
                ]
            });
        isAdded = true;
    }
    if (isAdded) {
        if (!grParse.hasOwnProperty("alphabet")) {
            grParse["alphabet"] = [];
        }
        right.split('').forEach(function (chr) {
            if (grParse.variables.indexOf(chr) < 0 && grParse.alphabet.indexOf(chr) < 0) {
                grParse.alphabet.push(chr);
            }
        });
    } else {
        parseErr("For some reason it couldn't be added!");
        return -1;
    }
}

function grammarToStr() {
    if (!grParse.hasOwnProperty("variables") || !grParse.hasOwnProperty("rules") || !grParse.hasOwnProperty("alphabet") || !grParse.hasOwnProperty("start")) {
        return "No valid grammar parsed";
    }
    var txt = "Non-terminal symbols: ";
    grParse.variables.forEach(function (nonTer) {
        txt += nonTer + ", ";
    });
    txt = txt.substr(0, txt.length - 2);
    txt += "<br>Production rules: ";
    grParse.rules.forEach(function (rule) {
        if (rule.hasOwnProperty("from") && rule.hasOwnProperty("to")) {
            txt += rule.from + "&rarr;";
            rule.to.forEach(function (rightSide) {
                if (rightSide.hasOwnProperty("str")) {
                    txt += rightSide.str + "|";
                }
            });
            txt = txt.substr(0, txt.length - 1);
            txt += "; ";
        }
    });
    txt = txt.substr(0, txt.length - 2);
    txt += "<br>Alphabet: ";
    grParse.alphabet.forEach(function (ter) {
        txt += ter + ", ";
    });
    txt = txt.substr(0, txt.length - 2);
    txt += "<br>Start symbol: " + grParse.start;
    return txt;
}

function draw() {

}

function derive() {
    var anzDeriv = parseInt(numDerive.value);
    if (!(anzDeriv > 0)) {
        anzDeriv = 1;
    }
    if (!grParse.hasOwnProperty("variables") || !grParse.hasOwnProperty("rules") || !grParse.hasOwnProperty("alphabet") || !grParse.hasOwnProperty("start")) {
        return;
    }
    var foundWords = true;
    for (var i = 0; i < anzDeriv && foundWords; i++) {
        foundWords = false;
        var newProduced = [];
        producedWords.forEach(function (word) {
            grParse.rules.forEach(function (rule) {
                if (rule.hasOwnProperty("from") && rule.hasOwnProperty("to")) {
                    var fromPos = word.indexOf(rule.from)
                    while (fromPos >= 0) {
                        rule.to.forEach(function (rightSide) {
                            if (rightSide.hasOwnProperty("str")) {
                                var newWord = word.substr(0, fromPos) + rightSide.str + word.substr(fromPos + rule.from.length);
                                if (producedWords.indexOf(newWord) < 0) {
                                    newProduced.push(newWord);
                                }
                            }
                        });
                        fromPos = word.indexOf(rule.from, fromPos + 1);
                    }
                }
            });
        });
        if (newProduced.length > 0) {
            producedWords = producedWords.concat(newProduced);
            foundWords = true;
        }
    }
    if (!foundWords) {
        console.log("Finished! No more words found");
    }
    console.log(producedWords);
}

function parseErr(e) {
    if (e) {
        console.error(e);
    }
    btnDraw.disabled = "disabled";
    btnDerive.disabled = "disabled";
    btnLatex.disabled = "disabled";
}

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

    btnDraw.disabled = "disabled";
    btnDerive.disabled = "disabled";
    btnLatex.disabled = "disabled";
    txtGrammar.addEventListener("change", grammarChange);
    txtVars.addEventListener("change", grammarChange);
    btnParse.addEventListener("click", parse);
    btnDraw.addEventListener("click", draw);
    btnDerive.addEventListener("click", derive);
}