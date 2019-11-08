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
    var word = txtTreeWord.value;
    if (producedWords[word] == undefined) {
        gui.out.innerText = "The word you entered wasn't yet produced or is no part of the lanuage. You have to derivate until the word was produced!";
        return;
    }
    var tex = "";
    var productions = findSameWord({ "word": word, "history": { "length": -1 } });
    productions.forEach(production => {
        var synTree = historyToSyntaxTreeLeft(production.history);
        tex += "\\begin{tikzpicture}[level/.style ={sibling distance=30mm/#1}]\n";
        tex += "\\" + syntaxTreeBranchToLatex(synTree);
        tex = tex.substr(0, tex.length - 1) + ";\n";
        tex += "\\end{tikzpicture}\n\n\n";
    });
    gui.out.innerText = tex;
}

function syntaxTreeBranchToLatex(branch) {
    var tex = "node[] (" + branch.index + ") {" + branch.char + "}";
    if (branch.children.length > 0) {
        branch.children.forEach(child => {
            tex += " child {\n" + syntaxTreeBranchToLatex(child) + "}";
        });
    }
    tex += "\n";
    return tex;
}

//ONLY WORKS FOR HISTORIES CREATED BY LEFT DERIVATION
function historyToSyntaxTreeLeft(history) {
    var index = 0;
    var synTree = { "char": grParse.start, "index": index, "children": [] };
    index++;
    var lowestChildren = [synTree];
    history.forEach(element => {
        var lowestIndxElem = null;
        lowestChildren.forEach(child => {
            if (child.char == element.from) {
                if (lowestIndxElem == null || child.index < lowestIndxElem.index) {
                    lowestIndxElem = child;
                }
            }
        });
        var newChildren = [];
        element.to.split('').forEach(c => {
            var next = { "char": c, "index": index, "children": [] };
            index++;
            lowestIndxElem.children.push(next);
            newChildren.push(next);
        });
        var lstPos = lowestChildren.indexOf(lowestIndxElem);
        if (lstPos > 0) {
            lowestChildren.splice(lstPos, 1);
        }
        lowestChildren = lowestChildren.concat(newChildren);
    });
    //console.log(synTree);
    return synTree;
}

//For normal derivate: add changed index and index shift ti history, when building syntax tree change all idexes of elements with indexes larger than the change index
function historyToSyntaxTree(history) {
    var synTree = { "char": grParse.start, "index": 0, "children": [] };
    var lowestChildren = [synTree];
    history.forEach(element => {
        var lowestIndxElem = null;
        lowestChildren.forEach(child => {
            if (child.char == element.from) {
                if (lowestIndxElem == null || child.index < lowestIndxElem.index) {
                    lowestIndxElem = child;
                }
            }
        });
        var newChildren = [];
        element.to.split('').forEach(c => {
            var next = { "char": c, "index": index, "children": [] };
            index++;
            lowestIndxElem.children.push(next);
            newChildren.push(next);
        });
        var lstPos = lowestChildren.indexOf(lowestIndxElem);
        if (lstPos > 0) {
            lowestChildren.splice(lstPos, 1);
        }
        lowestChildren = lowestChildren.concat(newChildren);
    });
    //console.log(synTree);
    return synTree;
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
            gui.out.innerText = "Propably unique. This is not certain. It's only checked with the currently known left derivations. To increase certaincy, create more left derivations. Currently known left derivations: " + producedWords.length;
        } else {
            gui.out.innerText = "The grammar isn't unique! This is sure.";
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
                gui.out.innerText += " Example: \n" + txt;
            }
        }
    } else {
        gui.out.innerText = "To check if the grammar is unique, please create enough left derivations. Currently no left derivations are created";
    }
}