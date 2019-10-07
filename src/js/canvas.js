import utils from './utils'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/**
 * Objeto "Estrella", que caerá de forma paulatina a lo ancho del lienzo y está representado por medio de círculos.
 * @param {int} x         [Coordenada X para la aparición del círculo]
 * @param {int} y         [Coordenada Y para la aparición del círculo]
 * @param {int} radius    [Dimensión del RADIO del círculo]
 * @param {string} color  [Color del relleno de la forma, puede ser: RGBA, RGB o HEX]
 */
function Star(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.gravity = 1;
    this.friction = 0.8;
    this.velocity = {
        x: (Math.random() - 0.5) * 8,
        y: 3
    }
}

/**
 * Función definida por medio de prototype para agilizar el tiempo de procesamiento.
 * 1.- Dibuja un círculo.
 * 2.- Agrega color, sombra y blur.
 * 3.- Rellena la forma.
 * @return {[NULL]} [Sin retorno]
 */
Star.prototype.draw = function() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.shadowColor = '#E3EAEF';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

/**
 * Función definida por medio de prototype para agilizar el tiempo de procesamiento.
 * Dibujado de la forma:
 * - Lleva a cabo los desplazamientos de los círculos en X y Y.
 * - Registra la colisión contra los perímetros del canvas y el "piso" de la escena.
 * * @return {[NULL]} [Sin retorno]
 */
Star.prototype.update = function() {
    this.draw();

    //Bola llegando al final del canvas.
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction;
        this.shatter();
    }else{
        this.velocity.y += this.gravity;
    }

    //Bola golpeando los límites derechos o izquierdos del mapa.
    if (this.x + this.radius + this.velocity.x > canvas.width || this.x - this.radius <= 0) {
        this.velocity.x = -this.velocity.x * this.friction;
        this.shatter();
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
}

/**
 * Función definida por medio de prototype para agilizar el tiempo de procesamiento.
 * Realiza la reducción del RADIO del círculo al colisiona e inicia el desprendimiento de 8 partículas por cada llamada.
 * * @return {[NULL]} [Sin retorno]
 */
Star.prototype.shatter = function(){
    this.radius -= 3;
    for (let i = 0; i < 8; i++) {
        miniStars.push(new MiniStar(this.x, this.y, 2));
    }
}


/**
 * Objeto "Mini Estrella", que se generará cuando una estrella colisiona contra alguno de los límites de la escena. Está representado por medio de círculos.
 * @param {int} x         [Coordenada X para la aparición del círculo]
 * @param {int} y         [Coordenada Y para la aparición del círculo]
 * @param {int} radius    [Dimensión del RADIO del círculo]
 * @param {string} color  [Color del relleno de la forma, puede ser: RGBA, RGB o HEX]
 */
function MiniStar(x, y, radius, color){

    Star.call(this, x, y, radius, color);
    this.gravity = 0.09;
    this.friction = 0.88;
    this.ttl = 3;
    this.opacity = 1;
    this.velocity = {
        x: utils.randomIntFromRange(-5, 5),
        y: utils.randomIntFromRange(-15, 15)
    }


    /**
     * Función definida por medio de prototype para agilizar el tiempo de procesamiento.
     * 1.- Dibuja un círculo.
     * 2.- Agrega color, sombra y blur.
     * 3.- Rellena la forma.
     * @return {[NULL]} [Sin retorno]
     */
    MiniStar.prototype.draw = function() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(227, 234, 239, ${this.opacity})`;
        ctx.shadowColor = '#E3EAEF';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    /**
     * Función definida por medio de prototype para agilizar el tiempo de procesamiento.
     * Dibujado de la forma:
     * - Lleva a cabo los desplazamientos de los círculos en X y Y.
     * - Registra la colisión contra los perímetros del canvas y el "piso" de la escena.
     * - Registra un tiempo de vida máximo para cada mini Estrella y posteriormente cambia la opacidad del elemento para hacerlo cada vez menos visible.
     * * @return {[NULL]} [Sin retorno]
     */
    MiniStar.prototype.update = function() {
        this.draw();

        //Bola llegando al final del canvas.
        if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
            this.velocity.y = -this.velocity.y * this.friction;
        }else{
            this.velocity.y += this.gravity;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.ttl -= 0.01;
        this.opacity -= 1 / (this.ttl / 0.01);
    }
}

/**
 * Función para la creación dinámica de "Montañas".
 * 1- Se distribuye de forma regular el espacio para generar las mismas dimensiones por elemento.
 * 2.- Se agregan y restan 325 px para dar una forma más prolongada a cada montaña.
 * @param  {int} mountainAmount [Número de montañas a generar]
 * @param  {int} height         [Altura de cada montaña]
 * @param  {String} color       [Color del relleno de la forma, puede ser: RGBA, RGB o HEX]
 * @return {[NULL]}             [Sin retorno]
 */
function createMountainRange(mountainAmount, height, color) {
    for (let i = 0; i < mountainAmount; i++) {
        const mountainWidth = canvas.width / mountainAmount;
        ctx.beginPath();
        ctx.moveTo(i * mountainWidth, canvas.height);
        ctx.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height);
        ctx.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height);
        ctx.lineTo(i * mountainWidth - 325, canvas.height);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    };
}


/*
 * Inicia la implementación del cuerpo del código.
 */
const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, '#171e26');
backgroundGradient.addColorStop(1, '#3f586b');

let stars;
let miniStars;
let backgroundStars;
let ticker = 0;
let randomSpawnTime = 75;
const groundHeight = 100;

/**
 * Dibujado de estrellas que conforman parte del escenario.
 * @return {[NULL]} [Sin retorno]
 */
function init() {
    stars = [];
    miniStars = [];
    backgroundStars = [];

    /*
     * Estrella inicial - Conservada para posible debug/modificación en las partículas.
     *

    for (let i = 0; i < 1; i++) {
        stars.push(new Star(canvas.width / 2, 30, 30, '#E3EAEF'));
    }
     */

    for (let i = 0; i < 150; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 3;
        backgroundStars.push(new Star(x, y, radius, 'white'));
    }
}

/**
 * Cicló de animación.
 * 1.- Creación del fondo con gradiente.
 * 2.- Dibujado de las estrellas de fondo.
 * 3.- Trazado de las montañas.
 * 4.- Dibujado/Actualizado de las estrellas que se precipitarán al suelo.
 * 5.- Dibujado/Actualizado de las mini estrellas que se generan post colisión.
 * 6.- Generación Aleatoria de las posiciones de las estrellas y sus tiempos de generación.
 * @return {[NULL]} [Sin retorno]
 */
function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    backgroundStars.forEach(backgroundStars => {
        backgroundStars.draw();
    });

    createMountainRange(1, canvas.height -  50, '#384551');
    createMountainRange(2, canvas.height - 100, '#283843');
    createMountainRange(3, canvas.height - 300, '#26333E');
    ctx.fillStyle = "#182028";
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

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

    ticker++;

    if (ticker % randomSpawnTime == 0) {
        const radius = 12;
        const x = Math.max(Math.random() * canvas.width - radius);
        const y = -100;
        stars.push(new Star(x, y, radius, 'white'));
        randomSpawnTime = utils.randomIntFromRange(175, 300);
    }
}

init();
animate();
