/* tslint:disable:one-line max-line-length interface-name comment-format */
/// <reference path="field.ts" />

interface BoxCell
{
  x: number;
  y: number;
}

class Box
{
  cellType: CellType;
  ofsX: number;
  ofsY: number;
  cells: BoxCell[];
  rotLeft: Box;
  rotRight: Box;

  constructor(cellType: CellType, ofsX: number, ofsY: number, cells: string)
  {
    this.cellType = cellType;
    this.ofsX = ofsX;
    this.ofsY = ofsY;
    this.cells = [];
    var x = 0;
    var y = 0;
    for (var i = 0; i < cells.length; i++)
    {
      switch (cells.charCodeAt(i))
      {
        case 35: this.cells.push({ x: x, y: y }); x++; break; // "#" - Cell
        case 32: x++; break;        // Space
        case 10: y++; x = 0; break; // Linebreak
      }
    }
  }
}

var boxes = (() =>
{
  var bx: Box[] = [];
  var b1: Box, b2: Box, b3: Box, b4: Box;

  // --- Box ---
  b1 = new Box(CellType.Box, 0, 0,
    "##\n" +
    "##");
  b1.rotLeft = b1.rotRight = b1;
  bx.push(b1);

  b1 = new Box(CellType.Row, -1, 0,
    "####");
  b2 = new Box(CellType.Row, 0, -1,
    "#\n" +
    "#\n" +
    "#\n" +
    "#");
  b1.rotLeft = b1.rotRight = b2;
  b2.rotLeft = b2.rotRight = b1;
  bx.push(b1);

  // --- Triangle ---
  b1 = new Box(CellType.Triangle, -1, 0,
    "###\n" +
    " #");
  b2 = new Box(CellType.Triangle, 0, -1,
    "#\n" +
    "##\n" +
    "#");
  b3 = new Box(CellType.Triangle, -1, -1,
    " #\n" +
    "###");
  b4 = new Box(CellType.Triangle, -1, -1,
    " #\n" +
    "##\n" +
    " #");
  b1.rotLeft = b2; b1.rotRight = b4;
  b2.rotLeft = b3; b2.rotRight = b1;
  b3.rotLeft = b4; b3.rotRight = b2;
  b4.rotLeft = b1; b4.rotRight = b3;
  bx.push(b1);

  // --- Z-Element ---
  b1 = new Box(CellType.Zel, -1, 0,
    "##\n" +
    " ##");
  b2 = new Box(CellType.Zel, 0, -1,
    " #\n" +
    "##\n" +
    "#");
  b1.rotLeft = b1.rotRight = b2;
  b2.rotLeft = b2.rotRight = b1;
  bx.push(b1);

  // --- S-Element ---
  b1 = new Box(CellType.Sel, -1, 0,
    " ##\n" +
    "##");
  b2 = new Box(CellType.Sel, 0, -1,
    "#\n" +
    "##\n" +
    " #");
  b1.rotLeft = b1.rotRight = b2;
  b2.rotLeft = b2.rotRight = b1;
  bx.push(b1);

  // --- L-Element ---
  b1 = new Box(CellType.Left, -1, 0,
    "###\n" +
    "#");
  b2 = new Box(CellType.Left, 0, -1,
    "#\n" +
    "#\n" +
    "##");
  b3 = new Box(CellType.Left, -1, -1,
    "  #\n" +
    "###");
  b4 = new Box(CellType.Left, -1, -1,
    "##\n" +
    " #\n" +
    " #");
  b1.rotLeft = b2; b1.rotRight = b4;
  b2.rotLeft = b3; b2.rotRight = b1;
  b3.rotLeft = b4; b3.rotRight = b2;
  b4.rotLeft = b1; b4.rotRight = b3;
  bx.push(b1);

  // --- R-Element ---
  b1 = new Box(CellType.Right, -1, 0,
    "###\n" +
    "  #");
  b2 = new Box(CellType.Right, 0, -1,
    "##\n" +
    "#\n" +
    "#");
  b3 = new Box(CellType.Right, -1, -1,
    "#\n" +
    "###");
  b4 = new Box(CellType.Right, -1, -1,
    " #\n" +
    " #\n" +
    "##");
  b1.rotLeft = b2; b1.rotRight = b4;
  b2.rotLeft = b3; b2.rotRight = b1;
  b3.rotLeft = b4; b3.rotRight = b2;
  b4.rotLeft = b1; b4.rotRight = b3;
  bx.push(b1);

  return bx;
})();
