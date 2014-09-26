function init() {
  var level;
  setTimeout(function(){
    $('.title span > *').each(function(i) {
      i+=1;
      $(this).transition({'opacity':1,'delay':i*100}, 1500*i);
     });
  },200);

  $('#begin').click(function(e) {
    $('#front').transition({'background':'white'},500);
    setTimeout(function() {
      scatter();
    },100);
  });
}

function raph() {
  var paper = Raphael(0,0,70,70);
  var t = paper.rect(0,0,70,10);
  t.attr('fill','white');
}

function scatter() {
  level = 1;
  $('body').attr('class','game scatter');
  window.onresize = function() {
    canvas.width = w();
    canvas.height = h();
    center();
  }
  
  canvas = document.createElement("canvas");
  context = canvas.getContext("2d");
  canvas.width = w();
  canvas.height = h();
  document.body.appendChild(canvas);
  $('canvas').transition({'opacity':1},1000);

  var pass = Math.round(Math.random() * 9999999);
  setPass(pass);

  var good = generate(pass,true);
  var bad = generate(pass,false);
  var startX = Math.round(Math.random() * w());
  var startY = h();
  var offset = -200;
  var particles = {},
      particleIndex = 0,
      settings = {
        density: .5,
        squareSize: 100,
        startingX: startX,
        startingY: startY,
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
    } else {
      seedAngles();
      currentAngle = 0;
    }
  }

  Particle.prototype.draw = function(i) {
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

    if (this.y <= -100) {
      delete particles[this.id];
    }
    context.clearRect(left, settings.groundLevel, canvas.width, canvas.height);
    if(this.id == 200) {
      console.log(this);
      context.drawImage(good,this.x,this.y,100,100);
    }
    else {
      context.drawImage(bad,this.x,this.y,100,100);
    }
    
  }

  setInterval(function() {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < settings.density; i++) {
      new Particle();
    }
    for (var i in particles) {
      particles[i].draw(i);
    }
    

  }, 30);
}
function generate(pass,bool) {
  var img = new Image;
  img.onload = function() {
    context.drawImage(img,canvas.width/2-50,canvas.height/2-50,100,100);
    localStorage.setItem( "savedImageData", canvas.toDataURL("image/jpg"));
  }
  // img.crossOrigin = 'Anonymous'
  img.crossOrigin = 'crossdomain.xml';

  if(bool==true) {
    var text = 'Type "' + pass + '" in the text field to move to the next level.';
    var color = 'ff0000';
  }
  else {
    var text = 'Sorry, this is not the right QR code, keep trying.';
    var color = '000000';
  }
  img.src = 'https://chart.googleapis.com/chart?chs=547x547&cht=qr&chl='+text+'&chld=L|1&choe=UTF-8';
  // img.src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example';

  return img;
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
  return(-110);
}
function right() {
  return(w()+10);
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
  // var left = w()/2 - $('.center').width()/2;
  $('.center').css({'top':top});
}

function setPass(pass) {
  var input =  $('#password');
  var cover = $('footer .cover');
  cover.hover(function() {
    cover.fadeOut(200);
  });
  input.hover(function() {
    clicked();
  },
  function() {
    input.blur();
    if(input.val() == '') {
      cover.fadeIn(350);
      input.removeClass('clicked');
    }
  });
  input.click(function() {
    clicked();
  });
  function clicked() {
    input.addClass('clicked');
    input.focus();
  }

  $('body').keypress(function(event) {
    if(event.charCode == 13 && input.val() == pass) {
      next();
    }
  });
}





