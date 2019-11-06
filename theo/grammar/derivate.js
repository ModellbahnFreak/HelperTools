function derivate() {
    var anzDeriv = parseInt(numDerivate.value);
    if (!(anzDeriv > 0)) {
        anzDeriv = 1;
    }
    var maxLen = parseInt(numMaxLen.value);
    if (!(maxLen > -1)) {
        maxLen = -1;
    }
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