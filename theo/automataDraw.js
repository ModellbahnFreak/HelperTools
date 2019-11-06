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
    btnDraw.disabled = "";
    btnDerive.disabled = "";
    if (grParse.type == 3) {
        btnLatex.disabled = "";
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

function derive() {
    var anzDeriv = parseInt(numDerive.value);
    if (!(anzDeriv > 0)) {
        anzDeriv = 1;
    }
    var maxLen = parseInt(numMaxLen.value);
    if (!(maxLen > -1)) {
        maxLen = -1;
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
                        //if (fromPos >= 0) {
                        rule.to.forEach(function (rightSide) {
                            if (rightSide.hasOwnProperty("str")) {
                                if (maxLen == -1 || word.length - rule.from.length + rightSide.str.length <= maxLen) {
                                    var newWord = word.substr(0, fromPos) + rightSide.str + word.substr(fromPos + rule.from.length);
                                    if (producedWords.indexOf(newWord) < 0) {
                                        newProduced.push(newWord);
                                    }
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
    out.innerText = "";
    if (!foundWords) {
        out.innerText += "Finished! No more words found\n";
    }
    out.innerText += "Found " + producedWords.length + "\n";
    out.innerText += producedWords;
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
    btnDerive.disabled = "disabled";
    btnLatex.disabled = "disabled";
}