/*
(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!
*/

function parseAutomata() {
    setEnableParser(false);

    automParse = {};

    var states = gui.txtVars.value.replace(/,/g, ";").trim().split(";");
    var fnStr = gui.txtGrammar.value.trim().replace(/#.*\n/g, "\n").replace(/#.*/g, "").trim();

    automParse["states"] = states;
    if (automParse.states.length <= 0) {
        parseErr("You didn't specify any states");
        return;
    }

    var lines = fnStr.split("\n");
    if (lines.length < 3) {
        parseErr("You didn't specify start states, accepting states AND the function. (One line for each)");
        return;
    }
    automParse["start"] = lines[0].replace(/,/g, ";").trim().split(";");

    var accepting = lines[1].replace(/,/g, ";").trim().split(";");
    var functionStr = lines[2].replace(/,/g, ";").replace(/>/g, "").replace(/=/g, "-").trim().split(";");
    var newFunction = {};
    var newFunction2 = {};
    var alphabet = [];
    var success = true;
    functionStr.forEach(str => {
        var fromTo = str.trim().split("-");
        if (fromTo.length != 2) {
            success = false;
            parseErr("Every function must have a from and to");
            return;
        }
        if (fromTo[0].length != 1 || states.indexOf(fromTo[0]) < 0) {
            success = false;
            parseErr("The from part must only be one non terminal");
            return;
        }
        var toParts = fromTo[1].trim().split("|");
        toParts.forEach(to => {
            to = to.trim();
            if (to.length < 2) {
                success = false;
                debugger;
                parseErr("The to part must at least be one terminal and one non terminal");
                return;
            }
            var ter = to.trim().charAt(0);
            var nextState = to.trim().charAt(1);
            if (states.indexOf(nextState) < 0) {
                success = false;
                parseErr("The specified to state is unknown");
                return;
            }
            if (alphabet.indexOf(ter) < 0) {
                alphabet.push(ter);
            }
            if (!newFunction.hasOwnProperty(fromTo[0])) {
                newFunction[fromTo[0]] = {};
            }
            if (newFunction[fromTo[0]].hasOwnProperty(ter)) {
                if (newFunction[fromTo[0]][ter] instanceof Array) {
                    newFunction[fromTo[0]][ter].push(nextState);
                } else {
                    newFunction[fromTo[0]][ter] = [newFunction[fromTo[0]][ter], nextState];
                }
            } else {
                newFunction[fromTo[0]][ter] = nextState;
            }

            if (!newFunction2.hasOwnProperty(fromTo[0])) {
                newFunction2[fromTo[0]] = {};
            }
            if (newFunction2[fromTo[0]].hasOwnProperty(nextState)) {
                newFunction2[fromTo[0]][nextState].push(ter);
            } else {
                newFunction2[fromTo[0]][nextState] = [ter];
            }
        });
    });

    automParse["function"] = newFunction;
    automParse["function2"] = newFunction2;
    automParse["alphabet"] = alphabet;
    automParse["type"] = "NFA";
    automParse.accept = accepting;

    if (success) {
        gui.out.value = "Successfully parsed Automata of type " + automParse.type;
        setEnableAutomata(true);
        setEnableParser(true);
    }
}