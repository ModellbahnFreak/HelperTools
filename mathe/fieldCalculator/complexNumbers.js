/*(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!*/

function ComplexNumber(str, val1) {
    if (isFinite(str) && isFinite(val1)) {
        this.value0 = parseInt(str);
        this.value1 = parseInt(val1);
    } else if (str instanceof ComplexNumber) {
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
}

ComplexNumber.prototype.add = function (other) {
    newValue0 = this.value0 + other.value0;
    newValue1 = this.value1 + other.value1;
    return new ComplexNumber(newValue0, newValue1);
}

ComplexNumber.prototype.subtract = function (other) {
    return this.add(other.invertAdd());
}

ComplexNumber.prototype.multiply = function (other) {
    newValue0 = this.value0 * other.value0 - this.value1 * other.value1;
    newValue1 = this.value0 * other.value1 + this.value1 * other.value0;
    return new ComplexNumber(newValue0, newValue1);
}

ComplexNumber.prototype.devide = function (other) {
    return this.multiply(other.invertMult());
}

ComplexNumber.prototype.invertMult = function () {
    var divisor = this.value0 * this.value0 + this.value1 * this.value1;
    if (divisor == 0) {
        throw new RangeError("Can't devide by 0");
    }
    var newVal0 = this.value0 / divisor;
    var newVal1 = -1 * this.value1 / divisor;
    return new ComplexNumber(newVal0, newVal1);
}

ComplexNumber.prototype.invertAdd = function () {
    newValue0 *= -1;
    newValue1 *= -1;
    return new ComplexNumber(newValue0, newValue1);
}

ComplexNumber.prototype.equals = function (other) {
    if (!other instanceof ComplexNumber) {
        return false;
    }
    return (other.value0 == this.value0 && other.value1 == this.value1);
}

ComplexNumber.neutralAdd = function () {
    return new ComplexNumber(0);
}

ComplexNumber.neutralMult = function () {
    return new ComplexNumber(1);
}

ComplexNumber.prototype.toString = function (mode) {
    if (this.value1 < 0) {
        return this.value0 + "-" + Math.abs(this.value1) + "i";
    } else if (this.value1 > 0) {
        return this.value0 + "+" + Math.abs(this.value1) + "i";
    } else {
        return this.value0;
    }
}