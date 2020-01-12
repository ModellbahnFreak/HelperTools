/*(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!*/

function ModuloNumber(str, modVal) {
    if (str instanceof ModuloNumber) {
        this.mod = Math.floor(str.mod);
        this.value = Math.floor(str.value);
    } else {
        if (isFinite(str)) {
            this.value = Math.floor(str);
        } else if (typeof str == "string") {
            this.value = parseInt(str);
        } else {
            this.value = 0;
        }
        if (isFinite(modVal)) {
            this.mod = Math.floor(modVal);
        } else if (typeof modVal == "string") {
            this.mod = parseInt(modVal);
        } else {
            if (gui != undefined && gui.modVal != undefined && gui.modVal.value != undefined) {
                this.mod = parseInt(gui.modVal.value);
            } else {
                this.mod = 3;
            }
        }
    }
    this.normalize();
}

ModuloNumber.prototype.normalize = function() {
    this.value = this.normalizeVal(this.value);
}

ModuloNumber.prototype.normalizeVal = function(x) {
    var y = x % this.mod;
    while (y < 0) {
        y += this.mod;
    }
    return y;
}

ModuloNumber.prototype.add = function (other) {
    if (this.mod == other.mod) {
        this.normalize();
        other.normalize();
        var newValue = this.value + other.value;
        var newNum = new ModuloNumber(newValue, this.mod);
        newNum.normalize();
        return newNum;
    }
}

ModuloNumber.prototype.subtract = function (other) {
    this.normalize();
    other.normalize();
    return this.add(other.invertAdd());
}

ModuloNumber.prototype.multiply = function (other) {
    if (this.mod == other.mod) {
        this.normalize();
        other.normalize();
        var newValue = this.value * other.value;
        var newNum = new ModuloNumber(newValue, this.mod);
        newNum.normalize();
        return newNum;
    }
}

ModuloNumber.prototype.devide = function (other) {
    this.normalize();
    other.normalize();
    return this.multiply(other.invertMult());
}

ModuloNumber.prototype.invertMult = function () {
    this.normalize();
    if (this.value == 0) {
        throw new Error("Arithmetic exception, division by 0");
    }
    for (var i = 1; i < this.mod; i++) {
        var erg = this.value * i;
        if (this.normalizeVal(erg) == 1) {
            return new ModuloNumber(i, this.mod);
        }
    }
}

ModuloNumber.prototype.invertAdd = function () {
    this.normalize();
    var newNum = new ModuloNumber(this.normalizeVal(-this.value), this.mod);
    newNum.normalize();
    return newNum;
}

ModuloNumber.prototype.equals = function (other) {
    if (!other instanceof ModuloNumber) {
        return false;
    }
    return (other.value == this.value && other.mod == this.mod);
}

ModuloNumber.neutralAdd = function () {
    return new ModuloNumber(0);
}

ModuloNumber.neutralMult = function () {
    return new ModuloNumber(1);
}

ModuloNumber.prototype.toString = function (mode) {
    this.normalize();
    if (this.mod == 3 && this.value == 2) {
        return "-1";
    }
    return this.value;
}