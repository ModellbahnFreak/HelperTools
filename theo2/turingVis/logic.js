const tracks = document.querySelector(".trackContainer");
var allCells = document.querySelectorAll(".cell");
const allTracks = document.querySelectorAll(".track");
const cellWidth = allCells[0].offsetWidth;
var cellsByTrack = [];
var trackContent = [];
var currOffset = 0;
var currentMachine = undefined;

const btnParseMachine = document.querySelector("#btnParseMachine");
const btnConvert = document.querySelector("#btnConvert");
const btnStep = document.querySelector("#btnStep");
const btnRun = document.querySelector("#btnRun");
const btnStop = document.querySelector("#btnStop");
const machineProgramInput = document.querySelector("#machineProgramInput");
const txtInputWord = document.querySelector("#txtInputWord");
const btnWriteToTrack = document.querySelector("#btnWriteToTrack");
const btnReset = document.querySelector("#btnReset");

function init() {
    tracks.style.transform = "translateX(50%) translateX(-" + (cellWidth / 2) + "px)";
    reinitTrackContent();
    btnParseMachine.addEventListener("click", () => {
        try {
            currentMachine = execNormalProgram(0, machineProgramInput.value);
        } catch (e) {
            lblCurrentState.value = "ERROR: " + e;
        }
    });
    btnRun.addEventListener("click", () => {
        if (currentMachine) {
            currentMachine.exec();
        } else {
            alert("You have to enter and parse a machine first");
        }
    });
    btnStop.addEventListener("click", () => {
        if (currentMachine) {
            currentMachine.shouldStop = true;
        } else {
            alert("You have to enter and parse a machine first");
        }
    });
    btnStep.addEventListener("click", () => {
        if (currentMachine) {
            currentMachine.exec(1);
        } else {
            alert("You have to enter and parse a machine first");
        }
    });
    btnConvert.addEventListener("click", () => {
        if (currentMachine) {
            currentMachine = convertMachineToIneffective(currentMachine);
        } else {
            alert("You have to enter and parse a machine first");
        }
    });
    btnWriteToTrack.addEventListener("click", () => {
        writeToTrack(0, txtInputWord.value);
    });
    machineProgramInput.addEventListener("change", () => {
        localStorage.setItem("machineProgram", machineProgramInput.value);
    });
    txtInputWord.addEventListener("change", () => {
        localStorage.setItem("inputWord", txtInputWord.value);
    });
    btnReset.addEventListener("click", () => {
        try {
            currentMachine = execNormalProgram(0, machineProgramInput.value);
            writeToTrack(0, txtInputWord.value);
        } catch (e) {
            lblCurrentState.value = "ERROR: " + e;
        }
    });
    machineProgramInput.value = localStorage.getItem("machineProgram");
    txtInputWord.value = localStorage.getItem("inputWord");
    try {
        currentMachine = execNormalProgram(0, machineProgramInput.value);
    } catch (e) {
        lblCurrentState.value = "ERROR: " + e;
    }
    writeToTrack(0, localStorage.getItem("inputWord"));
}

function reinitTrackContent() {
    trackContent = [];
    cellsByTrack = [];
    for (var i = 0; i < allTracks.length; i++) {
        trackContent.push([]);
        cellsByTrack.push([]);
    }
}

function gotoCell(num) {
    currOffset = num;
    for (var i = 0; i < allCells.length; i++) {
        //allCells[i].style.transform = "translateX(-" + (cellWidth * (num + 0.5)) + "px)";
        allCells[i].style.transform = "translateX(-" + (num * 100) + "%)";
    }
}

function writeToTrack(trackNum, text) {
    allCells = [];
    reinitTrackContent();
    for (var i = 0; i < allTracks.length; i++) {
        while (allTracks[i].firstElementChild) {
            allTracks[i].firstElementChild.remove();
        }
    }
    for (var i = 0; i < text.length; i++) {
        for (var a = 0; a < allTracks.length; a++) {
            if (a == trackNum) {
                trackContent[a][i] = text.charAt(i);
                const newTop = document.createElement("div");
                newTop.className = "cell border";
                newTop.innerText = text.charAt(i);
                allTracks[a].appendChild(newTop);
                cellsByTrack[a][i] = newTop;
                allCells.push(newTop);
            } else {
                trackContent[a][i] = "";
                const newBottom = document.createElement("div");
                newBottom.className = "cell";
                allTracks[a].appendChild(newBottom);
                cellsByTrack[a][i] = newBottom;
                allCells.push(newBottom);
            }
        }
    }
}

