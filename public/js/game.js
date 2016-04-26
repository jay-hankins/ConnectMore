var width = 600;
var height = 700;
var lineColor = '#835f17';
var p1 = '#831717';
var p2 = '#0e4f4f';

/*jslint browser:true, plusplus:true, vars: true */
"use strict";

var width = 600;
var height = 700;

// http://stackoverflow.com/questions/13756482/create-copy-of-multi-dimensional-array-not-reference-javascript
Array.prototype.clone = function () {
    var arr = [], i;
    for (i = 0; i < this.length; i++) {
        arr[i] = this[i].slice();
    }
    return arr;
};
function Game() {
    var that = this;
    this.map = [];
    this.paused = false;
    this.won = false;
    this.rejectClick = false;
    this.move = 0;
    // this.aiHistory = [];

    this.initOnceDone = false;
    /**
     * Only initalize once for these functions, can prevent race condition
     */
    this.initOnce = function () {
        if (this.initOnceDone) {
            return false;
        }

        this.canvas = document.getElementById('gameCanvas');
        this.canvas.addEventListener('click', function (e) {
            that.onclick(that.canvas, e);
        });
        this.context = this.canvas.getContext('2d');
        this.initOnceDone = true;
    };

    this.init = function () {
        this.map = [];
        this.paused = false;
        this.won = false;
        this.rejectClick = false;
        this.move = 0;
        // this.aiHistory = [];
        this.initOnce();

        var i, j;
        for (i = 0; i <= 6; i++) {
            this.map[i] = [];
            for (j = 0; j <= 7; j++) {
                this.map[i][j] = 0;
            }
        }
        this.clear();
        this.drawMask();
        this.print();
    };

    this.playerMove = function () {
        if (this.move % 2 === 0) {
            return 1;
        }
        return -1;
    };

    this.print = function () {
        var i, j, msg;
        msg = "\n";
        msg += "Move: " + this.move;
        msg += "\n";
        for (i = 0; i < 6; i++) {
            for (j = 0; j < 7; j++) {
                msg += " " + this.map[i][j];
            }
            msg += "\n";
        }
        console.log(msg);
    };

    this.printState = function (state) {
        var i, j, msg = "\n";
        for (i = 0; i < 6; i++) {
            for (j = 0; j < 7; j++) {
                msg += " " + state[i][j];
            }
            msg += "\n";
        }
        console.log(msg);
    };

    this.win = function (player) {
        this.paused = true;
        this.won = true;
        this.rejectClick = false;
        var msg = null;
        var moves = Math.floor(this.move / 2);
        if (player > 0) {
            moves++;
            msg = "Player 1 wins in " + moves + " moves";
        } else if (player < 0) {
            msg = "Player 2 wins in " + moves + " moves";
        } else {
            msg = "It's a draw";
        }
        msg += " - Click to reset";
        this.context.save();
        this.context.font = '10pt Arial';
        this.context.fillStyle = "#111";
        this.context.fillText(msg, 275, 15);
        this.context.restore();
        var nameform = document.createElement('form');
        nameform.setAttribute('method', 'post');
        nameform.setAttribute('action', 'postScore');
        var namebox = document.createElement('input');
        namebox.setAttribute('type', 'text');
        namebox.setAttribute('name', 'username');
        namebox.setAttribute('value', 'Winner\'s name?')
        var submitbutton = document.createElement('input');
        submitbutton.setAttribute('type', 'submit');
        submitbutton.setAttribute('value', 'Submit');
        nameform.appendChild(namebox);
        nameform.appendChild(submitbutton);
        var content = document.getElementById('main-content');
        content.appendChild(nameform);

        console.info(msg);
    };
    this.fillMap = function (state, column, value) {
        var tempMap = state.clone();
        if (tempMap[0][column] !== 0 || column < 0 || column > 6) {
            return -1;
        }

        var done = false,
            row = 0,
            i;
        for (i = 0; i < 5; i++) {
            if (tempMap[i + 1][column] !== 0) {
                done = true;
                row = i;
                break;
            }
        }
        if (!done) {
            row = 5;
        }
        tempMap[row][column] = value;
        return tempMap;

    };

    this.action = function (column, callback) {
        if (this.paused || this.won) {
            return 0;
        }
        if (this.map[0][column] !== 0 || column < 0 || column > 6) {
            return -1;
        }

        var done = false;
        var row = 0, i;
        for (i = 0; i < 5; i++) {
            if (this.map[i + 1][column] !== 0) {
                done = true;
                row = i;
                break;
            }
        }
        if (!done) {
            row = 5;
        }
        this.animate(column, this.playerMove(this.move), row, 0, function () {
            that.map[row][column] = that.playerMove(that.move);
            that.move++;
            that.draw();
            that.check();
            that.print();
            callback();
        });
        this.paused = true;
        return 1;
    };

    this.check = function () {
        var i, j, k;
        var temp_r = 0, temp_b = 0, temp_br = 0, temp_tr = 0;
        for (i = 0; i < 6; i++) {
            for (j = 0; j < 7; j++) {
                temp_r = 0;
                temp_b = 0;
                temp_br = 0;
                temp_tr = 0;
                for (k = 0; k <= 3; k++) {
                    //from (i,j) to right
                    if (j + k < 7) {
                        temp_r += this.map[i][j + k];
                    }
                    //from (i,j) to bottom
                    if (i + k < 6) {
                        temp_b += this.map[i + k][j];
                    }

                    //from (i,j) to bottom-right
                    if (i + k < 6 && j + k < 7) {
                        temp_br += this.map[i + k][j + k];
                    }

                    //from (i,j) to top-right
                    if (i - k >= 0 && j + k < 7) {
                        temp_tr += this.map[i - k][j + k];
                    }
                }
                if (Math.abs(temp_r) === 4) {
                    this.win(temp_r);
                } else if (Math.abs(temp_b) === 4) {
                    this.win(temp_b);
                } else if (Math.abs(temp_br) === 4) {
                    this.win(temp_br);
                } else if (Math.abs(temp_tr) === 4) {
                    this.win(temp_tr);
                }

            }
        }
        // check if draw
        if ((this.move === 42) && (!this.won)) {
            this.win(0);
        }
    };

    this.drawCircle = function (x, y, fill) {
        this.context.save();
        // this.context.fillStyle = fill;
        // this.context.strokeStyle = stroke;
        // this.context.beginPath();
        // this.context.arc(x, y, r, 0, 2 * Math.PI, false);
        // //this.context.stroke();
        // this.context.fill();

        this.context.beginPath();
        this.context.rect(x, y, 70, 70);
        this.context.fillStyle = fill;
        this.context.fill();

        this.context.closePath();

        this.context.restore();
    };
    this.drawMask = function () {
        // draw the mask WHICH IS A GRID NOW
        // http://stackoverflow.com/questions/6271419/how-to-fill-the-opposite-shape-on-canvas
        // -->  http://stackoverflow.com/a/11770000/917957

        this.context.save();
        // this.context.fillStyle = "#ffe2a9";
        this.context.lineWidth = 30;
        this.context.strokeStyle = "#D9B56E";
        this.context.beginPath();
        for (var x = 0; x <= height; x += 100) {
            this.context.moveTo(x+5, 0);
            this.context.lineTo(x+5, width);
        }
  
        for (var y = 0; y <= width; y += 100) {
            this.context.moveTo(0, y+5);
            this.context.lineTo(height+10, y+5);
        }
        this.context.stroke();
        this.context.closePath();
        this.context.fill();
        this.context.restore();
    };

    this.draw = function () {
        var x, y;
        var fg_color;
        for (y = 0; y < 6; y++) {
            for (x = 0; x < 7; x++) {
                fg_color = "transparent";
                if (this.map[y][x] >= 1) {
                    fg_color = "#AF3C3C";
                } else if (this.map[y][x] <= -1) {
                    fg_color = "#9975AB";
                }
                this.drawCircle(100 * x + 20, 100 * y + 20, fg_color);
            }
        }
    };
    this.clear = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    this.animate = function (column, move, to_row, cur_pos, callback) {
        var fg_color = "transparent";
        if (move >= 1) {
            fg_color = "#AF3C3C";
        } else if (move <= -1) {
            fg_color = "#9975AB";
        }
        if (to_row * 100 >= cur_pos) {
            this.clear();
            this.draw();
            this.drawCircle(100 * column + 20, cur_pos + 0, fg_color);
            this.drawMask();
            window.requestAnimationFrame(function () {
                that.animate(column, move, to_row, cur_pos + 25, callback);
            });
        } else {
            callback();
        }
    };

    this.onregion = function (x) {
        if (x < 100) { return 0;} 
        else if (x < 200) {return 1;}
        else if (x < 300) {return 2;}
        else if (x < 400) {return 3;}
        else if (x < 500) {return 4;}
        else if (x < 600) {return 5;}
        else if (x < 700) {return 6;}
        return false;
    };
    this.oncircle = function (coord, centerCoord, radius) {
        if ((coord[0] - centerCoord[0]) * (coord[0] - centerCoord[0]) <=  radius * radius
                && (coord[1] - centerCoord[1]) * (coord[1] - centerCoord[1]) <=  radius * radius) {
            return true;
        }
        return false;
    };

    this.onclick = function (canvas, e) {
        if (this.rejectClick) {
            return false;
        }
        if (this.won) {
            this.init();
            return false;
        }
        var rect = canvas.getBoundingClientRect(),
            x = e.clientX - rect.left,// - e.target.scrollTop,
            y = e.clientY - rect.top;// - e.target.scrollLeft;

        //console.log("(" + x + ", " + y + ")");
        var j, valid, check;
        check = this.onregion(x);

        for (j = 0; j < 7; j++) {
            if (j === check) {
                console.log("clicked region " + j);
                this.paused = false;
                valid = this.action(j, function () {
                    that.ai(-1);
                });
                if (valid === 1) { // give user retry if action is invalid
                    // this.rejectClick = true;
                }
                break; //because there will be no 2 points that are clicked at a time
            }
        }
    };

    this.init();
}
document.addEventListener('DOMContentLoaded', function () {
    this.game = new Game();
    //this.game.ai(1);
});