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

  /** gespeicherte Zellen (Standard: 10 x 16 Elemente) */
  cells: Cell[];

  /** gespeicherte Zellen für die Vorschau (4 x 4 Elemente) */
  previewCells: Cell[];

  //#region // --- constructor ---
  constructor(parentDiv: HTMLElement, fieldWidth: number, fieldHeight: number, maxWidth: number, maxHeight: number)
  {
    this.width = fieldWidth;
    this.height = fieldHeight;
    this.cells = [];
    this.previewCells = [];

    // --- maximale Größe einer Zelle berechnen ---
    maxWidth -= fieldWidth + 1;
    maxHeight -= fieldHeight + 1;
    var cellSize = 2;
    while (cellSize * fieldWidth <= maxWidth && cellSize * fieldHeight <= maxHeight)
    {
      cellSize++;
    }
    cellSize--;

    // --- Tabelle des Spielfeldes erzeugen (Default: 10 x 16)---
    var x: number, y: number, row: HTMLElement, cell: HTMLElement;
    var fieldTab = document.createElement("TABLE");
    fieldTab.classList.add("game");
    for (y = 0; y < fieldHeight; y++)
    {
      row = document.createElement("TR");
      row.style.height = cellSize + "px";
      for (x = 0; x < fieldWidth; x++)
      {
        cell = document.createElement("TD");
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
      fieldTab.appendChild(row);
    }

    // --- Tabelle mit der Spielvorschau erzeugen (4 x 4) ---
    var previewTab = document.createElement("TABLE");
    previewTab.classList.add("game");
    for (y = 0; y < 4; y++)
    {
      row = document.createElement("TR");
      row.style.height = cellSize + "px";
      for (x = 0; x < 4; x++)
      {
        cell = document.createElement("TD");
        cell.style.width = cellSize + "px";
        cell.style.height = cellSize + "px";
        cell.className = (<any>CellType).classNames[CellType.Empty];
        row.appendChild(cell);

        this.previewCells.push({
          ref: cell,
          view: CellType.Empty,
          data: CellType.Empty
        });
      }
      previewTab.appendChild(row);
    }

    // --- Haupt-Tabelle mit links/rechts Trennung erzeugen ---
    var mainRow = document.createElement("TR");
    var leftCell = document.createElement("TD");
    var rightCell = document.createElement("TD");

    leftCell.appendChild(fieldTab);
    rightCell.style.verticalAlign = "top";
    rightCell.style.padding = (cellSize + 1) * 3 + "px 0 0 " + Math.ceil(cellSize / 2) + "px";
    rightCell.appendChild(previewTab);

    mainRow.appendChild(leftCell);
    mainRow.appendChild(rightCell);

    parentDiv.appendChild(document.createElement("TABLE").appendChild(mainRow));
  }
  //#endregion

  /** aktualisert die Farben auf dem Spielfeld (sofern notwendig) */
  view(): void
  {
    var i: number, cell: Cell;
    var cells = this.cells;
    for (i = 0; i < cells.length; i++)
    {
      cell = cells[i];
      if (cell.view !== cell.data)
      {
        cell.ref.className = (<any>CellType).classNames[cell.data];
        cell.view = cell.data;
      }
    }
    cells = this.previewCells;
    for (i = 0; i < cells.length; i++)
    {
      cell = cells[i];
      if (cell.view !== cell.data)
      {
        cell.ref.className = (<any>CellType).classNames[cell.data];
        cell.view = cell.data;
      }
    }
  }

  /**
   * zeigt eine bestimmten Stein in der Vorschau
   * @param box Stein, welcher gezeigt werden soll
   */
  previewBox(box: Box): void
  {
    var i: number;
    var bc = box.cells;

    // --- Position und Größe des Steins ermitteln ---
    var minX = 4, maxX = 0, minY = 4, maxY = 0;
    for (i = 0; i < bc.length; i++)
    {
      var px = bc[i].x;
      var py = bc[i].y;
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    }

    // --- alle alten Felder löschen ---
    for (i = 0; i < this.previewCells.length; i++)
    {
      this.previewCells[i].data = CellType.Empty;
    }

    // --- optimale Position berechnen und den neuen Stein zeichnen ---
    var x = 2 - Math.floor((maxX - minX + 2) / 2);
    var y = 2 - Math.floor((maxY - minY + 2) / 2);
    for (i = 0; i < bc.length; i++)
    {
      var cx = x + bc[i].x;
      var cy = y + bc[i].y;
      this.previewCells[cx + cy * 4].data = box.cellType;
    }
  }

  /** setzt einen Stein in das Spielfeld (ohne Bereichsprüfung)
   * @param x X-Position des Steins
   * @param y Y-Position des Steins
   * @param box Stein, welcher gesetzt werden soll
   */
  setBox(x: number, y: number, box: Box): void
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

  /** entfernt einen Stein wieder aus dem Spielfeld
   * @param x X-Position des Steins
   * @param y Y-Position des Steins
   * @param box Stein, welcher entfernt werden soll
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

  /** prüft, ob ein bestimmter Stein gesetzt werden kann
   * @param x X-Position des Steins
   * @param y Y-Position des Steins
   * @param box Stein, welcher geprüft werden soll
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

  /** scannt nach vollständigen Zeilen und gibt diese zurück (sofern welche vorhanden) */
  scanLines(): number[]
  {
    var w = this.width;
    var c = this.cells;
    var foundLines: number[] = [];
    for (var line = 0; line < this.height; line++)
    {
      var cells = 0;
      for (var x = 0; x < w; x++)
      {
        if (c[x + line * w].data === CellType.Empty) { break; }
        cells++;
      }
      if (cells === w) { foundLines.push(line); }
    }
    return foundLines;
  }

  /** entfernt Zeilen aus dem Spielfeld
   * @param lines Zeilen, welche entfernt werden sollen
   */
  linesRemove(lines: number[])
  {
    var w = this.width;
    var c = this.cells;
    for (var i = 0; i < lines.length; i++)
    {
      for (var y = lines[i] * w; y > 0; y -= w)
      {
        for (var x = 0; x < w; x++)
        {
          c[x + y].data = c[x + y - w].data;
        }
      }
      for (var l = 0; l < w; l++)
      {
        c[l].data = CellType.Empty;
      }
    }
  }

  /** markiert Zeilen auf dem Spielfeld
   * @param lines Zeilen, welche markiert werden sollen
   * @param cellType Zellentyp, welcher gesetzt werden soll 
   */
  linesMark(lines: number[], cellType: CellType)
  {
    var w = this.width;
    var c = this.cells;
    for (var i = 0; i < lines.length; i++)
    {
      var l = lines[i] * w;
      for (var x = 0; x < w; x++)
      {
        c[l + x].data = cellType;
      }
    }
  }
}
