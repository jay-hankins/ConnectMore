function startGame() {
  gameBoard.start();
}

var gameBoard = {
  canvas: document.getElementById('gameCanvas'),
  start: function() {
    this.context = this.canvas.getContext('2d');
    var ctx = this.context;
    this.scaleCanvas();
    ctx.strokeStyle = '#835f17';
    ctx.fillStyle = '#835f17';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5;
    for (var x = 0; x < this.canvas.height; x += 100) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
    }
    for (var y = 0; y < this.canvas.width; y += 100) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
    }
    ctx.stroke();
  },

  backingScale: function() {
    if ('devicePixelRatio' in window) {
      if (window.devicePixelRatio > 1) {
        return window.devicePixelRatio;
      }
    }
    return 1;
  },

  scaleCanvas: function(){
    var scaleFactor = this.backingScale();
    realWidth = this.canvas.width;
    realHeight = this.canvas.height;
    if (scaleFactor > 1) {
      var oldWidth = this.canvas.width;
      var oldHeight = this.canvas.height;
      this.canvas.width = this.canvas.width * scaleFactor;
      this.canvas.height = this.canvas.height * scaleFactor;
      // update the context for the new canvas scale
      var ctx = this.canvas.getContext('2d');
      ctx.scale(scaleFactor, scaleFactor);
      this.canvas.style.width = realWidth + "px";
      this.canvas.style.height = realHeight + "px";
    }
  },
}