function insertOntoTrack(trackNum, end, char) {
    for (var a = 0; a < allTracks.length; a++) {
        if (a == trackNum) {
            const newTop = document.createElement("div");
            newTop.className = "cell border";
            newTop.innerText = char;
            newTop.style.transform = "translateX(-" + (currOffset * 100) + "%)";
            if (end) {
                allTracks[a].appendChild(newTop);
                cellsByTrack[a].splice(cellsByTrack[a].length, 0, newTop);
                trackContent[a].splice(trackContent[a].length, 0, char);
            } else {
                allTracks[a].prepend(newTop);
                cellsByTrack[a].splice(0, 0, newTop);
                trackContent[a].splice(0, 0, char);
            }
            allCells.push(newTop);
        } else {
            const newBottom = document.createElement("div");
            newBottom.className = "cell";
            newBottom.style.transform = "translateX(-" + (currOffset * 100) + "%)";
            if (end) {
                allTracks[a].appendChild(newBottom);
                cellsByTrack[a].splice(cellsByTrack[a].length, 0, newBottom);
                trackContent[a].splice(trackContent[a].length, 0, "");
            } else {
                allTracks[a].prepend(newBottom);
                cellsByTrack[a].splice(0, 0, newBottom);
                trackContent[a].splice(0, 0, "");
            }
            allCells.push(newBottom);
        }
    }
}

function changeCellContent(track, index, newChar) {
    cellsByTrack[track][index].classList.add("border");
    cellsByTrack[track][index].innerText = newChar;
}

function stepTuringNormal(program, steps) {
    if (!program.hasEnded) {
        const numSteps = steps > 0 ? steps : -1;
        if (numSteps == 0) {
            return program.hasEnded;
        }
        const currChr = trackContent[program.track][program.currentCellIndex]
        if (program.fun[program.currState] && program.fun[program.currState][currChr]) {
            trackContent[program.track][program.currentCellIndex] = program.fun[program.currState][currChr].newChr;
            changeCellContent(program.track, program.currentCellIndex, program.fun[program.currState][currChr].newChr);
            if (program.fun[program.currState][currChr].move == "l") {
                if (program.currentCellIndex > 0) {
                    program.currentCellIndex--;
                    gotoCell(program.currentCellIndex);
                } else {
                    insertOntoTrack(program.track, false, "_");
                }
            } else if (program.fun[program.currState][currChr].move == "r") {
                if (program.currentCellIndex < trackContent[program.track].length - 1) {
                    program.currentCellIndex++;
                    gotoCell(program.currentCellIndex);
                } else {
                    insertOntoTrack(program.track, true, "_");
                    program.currentCellIndex++;
                    gotoCell(program.currentCellIndex);
                }
            }
            program.currState = program.fun[program.currState][currChr].newState;
            lblCurrentState.value = program.currState;
            if (program.endStates.includes(program.currState)) {
                program.hasEnded = true;
                program.wasSuccessFull = true;
                lblCurrentState.value = program.currState + " - accepted";
            }
        } else {
            program.hasEnded = true;
            program.wasSuccessFull = false;
            lblCurrentState.value = program.currState + " - rejected";
        }
        if (program.shouldStop) {
            program.shouldStop = false;
        } else {
            if ((numSteps - 1) != 0 && !program.hasEnded) {
                setTimeout(() => {
                    stepTuringNormal(program, numSteps - 1);
                }, 1000);
            }
        }
    }
    return program.hasEnded;
}

