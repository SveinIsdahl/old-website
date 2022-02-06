'use strict'

let canvas = document.getElementById('canvas');
let c = canvas.getContext('2d');
let width = canvas.width;
let height = canvas.height;



let elasticId
let ball = [];
let mouseState;
let x, y;
let state = "static";
let selectedId = "no";

document.getElementById("button").addEventListener("click", function() {
    if (state == "static") {
        state = "elastic";
        document.getElementById("button").innerHTML = "Current type: Elastic";
    } else {
        state = "static";
        document.getElementById("button").innerHTML = "Current type: Static";
    }
});

function log(message) {
    console.log(message);
}

//Vektorfunksjoner
const vecFunc = {
    dotProduct: function(x1, y1, x2, y2) {
        return x1 * x2 + y1 * y2;
    },
    avstandPunkt: function(p1, p2) {
        return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow(p1.y - p2.y, 2));
    },
    length: function(x, y) {
        return Math.sqrt(x * x + y * y);
    },
    normalize: function(x, y) {
        return {
            x: x / this.length(x, y),
            y: y / this.length(x, y)
        }
    }
};


class Ball {
    constructor(radius, x, y, id) {
            this.id = id;
            this.r = radius;
            this.x = x;
            this.y = y;
            this.vx = 0;
            this.vy = 0;
            this.ax = 0;
            this.ay = 0;
            this.mass = radius / 20;
            this.fx = 0;
            this.fy = 0;

        }
        //Funksjon i objektet som legger til akselerasjon i fart og fart i posisjon osv.
    apply() {
        this.x += this.vx;
        this.y += this.vy;

        this.vx += this.ax;
        this.vy += this.ay;

        this.ax = this.fx / this.mass;
        this.ay = this.fy / this.mass;

        //friksjon
        this.vx *= 0.999;
        this.vy *= 0.999;

    }


}

//sjekker om to baller overlapper hverandre ved å sjekke om lendgen til vektoren mellom dem eller kortere enn radiusene kombinert
function doBallsOverlap(ball, target) {
    //sjekker om ball og target er samme objekt i arrayet
    if (ball.id == target.id) {
        return false;
    }
    if (
        //Her kan man opphøye på begge sider for å slippe sqrt (dersom man bruker avstandPunkt() fra vecFunc må man det)
        Math.pow((ball.x - target.x), 2) + Math.pow(ball.y - target.y, 2) < Math.pow((ball.r + target.r), 2)
    ) {
        return true;
    } else {
        return false;
        log("false");
    }
}


//Loop som lager x antall objekter i arrayet
for (let i = 0; i < 5; i++) {
    ball[i] = new Ball(
        //i * Math.random() * 0.01
        30, Math.random() * (width - 25) + 10, Math.random() * (height - 25) + 10, i);
}

for (let i = 5; i < 10; i++) {
    ball[i] = new Ball(
        //i * Math.random() * 0.01
        3, Math.random() * (width - 25) + 10, Math.random() * (height - 25) + 10, i);
}



function setup() {
    for (let i = 0; i < ball.length; i++) {
        //Legg til slider for total kinetisk energi/temperatur (Ikke i noen bestemt enhet)
        let totalEnergi = 0.5;
        //ball[i].vx = (Math.random() * 2 - 1) * totalEnergi;
        //ball[i].vy = (Math.random() * 2 - 1) * totalEnergi;
    }

}



