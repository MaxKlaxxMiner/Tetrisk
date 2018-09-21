/* tslint:disable:one-line max-line-length interface-name comment-format */
/// <reference path="boxes.ts" />
/// <reference path="field.ts" />
var game;
var keys = {};
var Game = (function () {
    //#region // --- constructor ---
    function Game(parentDiv, fieldWidth, fieldHeight, maxWidth, maxHeight) {
        /** gibt an, ob und wie lange die Taste zum links-bewegen gedrükt wurde */
        this.keyLeft = 0;
        /** gibt an, ob und wie lange die Taste zum rechts-bewegen gedrückt wurde */
        this.keyRight = 0;
        /** gibt an, ob und wie lange die Taste zum nachunten-bewegen gedrückt wurde */
        this.keyDown = 0;
        /** gibt an, ob eine Taste zum drehen gedrückt wurde */
        this.keyRotate = false;
        /** merkt sich die Anzahl der Ticks, welche bereits verarbeitet wurden */
        this.ticks = 0;
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
    Game.prototype.moveBox = function (mx, my, rot) {
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
        if (canMove) {
            this.currentX = mx;
            this.currentY = my;
            this.currentBox = box;
        }
        this.field.setBox(this.currentX, this.currentY, this.currentBox);
        return canMove;
    };
    /** führt eine oder mehrere Tick-Berechnungen durch
     * @param count Anzahl der Tick-Berechnungen, welche durchgeführt werden sollen (1000 Ticks = 1 Sekunde)
     */
    Game.prototype.tick = function (count) {
        if (count <= 0) {
            return;
        }
        // --- gedrückte Tasten abfragen ---
        this.keyLeft = Game.isPressed(this.keys.left) ? (this.keyLeft === 0 ? 1 : this.keyLeft) : 0;
        this.keyRight = Game.isPressed(this.keys.right) ? (this.keyRight === 0 ? 1 : this.keyRight) : 0;
        this.keyDown = Game.isPressed(this.keys.down) ? (this.keyDown === 0 ? 1 : this.keyDown) : 0;
        var rCw = Game.isPressed(this.keys.clockwise);
        var rCc = Game.isPressed(this.keys.counterclockwise);
        if (rCw !== rCc) {
            if (!this.keyRotate) {
                this.keyRotate = true;
                this.moveBox(0, 0, rCw ? +1 : -1);
            }
        }
        else {
            this.keyRotate = false;
        }
        while (count > 0) {
            if (this.keyLeft > 0) {
                if (this.keyLeft % Game.tickMove === 1) {
                    this.moveBox(-1, 0, 0);
                }
                this.keyLeft++;
            }
            if (this.keyRight > 0) {
                if (this.keyRight % Game.tickMove === 1) {
                    this.moveBox(+1, 0, 0);
                }
                this.keyRight++;
            }
            if (this.keyDown > 0) {
                if (this.keyDown % Game.tickRapid === 1) {
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
                                for (var x = 0; x < w; x++) {
                                    c[x].data = 0 /* Empty */;
                                }
                            }
                        }
                        if (!this.getNextBox()) {
                            return;
                        }
                    }
                }
                this.keyDown++;
            }
            else {
            }
            this.ticks++;
            count--;
        }
        this.field.view();
    };
    /** Tickrate für gedrückte Taste für links/rechts */
    Game.tickMove = 90;
    /** Tickrate für gedrückte Taste nach unten */
    Game.tickRapid = 45;
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