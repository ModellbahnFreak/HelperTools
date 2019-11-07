/*
(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!
*/

function syntaxLatex() {
    /*var word = txtTreeWord.value;
    if (producedWords.indexOf(word) < 0 || !wordProcuctions.hasOwnProperty(word)) {
        out.innerText = "The word you entered wasn't yet produced or is no part of the lanuage. You have to derivate until the word was produced!";
        return;
    }
    var tex = "";
    var productions = findSameWord({ "word": word, "history": { "length": -1 } });
    productions.forEach(production => {
        var nameIdx = 0;
        tex += "\\begin{tikzpicture}[level/.style ={sibling distance=30mm/#1}]";
        var history = production.history;
        history.forEach(element => {
            tex += "\\node[] (" + nameIdx + ") {" + history[0].word + "} child {"
        });
    });
    out.innerText = tex;*/
}

function historyToSyntaxTree(history) {
    /*var synTree = { "char": grParse.start, "children": [] };
    var lowestChildren = [synTree];
    history.forEach(element => {
        var changedBranch = null;
        lowestChildren.forEach(child => {
            if (child.char == element.from) {

            }
        });
    });*/
}

/*
\begin{tikzpicture}[level/.style ={sibling distance=30mm/#1}]
			\node[] (0) {S} child {
                node [] (1) {T} child {
                    node [] (4) {T} child {
                        node [] (10) {F} child {
                            node [] (11) {x}
                        }
                    }
                } child {
                    node [] (3) {+}
                } child {
                    node [] (2) {T} child {
                        node [] (5) {T} child {
                            node [] (8) {F} child {
                                node [] (9) {x}
                            }
                        }
                    } child {
                        node [] (6) {+}
                    } child {
                        node [] (7) {T} child {
                            node [] (12) {F} child {node [] (13) {x}
                        }
                    }
                }
            }
				};
            \end{tikzpicture}

{
    "word": "abc",
    "history": [
        {
            "word": "S",
            "from": "",
            "to": "S"
        },
        {
            "word": "aBC",
            "from": "S",
            "to": "aBC"
        },
        {
            "word": "abC",
            "from": "B",
            "to": "b"
        },
        {
            "word": "abc",
            "from": "C",
            "to": "c"
        }
    ]
}
            */

function displayUnique() {
    if (lastDerivMode == 1) {
        if (grParse.isUnique) {
            out.innerText = "Propably unique. This is not certain. It's only checked with the currently known left derivations. To increase certaincy, create more left derivations. Currently known left derivations: " + producedWords.length;
        } else {
            out.innerText = "The grammar isn't unique! This is sure.";
            if (grParse.hasOwnProperty("notUniqueExample")) {
                var h1 = grParse.notUniqueExample[0];
                var h2 = grParse.notUniqueExample[1];
                var txt = "";
                h1.forEach(elem => {
                    txt += elem.word + "=>";
                });
                txt = txt.substr(0, txt.length - 2);
                txt += "\n";
                h2.forEach(elem => {
                    txt += elem.word + "=>";
                });
                txt = txt.substr(0, txt.length - 2);
                out.innerText += " Example: \n" + txt;
            }
        }
    } else {
        out.innerText = "To check if the grammar is unique, please create enough left derivations. Currently no left derivations are created";
    }
}