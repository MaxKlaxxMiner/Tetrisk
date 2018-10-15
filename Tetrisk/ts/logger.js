/* tslint:disable:one-line max-line-length interface-name comment-format */
/// <reference path="boxes.ts" />
/// <reference path="field.ts" />
var Logger = (function () {
    //#region // --- Konstruktor ---
    function Logger() {
        this.data = [];
    }
    //#endregion
    /** fügt neu erstellten Stein in den Logstream hinzu
     * @param ticks Zeitstempel des aktuellen Spiels
     * @param box Stein, welcher erstellt wurde
     */
    Logger.prototype.writeBox = function (ticks, box) {
        var lg = { ticks: ticks, logType: "box", cellType: box.cellType };
        this.data.push(lg);
    };
    /** gibt den letzt bekannten Tasten-Status zurück */
    Logger.prototype.getLastKeys = function () {
        for (var i = this.data.length - 1; i >= 0; i--) {
            if (this.data[i].logType === "keys")
                return this.data[i];
        }
        return null; // kein Keys-Eintrag gefunden
    };
    /** fügt einen Tastendruck-Event in den Logstream hinzu
     * @param ticks Zeitstempel des aktuellen Spiels
     * @param count Ticks, wie lange sicht nichts an den Tasten geändert hat
     * @param left Taste für linke Steuerung gedrückt
     * @param right Taste für rechts Steuerung gedrückt
     * @param down Taste für nach unten gedrückt
     * @param rotCw Taste für Rechtsdrehung gedrückt (im Uhrzeigersinn)
     * @param rotCc Taste für Linksdrehung gedrückt (gegen dem Uhrzeigersinn)
     */
    Logger.prototype.writeKeys = function (ticks, count, left, right, down, rotCw, rotCc) {
        var lg = { ticks: ticks, logType: "keys", count: count, left: left, right: right, down: down, rotCw: rotCw, rotCc: rotCc };
        // --- nur wenn sich etwas an dem Tasten-Status geändert hat, dann einen neuen Log-Eintrag erstellen (sonst den alten nur anpassen) ---
        var last = this.getLastKeys();
        if (last && lg.left === last.left && lg.right === last.right && lg.down === last.down && lg.rotCw === last.rotCw && lg.rotCc === last.rotCc && last.ticks + last.count === lg.ticks) {
            last.count += lg.count;
        }
        else {
            this.data.push(lg);
        }
    };
    /** fügt eine Steinbewegung in den Logstream hinzu
     * @param ticks Zeitstempel des aktuellen Spiels
     * @param x X-Bewegung des Steines (-1 = eins nach links, +1 = eins nach rechts, 0 = keine horizontale Bewegung)
     * @param y Y-Bewegung des Steines (+1 = eins nach unten, 0 = keine vertikale Bewegung)
     * @param r Rotation des Steines (-1 = Drehung gegen den Uhrzeigersinn, +1 = Drehung im Uhrzeigersinn, 0 = keine Drehung)
     */
    Logger.prototype.writeMove = function (ticks, x, y, r) {
        var lg = { ticks: ticks, logType: "move", x: x, y: y, r: r };
        this.data.push(lg);
    };
    /** fügt einen Event in den Logstream hinzu, wenn eine oder mehrere vollständige Zeilen erkannt wurden
     * @param ticks Zeitstempel des aktuellen Spiels
     * @param lines betroffene Zeilen, welche als vollständig erkannt wurden
     * @param removed wurden die Zeilen nur flackernd markiert (false) oder nun wirklich entfernt (true)
     */
    Logger.prototype.writeLines = function (ticks, lines, removed) {
        var lg = { ticks: ticks, logType: "lines", lines: lines, removed: removed };
        this.data.push(lg);
    };
    return Logger;
})();
//# sourceMappingURL=logger.js.map