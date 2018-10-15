/* tslint:disable:one-line max-line-length interface-name comment-format */
/// <reference path="boxes.ts" />
/// <reference path="field.ts" />

interface LogElement
{
  /** Typ des Logeintrages: "box", "keys", "move", "lines" */
  logType: string;
  /** aktueller Timestamp */
  ticks: number;
}

interface LogBox extends LogElement
{
  /** Typ des Steines, welcher neu hinzugefügt wurde */
  cellType: CellType;
}

interface LogKeys extends LogElement
{
  /** Ticks, wie lange sicht nichts an den Tasten geändert hat */
  count: number;
  /** Taste für linke Steuerung gedrückt */
  left: boolean;
  /** Taste für rechts Steuerung gedrückt */
  right: boolean;
  /** Taste für nach unten gedrückt */
  down: boolean;
  /** Taste für Rechtsdrehung gedrückt (im Uhrzeigersinn) */
  rotCw: boolean;
  /** Taste für Linksdrehung gedrückt (gegen dem Uhrzeigersinn) */
  rotCc: boolean;
}

interface LogMove extends LogElement
{
  /** X-Bewegung des Steines (-1 = eins nach links, +1 = eins nach rechts, 0 = keine horizontale Bewegung) */
  x: number;
  /** Y-Bewegung des Steines (+1 = eins nach unten, 0 = keine vertikale Bewegung) */
  y: number;
  /** Rotation des Steines (-1 = Drehung gegen den Uhrzeigersinn, +1 = Drehung im Uhrzeigersinn, 0 = keine Drehung) */
  r: number;
}

interface LogLines extends LogElement
{
  /** Zeilen, welche als vollständig erkannt wurden */
  lines: number[];
  /** wurden die Zeilen nur flackernd markiert (false) oder nun wirklich entfernt (true) */
  removed: boolean;
}

class Logger
{
  data: LogElement[];

  //#region // --- Konstruktor ---
  constructor()
  {
    this.data = [];
  }
  //#endregion

  /** fügt neu erstellten Stein in den Logstream hinzu
   * @param ticks Zeitstempel des aktuellen Spiels
   * @param box Stein, welcher erstellt wurde
   */
  writeBox(ticks: number, box: Box): void
  {
    var lg: LogBox = { ticks: ticks, logType: "box", cellType: box.cellType };
    this.data.push(lg);
  }

  /** gibt den letzt bekannten Tasten-Status zurück */
  private getLastKeys(): LogKeys
  {
    for (var i = this.data.length - 1; i >= 0; i--)
    {
      if (this.data[i].logType === "keys") return <LogKeys>this.data[i];
    }
    return <LogKeys>null; // kein Keys-Eintrag gefunden
  }

  /** fügt einen Tastendruck-Event in den Logstream hinzu
   * @param ticks Zeitstempel des aktuellen Spiels
   * @param count Ticks, wie lange sicht nichts an den Tasten geändert hat
   * @param left Taste für linke Steuerung gedrückt
   * @param right Taste für rechts Steuerung gedrückt
   * @param down Taste für nach unten gedrückt
   * @param rotCw Taste für Rechtsdrehung gedrückt (im Uhrzeigersinn)
   * @param rotCc Taste für Linksdrehung gedrückt (gegen dem Uhrzeigersinn)
   */
  writeKeys(ticks: number, count: number, left: boolean, right: boolean, down: boolean, rotCw: boolean, rotCc: boolean): void
  {
    var lg: LogKeys = { ticks: ticks, logType: "keys", count: count, left: left, right: right, down: down, rotCw: rotCw, rotCc: rotCc };

    // --- nur wenn sich etwas an dem Tasten-Status geändert hat, dann einen neuen Log-Eintrag erstellen (sonst den alten nur anpassen) ---
    var last = this.getLastKeys();
    if (last && lg.left === last.left && lg.right === last.right && lg.down === last.down && lg.rotCw === last.rotCw && lg.rotCc === last.rotCc && last.ticks + last.count === lg.ticks)
    {
      last.count += lg.count;
    }
    else
    {
      this.data.push(lg);
    }
  }

  /** fügt eine Steinbewegung in den Logstream hinzu
   * @param ticks Zeitstempel des aktuellen Spiels
   * @param x X-Bewegung des Steines (-1 = eins nach links, +1 = eins nach rechts, 0 = keine horizontale Bewegung)
   * @param y Y-Bewegung des Steines (+1 = eins nach unten, 0 = keine vertikale Bewegung)
   * @param r Rotation des Steines (-1 = Drehung gegen den Uhrzeigersinn, +1 = Drehung im Uhrzeigersinn, 0 = keine Drehung)
   */
  writeMove(ticks: number, x: number, y: number, r: number): void
  {
    var lg: LogMove = { ticks: ticks, logType: "move", x: x, y: y, r: r };
    this.data.push(lg);
  }

  /** fügt einen Event in den Logstream hinzu, wenn eine oder mehrere vollständige Zeilen erkannt wurden
   * @param ticks Zeitstempel des aktuellen Spiels
   * @param lines betroffene Zeilen, welche als vollständig erkannt wurden
   * @param removed wurden die Zeilen nur flackernd markiert (false) oder nun wirklich entfernt (true)
   */
  writeLines(ticks: number, lines: number[], removed: boolean): void
  {
    var lg: LogLines = { ticks: ticks, logType: "lines", lines: lines, removed: removed };
    this.data.push(lg);
  }
}
