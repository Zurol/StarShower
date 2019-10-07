import utils from './utils'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

// stars
function Star(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.gravity = 1;
    this.friction = 0.8;
    this.velocity = {
        x: 0,
        y: 3
    }
}

Star.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
}

Star.prototype.update = function() {
    this.draw();

    //Bola llegando al final del canvas
    if (this.y + this.radius + this.velocity.y > canvas.height) {
        this.velocity.y = -this.velocity.y * this.friction;
        this.shatter();
    }else{
        this.velocity.y += this.gravity;
    }
    this.y += this.velocity.y;
}

Star.prototype.shatter = function(){
    this.radius -= 3;
    for (let i = 0; i < 8; i++) {
        miniStars.push(new MiniStar(this.x, this.y, 2));
    }
}

function MiniStar(x, y, radius, color){

    Star.call(this, x, y, radius, color);
    this.gravity = 0.1;
    this.friction = 0.8;
    this.ttl = 500;
    this.opacity = 1;
    this.velocity = {
        x: utils.randomIntFromRange(-5, 5),
        y: utils.randomIntFromRange(-15, 15)
    }

    MiniStar.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(255, 0, 0, ${this.opacity})`;
        ctx.fill();
        ctx.closePath();
    }

    MiniStar.prototype.update = function() {
        this.draw();

        //Bola llegando al final del canvas
        if (this.y + this.radius + this.velocity.y > canvas.height) {
            this.velocity.y = -this.velocity.y * this.friction;
        }else{
            this.velocity.y += this.gravity;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.ttl -= 1;
        this.opacity -= 1 / this.ttl;
    }
}

// Implementation
const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, '#171e26');
backgroundGradient.addColorStop(1, '#3f586b');
let stars;
let miniStars;

function init() {
    stars = [];
    miniStars = [];

    for (let i = 0; i < 1; i++) {
        stars.push(new Star(canvas.width / 2, 30, 30, 'blue'));
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star, index) => {
        star.update();
        if (star.radius == 0) {
            stars.splice(index, 1);
        }
    });

    miniStars.forEach((miniStar, index) => {
        miniStar.update();
        if (miniStars.ttl == 0) {
            miniStars.splice(index, 1);
        }
    });
}

init();
animate();
