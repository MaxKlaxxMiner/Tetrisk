/* tslint:disable:one-line max-line-length interface-name comment-format */
/// <reference path="boxes.ts" />
/// <reference path="field.ts" />
var game;
var keys = {};
var Game = (function () {
    //#endregion
    //#region // --- Konstruktor ---
    function Game(parentDiv, fieldWidth, fieldHeight, maxWidth, maxHeight) {
        /** gibt an, ob und wie lange die Taste zum links-bewegen gedrückt wurde */
        this.keyLeft = 0;
        /** gibt an, ob und wie lange die Taste zum rechts-bewegen gedrückt wurde */
        this.keyRight = 0;
        /** gibt an, wie lange noch gewartet werden muss, bis die nächste links/rechts Taste gedrückt werden darf */
        this.keyMoveWait = 0;
        /** gibt an, in welcher Richtung das nächste mal der Stein bewegt werden soll (falls die Richtungstasten zu schnell hintereinander gedrückt wurden) */
        this.keyMoveNext = 0;
        /** gibt an, ob und wie lange die Taste zum nachunten-bewegen gedrückt wurde */
        this.keyDown = 0;
        /** gibt an, ob eine Taste zum drehen gedrückt wurde */
        this.keyRotate = false;
        /** gibt an, wie lange noch gewartet werden muss, bis das nächste mal der Stein gedreht werden darf */
        this.keyRotateWait = 0;
        /** gibt an, in welcher Richtung das nächste mal der Stein gedreht werden soll (falls die Drehtasten zu schnell hintereinander gedrückt wurden) */
        this.keyRotateNext = 0;
        /** merkt sich die Anzahl der Ticks, welche bereits verarbeitet wurden */
        this.ticks = 0;
        /** merkt sich, wann der Stein das letzte mal nach unten bewegt wurde */
        this.ticksLastDown = 0;
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
        this.currentBox = boxes[5];
        this.currentX = Math.floor(this.field.width / 2 - .5);
        this.currentY = 0;
        this.nextBox = boxes[Math.floor(Math.random() * boxes.length)];
        this.field.setBox(this.currentX, this.currentY, this.currentBox);
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
    /** wechselt zum nächsten Stein und prüft, ob das Spiel weitergeführt werden kann */
    Game.prototype.getNextBox = function () {
        this.currentBox = this.nextBox;
        this.currentX = Math.floor(this.field.width / 2 - .5);
        this.currentY = 0;
        var alive = this.field.checkBox(this.currentX, this.currentY, this.currentBox);
        this.nextBox = boxes[Math.floor(Math.random() * boxes.length)];
        this.field.setBox(this.currentX, this.currentY, this.currentBox);
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
    //#endregion
    //#region // --- Tick ---
    /** führt eine oder mehrere Tick-Berechnungen durch
     * @param count Anzahl der Tick-Berechnungen, welche durchgeführt werden sollen (1000 Ticks = 1 Sekunde)
     */
    Game.prototype.tick = function (count) {
        if (count <= 0) {
            return;
        }
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
        while (count > 0) {
            // --- gedrückte Tasten berechnen ---
            this.keyLeft = pressLeft ? this.keyLeft + 1 : 0;
            this.keyRight = pressRight ? this.keyRight + 1 : 0;
            this.keyDown = pressDown ? this.keyDown + 1 : 0;
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
                            this.keyRotateWait = Game.tickMoveRepeat; // Limiter setzen
                        }
                    }
                    else {
                        this.keyRotateNext--;
                        if (this.moveBox(0, 0, +1)) {
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
                            this.keyMoveWait = Game.tickMoveRepeat; // Limiter setzen und
                            break;
                        }
                    }
                    else {
                        this.keyMoveNext--;
                        if (this.moveBox(+1, 0, 0)) {
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
                this.ticksLastDown = 0;
                if (!this.moveBox(0, +1, 0)) {
                    var scan = this.field.scanLines();
                    if (scan.length) {
                        var w = this.field.width;
                        var c = this.field.cells;
                        for (var i = 0; i < scan.length; i++) {
                            for (var y = scan[i] * w; y > 0; y -= w) {
                                for (var x = 0; x < w; x++) {
                                    c[x + y].data = c[x + y - w].data;
                                }
                            }
                            for (var l = 0; l < w; l++) {
                                c[l].data = 0 /* Empty */;
                            }
                        }
                    }
                    if (!this.getNextBox()) {
                        // todo: Spieler hat verloren
                        return;
                    }
                    this.keyDown = Game.tickMoveStart * -2; // bereits gedrückte unten-Taste für eine kurze Zeit blocken, damit der nachfolgenden Stein nicht sofort losrennt
                }
            }
            else {
                this.ticksLastDown++;
            }
            this.ticks++;
            count--;
        }
        this.field.view();
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