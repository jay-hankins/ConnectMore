function start() {
  resize();
};

function resize() {
  scaleCanvas();
  drawGrid();
  scaleCanvas();
  drawGrid();
  scaleCanvas();
  drawGrid();
}

var canvas = document.getElementById('gameCanvas');
var width = canvas.width;
var height = canvas.height;
var lineColor = '#835f17';

function drawGrid() {
  var ctx = canvas.getContext('2d');
  ctx.lineWidth = 2;
  ctx.strokeStyle = lineColor;
  for (var x = 0; x <= width; x += 100) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (var y = 0; y <= height; y += 100) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
}

function backingScale() {
  if ('devicePixelRatio' in window) {
    if (window.devicePixelRatio > 1) {
      return window.devicePixelRatio;
    }
  }
  return 1;
};

function scaleCanvas() {
  var scaleFactor = backingScale();
  realWidth = canvas.width;
  realHeight = canvas.height;
  if (scaleFactor > 1) {
    var oldWidth = this.canvas.width;
    var oldHeight = this.canvas.height;
    this.canvas.width = this.canvas.width * scaleFactor;
    this.canvas.height = this.canvas.height * scaleFactor;
    var ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
    this.canvas.style.width = realWidth + 'px';
    this.canvas.style.height = realHeight + 'px';
  }
}