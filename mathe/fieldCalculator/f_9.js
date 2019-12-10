/*(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!*/

function F9(str, val1) {
    if (isFinite(str) && isFinite(val1)) {
        this.value0 = parseInt(str);
        this.value1 = parseInt(str);
    } else if (str instanceof F9) {
        this.value0 = str.value0;
        this.value1 = str.value1;
    } else {
        if (isFinite(str)) {
            this.value0 = parseInt(str);
            this.value1 = 0;
        } else {
            this.value0 = 0;
            this.value1 = 0;
            var multiplyer = 1;
            var pos = -1;
            while (str.length > 0) {
                pos = str.trim().search(/(\+|-)/g);
                if (pos == 0) {
                    if (str.charAt(0) == '-') {
                        multiplyer = -1;
                    }
                    str = str.substr(pos + 1).trim();
                    pos = str.search(/(\+|-)/g);
                }
                if (pos < 0) {
                    pos = str.length;
                }
                var subPart = str.substr(0, pos)
                if (subPart.indexOf("i") >= 0) {
                    subPart = subPart.replace("i", "");
                    if (subPart.length == 0) {
                        this.value1 += 1 * multiplyer;
                    } else {
                        this.value1 += parseInt(subPart) * multiplyer;
                    }
                } else {
                    this.value0 += parseInt(subPart) * multiplyer;
                }
                str = str.substr(pos).trim();
            }

        }
    }
    this.normalize();
}

F9.prototype.normalize = function () {
    this.value0 = this.value0 % 3;
    this.value1 = this.value1 % 3;
    while (this.value0 < 0) {
        this.value0 += 3
    }
    while (this.value1 < 0) {
        this.value1 += 3
    }
}

F9.prototype.add = function (other) {
    this.normalize();
    other.normalize();
    newValue0 = this.value0 + other.value0;
    newValue1 = this.value1 + other.value1;
    var newF9 = new F9(newValue0, newValue1);
    newF9.normalize();
    return newF9;
}

F9.prototype.subtract = function (other) {
    this.normalize();
    other.normalize();
    return this.add(other.invertAdd());
}

F9.prototype.multiply = function (other) {
    this.normalize();
    other.normalize();
    newValue0 = this.value0 * other.value0 - this.value1 * other.value1;
    newValue1 = this.value0 * other.value1 + this.value1 * other.value0;
    var newF9 = new F9(newValue0, newValue1);
    newF9.normalize();
    return newF9;
}

F9.prototype.devide = function (other) {
    this.normalize();
    other.normalize();
    return this.multiply(other.invertMult());
}

F9.prototype.invertMult = function () {
    this.normalize();
    if (this.value0 == 0) {
        if (this.value1 == 0) {
            throw new RangeError("Can't devide by 0");
        } else if (this.value1 == 1) {
            return new F9(0, 2);
        } else if (this.value1 == 2) {
            return new F9(0, 1);
        }
    } else if (this.value0 == 1) {
        if (this.value1 == 0) {
            return new F9(1, 0);
        } else if (this.value1 == 1) {
            return new F9(2, 1)
        } else if (this.value1 == 2) {
            return new F9(2, 2)
        }
    } else if (this.value0 == 2) {
        if (this.value1 == 0) {
            return new F9(2, 0)
        } else if (this.value1 == 1) {
            return new F9(1, 1)
        } else if (this.value1 == 2) {
            return new F9(1, 2)
        }
    }
    throw new Error("Unexpected state - Unknown numver in F_9");
}

F9.prototype.invertAdd = function () {
    this.normalize();
    newValue0 *= -1;
    newValue1 *= -1;
    var newF9 = new F9(newValue0, newValue1);
    newF9.normalize();
    return newF9;
}

F9.prototype.equals = function (other) {
    if (!other instanceof RealNumber) {
        return false;
    }
    return (other.value0 == this.value0 && other.value1 == this.value1);
}

F9.neutralAdd = function () {
    return new F9(0);
}

F9.neutralMult = function () {
    return new F9(1);
}

F9.prototype.toString = function (mode) {
    var iota = "&iota;";
    if (mode == "latex") {
        iota = "\\iota";
    }
    if (this.value1 < 0) {
        return this.value0 + "-" + Math.abs(this.value1) + iota;
    } else if (this.value1 > 0) {
        return this.value0 + "+" + Math.abs(this.value1) + iota;
    } else {
        return this.value0;
    }
}