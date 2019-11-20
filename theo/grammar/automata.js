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
        gui.out.value = "The given grammar is not of type 3 so an automata can't be drawn!";
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

    //automParse.states.push("Fail")

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

        if (missingChars.length > 0) {
            automParse["type"] = "NFA";
        }

        /*missingChars.forEach(c => {
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
        });*/
    });

    /*automParse.alphabet.forEach(c => {
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
    });*/

    gui.out.value = "Converted Grammar to automata.\nTha automata is of type: " + automParse.type;

    setEnableAutomata(true);
    setEnableParser(false);
}

function toLatex(automat) {
    if (!automParse.hasOwnProperty("states") || !automParse.hasOwnProperty("function2") || !automParse.hasOwnProperty("accept") || !automParse.hasOwnProperty("start")) {
        return;
    }
    var tex = "\\begin{figure}[!h]\n\\centering\n\\begin{tikzpicture}[initial text={}]\n";
    var lastVar = "";
    automParse.states.forEach(function (state) {
        var stateStr = state;
        if (stateStr == "") {
            stateStr = "fail";
        }

        tex += "\\node[state";
        if (automParse.start == state) {
            tex += ",initial";
        } else if (automParse.start instanceof Array) {
            if (automParse.start.indexOf(state) >= 0) {
                tex += ",initial";
            }
        }
        if (automParse.accept.indexOf(state) >= 0) {
            tex += ",accepting";
        }
        tex += "] (" + stateStr + ")";
        if (lastVar != "") {
            tex += " [right=of " + lastVar + "]";
        }

        lastVar = stateStr;

        if (stateStr == "fail") {
            stateStr = "\\emptyset";
        }
        tex += " {$" + stateStr + "$};\n";
    });
    automParse.states.forEach(function (stateFrom) {
        automParse.states.forEach(function (stateTo) {
            if (automParse.function2.hasOwnProperty(stateFrom) && automParse.function2[stateFrom].hasOwnProperty(stateTo)) {
                var stateFromStr = stateFrom;
                var stateToStr = stateTo;
                if (stateFromStr == "") {
                    stateFromStr = "fail";
                }
                if (stateToStr == "") {
                    stateToStr = "fail";
                }
                tex += "\\path[->";
                if (stateFrom == stateTo) {
                    tex += ",loop above";
                }
                tex += "] (" + stateFromStr + ") edge node[above]{$" + arrToString(automParse.function2[stateFrom][stateTo], ", ") + "$} (" + stateToStr + ");\n";
            }
        })
    });
    tex += "\\end{tikzpicture}\n\\caption{Automat erstellt mit HelperTools (https://github.com/ModellbahnFreak/HelperTools/)}\n\\label{fig:automat}\n\\end{figure}";
    gui.out.value = tex;
}

