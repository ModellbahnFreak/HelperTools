/*(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!*/

function RealNumber(str) {
    if (str instanceof RealNumber) {
        this.value = str.value;
    } else {
        this.value = parseFloat(str);
    }
}

RealNumber.prototype.add = function (other) {
    return new RealNumber(this.value + other.value);
}

RealNumber.prototype.subtract = function (other) {
    return new RealNumber(this.value - other.value);
}

RealNumber.prototype.multiply = function (other) {
    return new RealNumber(this.value * other.value);
}

RealNumber.prototype.devide = function (other) {
    return new RealNumber(this.value / other.value);
}

RealNumber.prototype.invertMult = function () {
    return new RealNumber(1.0 / this.value);
}

RealNumber.prototype.invertAdd = function () {
    return new RealNumber(-this.value);
}

RealNumber.prototype.equals = function (other) {
    if (!other instanceof RealNumber) {
        return false;
    }
    return other.value == this.value;
}

RealNumber.neutralAdd = function () {
    return new RealNumber(0);
}

RealNumber.neutralMult = function () {
    return new RealNumber(1);
}

RealNumber.prototype.toString = function () {
    return this.value;
}