/* tslint:disable:one-line max-line-length interface-name comment-format */
/// <reference path="field.ts" />

var field: Field;

window.onload = () =>
{
  var div = document.getElementById("game");
  if (div)
  {
    field = new Field(div, 10, 16, 1000, 600);

    for (var i = 0; i < 9; i++)
    {
      field.cells[i + 15 * 10].data = CellType.Pushed;
    }

    field.cells[0 + 13 * 10].data = CellType.Box;
    field.cells[1 + 13 * 10].data = CellType.Box;
    field.cells[0 + 14 * 10].data = CellType.Box;
    field.cells[1 + 14 * 10].data = CellType.Box;

    field.cells[3 + 13 * 10].data = CellType.Triangle;
    field.cells[2 + 14 * 10].data = CellType.Triangle;
    field.cells[3 + 14 * 10].data = CellType.Triangle;
    field.cells[4 + 14 * 10].data = CellType.Triangle;

    field.cells[5 + 14 * 10].data = CellType.Row;
    field.cells[6 + 14 * 10].data = CellType.Row;
    field.cells[7 + 14 * 10].data = CellType.Row;
    field.cells[8 + 14 * 10].data = CellType.Row;

    field.cells[3 + 12 * 10].data = CellType.Zel;
    field.cells[4 + 12 * 10].data = CellType.Zel;
    field.cells[4 + 13 * 10].data = CellType.Zel;
    field.cells[5 + 13 * 10].data = CellType.Zel;

    field.cells[1 + 11 * 10].data = CellType.Sel;
    field.cells[1 + 12 * 10].data = CellType.Sel;
    field.cells[2 + 12 * 10].data = CellType.Sel;
    field.cells[2 + 13 * 10].data = CellType.Sel;

    field.cells[8 + 12 * 10].data = CellType.Left;
    field.cells[6 + 13 * 10].data = CellType.Left;
    field.cells[7 + 13 * 10].data = CellType.Left;
    field.cells[8 + 13 * 10].data = CellType.Left;

    field.cells[0 + 10 * 10].data = CellType.Right;
    field.cells[1 + 10 * 10].data = CellType.Right;
    field.cells[0 + 11 * 10].data = CellType.Right;
    field.cells[0 + 12 * 10].data = CellType.Right;

    field.view();

    console.log("init: ok");
  }
  else
  {
    console.log("init: error element not found");
  }
};
