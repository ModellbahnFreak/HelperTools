/*
(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!
*/

function saveRegex() {
    regex = new RegExp("^" + gui.txtGrammar.value + "$", "g");
    gui.out.value = "Successfully parsed the regular expression.";
    setEnabledRegex(true);
}

function checkRegex() {
    if (regex != null) {
        if (gui.txtWord.value.match(regex)) {
            gui.out.value = "The word matches the regular expression";
        } else {
            gui.out.value = "The word doesn't match the regular expression";
        }
    }
}

function regexToAutomata() {
    gui.out.value = "Not implemented yet";
}

function regexCreateWords() {
    var maxLen = parseInt(gui.numMaxLen.value);
    if (maxLen <= 0) {
        gui.out.value = "Please set a maximum word length!";
        return;
    }
    var str1 = regex.toString()
    var regexStr = str1.substr(2, str1.length - 2 - 3);
    var alph = regexStr.replace(/[\[\\\^\$\.\|\?\*\+\(\)]/g, "").split("");
    var alphabet = [];
    alph.forEach(c => {
        if (alphabet.indexOf(c) < 0) {
            alphabet.push(c);
        }
    });
    alphabet.push("");
    gui.out.value = "Fond words: \n";
    var foundWords = [];
    var words = genAllWords(alphabet, maxLen);
    words.forEach(w => {
        if (w.match(regex) && foundWords.indexOf(w) < 0) {
            gui.out.value += w + ", ";
            foundWords.push(w);
        }
    });
}

function genRndWord(alphabet, len) {
    var word = "";
    for (var i = 0; i < len; i++) {
        word += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return word;
}

function genAllWords(alphabet, length) {
    if (length <= 0) {
        return [""];
    }
    var allWordsShorter = [""];//genAllWords(alphabet, length - 1);
    var lastStepWords = allWordsShorter;
    for (var i = 1; i <= length; i++) {
        var newWords = [];
        lastStepWords.forEach(w => {
            alphabet.forEach(x => {
                newWords.push(w + x);
            });
        });
        allWordsShorter = allWordsShorter.concat(newWords);
        lastStepWords = newWords;
    }
    return allWordsShorter;
}

function automataToRegex() {
    if (automParse.type != "DFA") {
        gui.out.value = "Please input a dfa or convert the automata to a deterministic one.";
        return;
    }
    var r = [];
    var n = automParse.states.length;
    var k = 0;
    var states = [];
    for (var i = 1; i <= n; i++) {
        states[i] = automParse.states[i - 1];
    }
    r[k] = [];
    for (var i = 1; i <= n; i++) {
        r[k][i] = [];
        for (var j = 1; j <= n; j++) {
            r[k][i][j] = "";
            var numAdded = 0;
            var words = genAllWords(automParse.alphabet, n);
            words.forEach(w => {
                var z = i;
                var graterK = false;
                for (var a = 0; a < w.length; a++) {
                    z = states.indexOf(automParse.function[states[z]][w.charAt(a)]);
                    if (z == -1) {
                        break;
                    }
                    if (a < w.length - 1 && z > k) {
                        graterK = true;
                    }
                }
                if (!graterK && z == j) {
                    r[k][i][j] += w + "|";
                    numAdded++;
                }
            });
            if (r[k][i][j] == "|" && numAdded == 1) {
                r[k][i][j] = "";
            } else if (r[k][i][j] == "" && numAdded == 0) {
                r[k][i][j] = null;
            } else {
                if (numAdded == 1) {
                    r[k][i][j] = r[k][i][j].substr(0, r[k][i][j].length - 1);
                } else {
                    r[k][i][j] = "(" + r[k][i][j].substr(0, r[k][i][j].length - 1) + ")";
                }
            }
        }
    }
    for (k = 1; k <= n; k++) {
        r[k] = [];
        for (var i = 1; i <= n; i++) {
            r[k][i] = [];
            for (var j = 1; j <= n; j++) {
                if (r[k - 1][i][j] == null) {
                    if (r[k - 1][i][k] == null || r[k - 1][k][k] == null || r[k - 1][k][j] == null) {
                        r[k][i][j] = null;
                    } else {
                        if (r[k - 1][i][k] == "" && r[k - 1][k][k] == "" && r[k - 1][k][j] == "") {
                            r[k - 1][i][k] = "";
                        } else {
                            if (r[k - 1][k][k] == "") {
                                r[k][i][j] = "(" + r[k - 1][i][k] + r[k - 1][k][j] + ")";
                            } else {
                                r[k][i][j] = "(" + r[k - 1][i][k] + "(" + r[k - 1][k][k] + ")*" + r[k - 1][k][j] + ")";
                            }
                        }
                    }
                } else {
                    if (r[k - 1][i][k] == null || r[k - 1][k][k] == null || r[k - 1][k][j] == null) {
                        r[k][i][j] = r[k - 1][i][j];
                    } else {
                        if (r[k - 1][i][k] == "" && r[k - 1][k][k] == "" && r[k - 1][k][j] == "") {
                            r[k][i][j] = r[k - 1][i][j];
                        } else {
                            if (r[k - 1][k][k] == "") {
                                r[k][i][j] = "(" + r[k - 1][i][j] + "|" + r[k - 1][i][k] + r[k - 1][k][j] + ")";
                            } else {
                                r[k][i][j] = "(" + r[k - 1][i][j] + "|" + r[k - 1][i][k] + "(" + r[k - 1][k][k] + ")*" + r[k - 1][k][j] + ")";
                            }
                        }
                    }
                }
            }
        }
    }
    console.log(r);
    var erg = "";
    for (var i = 0; i < automParse.accept.length; i++) {
        erg += r[n][states.indexOf(automParse.start)][states.indexOf(automParse.accept[i])] + "|";
    }
    gui.out.value = "(" + erg.substr(0, erg.length - 1) + ")";
}