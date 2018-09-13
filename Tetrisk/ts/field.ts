/* tslint:disable:one-line max-line-length interface-name comment-format */

//#region # enum CellType
enum CellType
{
  /** Leere Zelle (schwarz) */
  Empty,

  /** Weißes aufblinken */
  Blink,

  /** hochgeschobenes Feld (vom Gegner) */
  Pushed,

  /** Box (2x2)
   * ##
   * ##
   */
  Box,

  /** Linie (4x1)
   * ####
   */
  Row,

  /** Dreieck
   * #
   * ##
   * #
   */
  Triangle,

  /** Z-Element
   * ##
   *  ##
   */
  Zel,

  /** S-Element
   *  ##
   * ##
   */
  Sel,

  /** L-Element
   * #
   * #
   * ##
   */
  Left,

  /** R-Element
   * ##
   * #
   * #
   */
  Right,
}
(<any>CellType).classNames = ["e", "w", "p", "b", "r", "t", "z", "s", "l", "a"];
//#endregion

interface Cell
{
  /** Referenz auf das HTML-Element */
  ref: HTMLElement;

  /** Farbe, welche momentan sichtbar ist */
  view: CellType;

  /** Farbe, welche gezeigt werden soll */
  data: CellType;
}

class Field
{
  /** Breite des Spielfeldes in Zellen (Standard: 10) */
  width: number;

  /** Höhe des Spielfeldes in Zellen (Standard: 16) */
  height: number;

  /** gespeicherte Zellen (Standard: 10 * 16 Elemente) */
  cells: Cell[];

  //#region // --- constructor ---
  constructor(parentDiv: HTMLElement, fieldWidth: number, fieldHeight: number, maxWidth: number, maxHeight: number)
  {
    this.width = fieldWidth;
    this.height = fieldHeight;
    this.cells = [];

    // --- maximale Größe einer Zelle berechnen ---
    maxWidth -= fieldWidth + 1;
    maxHeight -= fieldHeight + 1;
    var cellSize = 2;
    while (cellSize * fieldWidth <= maxWidth && cellSize * fieldHeight <= maxHeight)
    {
      cellSize++;
    }
    cellSize--;

    // --- Tabelle als DOM-Struktur erzeugen ---
    var tab = document.createElement("TABLE");
    tab.classList.add("game");
    for (var y = 0; y < fieldHeight; y++)
    {
      var row = document.createElement("TR");
      row.style.height = cellSize + "px";
      for (var x = 0; x < fieldWidth; x++)
      {
        var cell = document.createElement("TD");
        cell.style.width = cellSize + "px";
        cell.style.height = cellSize + "px";
        cell.className = (<any>CellType).classNames[CellType.Empty];
        row.appendChild(cell);

        this.cells.push({
          ref: cell,
          view: CellType.Empty,
          data: CellType.Empty
        });
      }
      tab.appendChild(row);
    }
    parentDiv.appendChild(tab);
  }
  //#endregion

  /** aktualisert die Farben auf dem Spielfeld (sofern notwendig) */
  view()
  {
    var cells = this.cells;
    for (var i = 0; i < cells.length; i++)
    {
      var cell = cells[i];
      if (cell.view !== cell.data)
      {
        cell.ref.className = (<any>CellType).classNames[cell.data];
        cell.view = cell.data;
      }
    }
  }
}