function checkWordAutom() {
    var word = txtWord.value;
    if (!automParse.hasOwnProperty("states") || !automParse.hasOwnProperty("type") || !automParse.hasOwnProperty("alphabet") || !automParse.hasOwnProperty("function") || !automParse.hasOwnProperty("accept") || !automParse.hasOwnProperty("start")) {
        return;
    }
    if (automParse.type != "DFA" && automParse.type != "NFA") {
        gui.out.value = "The Automata isn't of a known type. So it can't be used to check words.";
        return;
    }
    var state = [automParse.start];
    word.split('').forEach(function (c) {
        if (automParse.alphabet.indexOf(c) < 0) {
            gui.out.value = "Word contains non-terminal chars";
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
            gui.out.value = "Word is accepted by automata";
        } else {
            gui.out.value = "Word is NOT accepted by automata";
        }
    }
}

function nfaToDfa() {
    if (!automParse.hasOwnProperty("states") || !automParse.hasOwnProperty("function2") || !automParse.hasOwnProperty("accept") || !automParse.hasOwnProperty("start")) {
        return;
    }
    if (automParse.type != "NFA") {
        gui.out.value = "The Automata isn't a NFA. So it can't be converted to a DFA.";
        return;
    }

    var newStart = [];
    newStart = newStart.concat(automParse.start);

    var newStates = pot(automParse.states);

    var statesToCheck = [newStart];
    var statesChecked = [];
    var newFunction = {};
    var newFunction2 = {};
    automParse.type = "DFA";
    while (statesToCheck.length > 0) {
        var nextCheck = [];
        statesToCheck.forEach(function (state) {
            if (!arrInArr(statesChecked, state)) {
                automParse.alphabet.forEach(function (c) {
                    var toState = [];
                    state.forEach(function (subState) {
                        if (automParse.function.hasOwnProperty(subState)) {
                            if (automParse.function[subState].hasOwnProperty(c)) {
                                toState = toState.concat(automParse.function[subState][c]);
                            }
                        }
                    });
                    var stateStr = arrToString(state);
                    var toStateStr = arrToString(toState);
                    if (!newFunction.hasOwnProperty(stateStr)) {
                        newFunction[stateStr] = {};
                    }
                    if (newFunction[stateStr].hasOwnProperty(c)) {
                        automParse.type = "NFA";
                        gui.out.value = "Converting to DFA didn't ork for some reason.";
                    }
                    newFunction[stateStr][c] = toStateStr;
                    if (!newFunction2.hasOwnProperty(stateStr)) {
                        newFunction2[stateStr] = {};
                    }
                    if (newFunction2[stateStr].hasOwnProperty(toStateStr)) {
                        newFunction2[stateStr][toStateStr].push(c);
                    } else {
                        newFunction2[stateStr][toStateStr] = [c];
                    }
                    nextCheck.push(toState);
                });
                statesChecked.push(state);
            }
        });
        statesToCheck = nextCheck;
    }
    /*newStates.forEach(function (state) {
        automParse.alphabet.forEach(function (c) {
            var toState = [];
            state.forEach(function (subState) {
                toState = toState.concat(automParse.function[subState][c]);
            });
            var stateStr = arrToString(state);
            var toStateStr = arrToString(toState);
            if (!newFunction.hasOwnProperty(stateStr)) {
                newFunction[stateStr] = {};
            }
            newFunction[stateStr][c] = toStateStr;
            if (!newFunction2.hasOwnProperty(stateStr)) {
                newFunction2[stateStr] = {};
            }
            if (newFunction2[stateStr].hasOwnProperty(toStateStr)) {
                newFunction2[stateStr][toStateStr].push(c);
            } else {
                newFunction2[stateStr][toStateStr] = [c];
            }
        });
    });*/

    var newAccept = [];
    statesChecked.forEach(state => {
        automParse.accept.forEach(accept => {
            if (state.indexOf(accept) >= 0) {
                newAccept.push(arrToString(state));
            }
        });
    });

    automParse.states = [];
    statesChecked.forEach(function (s) {
        automParse.states.push(arrToString(s));
    });
    automParse.start = arrToString(newStart);
    automParse.accept = newAccept;
    automParse.function = newFunction;
    automParse.function2 = newFunction2;
    if (automParse.type == "DFA") {
        gui.out.value = "Conversion to DFA successfull.";
    }
}

function productAutomata() {
    if (automMemory == null && automParse != null) {
        if (automParse.type != "DFA") {
            gui.out.value = "Both automatas must be of type DFA to calculate the product automata.";
            return
        }
        automMemory = automParse;
        gui.out.value = "Current automata saved to memory. Please enter AND PARSE next one.";
        gui.txtGrammar.value = "#Current automata saved to memory. Please enter AND PARSE next one.";
        gui.txtVars.value = "";
    } else if (automMemory != null && automParse != null) {
        if (automParse.type != "DFA") {
            gui.out.value = "Both automatas must be of type DFA to calculate the product automata.";
            return;
        }
        if (!setEquals(automParse.alphabet, automMemory.alphabet)) {
            gui.out.value = "Both automatas must have the same slphabet to calculate the product automata.";
            return;
        }
        var statesNew = cartesianProd(automMemory.states, automParse.states);
        var acceptNew = cartesianProd(automMemory.accept, automParse.accept);
        var startNew = [automMemory.start, automParse.start];
        var newFunction = {};
        var newFunction2 = {};
        statesNew.forEach(state => {
            automParse.alphabet.forEach(c => {
                var toState = [];
                if (state.length == 2) {
                    toState = [automMemory.function[state[0]][c], automParse.function[state[1]][c]];
                }
                var stateStr = arrToString(state);
                var toStateStr = arrToString(toState);
                if (!newFunction.hasOwnProperty(stateStr)) {
                    newFunction[stateStr] = {};
                }
                if (newFunction[stateStr].hasOwnProperty(c)) {
                    automParse.type = "NFA";
                    gui.out.value = "The product automata is a NFA for some wierd reason.";
                    if (newFunction[stateStr][c] instanceof Array) {
                        newFunction[stateStr][c].push(toStateStr);
                    } else {
                        newFunction[stateStr][c] = [newFunction[stateStr][c], toStateStr];
                    }
                } else {
                    newFunction[stateStr][c] = toStateStr;
                }
                if (!newFunction2.hasOwnProperty(stateStr)) {
                    newFunction2[stateStr] = {};
                }
                if (newFunction2[stateStr].hasOwnProperty(toStateStr)) {
                    newFunction2[stateStr][toStateStr].push(c);
                } else {
                    newFunction2[stateStr][toStateStr] = [c];
                }
            });
        });
        var statesNewStr = [];
        statesNew.forEach(state => {
            statesNewStr.push(arrToString(state));
        });
        var acceptNewStr = [];
        acceptNew.forEach(state => {
            acceptNewStr.push(arrToString(state));
        });
        automParse.states = statesNewStr;
        automParse.accept = acceptNewStr;
        automParse.start = arrToString(startNew)
        automParse.function = newFunction;
        automParse.function2 = newFunction2;
        automMemory = null;
        gui.out.value = "Product automata was successfully calculated";
    } else if (automMemory != null && (automParse == null || automParse == automMemory)) {
        automMemory = automParse;
        gui.out.value = "You have to enter and succesfully parse another automat to be able to create the product automata";
    }
}

/*//Old implementation of toLatex:
function toLatex(automat) {
    if (!grParse.hasOwnProperty("variables") || !grParse.hasOwnProperty("rules") || !grParse.hasOwnProperty("alphabet") || !grParse.hasOwnProperty("start")) {
        return;
    }
    if (grParse.type != 3) {
        gui.out.value = "The given grammar is not of type 3 so an automata can't be drawn!";
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
    gui.out.value = tex;
}
*/