/*(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!*/

function RationalNumber(str, denominator) {
    if (str instanceof RationalNumber) {
        this.numerator = str.numerator;
        this.denominator = str.denominator;
    } else {
        if (isFinite(str) && isFinite(denominator)) {
            this.numerator = parseFloat(str);
            this.denominator = parseFloat(denominator);
        } else if (typeof str == "string") {
            if (str.indexOf("/") >= 0) {
                var parts = str.split(/\//);
                if (parts.length < 2) {
                    throw new Error("Not a correct Fraction format");
                }
                this.numerator = parseFloat(parts[0]);
                this.denominator = parseFloat(parts[1]);
            } else {
                var val = parseFloat(str);
                this.numerator = undefined;
                for (this.denominator = 1; this.denominator < Number.MAX_SAFE_INTEGER && this.numerator == undefined; this.denominator++) {
                    if ((val * this.denominator) % 1 == 0) {
                        this.numerator = val * this.denominator;
                    }
                }
                this.denominator--;
            }
        }
    }
    if (this.denominator == 0) {
        throw new Error("Division by zero is not allowed");
    }
}

RationalNumber.prototype.add = function (other) {
    var newNumerator = 0;
    var newDenominator = 1;
    if (this.denominator == other.denominator) {
        newNumerator = this.numerator + other.numerator;
        newDenominator = this.denominator;
    } else {
        newNumerator = (this.numerator * other.denominator) + (other.numerator * this.denominator);
        newDenominator = this.denominator * other.denominator;
    }
    var erg = new RationalNumber(newNumerator, newDenominator);
    erg.simplify();
    return erg;
}

RationalNumber.prototype.subtract = function (other) {
    return this.add(other.invertAdd());
}

RationalNumber.prototype.multiply = function (other) {
    var newNumerator = this.numerator * other.numerator;
    var newDenominator = this.denominator * other.denominator;
    var erg = new RationalNumber(newNumerator, newDenominator);
    erg.simplify();
    return erg;
}

RationalNumber.prototype.devide = function (other) {
    return this.multiply(other.invertMult());
}

RationalNumber.prototype.invertMult = function () {
    var erg = new RationalNumber(this.denominator, this.numerator);
    erg.simplify();
    return erg;
}

RationalNumber.prototype.invertAdd = function () {
    var erg = new RationalNumber((-1) * this.numerator, this.denominator);
    erg.simplify();
    return erg;
}

RationalNumber.prototype.simplify = function () {
    if (this.denominator < 0) {
        this.denominator *= -1;
        this.numerator *= -1;
    }
    for (var i = Math.max(this.numerator, this.denominator); i >= 1; i--) {
        if (this.denominator % i == 0 && this.numerator % i == 0) {
            this.numerator /= i;
            this.denominator /= i;
            break;
        }
    }
}

RationalNumber.prototype.equals = function (other) {
    if (!other instanceof RealNumber) {
        return false;
    }
    if (other.numerator == this.numerator && other.denominator == this.denominator) {
        return true;
    }
    return (this.numerator / this.denominator) == (other.numerator / other.denominator);
}

RationalNumber.neutralAdd = function () {
    return new RationalNumber(0, 1);
}

RationalNumber.neutralMult = function () {
    return new RationalNumber(1, 1);
}

RationalNumber.prototype.toString = function (mode) {
    if (mode == "latex") {
        if (this.denominator == 1) {
            return this.numerator;
        } else if (this.numerator * this.denominator < 0) {
            return "-\\frac{" + Math.abs(this.numerator) + "}{" + Math.abs(this.denominator) + "}";
        } else {
            return "\\frac{" + Math.abs(this.numerator) + "}{" + Math.abs(this.denominator) + "}";
        }
    }

    if (this.denominator == 1) {
        return this.numerator;
    } else if (this.numerator * this.denominator < 0) {
        return "-<sup>" + Math.abs(this.numerator) + "</sup>&frasl;<sub>" + Math.abs(this.denominator) + "</sub>";
    } else {
        return "<sup>" + Math.abs(this.numerator) + "</sup>&frasl;<sub>" + Math.abs(this.denominator) + "</sub>";
    }
}