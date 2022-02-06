//@ts-check
const l = x => console.log(x);

import { dotProduct, distancePoints, length, normalize } from "./vectors.js";
const canvas = /** */ document.getElementById("canvas");
// @ts-ignore
const c = canvas.getContext("2d");

const w = 1200;
const h = 700;

let mouseDownState = false;
let mpos = {};
canvas.width = w;
canvas.height = h;
canvas.style.width = w + "px";
canvas.style.height = h + "px";

class Boid {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 7;
        this.vx = 0;
        this.vy = 0;
    }
    updatePos() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) { this.x = w };
        if (this.x > w) { this.x = 0 };
        if (this.y < 0) { this.y = h };
        if (this.y > h) { this.y = 0 };

        const maxVel = 8;
        if (Math.abs(this.vx) > maxVel) {
            this.vx = maxVel * Math.sign(this.vx);

        }
        if (Math.abs(this.vy) > maxVel) {
            this.vy = maxVel * Math.sign(this.vy);
        }
    }
    /**
     * @param {array} boidArray
     * @param {number} i
     */
    repulsionCalculation(boidArray, i) {
        let b1 = this;

        let currentDistanceToClosest = Infinity;
        let indexOfShortestDist = -1;
        boidArray.forEach((b2, j) => {
            if (i !== j) {
                // DIstance uten å ta kvadratrot for optimization
                let distTest = (Math.pow((b1.x - b2.x), 2) + Math.pow(b1.y - b2.y, 2));
                if (distTest < currentDistanceToClosest) {
                    currentDistanceToClosest = distTest;
                    indexOfShortestDist = j;
                }
            }
        })
        const b2 = boidArray[indexOfShortestDist];
        const velVec = normalize(b2.x - b1.x, b2.y - b1.y);

        b1.vx -= velVec.x * (100 / currentDistanceToClosest);
        b1.vy -= velVec.y * (100 / currentDistanceToClosest);
    }
    moveToMouse(pos) {
        const velVec = normalize(pos.x - this.x, pos.y - this.y);

        const lengthSquared = (Math.pow((this.x - pos.x), 2) + Math.pow(this.y - pos.y, 2))
        console.log()
        this.vx += velVec.x * 0.02 + Math.min(2/lengthSquared, 1)
        this.vy += velVec.y * 0.02 + Math.min(2/lengthSquared, 1)
        
    }
}
const boidArr = [];
for (let i = 0; i < 5; i++) {
    boidArr[i] = new Boid(Math.round(Math.random() * w), Math.round(Math.random() * h));

}

c.lineWidth = 3;
function draw() {
    c.clearRect(0, 0, w, h)
    c.beginPath();
    boidArr.forEach((b1, i) => {
        b1.repulsionCalculation(boidArr, i);

        if (mouseDownState) {
            b1.moveToMouse(mpos);
            updateCenterPoint(mpos)
        }

        b1.updatePos();


        c.beginPath();
        c.lineWidth = 3;
        c.arc(b1.x, b1.y, b1.r, 0, 2 * Math.PI);
        c.stroke();

        c.beginPath();
        c.moveTo(b1.x, b1.y);
        c.lineWidth = 1;
        c.lineTo(b1.vx * 15 + b1.x, b1.vy * 15 + b1.y)
        c.stroke();
    })
    c.stroke();
        requestAnimationFrame(draw);

    



}
requestAnimationFrame(draw);

function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    mouseDownState = true;
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}
document.addEventListener("mousedown", (e) => {
    mpos = getMousePos(e);
});

function updateCenterPoint(pos) {
    c.beginPath();
    c.lineWidth = 3;
    c.arc(pos.x, pos.y, 1, 0, 2 * Math.PI);
    c.stroke()



}