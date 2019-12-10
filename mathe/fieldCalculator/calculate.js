/*(c) 2019 ModellbahnFreak
This tool was created by ModellbahnFreak (the author)(https://github.com/ModellbahnFreak) and published via Github
(https://modellbahnfreak.github.io/HelperTools/theo/grammar/). Usage of the project and/or it's sources (this also
includes parts of it) without the permission on ModellbahnFreak is not allowed! Furtuermore, the author doesn't take
any responsibilities for anything (especially not concerning this tool). The result calculated by this tool might be
inacurate or wrong. The author doesn't claim, that they are correct either. If the results are used, they should be
checked with care!*/

var gui = {};
var fields = {
    "realNumbers": RealNumber,
    "rationalNumbers": RationalNumber,
    "f_9": F9
};
var CurrentField = fields["realNumbers"];
function init() {
    gui = document.getElementsByTagName("*");
    gui.selField.addEventListener("change", setNewField);

    gui.addNum.addEventListener("click", numberOperation);
    gui.subtrNum.addEventListener("click", numberOperation);
    gui.multNum.addEventListener("click", numberOperation);
    gui.devideNum.addEventListener("click", numberOperation);

    gui.btnMatAdd.addEventListener("click", matOperation);
    gui.btnMatSubtr.addEventListener("click", matOperation);
    gui.btnMatMultiply.addEventListener("click", matOperation);
    gui.btnMatDevide.addEventListener("click", matOperation);
    gui.btnMatInvert1.addEventListener("click", matOperation);
    gui.btnAppend.addEventListener("click", matOperation);
    gui.btnStepForm.addEventListener("click", matOperation);

    gui.mat1.value = "1&2&3\n4&5&6";
    gui.mat2.value = "1&1&1\n1&1&1";
}

function setNewField() {
    gui.mat1.value = "";
    gui.mat2.value = "";
    gui.num1.value = "";
    gui.num2.value = "";
    CurrentField = fields[gui.selField.value];
}

function numberOperation(e) {
    var part1 = new CurrentField(gui.num1.value.trim());
    var part2 = new CurrentField(gui.num2.value.trim());
    switch (e.target.id) {
        case "addNum":
            gui.out.innerHTML = part1.add(part2).toString(gui.selMode.value);
            break;
        case "subtrNum":
            gui.out.innerHTML = part1.subtract(part2).toString(gui.selMode.value);
            break;
        case "multNum":
            gui.out.innerHTML = part1.multiply(part2).toString(gui.selMode.value);
            break;
        case "devideNum":
            gui.out.innerHTML = part1.devide(part2).toString(gui.selMode.value);
            break;
    }
}

function matOperation(e) {
    var part1 = new Matrix(gui.mat1.value.trim());
    var part2 = new Matrix(gui.mat2.value.trim());
    switch (e.target.id) {
        case "btnMatAdd":
            gui.out.innerHTML = part1.add(part2).toString(gui.selMode.value);
            break;
        case "btnMatSubtr":
            gui.out.innerHTML = part1.subtract(part2).toString(gui.selMode.value);
            break;
        case "btnMatMultiply":
            gui.out.innerHTML = part1.multiply(part2).toString(gui.selMode.value);
            break;
        case "btnMatDevide":
            gui.out.innerHTML = part1.devide(part2).toString(gui.selMode.value);
            break;
        case "btnMatInvert1":
            gui.out.innerHTML = part1.invertMult().toString(gui.selMode.value);
            break;
        case "btnAppend":
            gui.out.innerHTML = part1.appendRight(part2).toString(gui.selMode.value);
            break;
        case "btnStepForm":
            var erg = part1;
            if (part2.height == part1.height) {
                erg = part1.appendRight(part2);
            }
            gui.out.innerHTML = erg.toStepForm().toString(gui.selMode.value);
            break;
    }
}