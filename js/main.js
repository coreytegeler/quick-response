window.onload = function() {
    center();
    init();
}

function init() {
    level = 1;
    $('#front .box').transition({
        'opacity': 1
    });
    $('#begin').click(function(e) {
        buildBox();
        stretchCanvas();
        scatter(level);
        setTimeout(function() {
          $('canvas').fadeIn(100); 
        },400);
    });
}
function buildBox() {
  $('.box:not(:first-child)').each(function() {
    var y = $(this).prev().outerHeight() + $(this).prev().offset().top;
    $(this).css({'top':y});
  })

  $('.box').draggable({
    start: function(event, ui) {

    },
    drag: function(event, ui) {

    },
    stop: function(event, ui) {
      checkSides(ui);
    }
  });

  $('.box').click(function() {
    var w = $(this).width();
    var h = $(this).height();
    var scale = 2/10;
    var top = h/2;
    var left = w/2;

    if($(this).hasClass('hide')) {
      $(this).draggable( "option", "cursorAt", { 
        left: left,
        top: top
      });
    }

     $(this).toggleClass('hide');
  });



}
function checkSides(ui) {
  if(ui instanceof jQuery) {
    var box = ui;
  } else {
    var box = $(ui.helper[0]);
  }
  var left = box.position().left;
  var top = box.position().top;
  var right = box.position().left + box.outerWidth() + 20;
  var bottom = box.position().top + box.outerHeight() + 20;
  if(left <=0) {
    box.transition({'left':0},200);
  }
  if(right>=w()){
    box.transition({'left': (
      w()-box.outerWidth()-20
    )},400, 'easeInOutExpo');
  }
  if(top<=0){
    box.transition({'top':0},200, 'easeInOutExpo');
  }
  if(bottom>=h()){
    box.transition({'top':(
      h() - box.outerHeight() - 20
    )},200, 'easeInOutExpo');
  }
}
function stretchCanvas() {
  $('body').attr('class', 'game scatter');
  canvas = document.createElement("canvas");
  context = canvas.getContext("2d");
  canvas.width = w();
  canvas.height = h();
  document.body.appendChild(canvas);

  var timer;
  window.onresize = function() {
      timer && clearTimeout(timer);
      timer = setTimeout(onResize, 100);
  }
}

function onResize() {
  canvas.width = w();
    canvas.height = h();
    $('.box').each(function(){
      checkSides($(this));
    });
    center();
}

function raph() {
    var paper = Raphael(0, 0, 70, 70);
    var t = paper.rect(0, 0, 70, 10);
    t.attr('fill', 'white');
}

function scatter(level) {
    var pass = Math.round(Math.random() * 99999);
    setPass(pass);
    var good = generate(pass, true);
    var bad = generate(pass, false);
    var startX = Math.round(Math.random() * w());
    var startY = h();
    var particles = {},
        particleIndex = 0,
        settings = {
            density: 1,
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
            seedsX.push(Math.random() * 40 - Math.random() * 50);
            seedsY.push(Math.random() * 40 - Math.random() * 50);
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
            particleIndex++;
            particles[particleIndex] = this;
            this.id = particleIndex;
            var rand = Math.round(Math.random() * 15+level);
            if (rand == 1) {
                this.is = good;
                this.size = 150;
            } else {
                this.is = bad;
                this.size = 100;
            }
        } else {
            seedAngles();
            currentAngle = 0;
        }
    }
    Particle.prototype.draw = function(i) {
        this.x += this.vx;
        this.y += this.vy;
        if ((this.y + this.size) > bottom()) {
            this.vy *= -0.6;
            this.vx *= 0.75;
            this.y = bottom() - this.size;
        }
        if (this.x - (this.size) <= left()) {
            this.vx *= -1;
            this.x = left() + (this.size);
        }
        if (this.x + (this.size) >= right()) {
            this.vx *= -1;
            this.x = right() - this.size;
        }
        this.life++;

        if (this.y <= -100) {
            delete particles[this.id];
        }

        var date = new Date();
        var sec = date.getSeconds();



        context.drawImage(this.is, this.x, this.y, this.size, this.size);

    }

    setInterval(function() {
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        for (var i in particles) {
            particles[i].draw(i);
        }
    }, 30);

    setInterval(function() {
        // for (var i = 0; i < settings.density; i++) {
        new Particle();
        // }
    }, (400 - (level * 10)));
}

function generate(pass, bool) {
    var img = new Image;
    img.onload = function() {
      context.drawImage(img, canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);
      localStorage.setItem("savedImageData", canvas.toDataURL("image/jpg"));
    }

    img.crossOrigin = 'crossdomain.xml';

    if (bool == true) {
      var text = 'Type "' + pass + '" in the text field to move to the next level.';
      var color = 'ff0000';
    } else {
      var text = 'Sorry, this is not the right QR code, keep trying.';
      var color = '000000';
    }
    img.src = 'https://chart.googleapis.com/chart?chs=547x547&cht=qr&chl=' + text + '&chld=L|1&choe=UTF-8';
    // img.src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example';

    return img;
}
function w() {
  return (window.innerWidth);
}

function h() {
  return (window.innerHeight);
}

function x() {
  return (Math.random() * w());
}

function y() {
  return (Math.random() * h());
}

function left() {
  return (-110);
}

function right() {
  return (w() + 10);
}

function bottom() {
  return (h() + 200);
}

function center() {
  if ($('.center').hasClass('top')) {
      var top = 0;
  } else {
      var top = h() / 2 - $('.center').height() / 2;
  }
  // var left = w()/2 - $('.center').width()/2;
  $('.center').css({
      'top': top
  });
}

function setPass(pass) {
  var input = $('#password');
  input.hover(function() {
    if (input.val() == '#####') {
      input.val('');
    }
    input.focus();
  },
  function() {
    if (input.val() == '') {
        input.val('#####');
        input.blur();
    }
  });
  input.click(function() {
    if (input.val() == '') {
      input.val('');
    }
  });
  input.blur(function() {
    if(input.val('')) {
      input.val('#####');
    }
  });


  var numbers = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
  var emojis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  $('body').keypress(function(event) {
    $('#password').focus();
    var key = event.charCode;
    var isNumber = numbers.indexOf(key);
    if(isNumber < 0 ) {
      if (key == 13) {
        console.log('!!');
        if($('#password').val() == pass) {
          $('.input').addClass('right');
          setTimeout(function() {
            $('.input').removeClass('right');
          },100);
          level += 1;
          scatter(level);
          $('#password').val(''); 
        } 
        else {
          $('.input').addClass('wrong');
          setTimeout(function() {
            $('.input').removeClass('wrong');
          },100);
        }
      }
      event.preventDefault();
      return false;
    }
  });
}