function stepTuringDual(program, steps) {
    if (!program.hasEnded) {
        const numSteps = steps > 0 ? steps : -1;
        if (numSteps == 0) {
            return program.hasEnded;
        }
        const currChrs = [];
        for (var i = 0; i < allTracks.length; i++) {
            if (trackContent[i][program.currentCellIndex] && trackContent[i][program.currentCellIndex].length > 0) {
                currChrs.push(trackContent[i][program.currentCellIndex]);
            }
        }
        const currChrsStr = currChrs.join(";");
        if (program.fun[program.currState] && program.fun[program.currState][currChrsStr]) {
            const newChrs = program.fun[program.currState][currChrsStr].newChr.split(";");
            for (var i = 0; i < newChrs.length; i++) {
                trackContent[i][program.currentCellIndex] = newChrs[i];
                changeCellContent(i, program.currentCellIndex, newChrs[i]);
            }
            if (program.fun[program.currState][currChrsStr].move == "l") {
                if (program.currentCellIndex > 0) {
                    program.currentCellIndex--;
                    gotoCell(program.currentCellIndex);
                } else {
                    insertOntoTrack(0, false, "_");
                }
            } else if (program.fun[program.currState][currChrsStr].move == "r") {
                if (program.currentCellIndex < trackContent[0].length - 1) {
                    program.currentCellIndex++;
                    gotoCell(program.currentCellIndex);
                } else {
                    insertOntoTrack(0, true, "_");
                    program.currentCellIndex++;
                    gotoCell(program.currentCellIndex);
                }
            }
            program.currState = program.fun[program.currState][currChrsStr].newState;
            lblCurrentState.value = program.currState;
            if (program.endStates.includes(program.currState)) {
                program.hasEnded = true;
                program.wasSuccessFull = true;
                lblCurrentState.value = program.currState + " - accepted";
            }
        } else {
            program.hasEnded = true;
            program.wasSuccessFull = false;
            lblCurrentState.value = program.currState + " - rejected";
        }
        if (program.shouldStop) {
            program.shouldStop = false;
        } else {
            if ((numSteps - 1) != 0 && !program.hasEnded) {
                setTimeout(() => {
                    stepTuringDual(program, numSteps - 1);
                }, 1000);
            }
        }
    }
    return program.hasEnded;
}

function convertMachineToIneffective(program) {
    var newProgram = {
        fun: {
            "s": {},
            "f": {},
            "d": {},
            "l_from": {},
            "l_to": {},
            "r_from": {},
            "r_to": {},
        },
        currentCellIndex: 0,
        endStates: ["f"],
        currState: "s",
        hasEnded: false,
        wasSuccessFull: false,
        alphabet: [],
        shouldStop: false,
        exec: (steps) => {
            program.shouldStop = false;
            return stepTuringDual(newProgram, steps);
        }
    };
    program.alphabet.forEach(char => {
        newProgram.fun["s"][char] = {
            newState: "d",
            newChr: char + ";q1",
            move: "n"
        };
        newProgram.fun["l_from"][char + ";q0"] = {
            newState: "d",
            newChr: char + ";q0",
            move: "l"
        };
        newProgram.fun["r_from"][char + ";q0"] = {
            newState: "d",
            newChr: char + ";q0",
            move: "r"
        };
        newProgram.fun["l_to"][char] = {
            newState: "l_from",
            newChr: char + ";q1",
            move: "r"
        };
        newProgram.fun["r_to"][char] = {
            newState: "r_from",
            newChr: char + ";q1",
            move: "l"
        };
        for (var i = 0; i < program.states.length; i++) {
            if (program.fun[program.states[i]] && program.fun[program.states[i]][char]) {
                const nextStateIdx = program.states.indexOf(program.fun[program.states[i]][char].newState) + 1;
                if (nextStateIdx == 0) {
                    throw new Error("This can't happen");
                }
                if (program.endStates.indexOf(program.fun[program.states[i]][char].newState) >= 0) {
                    newProgram.fun["d"][char + ";q" + (i + 1)] = {
                        newState: "f",
                        newChr: program.fun[program.states[i]][char].newChr + ";q" + nextStateIdx,
                        move: "n"
                    };
                } else {
                    if (program.fun[program.states[i]][char].move == "l") {
                        newProgram.fun["d"][char + ";q" + (i + 1)] = {
                            newState: "l_from",
                            newChr: program.fun[program.states[i]][char].newChr + ";q" + nextStateIdx,
                            move: "n"
                        };
                    } else if (program.fun[program.states[i]][char].move == "r") {
                        newProgram.fun["d"][char + ";q" + (i + 1)] = {
                            newState: "r_from",
                            newChr: program.fun[program.states[i]][char].newChr + ";q" + nextStateIdx,
                            move: "n"
                        };
                    } else {
                        newProgram.fun["d"][char + ";q" + (i + 1)] = {
                            newState: "d",
                            newChr: program.fun[program.states[i]][char].newChr + ";q" + nextStateIdx,
                            move: "n"
                        };
                    }
                }
            }
            newProgram.fun["l_to"][char + ";q" + (i + 1)] = {
                newState: "l_from",
                newChr: char + ";q" + (i + 2),
                move: "r"
            };
            newProgram.fun["r_to"][char + ";q" + (i + 1)] = {
                newState: "r_from",
                newChr: char + ";q" + (i + 2),
                move: "l"
            };
            newProgram.fun["l_from"][char + ";q" + (i + 1)] = {
                newState: "l_to",
                newChr: char + ";q" + (i),
                move: "l"
            };
            newProgram.fun["r_from"][char + ";q" + (i + 1)] = {
                newState: "r_to",
                newChr: char + ";q" + (i),
                move: "r"
            };
        }
        newProgram.fun["l_to"][char + ";q0"] = {
            newState: "l_from",
            newChr: char + ";q1",
            move: "r"
        };
        newProgram.fun["r_to"][char + ";q0"] = {
            newState: "r_from",
            newChr: char + ";q1",
            move: "l"
        };
    });
    lblCurrentState.value = newProgram.currState + " - not running yet";
    return newProgram;
}

