/* tslint:disable:one-line max-line-length interface-name comment-format */
/// <reference path="field.ts" />
var Box = (function () {
    function Box(cellType, ofsX, ofsY, cells) {
        this.cellType = cellType;
        this.ofsX = ofsX;
        this.ofsY = ofsY;
        this.cells = [];
        var x = 0;
        var y = 0;
        for (var i = 0; i < cells.length; i++) {
            switch (cells.charCodeAt(i)) {
                case 35:
                    this.cells.push({ x: x, y: y });
                    x++;
                    break;
                case 32:
                    x++;
                    break;
                case 10:
                    y++;
                    x = 0;
                    break;
            }
        }
    }
    return Box;
})();
var boxes = (function () {
    var bx = [];
    var b1, b2, b3, b4;
    // --- Box ---
    b1 = new Box(3 /* Box */, 0, 0, "##\n" + "##");
    b1.rotLeft = b1.rotRight = b1;
    bx.push(b1);
    b1 = new Box(4 /* Row */, -1, 0, "####");
    b2 = new Box(4 /* Row */, 0, -1, "#\n" + "#\n" + "#\n" + "#");
    b1.rotLeft = b1.rotRight = b2;
    b2.rotLeft = b2.rotRight = b1;
    bx.push(b1);
    // --- Triangle ---
    b1 = new Box(5 /* Triangle */, -1, 0, "###\n" + " #");
    b2 = new Box(5 /* Triangle */, 0, -1, "#\n" + "##\n" + "#");
    b3 = new Box(5 /* Triangle */, -1, -1, " #\n" + "###");
    b4 = new Box(5 /* Triangle */, -1, -1, " #\n" + "##\n" + " #");
    b1.rotLeft = b2;
    b1.rotRight = b4;
    b2.rotLeft = b3;
    b2.rotRight = b1;
    b3.rotLeft = b4;
    b3.rotRight = b2;
    b4.rotLeft = b1;
    b4.rotRight = b3;
    bx.push(b1);
    // --- Z-Element ---
    b1 = new Box(6 /* Zel */, -1, 0, "##\n" + " ##");
    b2 = new Box(6 /* Zel */, 0, -1, " #\n" + "##\n" + "#");
    b1.rotLeft = b1.rotRight = b2;
    b2.rotLeft = b2.rotRight = b1;
    bx.push(b1);
    // --- S-Element ---
    b1 = new Box(7 /* Sel */, -1, 0, " ##\n" + "##");
    b2 = new Box(7 /* Sel */, 0, -1, "#\n" + "##\n" + " #");
    b1.rotLeft = b1.rotRight = b2;
    b2.rotLeft = b2.rotRight = b1;
    bx.push(b1);
    // --- L-Element ---
    b1 = new Box(8 /* Left */, -1, 0, "###\n" + "#");
    b2 = new Box(8 /* Left */, 0, -1, "#\n" + "#\n" + "##");
    b3 = new Box(8 /* Left */, -1, -1, "  #\n" + "###");
    b4 = new Box(8 /* Left */, -1, -1, "##\n" + " #\n" + " #");
    b1.rotLeft = b2;
    b1.rotRight = b4;
    b2.rotLeft = b3;
    b2.rotRight = b1;
    b3.rotLeft = b4;
    b3.rotRight = b2;
    b4.rotLeft = b1;
    b4.rotRight = b3;
    bx.push(b1);
    // --- R-Element ---
    b1 = new Box(9 /* Right */, -1, 0, "###\n" + "  #");
    b2 = new Box(9 /* Right */, 0, -1, "##\n" + "#\n" + "#");
    b3 = new Box(9 /* Right */, -1, -1, "#\n" + "###");
    b4 = new Box(9 /* Right */, -1, -1, " #\n" + " #\n" + "##");
    b1.rotLeft = b2;
    b1.rotRight = b4;
    b2.rotLeft = b3;
    b2.rotRight = b1;
    b3.rotLeft = b4;
    b3.rotRight = b2;
    b4.rotLeft = b1;
    b4.rotRight = b3;
    bx.push(b1);
    return bx;
})();
//# sourceMappingURL=boxes.js.map