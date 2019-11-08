/*
(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!
*/

function grmmarToAutomata() {
    if (!grParse.hasOwnProperty("variables") || !grParse.hasOwnProperty("rules") || !grParse.hasOwnProperty("alphabet") || !grParse.hasOwnProperty("start")) {
        return;
    }
    if (grParse.type != 3) {
        gui.out.innerText = "The given grammar is not of type 3 so an automata can't be drawn!";
        return;
    }
    automParse = {};
    automParse["states"] = grParse.variables;
    automParse["alphabet"] = grParse.alphabet;
    automParse["start"] = grParse.start;

    var asciiNum = 90;
    var endState = String.fromCharCode(asciiNum);
    while (grParse.variables.indexOf(endState) >= 0 || grParse.alphabet.indexOf(endState) >= 0) {
        asciiNum--;
        if (asciiNum > 63) {
            if (asciiNum < 65) {
                asciiNum = 122;
            } else if (asciiNum < 97) {
                asciiNum = 63;
            }
        }
        endState = String.fromCharCode(asciiNum);
    }
    automParse.states.push(endState);

    automParse.states.push("Fail")

    automParse["accept"] = [];
    automParse.accept.push(endState);

    automParse["type"] = "DFA";
    automParse["function"] = {};
    automParse["function2"] = {};
    grParse.rules.forEach(function (rule) {
        var missingChars = automParse.alphabet.concat();
        rule.to.forEach(function (right) {
            //Add first state as accepting state, if it leads to epsilon
            if (rule.from == grParse.start && right.str.length == 0) {
                automParse.accept.push(grParse.start);
            }

            var nonTer, newState;
            if (right.str.length == 2) {
                nonTer = right.str.charAt(0);
                newState = right.str.charAt(1);
            } else if (right.str.length == 1) {
                nonTer = right.str.charAt(0);
                newState = endState;
            }
            if (!automParse.function.hasOwnProperty(rule.from)) {
                automParse.function[rule.from] = {};
            }
            if (automParse.function[rule.from].hasOwnProperty(nonTer)) {
                console.log("The grammar can't be converted to a DFA");
                automParse["type"] = "NFA";
                var oldNextState = automParse.function[rule.from][nonTer];
                if (oldNextState instanceof Array) {
                    oldNextState.push(newState);
                } else {
                    oldNextState = [oldNextState, newState];
                }
                automParse.function[rule.from][nonTer] = oldNextState;
            } else {
                automParse.function[rule.from][nonTer] = newState;
            }

            if (!automParse.function2.hasOwnProperty(rule.from)) {
                automParse.function2[rule.from] = {};
            }
            if (automParse.function2[rule.from].hasOwnProperty(newState)) {
                automParse.function2[rule.from][newState].push(nonTer);
            } else {
                automParse.function2[rule.from][newState] = [nonTer];
            }

            var added = missingChars.indexOf(nonTer);
            if (added >= 0) {
                missingChars.splice(added, 1);
            }
        });

        missingChars.forEach(c => {
            if (!automParse.function.hasOwnProperty(rule.from)) {
                automParse.function[rule.from] = {};
            }
            automParse.function[rule.from][c] = "Fail";
            if (!automParse.function2.hasOwnProperty(rule.from)) {
                automParse.function2[rule.from] = {};
            }
            if (automParse.function2[rule.from].hasOwnProperty("Fail")) {
                automParse.function2[rule.from]["Fail"].push(c);
            } else {
                automParse.function2[rule.from]["Fail"] = [c];
            }
        });
    });

    automParse.alphabet.forEach(c => {
        if (!automParse.function.hasOwnProperty(endState)) {
            automParse.function[endState] = {};
        }
        automParse.function[endState][c] = "Fail";
        if (!automParse.function2.hasOwnProperty(endState)) {
            automParse.function2[endState] = {};
        }
        if (automParse.function2[endState].hasOwnProperty("Fail")) {
            automParse.function2[endState]["Fail"].push(c);
        } else {
            automParse.function2[endState]["Fail"] = [c];
        }
    });

    automParse.alphabet.forEach(c => {
        if (!automParse.function.hasOwnProperty("Fail")) {
            automParse.function["Fail"] = {};
        }
        automParse.function["Fail"][c] = "Fail";
        if (!automParse.function2.hasOwnProperty("Fail")) {
            automParse.function2["Fail"] = {};
        }
        if (automParse.function2["Fail"].hasOwnProperty("Fail")) {
            automParse.function2["Fail"]["Fail"].push(c);
        } else {
            automParse.function2["Fail"]["Fail"] = [c];
        }
    });

    gui.out.innerText = "Converted Grammar to automata.\nTha automata is of type: " + automParse.type;

    setEnableAutomata(true);
}

