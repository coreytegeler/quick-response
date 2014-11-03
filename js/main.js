window.onload = function() {
    init();
}
end = false;
function init() {
    var apple = /ipad|iphone|ipod/i.test(navigator.userAgent.toLowerCase());
    var android = /android/i.test(navigator.userAgent.toLowerCase());
    var blackberry = /blackberry/i.test(navigator.userAgent.toLowerCase());
    var windows = /windows phone/i.test(navigator.userAgent.toLowerCase());
    if (apple) {
        $('body').addClass('mobile apple');
        $('.download').attr('href', 'https://itunes.apple.com/us/app/qr-code-reader-by-scan/id698925807');
        $('.device').text('Apple');
    } else if (android) {
        $('body').addClass('mobile android');
        $('.download').attr('href', 'https://play.google.com/store/apps/details?id=me.scan.android.client');
        $('.device').text('Android');
    } else if (windows) {
        $('body').addClass('mobile windows');
        $('.download').attr('href', 'http://www.windowsphone.com/en-US/apps/c62d7a1c-c336-4394-84d0-2ea4913fc891');
        $('.device').text('Windows');
    } else {
        level = 1;
        $('#front .logo').css({opacity:1,y:h(),rotate3d:randRotate()});
        setTimeout(function() {
            $('#front .logo').addClass('center');
        },1);
        $('#begin').click(function(e) {
            $('#front .title').transition({y:-h(),rotate3d:randRotate()},1000, 'cubic-bezier(.41,.73,.2,1)');
            $('#front').transition({y:-h()*2,delay:400},400, 'in');
            setTimeout(function() {
                buildBox();
                stretchCanvas('game');
                showLevel();
                $('.box').each(function(i) {
                    setTimeout(function() {
                        $('.box:eq('+i+')').transition({x:0,rotate3d:'0,0,0,0deg'},500, 'cubic-bezier(.41,.73,.2,1)');
                    },100*i);
                });
            },800);
        });
    }

    $('.levelTxt').css({y:h()});
}

function randRotate() {
    var randX=Math.random()*(360)-180+', ';
    var randY=Math.random()*(360)-180+', ';
    var randZ=Math.random()*(360)-180+', ';
    var randA=Math.random()*(360)-180+'deg';
    var rotate = randX+randY+randZ+randA;
    return rotate;
}

function fragment() {
    for(var i=0; i < 30; i++) {
        var index = i + 1;
        if (index<10) {
            index = '0'+index;
        }
        var shape = new Image;
        var path = 'img/fragments/fragments-'+index+'.svg';
        shape.src = path;
        shape.width = 100;
        shape.height = 100;
        var x = Math.random() * (w() - 0) + 1;
        var y = Math.random() * (h() - 0) + 1;
        context.rect(0,0,w(),h());
        context.fillStyle="black";
        context.fill();
        // context.rotate('50deg');
        // context.drawImage(shape, w(), h(), shape.width, shape.height);
    }
}

function buildBox() {
    $('.box:not(:first-child)').each(function() {
        var y = $(this).prev().outerHeight() + $(this).prev().offset().top;
        $(this).css({
            'top': y
        });
    });
    $('.box').each(function() {
        var rotate = randRotate();
        $(this).css({x:-500, rotate3d:rotate});
    });
    $('.box').draggable({
        start: function(event, ui) {
            $(this).addClass('dragging');
        },
        drag: function(event, ui) {

        },
        stop: function(event, ui) {
            $(this).removeClass('dragging');
            checkSides(ui);
        },
        cancel: '.visible .close'
    });

    $('.close').mouseup(function() {
        var parent = $(this).parent();
        if (!parent.hasClass('dragging')) {
            parent.toggleClass('hide');
            parent.toggleClass('visible');
        }
    });

}

function checkSides(ui) {
    if (ui instanceof jQuery) {
        var box = ui;
    } else {
        var box = $(ui.helper[0]);
    }
    var left = box.position().left;
    var top = box.position().top;
    var right = box.position().left + box.outerWidth() + 20;
    var bottom = box.position().top + box.outerHeight() + 20;
    if (left <= 0) {
        box.transition({
            'left': 0
        }, 200);
    }
    if (right >= w()) {
        box.transition({
            'left': (
                w() - box.outerWidth() - 20
            )
        }, 400, 'easeInOutExpo');
    }
    if (top <= 0) {
        box.transition({
            'top': 0
        }, 200, 'easeInOutExpo');
    }
    if (bottom >= h()) {
        box.transition({
            'top': (
                h() - box.outerHeight() - 20
            )
        }, 200, 'easeInOutExpo');
    }
}

function stretchCanvas(name) {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    canvas.width = w();
    canvas.height = h();
    document.body.appendChild(canvas);
    $(canvas).addClass(name);
    $('body').attr('class',name);
    var timer;
    window.onresize = function() {
        timer && clearTimeout(timer);
        timer = setTimeout(onResize, 100);
    }
    if(name == 'start') {
        fragment();
    } else if(name == 'game') {
        scatter(level);
    }
}

