/* tslint:disable:one-line max-line-length interface-name comment-format */
/// <reference path="boxes.ts" />
/// <reference path="field.ts" />
/// <reference path="logger.ts" />
var game;
var keys = {};
var Game = (function () {
    //#endregion
    //#region // --- Konstruktor ---
    function Game(parentDiv, fieldWidth, fieldHeight, maxWidth, maxHeight) {
        // --- Spielfeld initialisieren ---
        this.field = new Field(parentDiv, fieldWidth, fieldHeight, maxWidth, maxHeight);
        // --- Standard-Tastencodes setzen ---
        this.setKeys([
            65,
            37,
            100
        ], [
            68,
            39,
            102
        ], [
            83,
            40,
            98
        ], [
            69,
            33,
            105
        ], [
            87,
            38,
            104
        ]);
    }
    //#endregion
    //#region // --- Start ---
    /** initialisiert und startet das Spiel */
    Game.prototype.start = function () {
        if (this.tickHandle) {
            return;
        }
        ;
        this.keyLeft = 0;
        this.keyRight = 0;
        this.keyMoveWait = 0;
        this.keyMoveNext = 0;
        this.keyDown = 0;
        this.keyRotate = false;
        this.keyRotateWait = 0;
        this.keyRotateNext = 0;
        this.ticks = 0;
        this.ticksLastDown = 0;
        this.helperDownTick = true;
        this.scanlines = [];
        this.scanlinesWait = 0;
        this.logWriter = new Logger();
        this.nextBox = this.rndNextBox();
        this.getNextBox();
        var my = this;
        var last = Date.now();
        this.tickHandle = setInterval(function () {
            var next = Date.now();
            my.tick(next - last);
            last = next;
        }, 1);
    };
    //#endregion
    //#region // --- Tasten-Hilfsmethoden ---
    /** ändert die Tastensteuerung
     * @param left Tastcodes für Linksbewegung (null = um die vorherige Einstellung zu behalten)
     * @param right Tastencodes für Rechtsbewegung (null = um die vorherige Einstellung zu behalten)
     * @param down Tastencodes für den Stein nach unten zu bewegen (null = um die vorherige Einstellung zu behalten)
     * @param clockwise Tastencodes um den Stein rechtsrum zu drehen (null = um die vorherige Einstellung zu behalten)
     * @param counterclockwise Tastencodes um den Stein linksrum zu drehen (null = um die vorherige Einstellung zu behalten)
     */
    Game.prototype.setKeys = function (left, right, down, clockwise, counterclockwise) {
        this.keys = {
            left: left || this.keys.left,
            right: right || this.keys.right,
            down: down || this.keys.down,
            clockwise: clockwise || this.keys.clockwise,
            counterclockwise: counterclockwise || this.keys.counterclockwise
        };
    };
    /** prüft, ob eine dieser Tasten gedrückt wurde
     * @param checkCodes Tastencodes, welche geprüft werden sollen
     */
    Game.isPressed = function (checkCodes) {
        for (var i = 0; i < checkCodes.length; i++) {
            if (keys[checkCodes[i]]) {
                return true; // einer der Tasten wurde gedrückt
            }
        }
        return false; // keine gedrückte Taste gefunden
    };
    //#endregion
    //#region // --- Steine-Hilfsmethoden ---
    /** gibt die nächste zufällige Box zurück */
    Game.prototype.rndNextBox = function () {
        return boxes[Math.floor(Math.random() * boxes.length)];
    };
    /** wechselt zum nächsten Stein und prüft, ob das Spiel weitergeführt werden kann */
    Game.prototype.getNextBox = function () {
        this.currentBox = this.nextBox;
        this.currentX = Math.floor(this.field.width / 2 - .5);
        this.currentY = 0;
        var alive = this.field.checkBox(this.currentX, this.currentY, this.currentBox);
        this.nextBox = this.rndNextBox();
        this.field.previewBox(this.nextBox);
        this.field.setBox(this.currentX, this.currentY, this.currentBox);
        this.logWriter && this.logWriter.writeBox(this.ticks, this.currentBox);
        return alive;
    };
    /** bewegt den aktuellen Stein und gibt zurück, ob dies möglich war
     * @param mx Offset X-Position (-1 = links, 0 = nichts, +1 = rechts)
     * @param my Offset Y-Position (0 = nichts, +1 = unten)
     * @param rot Drehrichtung (-1 = links drehen, 0 = nicht drehen, +1 = rechts drehen)
     */
    Game.prototype.moveBox = function (mx, my, rot, onlyCheck) {
        this.field.removeBox(this.currentX, this.currentY, this.currentBox);
        mx += this.currentX;
        my += this.currentY;
        var box = this.currentBox;
        if (rot < 0) {
            box = box.rotLeft;
        }
        if (rot > 0) {
            box = box.rotRight;
        }
        var canMove = this.field.checkBox(mx, my, box);
        if (canMove && !onlyCheck) {
            this.currentX = mx;
            this.currentY = my;
            this.currentBox = box;
        }
        this.field.setBox(this.currentX, this.currentY, this.currentBox);
        return canMove;
    };
    /**
     * Hilfsmethode, damit ein gerade bewegter Stein nicht zu schnell gesetzt wird
     */
    Game.prototype.downHelper = function () {
        if (this.helperDownTick && !this.moveBox(0, +1, 0, true)) {
            this.ticksLastDown = 0; // Auto-Tick für nach unten Bewegungen auf 0 setzen, damit der eben bewegte Stein nicht zu schnell aufgesetzt wird
            this.helperDownTick = false; // jetzigen Down-Helper als verbraucht markieren (wird zurück gesetzt, sobald der Stein sich wieder eins nach unten bewegt)
        }
    };
    //#endregion
    //#region // --- Tick ---
    /** führt eine oder mehrere Tick-Berechnungen durch
     * @param count Anzahl der Tick-Berechnungen, welche durchgeführt werden sollen (1000 Ticks = 1 Sekunde)
     */
    Game.prototype.tick = function (count) {
        if (count <= 0) {
            return;
        }
        // --- Tasten abfragen ---
        var pressLeft = Game.isPressed(this.keys.left);
        var pressRight = Game.isPressed(this.keys.right);
        var pressDown = Game.isPressed(this.keys.down);
        var rCw = Game.isPressed(this.keys.clockwise);
        var rCc = Game.isPressed(this.keys.counterclockwise);
        if (rCw !== rCc) {
            if (!this.keyRotate) {
                this.keyRotate = true;
                this.keyRotateNext += rCw ? +1 : -1;
                if (this.keyRotateNext < -2)
                    this.keyRotateNext += 4;
                if (this.keyRotateNext > +2)
                    this.keyRotateNext -= 4;
            }
        }
        else {
            this.keyRotate = false;
        }
        this.logWriter && this.logWriter.writeKeys(this.ticks, count, pressLeft, pressRight, pressDown, rCw, rCc);
        while (count > 0) {
            if (this.scanlinesWait > 0) {
                this.scanlinesWait--;
                if (this.scanlinesWait > 0) {
                    if (this.scanlinesWait % Game.tickLinesFlicker === 0) {
                        this.field.linesMark(this.scanlines, this.scanlinesWait % (Game.tickLinesFlicker * 2) === 0 ? 1 /* Blink */ : 0 /* Empty */);
                    }
                    this.ticks++;
                    count--;
                    continue;
                }
                this.field.linesRemove(this.scanlines);
                this.logWriter && this.logWriter.writeLines(this.ticks, this.scanlines, true);
                this.scanlines = [];
                if (!this.getNextBox()) {
                    // todo: Spieler hat verloren
                    return;
                }
                this.keyDown = -Game.tickMoveStart; // bereits gedrückte unten-Taste für eine kurze Zeit blocken, damit der nachfolgenden Stein nicht sofort losrennt
            }
            // --- gedrückte Tasten berechnen ---
            this.keyLeft = pressLeft ? this.keyLeft + 1 : 0;
            this.keyRight = pressRight ? this.keyRight + 1 : 0;
            this.keyDown = pressDown ? this.keyDown + 1 : 0;
            // --- links/rechts Bewegung berechnen ---
            if (this.keyLeft === 1 || this.keyRight === 0 && this.keyMoveNext >= 0 && this.keyLeft > Game.tickMoveStart && (this.keyLeft - Game.tickMoveStart) % Game.tickMoveRepeat === 1) {
                if (this.moveBox(this.keyMoveNext - 1, 0, 0, true))
                    this.keyMoveNext--;
            }
            if (this.keyRight === 1 || this.keyLeft === 0 && this.keyMoveNext <= 0 && this.keyRight > Game.tickMoveStart && (this.keyRight - Game.tickMoveStart) % Game.tickMoveRepeat === 1) {
                if (this.moveBox(this.keyMoveNext + 1, 0, 0, true))
                    this.keyMoveNext++;
            }
            // --- Drehung ausführen ---
            if (this.keyRotateWait === 0) {
                if (this.keyRotateNext !== 0) {
                    if (this.keyRotateNext < 0) {
                        this.keyRotateNext++;
                        if (this.moveBox(0, 0, -1)) {
                            this.downHelper();
                            this.logWriter && this.logWriter.writeMove(this.ticks, 0, 0, -1);
                            this.keyRotateWait = Game.tickMoveRepeat; // Limiter setzen
                        }
                    }
                    else {
                        this.keyRotateNext--;
                        if (this.moveBox(0, 0, +1)) {
                            this.downHelper();
                            this.logWriter && this.logWriter.writeMove(this.ticks, 0, 0, +1);
                            this.keyRotateWait = Game.tickMoveRepeat; // Limiter setzen
                        }
                    }
                }
            }
            else {
                this.keyRotateWait--;
            }
            // --- links/rechts Bewegungen ausführen ---
            if (this.keyMoveWait === 0) {
                while (this.keyMoveNext !== 0) {
                    if (this.keyMoveNext < 0) {
                        this.keyMoveNext++;
                        if (this.moveBox(-1, 0, 0)) {
                            this.downHelper();
                            this.logWriter && this.logWriter.writeMove(this.ticks, -1, 0, 0);
                            this.keyMoveWait = Game.tickMoveRepeat; // Limiter setzen und
                            break;
                        }
                    }
                    else {
                        this.keyMoveNext--;
                        if (this.moveBox(+1, 0, 0)) {
                            this.downHelper();
                            this.logWriter && this.logWriter.writeMove(this.ticks, +1, 0, 0);
                            this.keyMoveWait = Game.tickMoveRepeat; // Limiter setzen und
                            break;
                        }
                    }
                }
            }
            else {
                this.keyMoveWait--;
            }
            // --- nach unten Bewegung ausführen ---
            if (this.keyDown > 0 ? this.ticksLastDown >= Game.tickDownRepeat : this.ticksLastDown >= Game.tickDownTimeout) {
                this.ticksLastDown = 0; // Auto-Timer zurücksetzen
                this.helperDownTick = true; // Down-Helper zurücksetzen
                if (this.moveBox(0, +1, 0)) {
                    this.logWriter && this.logWriter.writeMove(this.ticks, 0, +1, 0);
                }
                else {
                    this.scanlines = this.field.scanLines();
                    if (this.scanlines.length) {
                        this.scanlinesWait = Game.tickLinesRemove;
                        this.logWriter && this.logWriter.writeLines(this.ticks, this.scanlines, false);
                    }
                    else {
                        if (!this.getNextBox()) {
                            // todo: Spieler hat verloren
                            return;
                        }
                        this.keyDown = -Game.tickMoveStart; // bereits gedrückte unten-Taste für eine kurze Zeit blocken, damit der nachfolgenden Stein nicht sofort losrennt
                    }
                }
            }
            else {
                this.ticksLastDown++;
            }
            this.ticks++;
            count--;
        }
        this.field.view();
        if (this.logWriter) {
            document.title = "Log: " + this.logWriter.data.length + " (" + (JSON.stringify(this.logWriter.data).length / 1024 / this.ticks * 1000).toFixed(1) + " kByte/s)";
        }
    };
    // --- Konstanten fürs Timing (müssen die gleichen wie in der .Net Umgebung sein, sonst könnte ein Cheat-Verdacht ausgeworfen werden) ---
    /** Startwert, ab wann eine links/rechts Taste automatisch wiederholt wird */
    Game.tickMoveStart = 180;
    /** Wiederholrate für links/rechts Tasten (und gleichzeitiger Speed-Limiter) */
    Game.tickMoveRepeat = 90;
    /** Wiederholrate für gedrückte Taste nach unten (und gleichzeitiger Speed-Limiter) */
    Game.tickDownRepeat = 60;
    /** Wiederholrate für automatisches nach unten bewegen */
    Game.tickDownTimeout = 600;
    /** Zeit, wie lange es dauert, bis vollständige Zeilen entfernt wurden */
    Game.tickLinesRemove = 450;
    /** Zeit, wie schnell entfernte Zeilen flackern sollen */
    Game.tickLinesFlicker = 17;
    return Game;
})();
window.onload = function () {
    document.body.onkeydown = function (e) {
        keys[e.keyCode] = true;
    };
    document.body.onkeyup = function (e) {
        keys[e.keyCode] = false;
    };
    var div = document.getElementById("game");
    if (div) {
        game = new Game(div, 10, 16, 1000, 600);
        game.start();
        console.log("init: ok");
    }
    else {
        console.log("init: error element not found");
    }
};
//# sourceMappingURL=game.js.map