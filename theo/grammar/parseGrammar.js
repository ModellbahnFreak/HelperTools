/*
(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!
*/

function grammarChange() {
    btnParse.disabled = "";
}

function parse() {
    grParse = {};

    var variables = txtVars.value;
    var grStr = txtGrammar.value;

    grParse["variables"] = variables.replace(/,/g, ";").trim().split(";");
    if (grParse.variables.length <= 0) { parseErr(); return; }
    grParse["start"] = grParse.variables[0];
    grParse["isUnique"] = true;

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

    getType();

    out.innerHTML = "Parsed grammar: <br>" + grammarToStr();
    producedWords = [grParse.start];

    btnParse.disabled = "disabled";
    btnLatex.disabled = "disabled";
    btnDraw.disabled = "";
    btnDerivate.disabled = "";
    btnCheckGrammar.disabled = "";
    if (grParse.type == 3) {
        btnGramToAutom.disabled = "";
    }
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

    txt += "<br>Type: " + grParse.type;
    return txt;
}

function draw() {

}

function getType() {
    if (!grParse.hasOwnProperty("variables") || !grParse.hasOwnProperty("rules") || !grParse.hasOwnProperty("alphabet") || !grParse.hasOwnProperty("start")) {
        return;
    }
    var type = 3;
    grParse.rules.forEach(function (rule) {
        if (rule.hasOwnProperty("from") && rule.hasOwnProperty("to")) {
            if (rule.from.length > 1 || grParse.variables.indexOf(rule.from) < 0) {
                type = 1;
            }
            rule.to.forEach(function (rightSide) {
                if (rightSide.hasOwnProperty("str")) {
                    if (!epsilonRuleApplies(rule.from, rightSide.str)) {
                        if (rightSide.str.length < rule.from.length) {
                            type = 0;
                        } else if (rightSide.str.length < 1 || rightSide.str.length > 2
                            || grParse.alphabet.indexOf(rightSide.str.charAt(0)) < 0
                            || (rightSide.str.length == 2 && grParse.variables.indexOf(rightSide.str.charAt(1)) < 0)) {
                            type = 2;
                        }
                    }
                }
            });
        }
    });
    grParse.type = type;
}

function epsilonRuleApplies(from, to) {
    if (to.length == 0 && from == grParse.start) {
        grParse.rules.forEach(function (rule) {
            rule.to.forEach(function (rightSide) {
                if (rightSide.str.indexOf(from) >= 0) {
                    return false;
                }
            });
        });
        console.log("epsilon rule aplies");
        return true;
    }
    return false;
}

function parseErr(e) {
    if (e) {
        console.error(e);
    }
    btnDraw.disabled = "disabled";
    btnDerivate.disabled = "disabled";
    btnLatex.disabled = "disabled";
}