function execNormalProgram(trackNum, programText) {
    var operations = programText.split("\n").map(l => l.trim().toLowerCase()).filter(l => !l.startsWith(";") && l.length != 0);
    var program = {
        fun: {},
        currentCellIndex: 0,
        track: trackNum,
        endStates: [],
        currState: "s",
        hasEnded: false,
        wasSuccessFull: false,
        alphabet: [],
        states: [],
        shouldStop: false,
        exec: (steps) => {
            program.shouldStop = false;
            return stepTuringNormal(program, steps);
        }
    };
    var syntaxInvalid = -1;
    for (var i = 0; i < operations.length; i++) {
        const line = operations[i];
        var parts = line.split(",");
        if (parts.length != 5) {
            syntaxInvalid = i;
        }
        if (!program.fun[parts[0]]) {
            program.fun[parts[0]] = {};
        }
        program.fun[parts[0]][parts[1]] = {
            newState: parts[2],
            newChr: parts[3],
            move: parts[4]
        };
        if (program.alphabet.indexOf(parts[1]) < 0) {
            program.alphabet.push(parts[1]);
        }
        if (program.alphabet.indexOf(parts[3]) < 0) {
            program.alphabet.push(parts[3]);
        }
        if (program.states.indexOf(parts[0]) < 0) {
            program.states.push(parts[0]);
        }
        if (program.states.indexOf(parts[2]) < 0) {
            program.states.push(parts[2]);
        }
    }
    if (syntaxInvalid >= 0) {
        console.log("Fallback to other syntax");
        program.fun = {};
        program.states = [];
        program.alphabet = [];
        syntaxInvalid = -1;
        for (var i = 0; i < operations.length; i++) {
            const line = operations[i];
            var parts = line.split(" ");
            if (parts.length != 5) {
                syntaxInvalid = i;
            }
            if (!program.fun[parts[0]]) {
                program.fun[parts[0]] = {};
            }
            program.fun[parts[0]][parts[1]] = {
                newState: parts[4],
                newChr: parts[2],
                move: parts[3]
            };
            if (program.alphabet.indexOf(parts[1]) < 0) {
                program.alphabet.push(parts[1]);
            }
            if (program.alphabet.indexOf(parts[2]) < 0) {
                program.alphabet.push(parts[2]);
            }
            if (program.states.indexOf(parts[0]) < 0) {
                program.states.push(parts[0]);
            }
            if (program.states.indexOf(parts[4]) < 0) {
                program.states.push(parts[4]);
            }
        }
    }
    if (syntaxInvalid >= 0) {
        throw new Error("Syntax error in line " + (syntaxInvalid + 1))
    }
    if (program.states.indexOf("s") < 0) {
        if (program.states.indexOf("q1") >= 0) {
            program.states.splice(program.states.indexOf("q1"), 1);
            program.states.splice(0, 0, "q1");
            program.currState = "q1";
        } else {
            program.states.splice(0, 0, "s");
        }
    } else {
        program.states.splice(program.states.indexOf("s"), 1);
        program.states.splice(0, 0, "s");
    }
    program.states.forEach(state => {
        if (state == "f" || state.includes("halt")) {
            program.endStates.push(state);
        }
    });
    lblCurrentState.value = program.currState + " - not running yet";

    return program;
}

init();