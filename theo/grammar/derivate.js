/*
(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!
*/

function derivate(anzDeriv, maxLen, leftDerivation) {
    //var start = new Date();
    if (!grParse.hasOwnProperty("variables") || !grParse.hasOwnProperty("rules") || !grParse.hasOwnProperty("alphabet") || !grParse.hasOwnProperty("start")) {
        return;
    }

    if (lastDerivMode != 0) {
        producedWords = {};
        producedWords[grParse.start] = 0;
        lastLevelProduced = [grParse.start];
        lastDerivMode = 0;
        thisLevel = 0;
    }

    var foundWords = true;
    for (var i = 0; i < anzDeriv && foundWords; i++) {
        thisLevel++;
        foundWords = false;
        var newProduced = [];
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
            lastLevelProduced = newProduced;
            foundWords = true;
        }
    }
    out.innerText = "";
    if (!foundWords) {
        out.innerText += "Finished! No more words found\n";
    }
    out.innerText += "Found " + Object.keys(producedWords).length + "\n";
    out.innerText += Object.keys(producedWords);

    /*var end = new Date();
    console.log(end - start);*/
}

function leftDerivation(anzDeriv, maxLen) {
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

    out.innerText = "";

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
                                var newHistory = oldHistory.concat({ "word": newWord, "from": leftmostNonTermRule.from, "to": rightSide.str });
                                var history = { "word": newWord, "history": newHistory };

                                if (containsNonTerminals(newWord) || producedWords[newWord] == undefined) {
                                    producedWords[newWord] = thisLevel;
                                    newProduced.push(history);
                                } else {
                                    if (grParse.isUnique) {
                                        var differentH = findSameWord(history, newProduced);
                                        if (differentH.length > 0) {
                                            out.innerText += "Not unique!\n";
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
        out.innerText += "Finished! No more words found with left derivation\n";
    }
    out.innerText += "Found " + Object.keys(producedWords).length + "\n";
    out.innerText += Object.keys(producedWords);
}

function containsNonTerminals(word) {
    if (!grParse.hasOwnProperty("variables")) {
        return true;
    }
    var contains = false;
    word.split('').forEach(c => {
        if (grParse.variables.indexOf(c) >= 0) {
            contains = true;
            return;
        }
    });
    return contains;
}

function historiesSame(h1, h2) {
    if (h1.word != h2.word) {
        return false;
    }
    if (h1.history.length != h2.history.length) {
        return false;
    }
    for (var i = 0; i < h1.history.length; i++) {
        if (h1.history[i].from != h2.history[i].from || h2.history[i].to != h2.history[i].to) {
            return false;
        }
    }
    return true;
}

function findSameWord(h, otherList) {
    var words = [];
    if (otherList) {
        otherList.forEach(p => {
            if (p != h && p.word == h.word) {
                if (!historiesSame(p, h)) {
                    words.push(p);
                }
            }
        });
    }
    if (words.length == 0) {
        wordProcuctions.forEach(p => {
            if (p != h && p.word == h.word) {
                if (!historiesSame(p, h)) {
                    words.push(p);
                }
            }
        });
    }
    return words;
}

function checkWordGrammar() {
    var word = txtWord.value;

    var notFoundReason = 2;//not found; 2: too short; 0: found
    producedWords.forEach(function (w) {
        if (w == word) {
            out.innerText = "The word was found in the language.";
            notFoundReason = 0;
            return;
        }
        if (w.length >= word.length) {
            notFoundReason = 1;
        }
    });
    if (notFoundReason == 2) {
        out.innerText = "The word wasn't found in the list of known derivates. Try derivating at least untill the length of the derivates matches your word.";
        if (grParse.hasOwnProperty("type")) {
            if (grParse.type > 0) {
                out.innerText = "Trying to create more derivates to potentially find the word. Pleas wait.";
                derivate(7, word.length);
            }
            checkWordGrammar();
        }
    } else if (notFoundReason == 1) {
        out.innerText = "The word wasn't found in with the known derivates. This means with a high probability that the word isn't in the language. But it's not for sure!";
    }
}