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
    for (var i = 0; i < 10000; i++) {
        var w = genRndWord(alphabet, maxLen);
        if (w.match(regex) && foundWords.indexOf(w) < 0) {
            gui.out.value += w + ", ";
            foundWords.push(w);
        } else {
            console.log(w);
        }
    }
}

function genRndWord(alphabet, len) {
    var word = "";
    for (var i = 0; i < len; i++) {
        word += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return word;
}