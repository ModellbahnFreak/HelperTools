/*
(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!
*/

function grammarToString() {
    gui.out.value = JSON.stringify(grParse);
}

function stringToGrammar() {
    grParse = JSON.parse(gui.txtGrammar.value);

    if (!grParse.hasOwnProperty("variables") || !grParse.hasOwnProperty("rules") || !grParse.hasOwnProperty("alphabet") || !grParse.hasOwnProperty("start")) {
        parseErr("No valid grammar parsed");
        return;
    }

    gui.out.value = "Parsed grammar: \n" + grammarToStr();

    setEnableParser(false);
    setEnableGrammar(true);
    setEnableToAutomata(grParse.type == 3);
}

function automataToString() {
    gui.out.value = JSON.stringify(automParse);
}

function stringToAutomata() {
    automParse = JSON.parse(gui.txtGrammar);
}

function syntaxTreeToString() {
    var words = findSameWord({ "word": gui.txtTreeWord.value, "history": { "length": -1 } });
    if (words.length <= 0) {
        gui.out.value = "Please enter a word which was already derivated into the Text box next to to \"Syntax tree:\"!";
        return;
    }
    words.forEach(w => {
        gui.out.value += JSON.stringify(historyToSyntaxTree(w.history)) + "\n\n";
    })
}

function stringToSyntaxTree() {
    gui.out.value = "Currently not available.";
}