//draw loop
function draw() {
    c.clearRect(0, 0, width, height);

    //Loop gjennom alle baller i arrayet
    for (let i = 0; i < ball.length; i++) {
        if (ball[i].x <= 0) { ball[i].x = width };
        if (ball[i].x > width) { ball[i].x = 0 };
        if (ball[i].y <= 0) { ball[i].y = height };
        if (ball[i].y > height) { ball[i].y = 0 };

        ball[i].apply();



        //Om farten til en ball er for lav settes den til null
        if (Math.abs(ball[i].vx) + Math.abs(ball[i].vy) < 0.001) {
            ball[i].vx = 0;
            ball[i].vy = 0;
        }




        //Looper gjennom for å sjekke hver ball mot alle andre baller om de overlapper
        for (let j = 0; j < ball.length; j++) {
            if (doBallsOverlap(ball[i], ball[j])) {

                let distance = vecFunc.avstandPunkt(ball[i], ball[j]);



                //Normalisert retningsvektor mellom ballene (enhetsvektor)
                let nx = (ball[j].x - ball[i].x) / distance;
                let ny = (ball[j].y - ball[i].y) / distance;

                //tangent
                let tx = -ny;
                let ty = nx;


                //dottprodukt mellom fartsvektor og tangent
                let dpTan1 = ball[i].vx * tx + ball[i].vy * ty;
                let dpTan2 = ball[j].vx * tx + ball[j].vy * ty;

                //dottprodukt mellom fartsvektor og normalisert vektor
                let dpNorm1 = ball[i].vx * nx + ball[i].vy * ny;
                let dpNorm2 = ball[j].vx * nx + ball[j].vy * ny;

                //bevegelsemengde er alltid konservert, ligninger henta fra https://en.wikipedia.org/wiki/Elastic_collision 
                let bm1 = (dpNorm1 * (ball[i].mass - ball[j].mass) + 2 * ball[j].mass * dpNorm2) / (ball[i].mass + ball[j].mass);
                let bm2 = (dpNorm2 * (ball[j].mass - ball[i].mass) + 2 * ball[i].mass * dpNorm1) / (ball[i].mass + ball[j].mass);


                let overlap = (distance - ball[i].r - ball[j].r) / 2;

                //FLytter ball1
                ball[i].x -= overlap * (ball[i].x - ball[j].x) / distance;
                ball[i].y -= overlap * (ball[i].y - ball[j].y) / distance;

                //Flytter target-ball i motsatt retning
                ball[j].x += overlap * (ball[i].x - ball[j].x) / distance;
                ball[j].y += overlap * (ball[i].y - ball[j].y) / distance;


                c.beginPath();
                c.moveTo(ball[i].x, ball[i].y);
                c.lineTo(ball[j].x, ball[j].y);
                c.stroke();

                ball[i].vx = tx * dpTan1 + nx * bm1;
                ball[i].vy = ty * dpTan1 + ny * bm1;
                ball[j].vx = tx * dpTan2 + nx * bm2;
                ball[j].vy = ty * dpTan2 + ny * bm2;



            }

        }


        //Om museknapp er trykket ned, sjekker om posisjonen til musepekeren ligger inni ball[i] og om state er static, setter da posisjon til ball[i] = posision til musepeker
        if (mouseState == 1 && state == "static") {
            if (isPointInCircle(ball[i], x, y) && selectedId == "no") {
                selectedId = ball[i].id;
                ball[i].x = x;
                ball[i].y = y;
            } else if (ball[i].id == selectedId) {
                ball[i].x = x;
                ball[i].y = y;
            }
        }
        //Om museknapp er trykket ned, sjekker om posisjonen til musepekeren ligger inni ball[i] og om state er elastic, lager da vektor mellom ball og musekpekerpoisjon
        if (mouseState == 1 && state == "elastic") {
            if (isPointInCircle(ball[i], x, y)) {
                selectedId = ball[i].id;
                c.beginPath();
                c.moveTo(ball[i].x, ball[i].y);
                c.lineTo(x, y);
                c.stroke();
            } else if (ball[i].id == selectedId) {
                c.beginPath();
                c.moveTo(ball[i].x, ball[i].y);
                c.lineTo(x, y);
                c.stroke();
                elasticId = ball[i].id;
            }

        }


        if (mouseState == 0 && state == "elastic" && elasticId == ball[i].id) {
            ball[i].vx = (ball[i].x - x) / 30;
            ball[i].vy = (ball[i].y - y) / 30;
            selectedId = "no";
            elasticId = "no";
        }

        if (mouseState == 0 && state == "static") {
            selectedId = "no";
        }


        //tegner alle sirklene
        c.beginPath();
        c.arc(ball[i].x, ball[i].y, ball[i].r, 0, 2 * Math.PI);
        c.stroke();

    }


}



setup();
setInterval(draw, fps(100));
//Fps til ms/frame
function fps(fps) {
    return (1 / fps) * 1000;
}

//sjekker om musepeker ligger på ball
function isPointInCircle(ball, x, y) {
    return Math.abs(Math.pow(ball.x - x, 2) + (Math.pow(ball.y - y, 2))) < (Math.pow(ball.r, 2));
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}


function mouseDown(evt) {
    mouseState = 1;
    x = getMousePos(evt).x;
    y = getMousePos(evt).y;
}

function mouseUp(evt) {
    mouseState = 0;
    x = getMousePos(evt).x;
    y = getMousePos(evt).y;
}


function mouseMove(evt) {
    x = getMousePos(evt).x;
    y = getMousePos(evt).y;
}

/*
var slider = document.getElementById("sizeIn");
var output = document.getElementById("sizeOut");
output.innerHTML = slider.value;

slider.oninput = function() {
    output.innerHTML = this.value;
    lineWidth = this.value;
}
*/

/*
Optimalisering:
Bruke Math. objekter kan noen ganger være krevende, bruk løsninger rundt dette
f.eks sqrt kan bli unngått ved å opphøye på begge sider av en likning
dersom det begynner å lagge, prøv å bytte ut alle matematiske operasjoner med bedre metoder.
Når jeg sjekkeer om musepeker ligger på en ball og om man trykker, sjekker jeg alle ballene om og om igjen, selv om en ball et selected.


Bedre kolisjoner (detection): kjør på høyere framerate, men kanskje ikke animer alle frames, (loop gjennom hele drawloopen uten å animere hver gang, ved å ha en ekstra for loop inni draw)

Kombiner med tegne.html, tegne inn sirklene

Lag sliders og knapper (som i tegne.html)
*/