function onResize() {
    canvas.width = w();
    canvas.height = h();
    $('.box').each(function() {
        checkSides($(this));
    });
}
function newPass() {
    return Math.round(Math.random() * 99999);
}
function scatter(level) {
    console.log('Level: ' + level);
    pass = newPass();
    console.log('Password: ' + pass);
    setPass();
    var startX = Math.round(Math.random() * w());
    var startY = h()+500;
    var qrs = {},
        particleIndex = 0;
    var seedsX = [];
    var seedsY = [];
    var maxAngles = 100;
    var currentAngle = 0;
    setInterval(function() {
        new QR();
    }, 1000);

    function seedAngles() {
        seedsX = [];
        seedsY = [];
        for (var i = 0; i < maxAngles; i++) {
            seedsX.push(Math.random() * 40 - Math.random() * 50);
            seedsY.push(Math.random() * 40 - Math.random() * 50);
        }
    }
    seedAngles();

    function QR() {
        if(end==false) {
            if (currentAngle !== maxAngles) {
                this.size = 150;
                this.x = Math.round(Math.random() * w());
                this.y = h()*2;
                this.vx = seedsX[currentAngle];
                this.vy = seedsY[currentAngle];
                currentAngle++;
                particleIndex++;
                qrs[particleIndex] = this;
                this.id = particleIndex;
                var rand = Math.round(Math.random() * 5 + level);
                if (rand == 1) {
                    var good = create(pass, true);
                    this.is = good;
                } else {
                    var bad = create(pass, false);
                    this.is = bad;
                }
            } else {
                seedAngles();
                currentAngle = 0;
            }
        }
    }
    QR.prototype.draw = function(i) {
        this.x += this.vx;
        this.y += this.vy;
        if (end == true) {
            rise += .2;
            this.y += this.vy + rise;
            
        } else {
            rise = 0;
        }
        if ((this.y + this.size) > bottom()) {
            this.vy *= -0.6;
            this.vx *= 0.75;
            this.y = bottom() - this.size;
            if(end==true) {
                delete qrs[this.id];
            }
        }
        if (this.x - this.size <= left()) {
            this.vx *= -1;
            this.x = left() + (this.size);
        }
        if (this.x + this.size >= right()) {
            this.vx *= -1;
            this.x = right() - this.size;
        }
        if (this.y <= -this.size) {
            delete qrs[this.id];
        }
        var date = new Date();
        var sec = date.getSeconds();
        context.drawImage(this.is, this.x, this.y, this.size, this.size);
    }

    setInterval(function() {
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        for (var i in qrs) {
            qrs[i].draw(i);
        }
    }, 30);
}

function create(pass, bool) {
    var img = new Image;
    if (bool == true) {
        var text = 'Type ' + pass + ' in the text field to move to the next level.';
        var colors = ['FF0000', '00FF00', '0000FF'];
        var color = colors[(Math.round(Math.random(colors.length))) + 1];
        img.src = "http://api.qrtag.net/qrcode/150/0/" + color + "/" + text;
    } else {
        $.getJSON("ads.json", function(data) {
            var urls = [];
            $.each(data.ads, function(key, val) {
                urls.push(val);
            });
            var index = Math.round(Math.random() * (urls.length - 1));
            var url = urls[index].url;
            var color = '000000';
            img.src = "http://api.qrtag.net/qrcode/150/0/" + url;
        });
    }
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
    return (-150);
}

function right() {
    return (w());
}

function bottom() {
    return (h() + 150);
}

function isDragging(elem) {
    return elem.hasClass('dragging');
}

function setPass() {
    var input = $('#password');
    input.hover(function() {
        if (input.val() == '#####' && !isDragging(input.parent().parent())) {
            input.val('');
        }
        input.focus();
    }, function() {
        if (input.val() == '' && !isDragging(input.parent().parent())) {
            input.blur();
            input.val('#####');
        }
    });
    input.click(function() {
        input.focus();
    });
    $('body').keyup(function(event) {
        $('#password').focus();
        var key = event.keyCode;
        if (key == 13) { //enter
            if ($('#password').val() == pass) {
                $('.input').addClass('right');
                end = true;
                setTimeout(function() {
                    $('.input').removeClass('right');
                    level += 1;
                    end = false;
                    pass = newPass();
                    showLevel();
                }, 2000);
                
                $('#password').val('');
            } else {
                $('.input').addClass('wrong');
                setTimeout(function() {
                    $('.input').removeClass('wrong');
                }, 100);
            }
        }
    });

    var numbers = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
    $('body').keypress(function(event) {
        var key = event.charCode;
        var isNumber = numbers.indexOf(key);
        if (isNumber < 0) {
            event.preventDefault();
            return false;
        }
    });
}

function showLevel() {
    $('.levelTxt .number').html(level);
    $('.levelTxt').css({opacity:1,y:h(),rotate3d:randRotate()}).transition({y:0,rotate3d:'0,0,0,0deg'},400,'easeOutExpo').transition({y:-h(),rotate3d:randRotate()},1400,'easeInExpo');
}



