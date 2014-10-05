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
        $('#front').transition({
            'background': 'white'
        }, 500);
        setTimeout(function() {
            $('body').attr('class', 'game scatter');
            canvas = document.createElement("canvas");
            context = canvas.getContext("2d");
            canvas.width = w();
            canvas.height = h();
            document.body.appendChild(canvas);
            $('canvas').transition({
                'opacity': 1
            }, 1000);
            window.onresize = function() {
                canvas.width = w();
                canvas.height = h();
                center();
            }
            scatter(level);
        }, 100);
    });
}

function raph() {
    var paper = Raphael(0, 0, 70, 70);
    var t = paper.rect(0, 0, 70, 10);
    t.attr('fill', 'white');
}

function scatter(level) {
    console.log(level);
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

window.onresize = function() {
    center();
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
    return (h() + 200)
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
    var cover = $('footer .cover');
    cover.hover(function() {
        cover.fadeOut(200);
    });
    input.hover(function() {
            clicked();
        },
        function() {
            input.blur();
            if (input.val() == '') {
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

    var numbers = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
    var emojis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    $('body').keypress(function(event) {
        $('#password').focus();
        var key = event.charCode;
        if (key == 13 && $('#password').val()) {
            $('#password').val('');
            level += 1;
            scatter(level);
        }
    });
}