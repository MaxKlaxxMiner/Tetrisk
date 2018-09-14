/* tslint:disable:one-line max-line-length interface-name comment-format */
/// <reference path="boxes.ts" />
//#region # enum CellType
var CellType;
(function (CellType) {
    /** Leere Zelle (schwarz) */
    CellType[CellType["Empty"] = 0] = "Empty";
    /** Weißes aufblinken */
    CellType[CellType["Blink"] = 1] = "Blink";
    /** hochgeschobenes Feld (vom Gegner) */
    CellType[CellType["Pushed"] = 2] = "Pushed";
    /** Box (2x2)
     * ##
     * ##
     */
    CellType[CellType["Box"] = 3] = "Box";
    /** Linie (4x1)
     * ####
     */
    CellType[CellType["Row"] = 4] = "Row";
    /** Dreieck
     * #
     * ##
     * #
     */
    CellType[CellType["Triangle"] = 5] = "Triangle";
    /** Z-Element
     * ##
     *  ##
     */
    CellType[CellType["Zel"] = 6] = "Zel";
    /** S-Element
     *  ##
     * ##
     */
    CellType[CellType["Sel"] = 7] = "Sel";
    /** L-Element
     * #
     * #
     * ##
     */
    CellType[CellType["Left"] = 8] = "Left";
    /** R-Element
     * ##
     * #
     * #
     */
    CellType[CellType["Right"] = 9] = "Right";
})(CellType || (CellType = {}));
CellType.classNames = ["e", "w", "p", "b", "r", "t", "z", "s", "l", "a"];
var Field = (function () {
    //#region // --- constructor ---
    function Field(parentDiv, fieldWidth, fieldHeight, maxWidth, maxHeight) {
        this.width = fieldWidth;
        this.height = fieldHeight;
        this.cells = [];
        // --- maximale Größe einer Zelle berechnen ---
        maxWidth -= fieldWidth + 1;
        maxHeight -= fieldHeight + 1;
        var cellSize = 2;
        while (cellSize * fieldWidth <= maxWidth && cellSize * fieldHeight <= maxHeight) {
            cellSize++;
        }
        cellSize--;
        // --- Tabelle als DOM-Struktur erzeugen ---
        var tab = document.createElement("TABLE");
        tab.classList.add("game");
        for (var y = 0; y < fieldHeight; y++) {
            var row = document.createElement("TR");
            row.style.height = cellSize + "px";
            for (var x = 0; x < fieldWidth; x++) {
                var cell = document.createElement("TD");
                cell.style.width = cellSize + "px";
                cell.style.height = cellSize + "px";
                cell.className = CellType.classNames[0 /* Empty */];
                row.appendChild(cell);
                this.cells.push({
                    ref: cell,
                    view: 0 /* Empty */,
                    data: 0 /* Empty */
                });
            }
            tab.appendChild(row);
        }
        parentDiv.appendChild(tab);
    }
    //#endregion
    /** aktualisert die Farben auf dem Spielfeld (sofern notwendig) */
    Field.prototype.view = function () {
        var cells = this.cells;
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            if (cell.view !== cell.data) {
                cell.ref.className = CellType.classNames[cell.data];
                cell.view = cell.data;
            }
        }
    };
    /** setzt eine Box in das Spielfeld (ohne Bereichsprüfung)
     * @param x X-Position der Box
     * @param y Y-Position der Box
     * @param box Box, welche gesetzt werden soll
     */
    Field.prototype.setBox = function (x, y, box) {
        x += box.ofsX;
        y += box.ofsY;
        var bc = box.cells;
        for (var i = 0; i < bc.length; i++) {
            var cx = x + bc[i].x;
            var cy = y + bc[i].y;
            if (cy < 0)
                continue;
            this.cells[cx + cy * this.width].data = box.cellType;
        }
    };
    /** entfernt eine Box wieder aus dem Spielfeld
     * @param x X-Position der Box
     * @param y Y-Position der Box
     * @param box Box, welche entfernt werden soll
     */
    Field.prototype.delBox = function (x, y, box) {
        x += box.ofsX;
        y += box.ofsY;
        var bc = box.cells;
        for (var i = 0; i < bc.length; i++) {
            var cx = x + bc[i].x;
            var cy = y + bc[i].y;
            if (cy < 0)
                continue;
            this.cells[cx + cy * this.width].data = 0 /* Empty */;
        }
    };
    /** prüft, ob eine bestimmte Box gesetzt werden kann
     * @param x X-Position der Box
     * @param y Y-Position der Box
     * @param box Box, welche geprüft werden soll
     */
    Field.prototype.checkBox = function (x, y, box) {
        x += box.ofsX;
        y += box.ofsY;
        var bc = box.cells;
        for (var i = 0; i < bc.length; i++) {
            var cx = x + bc[i].x;
            var cy = y + bc[i].y;
            if (cy < 0)
                continue;
            if (cx < 0 || cx >= this.width || cy >= this.height)
                return false;
            if (this.cells[cx + cy * this.width].data !== 0 /* Empty */)
                return false;
        }
        return true;
    };
    return Field;
})();
//# sourceMappingURL=field.js.map