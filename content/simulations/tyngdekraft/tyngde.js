// @ts-check
'use strict'

let canvas = document.getElementById("canvas");
let c = canvas.getContext("2d");
let G = 0.10;

class Planet {
    constructor(radius, mass, x, y, vx, vy) {
        this.radius = radius;
        this.mass = mass;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ax = 0;
        this.ay = 0;
        this.forceX = 0;
        this.forceY = 0;
    }
    updateValues() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx += this.ax;
        this.vy += this.ay;
        // Newtons 2. lov
        this.ax = this.forceX / this.mass;
        this.ay = this.forceY / this.mass;
    }
    draw() {
        this.updateValues();
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.stroke();
    }
}
function gravityCalculation(planet1, planet2) {
    let distance = Math.sqrt((Math.pow(planet2.x - planet1.x, 2) + (Math.pow(planet2.y - planet1.y, 2))));

    // Normalisert retningsvektor
    let vector = {
        x: (planet2.x - planet1.x) / distance,
        y: (planet2.y - planet1.y) / distance
    }

    // Finn vektor mellom planetene for å finne retning
    let gravity =  (G *(planet1.mass * planet2.mass) / (distance * distance));

    planet1.forceX = gravity * vector.x;
    planet1.forceY = gravity * vector.y;
    planet2.forceX = gravity * vector.x * (-1);
    planet2.forceY = gravity * vector.y * (-1);
}

let x = 0;
let planet1 = new Planet(10, 20, 400, 300, 0, 0.1);
let planet2 = new Planet(10, 20, 500, 300, 0, 0);
/*
planet1.vy = 0.1;
planet2.vy = -0.1;
*/
function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    //canvas.width = canvas.width;

    gravityCalculation(planet1, planet2);

    planet1.draw();
    planet2.draw();


}
setInterval(draw, 20);