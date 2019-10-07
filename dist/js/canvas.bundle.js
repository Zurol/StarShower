/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/canvas.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/canvas.js":
/*!**************************!*\
  !*** ./src/js/canvas.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utils = __webpack_require__(/*! ./utils */ "./src/js/utils.js");

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

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
    };
}

/**
 * Función definida por medio de prototype para agilizar el tiempo de procesamiento.
 * 1.- Dibuja un círculo.
 * 2.- Agrega color, sombra y blur.
 * 3.- Rellena la forma.
 * @return {[NULL]} [Sin retorno]
 */
Star.prototype.draw = function () {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.shadowColor = '#E3EAEF';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
};

/**
 * Función definida por medio de prototype para agilizar el tiempo de procesamiento.
 * Dibujado de la forma:
 * - Lleva a cabo los desplazamientos de los círculos en X y Y.
 * - Registra la colisión contra los perímetros del canvas y el "piso" de la escena.
 * * @return {[NULL]} [Sin retorno]
 */
Star.prototype.update = function () {
    this.draw();

    //Bola llegando al final del canvas.
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction;
        this.shatter();
    } else {
        this.velocity.y += this.gravity;
    }

    //Bola golpeando los límites derechos o izquierdos del mapa.
    if (this.x + this.radius + this.velocity.x > canvas.width || this.x - this.radius <= 0) {
        this.velocity.x = -this.velocity.x * this.friction;
        this.shatter();
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
};

/**
 * Función definida por medio de prototype para agilizar el tiempo de procesamiento.
 * Realiza la reducción del RADIO del círculo al colisiona e inicia el desprendimiento de 8 partículas por cada llamada.
 * * @return {[NULL]} [Sin retorno]
 */
Star.prototype.shatter = function () {
    this.radius -= 3;
    for (var i = 0; i < 8; i++) {
        miniStars.push(new MiniStar(this.x, this.y, 2));
    }
};

/**
 * Objeto "Mini Estrella", que se generará cuando una estrella colisiona contra alguno de los límites de la escena. Está representado por medio de círculos.
 * @param {int} x         [Coordenada X para la aparición del círculo]
 * @param {int} y         [Coordenada Y para la aparición del círculo]
 * @param {int} radius    [Dimensión del RADIO del círculo]
 * @param {string} color  [Color del relleno de la forma, puede ser: RGBA, RGB o HEX]
 */
function MiniStar(x, y, radius, color) {

    Star.call(this, x, y, radius, color);
    this.gravity = 0.09;
    this.friction = 0.88;
    this.ttl = 3;
    this.opacity = 1;
    this.velocity = {
        x: _utils2.default.randomIntFromRange(-5, 5),
        y: _utils2.default.randomIntFromRange(-15, 15)

        /**
         * Función definida por medio de prototype para agilizar el tiempo de procesamiento.
         * 1.- Dibuja un círculo.
         * 2.- Agrega color, sombra y blur.
         * 3.- Rellena la forma.
         * @return {[NULL]} [Sin retorno]
         */
    };MiniStar.prototype.draw = function () {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(227, 234, 239, ' + this.opacity + ')';
        ctx.shadowColor = '#E3EAEF';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    };

    /**
     * Función definida por medio de prototype para agilizar el tiempo de procesamiento.
     * Dibujado de la forma:
     * - Lleva a cabo los desplazamientos de los círculos en X y Y.
     * - Registra la colisión contra los perímetros del canvas y el "piso" de la escena.
     * - Registra un tiempo de vida máximo para cada mini Estrella y posteriormente cambia la opacidad del elemento para hacerlo cada vez menos visible.
     * * @return {[NULL]} [Sin retorno]
     */
    MiniStar.prototype.update = function () {
        this.draw();

        //Bola llegando al final del canvas.
        if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
            this.velocity.y = -this.velocity.y * this.friction;
        } else {
            this.velocity.y += this.gravity;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.ttl -= 0.01;
        this.opacity -= 1 / (this.ttl / 0.01);
    };
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
    for (var i = 0; i < mountainAmount; i++) {
        var mountainWidth = canvas.width / mountainAmount;
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
var backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, '#171e26');
backgroundGradient.addColorStop(1, '#3f586b');

var stars = void 0;
var miniStars = void 0;
var backgroundStars = void 0;
var ticker = 0;
var randomSpawnTime = 75;
var groundHeight = 100;

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

    for (var i = 0; i < 150; i++) {
        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height;
        var radius = Math.random() * 3;
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

    backgroundStars.forEach(function (backgroundStars) {
        backgroundStars.draw();
    });

    createMountainRange(1, canvas.height - 50, '#384551');
    createMountainRange(2, canvas.height - 100, '#283843');
    createMountainRange(3, canvas.height - 300, '#26333E');
    ctx.fillStyle = "#182028";
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    stars.forEach(function (star, index) {
        star.update();
        if (star.radius == 0) {
            stars.splice(index, 1);
        }
    });

    miniStars.forEach(function (miniStar, index) {
        miniStar.update();
        if (miniStars.ttl == 0) {
            miniStars.splice(index, 1);
        }
    });

    ticker++;

    if (ticker % randomSpawnTime == 0) {
        var radius = 12;
        var x = Math.max(Math.random() * canvas.width - radius);
        var y = -100;
        stars.push(new Star(x, y, radius, 'white'));
        randomSpawnTime = _utils2.default.randomIntFromRange(175, 300);
    }
}

init();
animate();

/***/ }),

/***/ "./src/js/utils.js":
/*!*************************!*\
  !*** ./src/js/utils.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  var xDist = x2 - x1;
  var yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

module.exports = { randomIntFromRange: randomIntFromRange, randomColor: randomColor, distance: distance };

/***/ })

/******/ });
//# sourceMappingURL=canvas.bundle.js.map