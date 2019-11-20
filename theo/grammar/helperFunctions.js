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
    setEnableParser(true);
}

function parseErr(e) {
    if (e) {
        gui.out.value = "Error while parsing: " + e;
        console.error(e);
    }
    setEnableOnlyParser();
}

function sampleGrammar() {
    gui.txtVars.value = "S,T,F";
    gui.txtGrammar.value = "S=>aT|bF #Production rules, it's possible to separate the two sides with -, ->, = or =>\n";
    gui.txtGrammar.value += "T=bF|b #New lines are also allowed (only in grammars)\nF-aT|a";
    grammarChange();
}

function sampleAutomata() {
    gui.txtVars.value = "S,T,F,Z";
    gui.txtGrammar.value = "S #Starting state\nT,F #Accepting states\nS=>aT|bF,T=bF|bZ,F-aT|aZ #Function, separation as for automata, left side must be a state, right side a char and a state";
    grammarChange();
}

function arrToString(arr, separator) {
    if (arr instanceof Array) {
        var sep = "";
        if (separator != undefined) {
            sep = separator;
        }
        var txt = "";
        arr.forEach(function (elem) {
            txt += elem + sep;
        });
        txt = txt.substr(0, txt.length - sep.length);
        return txt;
    } else {
        return arr;
    }
}

function arrInArr(haystack, needle) {
    var erg = false;
    haystack.forEach(function (arr) {
        if (!erg) {
            if (arrayEquals(arr, needle)) {
                erg = true;
            }
        }
    });
    return erg;
}

function pot(m) {
    var erg = [];
    for (var i = 0; i < Math.pow(2, m.length); i++) {
        var element = [];
        for (var a = 0; a < m.length; a++) {
            if (i >> a & 1 == 1) {
                element.push(m[a]);
            }
        }
        erg.push(element);
    }
    return erg;
}

function cartesianProd(set1, set2) {
    if (set1 instanceof Array && set2 instanceof Array) {
        var erg = [];
        set1.forEach(e1 => {
            set2.forEach(e2 => {
                erg.push([e1, e2]);
            });
        });
        return erg;
    } else if (set1 instanceof Array) {
        var erg = [];
        set1.forEach(e1 => {
            erg.push([e1, set2]);
        });
        return erg;
    } else if (set2 instanceof Array) {
        var erg = [];
        set2.forEach(e2 => {
            erg.push([set1, e2]);
        });
        return erg;
    } else {
        return null;
    }
}

function arrayEquals(arr1, arr2) {
    if (arr1 instanceof Array && arr2 instanceof Array) {
        if (arr1.length != arr2.length) {
            return false;
        }
        var same = true;
        for (var i = 0; i < arr1.length && same; i++) {
            if (arr1[i] != arr2[i]) {
                same = false;
            }
        }
        return same;
    }
    return false;
}

function setEquals(s1, s2) {
    if (s1 instanceof Array && s2 instanceof Array) {
        var same = true;
        s1.forEach(e => {
            if (s2.indexOf(e) < 0) {
                same = false;
            }
        });
        s2.forEach(e => {
            if (s1.indexOf(e) < 0) {
                same = false;
            }
        });
        return same;
    }
    return false;
}

function containsNonTerminals(word) {
    if (!grParse.hasOwnProperty("variables")) {
        return true;
    }
    var contains = false;
    word.split('').forEach(c => {
        if (grParse.variables.indexOf(c) >= 0) {
            contains = true;
            return;
        }
    });
    return contains;
}

function historiesSame(h1, h2) {
    if (h1.word != h2.word) {
        return false;
    }
    if (h1.history.length != h2.history.length) {
        return false;
    }
    for (var i = 0; i < h1.history.length; i++) {
        if (h1.history[i].from != h2.history[i].from || h2.history[i].to != h2.history[i].to) {
            return false;
        }
    }
    return true;
}

function findSameWord(h, otherList) {
    var words = [];
    if (otherList) {
        otherList.forEach(p => {
            if (p != h && p.word == h.word) {
                if (!historiesSame(p, h)) {
                    words.push(p);
                }
            }
        });
    }
    if (words.length == 0) {
        wordProcuctions.forEach(p => {
            if (p != h && p.word == h.word) {
                if (!historiesSame(p, h)) {
                    words.push(p);
                }
            }
        });
    }
    return words;
}

/*function setToStr(m) {
    var str = "";
    if (m instanceof Array) {
        m.forEach(function (e) {
            str += e;
        });
    } else {
        str = m;
    }
    return str;
}*/