function derivate(anzDeriv, maxLen) {
    if (!grParse.hasOwnProperty("variables") || !grParse.hasOwnProperty("rules") || !grParse.hasOwnProperty("alphabet") || !grParse.hasOwnProperty("start")) {
        return;
    }
    var foundWords = true;
    for (var i = 0; i < anzDeriv && foundWords; i++) {
        foundWords = false;
        var newProduced = [];
        producedWords.forEach(function (word) {
            grParse.rules.forEach(function (rule) {
                if (rule.hasOwnProperty("from") && rule.hasOwnProperty("to")) {
                    var fromPos = word.indexOf(rule.from)
                    while (fromPos >= 0) {
                        //if (fromPos >= 0) {
                        rule.to.forEach(function (rightSide) {
                            if (rightSide.hasOwnProperty("str")) {
                                if (maxLen == -1 || word.length - rule.from.length + rightSide.str.length <= maxLen) {
                                    var newWord = word.substr(0, fromPos) + rightSide.str + word.substr(fromPos + rule.from.length);
                                    if (producedWords.indexOf(newWord) < 0) {
                                        newProduced.push(newWord);
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
            producedWords = producedWords.concat(newProduced);
            foundWords = true;
        }
    }
    out.innerText = "";
    if (!foundWords) {
        out.innerText += "Finished! No more words found\n";
    }
    out.innerText += "Found " + producedWords.length + "\n";
    out.innerText += producedWords;
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