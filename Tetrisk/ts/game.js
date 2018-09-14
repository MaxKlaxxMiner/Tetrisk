/* tslint:disable:one-line max-line-length interface-name comment-format */
/// <reference path="boxes.ts" />
/// <reference path="field.ts" />
var field;
window.onload = function () {
    var div = document.getElementById("game");
    if (div) {
        field = new Field(div, 10, 16, 1000, 600);
        for (var i = 0; i < 9; i++) {
            field.cells[i + 15 * 10].data = CellType.Pushed;
        }
        field.setBox(0, 13, boxes[0]);
        field.setBox(6, 14, boxes[1]);
        field.setBox(3, 14, boxes[2].rotLeft.rotLeft);
        field.setBox(4, 12, boxes[3]);
        field.setBox(1, 12, boxes[4].rotLeft);
        field.setBox(7, 13, boxes[5].rotLeft.rotLeft);
        field.setBox(0, 11, boxes[6].rotLeft);
        field.setBox(9, 8, boxes[1].rotLeft);
        field.view();
        console.log("init: ok");
    }
    else {
        console.log("init: error element not found");
    }
};
//# sourceMappingURL=game.js.map