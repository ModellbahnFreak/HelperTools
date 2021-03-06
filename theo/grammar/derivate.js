/*
(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!
*/

function derivate(lenData) {
    //var start = new Date();
    var anzDeriv = lenData[0];
    var maxLen = lenData[1];
    if (!grParse.hasOwnProperty("variables") || !grParse.hasOwnProperty("rules") || !grParse.hasOwnProperty("alphabet") || !grParse.hasOwnProperty("start")) {
        return;
    }

    if (lastDerivMode != 0) {
        producedWords = {};
        producedWords[grParse.start] = 0;
        lastLevelProduced = [grParse.start];
        wordProcuctions = [];
        wordProcuctions.push({ "word": grParse.start, "history": [] });
        lastDerivMode = 0;
        thisLevel = 0;
    }

    var foundWords = true;
    for (var i = 0; i < anzDeriv && foundWords; i++) {
        thisLevel++;
        foundWords = false;
        var newProduced = [];
        var newProductions = [];
        lastLevelProduced.forEach(function (word) {
            grParse.rules.forEach(function (rule) {
                if (rule.hasOwnProperty("from") && rule.hasOwnProperty("to")) {
                    var fromPos = word.indexOf(rule.from);
                    while (fromPos >= 0) {
                        rule.to.forEach(function (rightSide) {
                            if (rightSide.hasOwnProperty("str")) {
                                if (maxLen == -1 || word.length - rule.from.length + rightSide.str.length <= maxLen) {
                                    var newWord = word.substr(0, fromPos) + rightSide.str + word.substr(fromPos + rule.from.length);
                                    if (producedWords[newWord] == undefined) {
                                        newProduced.push(newWord);
                                        producedWords[newWord] = thisLevel;
                                        var oldHistory = findSameWord({ "word": word, "history": { length: -1 } })[0].history;
                                        var newHistory = oldHistory.concat({ "word": newWord, "from": rule.from, "to": rightSide.str, "index": fromPos, "idxShift": (rightSide.str.length - rule.from.length) });
                                        var history = { "word": newWord, "history": newHistory };
                                        newProductions.push(history);
                                    }
                                }
                            }
                        });
                        fromPos = word.indexOf(rule.from, fromPos + 1);
                    }
                }
            });
        });
        if (newProduced.length > 0) {
            wordProcuctions = wordProcuctions.concat(newProductions);
            lastLevelProduced = newProduced;
            foundWords = true;
        }
    }
    gui.out.value = "";
    if (!foundWords) {
        gui.out.value += "Finished! No more words found\n";
    }
    gui.out.value += "Found " + Object.keys(producedWords).length + "\n";
    gui.out.value += Object.keys(producedWords);

    /*var end = new Date();
    console.log(end - start);*/
}

function leftDerivation(lenData) {
    var anzDeriv = lenData[0];
    var maxLen = lenData[1];
    if (!grParse.hasOwnProperty("variables") || !grParse.hasOwnProperty("rules") || !grParse.hasOwnProperty("alphabet") || !grParse.hasOwnProperty("start")) {
        return;
    }

    if (lastDerivMode != 1) {
        producedWords = {};
        producedWords[grParse.start] = 0;
        lastLevelProduced = producedWords;
        wordProcuctions = [];
        wordProcuctions.push({ "word": grParse.start, "history": [] });
        lastDerivMode = 1;
        thisLevel = 0;
    }

    gui.out.value = "";

    var foundWords = true;
    for (var i = 0; i < anzDeriv && foundWords; i++) {
        thisLevel++;
        foundWords = false;
        var newProduced = [];
        wordProcuctions.forEach(function (production) {
            if (production.history.length == thisLevel - 1) {
                var word = production.word;
                var leftmostNonTermPos = -1;
                var leftmostNonTermRule = null;

                grParse.rules.forEach(function (rule) {
                    if (rule.hasOwnProperty("from") && rule.hasOwnProperty("to")) {
                        var fromPos = word.indexOf(rule.from);
                        if (fromPos >= 0 && (leftmostNonTermPos == -1 || leftmostNonTermPos > fromPos)) {
                            leftmostNonTermPos = fromPos;
                            leftmostNonTermRule = rule;
                        }
                    }
                });
                if (leftmostNonTermPos >= 0) {
                    leftmostNonTermRule.to.forEach(function (rightSide) {
                        if (rightSide.hasOwnProperty("str")) {
                            if (maxLen == -1 || word.length - leftmostNonTermRule.from.length + rightSide.str.length <= maxLen) {
                                var newWord = word.substr(0, leftmostNonTermPos) + rightSide.str + word.substr(leftmostNonTermPos + leftmostNonTermRule.from.length);
                                var oldHistory = production.history;
                                var newHistory = oldHistory.concat({ "word": newWord, "from": leftmostNonTermRule.from, "to": rightSide.str, "index": leftmostNonTermPos, "idxShift": (rightSide.str.length - leftmostNonTermRule.from.length) });
                                var history = { "word": newWord, "history": newHistory };

                                if (containsNonTerminals(newWord) || producedWords[newWord] == undefined) {
                                    producedWords[newWord] = thisLevel;
                                    newProduced.push(history);
                                } else {
                                    if (grParse.isUnique) {
                                        var differentH = findSameWord(history, newProduced);
                                        if (differentH.length > 0) {
                                            newProduced.push(history);
                                            gui.out.value += "Not unique!\n";
                                            grParse.isUnique = false;
                                            grParse["notUniqueExample"] = [newHistory, differentH[0].history];
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            }

        });
        if (newProduced.length > 0) {
            wordProcuctions = wordProcuctions.concat(newProduced);
            lastLevelProduced = newProduced;
            foundWords = true;
        }
    }
    if (!foundWords) {
        gui.out.value += "Finished! No more words found with left derivation\n";
    }
    gui.out.value += "Found " + Object.keys(producedWords).length + "\n";
    gui.out.value += Object.keys(producedWords);

}

function checkWordGrammar() {
    if (producedWords[txtWord.value] != undefined) {
        gui.out.value = "The word was found in the language.";
        return;
    } else {
        gui.out.value = "The word wasn't found in with the known derivates. This doesn't mean, that the word isn't in the language. The more often you derivate, the higher the certaincy is that it's not contained";
    }
}