function toLatex(automat) {
    if (!automParse.hasOwnProperty("states") || !automParse.hasOwnProperty("function2") || !automParse.hasOwnProperty("accept") || !automParse.hasOwnProperty("start")) {
        return;
    }
    var tex = "\\begin{figure}[!h]\n\\centering\n\\begin{tikzpicture}[initial text={}]\n";
    var lastVar = "";
    automParse.states.forEach(function (state) {
        tex += "\\node[state";
        if (automParse.start == state) {
            tex += ",initial";
        }
        if (automParse.accept.indexOf(state) >= 0) {
            tex += ",accepting";
        }
        tex += "] (" + state + ")";
        if (lastVar != "") {
            tex += " [right=of " + lastVar + "]";
        }
        tex += " {$" + state + "$};\n";
        lastVar = state;
    });
    automParse.states.forEach(function (stateFrom) {
        automParse.states.forEach(function (stateTo) {
            if (automParse.function2.hasOwnProperty(stateFrom) && automParse.function2[stateFrom].hasOwnProperty(stateTo)) {
                tex += "\\path[->";
                if (stateFrom == stateTo) {
                    tex += ",loop above";
                }
                tex += "] (" + stateFrom + ") edge node[above]{$" + arrToString(automParse.function2[stateFrom][stateTo]) + "$} (" + stateTo + ");\n";
            }
        })
    });
    tex += "\\end{tikzpicture}\n\\caption{Nicht deterministischer Automat}\n\\label{fig:automat}\n\\end{figure}";
    gui.out.innerText = tex;
}

function arrToString(arr) {
    var txt = "";
    arr.forEach(function (elem) {
        txt += elem + ", ";
    });
    txt = txt.substr(0, txt.length - 2);
    return txt;
}

function checkWordAutom() {
    var word = txtWord.value;
    if (!automParse.hasOwnProperty("states") || !automParse.hasOwnProperty("type") || !automParse.hasOwnProperty("alphabet") || !automParse.hasOwnProperty("function") || !automParse.hasOwnProperty("accept") || !automParse.hasOwnProperty("start")) {
        return;
    }
    if (automParse.type != "DFA" && automParse.type != "NFA") {
        gui.out.innerText = "The Automata isn't of a known type. So it can't be used to check words.";
        return;
    }
    var state = [automParse.start];
    word.split('').forEach(function (c) {
        if (automParse.alphabet.indexOf(c) < 0) {
            gui.out.innerText = "Word contains non-terminal chars";
            state = [];
            return;
        }
        var allStatesNew = [];
        state.forEach(fromState => {
            var newStates = automParse.function[fromState][c];
            if (!newStates) {
                console.error("There was an unexpected symbol!");
                return;
            }
            allStatesNew = allStatesNew.concat(newStates);
        });
        state = [];
        allStatesNew.forEach(s => {
            if (state.indexOf(s) < 0) {
                state.push(s);
            }
        });
    });
    var accepted = false;
    state.forEach(s => {
        if (!accepted) {
            if (automParse.accept.indexOf(s) >= 0) {
                accepted = true;
            }
        }
    });
    if (state.length > 0) {
        if (accepted) {
            gui.out.innerText = "Word is accepted by automata";
        } else {
            gui.out.innerText = "Word is NOT accepted by automata";
        }
    }
}

/*//Old implementation of toLatex:
function toLatex(automat) {
    if (!grParse.hasOwnProperty("variables") || !grParse.hasOwnProperty("rules") || !grParse.hasOwnProperty("alphabet") || !grParse.hasOwnProperty("start")) {
        return;
    }
    if (grParse.type != 3) {
        gui.out.innerText = "The given grammar is not of type 3 so an automata can't be drawn!";
        return;
    }
    var tex = "\\begin{figure}[!h]\n\\centering\n\\begin{tikzpicture}[initial text={}]\n";
    var lastVar = "";
    grParse.variables.forEach(function (nonTer) {
        tex += "\\node[state";
        if (grParse.start == nonTer) {
            tex += ",initial";
        }
        if (nonTer == grParse.start) {
            grParse.rules.forEach(function (rule) {
                if (rule.from == nonTer) {
                    rule.to.forEach(function (right) {
                        if (right.str.length == 0) {
                            tex += ",accepting";
                        }
                    });
                }
            });
        }
        tex += "] (" + nonTer + ")";
        if (lastVar != "") {
            tex += " [right=of " + lastVar + "]";
        }
        tex += " {$" + nonTer + "$};\n";
        lastVar = nonTer;
    });
    var asciiNum = 90;
    var endState = String.fromCharCode(asciiNum);
    while (grParse.variables.indexOf(endState) >= 0 || grParse.alphabet.indexOf(endState) >= 0) {
        asciiNum--;
        if (asciiNum > 63) {
            if (asciiNum < 65) {
                asciiNum = 122;
            } else if (asciiNum < 97) {
                asciiNum = 63;
            }
        }
        endState = String.fromCharCode(asciiNum);
    }
    tex += "\\node[state,accepting] (" + endState + ") [right=of " + lastVar + "] {$" + endState + "$};\n";
    grParse.rules.forEach(function (nonTer) {
        nonTer.to.forEach(function (ter) {
            tex += "\\path[->";
            if (ter.str.length == 2) {
                if (ter.str.charAt(1) == nonTer.from) {
                    tex += ",loop above";
                }
                tex += "] (" + nonTer.from + ") edge node[below]{$" + ter.str.charAt(0) + "$} (" + ter.str.charAt(1) + ");\n";
            } else if (ter.str.length == 1) {
                tex += "] (" + nonTer.from + ") edge node[below]{$" + ter.str.charAt(0) + "$} (" + endState + ");\n";
            }
        });
    });
    tex += "\\end{tikzpicture}\n\\caption{Nicht deterministischer Automat}\n\\label{fig:automat}\n\\end{figure}";
    gui.out.innerText = tex;
}
*/