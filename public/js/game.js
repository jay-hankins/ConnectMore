var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var width = 600;
var height = 600;
var lineColor = '#835f17';
var p1 = '#831717';
var p2 = '#0e4f4f';

function start() {
  redraw();
  drawTileInLocation(10,10);
};

function redraw() {
  canvas.width = width;
  canvas.height = height;
  scaleCanvas();
  drawGrid();
}

function drawGrid() {
  var ctx = canvas.getContext('2d');
  ctx.lineWidth = 2;
  ctx.strokeStyle = lineColor;
  ctx.beginPath();
  for (var x = 0; x <= width; x += 100) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (var y = 0; y <= height; y += 100) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
  ctx.closePath();
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

function drawTileInLocation(x, y) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.rect(x, y, 80, 80);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}

function moveTileToLocation(x,y) {

}