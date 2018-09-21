/* tslint:disable:one-line max-line-length interface-name comment-format */
/// <reference path="boxes.ts" />

//#region # enum CellType
enum CellType
{
  /** Leere Zelle (schwarz) */
  Empty,

  /** Weißes aufblinken (z.B. wenn eine Zeile entfernt wird) */
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
  view() : void
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

  /** setzt eine Box in das Spielfeld (ohne Bereichsprüfung)
   * @param x X-Position der Box
   * @param y Y-Position der Box
   * @param box Box, welche gesetzt werden soll
   */
  setBox(x: number, y: number, box: Box) : void
  {
    x += box.ofsX;
    y += box.ofsY;
    var bc = box.cells;
    for (var i = 0; i < bc.length; i++)
    {
      var cx = x + bc[i].x;
      var cy = y + bc[i].y;
      if (cy < 0) { continue; } // Zelle oben außerhalb des Spielfeldes -> ignorieren
      this.cells[cx + cy * this.width].data = box.cellType;
    }
  }

  /** entfernt eine Box wieder aus dem Spielfeld
   * @param x X-Position der Box
   * @param y Y-Position der Box
   * @param box Box, welche entfernt werden soll
   */
  removeBox(x: number, y: number, box: Box): void
  {
    x += box.ofsX;
    y += box.ofsY;
    var bc = box.cells;
    for (var i = 0; i < bc.length; i++)
    {
      var cx = x + bc[i].x;
      var cy = y + bc[i].y;
      if (cy < 0) { continue; } // Zelle oben außerhalb des Spielfeldes -> ignorieren
      this.cells[cx + cy * this.width].data = CellType.Empty;
    }
  }

  /** prüft, ob eine bestimmte Box gesetzt werden kann
   * @param x X-Position der Box
   * @param y Y-Position der Box
   * @param box Box, welche geprüft werden soll
   */
  checkBox(x: number, y: number, box: Box): boolean
  {
    x += box.ofsX;
    y += box.ofsY;
    var bc = box.cells;
    for (var i = 0; i < bc.length; i++)
    {
      var cx = x + bc[i].x;
      var cy = y + bc[i].y;
      if (cx < 0 || cx >= this.width || cy >= this.height) { return false; } // links, rechts oder unten außerhalb des Spielfeldes -> Fehler
      if (cy < 0) { continue; } // Zelle oben außerhalb des Spielfeldes -> kein Fehler
      if (this.cells[cx + cy * this.width].data !== CellType.Empty) { return false; } // Zelle ist bereits belegt -> Fehler
    }
    return true; // keine verbotenen Zellen gefunden -> OK
  }
}
