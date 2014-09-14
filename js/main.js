function init() {
  // raph();
  setTimeout(function(){
    $('.title > *').each(function(i) {
      i+=1;
      $(this).transition({'opacity':1,'delay':i*100}, 1500*i);
     });
  },200);

  $('#begin').click(function(e) {
    // $('#front').transition({'opacity':'0'},1000);
    $('.title').addClass('top');
    setTimeout(function() {
      $('.title h1').addClass('top');
    },450);
    scatter(e.clientX,e.clientY);
    
  });
}

function raph() {
  var paper = Raphael(0,0,70,70);
  var t = paper.rect(0,0,70,10);
  t.attr('fill','white');
}

function scatter(startX,startY) {
  $('body').attr('class','scatter');
  window.onresize = function() {
    canvas.width = w();
    canvas.height = h();
    center();
  }
  
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  canvas.width = w();
  canvas.height = h();
  document.body.appendChild(canvas);
  $('canvas').transition({'opacity':1},1000);
  var img = new Image;
  img.onload = function() {
    context.drawImage(img,canvas.width/2-50,canvas.height/2-50,100,100);
  }
  var pass = Math.round(Math.random() * 9999999);
  img.crossOrigin = 'http://profile.ak.fbcdn.net/crossdomain.xml';
  img.src = 'https://chart.googleapis.com/chart?chs=547x547&cht=qr&chl='+pass+'&chld=L|1&choe=UTF-8';

  var offset = -200;
  var particles = {},
      particleIndex = 0,
      settings = {
        density: 8,
        squareSize: 100,
        startingX: startX,
        startingY: h(),
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
      seedsX.push(Math.random() * 50 - Math.random() * 80);
      seedsY.push(Math.random() * 50 - Math.random() * 80);
    }
  }
  seedAngles();
  function Particle() {
    if (currentAngle !== maxAngles) {
      this.x = x();
      this.y = h();

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
    // var data = context.getImageData(0,0,w(),h());
    // for(var i=0; i<data.data.length; i+=4) {
    //   if(data.data[i]==255 && data.data[i+1]==255 && data.data[i+2]==255) {
    //     data.data[i] = 50;
    //   }
    // }

  }, 30);
}
window.onload=function() {
  center();
  init();
}
window.onresize=function() {
  center();
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
function center() {
  if($('.center').hasClass('top')) {
    var top = 0;
  } else {
    var top = h()/2 - $('.center').height()/2; 
  }
  var left = w()/2 - $('.center').width()/2;
  $('.center').css({'top':top,'left':left});
}




