window.onload = function() {
    window.onresize = function() {
        canvas.width = w();
        canvas.height = h();
    }
  function w() {
    return(window.innerWidth);
  }
  function h() {
    return(window.innerHeight);
  }
  function x() {
    return(Math.random() * w());
  }
  function y() {
    return(Math.random() * h());
  }
  function left() {
    return(-200);
  }
  function right() {
    return(w()+200);
  }
  function bottom() {
    return(h()+200)
  }
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  canvas.width = w();
  canvas.height = h();
  document.body.appendChild(canvas);
  var img = new Image;
  img.onload = function() {
    context.drawImage(img,canvas.width/2-50,canvas.height/2-50,100,100);
  }
  img.src = 'https://chart.googleapis.com/chart?chs=547x547&cht=qr&chl=http://quickresponse.tumblr.com&chld=L|1&choe=UTF-8';

  var posX = Math.random() * canvas.width,
      posY = Math.random() * canvas.height;
  var offset = -200;
  var particles = {},
      particleIndex = 0,
      settings = {
        density: 5,
        squareSize: 100,
        startingX: x(),
        startingY: y(),
        maxLife: 1500,
      };
  var seedsX = [];
  var seedsY = [];
  var maxAngles = 100;
  var currentAngle = 0;

  function seedAngles() {
    seedsX = [];
    seedsY = [];
    for (var i = 0; i < maxAngles; i++) {
      seedsX.push(Math.random() * 50 - Math.random() * 50);
      seedsY.push(Math.random() * 50 - Math.random() * 50);
    }
  }
  seedAngles();
  function Particle() {
    if (currentAngle !== maxAngles) {
      this.x = x();
      this.y = y();

      this.vx = seedsX[currentAngle];
      this.vy = seedsY[currentAngle];

      currentAngle++;

      particleIndex ++;
      particles[particleIndex] = this;
      this.id = particleIndex;
      this.life = 0;
      this.maxLife = settings.maxLife;
    } else {
      seedAngles();
      currentAngle = 0;
    }
  }

  Particle.prototype.draw = function() {
    this.x += this.vx;
    this.y += this.vy;
    if ((this.y + settings.squareSize) > bottom()) {
      this.vy *= -0.6;
      this.vx *= 0.75;
      this.y = bottom() - settings.squareSize;
    }
    if (this.x - (settings.squareSize) <= left()) {
      this.vx *= -1;
      this.x = left() + (settings.squareSize);
    }
    if (this.x + (settings.squareSize) >= right()) {
      this.vx *= -1;
      this.x = right() - settings.squareSize;
    }
    this.life++;

    if (this.life >= this.maxLife) {
      delete particles[this.id];
    }
    // context.clearRect(left, settings.groundLevel, canvas.width, canvas.height);

    // var data = context.getImageData(0,0,w(),h());

    context.drawImage(img,this.x,this.y,100,100);
  }

  setInterval(function() {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < settings.density; i++) {
      new Particle();
    }

    for (var i in particles) {
      particles[i].draw();
    }
  }, 30);
};