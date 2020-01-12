/*(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!*/

function Matrix(values, separator) {
    this.values = [];
    this.width = -1;
    this.height = -1;
    if (values instanceof Array) {
        this.readFromArray(values);
    } else if (typeof values == "string") {
        var valStr = values.split("\n");
        var strArray = [];
        valStr.forEach(line => {
            if (line.trim().length > 0) {
                strArray.push(line.split("&"));
            }
        });
        this.readFromArray(strArray);
    }
    if (isFinite(separator)) {
        this.separatorAfter = separator;
    } else {
        this.separatorAfter = -1;
    }
}

Matrix.prototype.readFromArray = function (values) {
    this.height = values.length;
    values.forEach(line => {
        if (line instanceof Array) {
            if (this.width != -1 && line.length != this.width) {
                gui.out.innerText = "The Matrix must have the same numver of cells in each row";
                throw new EvalError("The Matrix must have the same numver of cells in each row");
            }
            this.width = line.length;
            var lineField = [];
            line.forEach(cell => {
                if (cell instanceof CurrentField) {
                    lineField.push(cell);
                } else {
                    lineField.push(new CurrentField(cell.trim()));
                }
            });
            this.values.push(lineField);
        } else {
            if (this.width != -1 && 1 != this.width) {
                gui.out.innerText = "The Matrix must have the same numver of cells in each row";
                throw new EvalError("The Matrix must have the same numver of cells in each row");
            }
            this.width = 1;
            if (line instanceof CurrentField) {
                this.values.push([line]);
            } else {
                this.values.push([new CurrentField(line.trim())]);
            }
        }
    });
}

Matrix.prototype.add = function (other) {
    if (other.width != this.width || other.height != this.height) {
        gui.out.innerText = "The Matrices to be added must be the same width AND height";
        throw new EvalError("The Matrices to be added must be the same width AND height");
    }
    var newVals = [];
    for (var y = 0; y < this.height; y++) {
        newVals[y] = [];
        for (var x = 0; x < this.width; x++) {
            newVals[y][x] = this.values[y][x].add(other.values[y][x]);
        }
    }
    return new Matrix(newVals, this.separatorAfter);
}

Matrix.prototype.multiply = function (other) {
    if (this.width != other.height) {
        gui.out.innerText = "The first matrix must have the same width as the second one's height";
        throw new EvalError("The first matrix must have the same width as the second one's height");
    }
    var newVal = [];
    var newWidth = other.width;
    var newHeigh = this.height;
    for (var y = 0; y < this.height; y++) {
        newVal[y] = [];
        for (var x = 0; x < other.width; x++) {
            newVal[y][x] = CurrentField.neutralAdd();
            for (var i = 0; i < this.width; i++) {
                newVal[y][x] = newVal[y][x].add(this.values[y][i].multiply(other.values[i][x]));
            }
        }
    }
    return new Matrix(newVal, this.separatorAfter);
}

Matrix.prototype.appendRight = function (other) {
    if (other.height != this.height) {
        gui.out.innerText = "The second matrix must have the same heigh as the first one";
        throw new EvalError("The second matrix must have the same heigh as the first one");
    }
    var newVals = [];
    for (var y = 0; y < this.height; y++) {
        newVals[y] = this.values[y].concat(other.values[y]);
    }
    return new Matrix(newVals, this.width - 1);
}

Matrix.prototype.isColumnClear = function (colNum) {
    var foundOne = false;
    for (var y = 0; y < this.height; y++) {
        if (foundOne && this.values[y][colNum] != 0) {
            return false;
        } else if (!foundOne && this.values[y][colNum] != 0) {
            foundOne = true;
        }
    }
    return true;
}

Matrix.prototype.clearColumn = function (col, row) {
    if (!this.values[row][col].equals(CurrentField.neutralAdd())) {
        var invCell = this.values[row][col].invertMult();
        var newOpLine = [];
        var newVals = [];
        for (var i = 0; i < this.width; i++) {
            newOpLine.push(this.values[row][i].multiply(invCell));
        }
        for (var y = 0; y < this.height; y++) {
            newVals[y] = [];
            if (y != row) {
                for (var x = 0; x < this.width; x++) {
                    newVals[y][x] = this.values[y][x].subtract(this.values[y][col].multiply(newOpLine[x]));
                }
            } else {
                newVals[y] = newOpLine;
            }
        }
        return new Matrix(newVals, this.separatorAfter);
    } else {
        return this;
    }
}

Matrix.prototype.toStepForm = function () {
    var unusedRows = [];
    for (var a = this.height - 1; a >= 0; a--) {
        unusedRows.push(a);
    }
    var newMat = this;
    for (var i = 0; i < this.width; i++) {
        if (!newMat.isColumnClear(i) && unusedRows.length > 0) {
            var row = unusedRows.pop();
            newMat = newMat.clearColumn(i, row);
        }
        if (SHOW_STEP_FORM_CALCULATION_PATH) {
            gui.out.innerHTML += newMat.toString() + "<br><br>";
        }
    }
    return newMat;
}

Matrix.prototype.subtract = function (other) {
    return this.add(other.invertAdd());
}

Matrix.prototype.devide = function (other) {
    return this.multiply(this.invertMult());
}

Matrix.prototype.invertMult = function () {
    var erg = this.appendRight(Matrix.unitMatrix(this.height));
    erg = erg.toStepForm();
    return erg;
}

Matrix.prototype.equals = function (other) {
    if (!other instanceof Matrix) {
        return false;
    }
    if (other.width != this.width || other.height != this.height) {
        return false;
    }
    for (var y = 0; y < this.values.length; y++) {
        for (var x = 0; x < this.values[y].length; x++) {
            if (!other.values[y][x].equals(this.values[y][x])) {
                return false;
            }
        }
    }
    return true;
}

Matrix.prototype.invertAdd = function () {
    var newVals = [];
    for (var y = 0; y < this.height; y++) {
        newVals[y] = [];
        for (var x = 0; x < this.width; x++) {
            newVals[y][x] = this.values[y][x].invertAdd();
        }
    }
    return new Matrix(newVals, this.separatorAfter);
}

Matrix.unitMatrix = function (size) {
    var newVals = [];
    for (var y = 0; y < size; y++) {
        newVals[y] = [];
        for (var x = 0; x < size; x++) {
            if (y == x) {
                newVals[y][x] = CurrentField.neutralMult();
            } else {
                newVals[y][x] = CurrentField.neutralAdd();
            }
        }
    }
    return new Matrix(newVals);
}

Matrix.prototype.toString = function (mode) {
    if (mode == "latex") {
        var erg = "$\\left(\\begin{array}{";
        for (var i = 0; i < this.width; i++) {
            erg += "c";
            if (i == this.separatorAfter) {
                erg += "|";
            }
        }
        erg += "}<br>";
        this.values.forEach(line => {
            line.forEach(cell => {
                erg += cell.toString(mode) + "&amp;";
                i++;
            });
            erg = erg.substr(0, erg.length - 5);
            erg += "\\\\ <br>";
        });
        erg += "\\end{array}\\right)$"

        return erg;
    }

    var erg = "<table class='matrix'><tbody>"
    this.values.forEach(line => {
        erg += "<tr>";
        var i = 0;
        line.forEach(cell => {
            if (i == this.separatorAfter) {
                erg += "<td class='borderRight'>"
            } else {
                erg += "<td>";
            }
            erg += cell.toString(mode) + "</td>";
            i++;
        });
        erg += "</tr>";
    });
    erg += "</tbody></table>";
    return erg;
}