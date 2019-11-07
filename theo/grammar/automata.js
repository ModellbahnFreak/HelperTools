function grmmarToAutomata() {
    if (!grParse.hasOwnProperty("variables") || !grParse.hasOwnProperty("rules") || !grParse.hasOwnProperty("alphabet") || !grParse.hasOwnProperty("start")) {
        return;
    }
    if (grParse.type != 3) {
        out.innerText = "The given grammar is not of type 3 so an automata can't be drawn!";
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

    automParse["accept"] = [];
    automParse.accept.push(endState);

    automParse["function"] = [];
    grParse.rules.forEach(function (rule) {
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
        });
    });

    btnLatex.disabled = "";
}

function toLatex(automat) {
    if (!grParse.hasOwnProperty("variables") || !grParse.hasOwnProperty("rules") || !grParse.hasOwnProperty("alphabet") || !grParse.hasOwnProperty("start")) {
        return;
    }
    if (grParse.type != 3) {
        out.innerText = "The given grammar is not of type 3 so an automata can't be drawn!";
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
    out.innerText = tex;
}