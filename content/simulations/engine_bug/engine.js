'use strict'

let canvas = document.getElementById('canvas');
let c = canvas.getContext('2d');
let width = canvas.width;
let height = canvas.height;


let antall = 600;


let ball = [];
let mouseState;
let x, y;
let state = "static";
let selectedId = "no";



function log(message) {
    console.log(message);
}


class Ball {
    constructor(radius, x, y, id) {
        //Alle varabler i objektet:
        this.id = id;
        this.r = radius;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
    }
    //Funkjson i objektet som legger til akselerasjon i fart og fart i posisjon.
    apply() {
        this.x += this.vx;
        this.y += this.vy;

        this.vx += this.ax;
        this.vy += this.ay;
    }

}

//sjekker om to baller overlapper hverandre ved å sjekke om lendgen til vektoren mellom dem eller kortere enn radiusene kombinert
function doBallsOverlap(ball, target) {
    //sjekker om ball og target er samme objekt i arrayet
    if (ball.id == target.id) {
        return false;
    }
    if (
        //Her kan man opphøye på begge sider for å slippe sqrt
        avstandPunkt(ball, target) < (ball.r + target.r)
    ) {
        return true;
    }
    else {
        return false;
        log("false");
    }
}

//finner avstand
function avstandPunkt(p1, p2) {
    return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow(p1.y - p2.y, 2));
}

//Loop som lager x antall objekter i arrayet
for (let i = 0; i < antall; i++) {
    ball[i] = new Ball(10, Math.random() * (width - 20) - 20, Math.random() * (height - 20) - 20, i);
}


function setup() {
    for (let i = 0; i < ball.length; i++) {
        //ball[i].vx = (Math.random() * 2 - 1)*1.5;
        //ball[i].vy = (Math.random() * 2 - 1)*1.5;
    }
}



//draw loop
function draw() {
    c.clearRect(0, 0, width, height);

    //Loop gjennom alle baller i arrayet
    for (let i = 0; i < ball.length; i++) {
        if (ball[i].x <= 0) {ball[i].x = width*Math.random()};
        if (ball[i].x > width){ball[i].x = width*Math.random()};
        if (ball[i].y <= 0) {ball[i].y = height*Math.random()};
        if (ball[i].y > height){ball[i].y = height*Math.random()};

        ball[i].apply();
        //Om farten til en ball er for lav settes den til null
        if (ball[i].vx + ball[i].vy > 0.0001) {
            //ball[i].vx = 0;
            //ball[i].vy = 0;
        }


        //Looper gjennom for å sjekke hver ball mot alle andre baller om de overlapper
        for (let j = 0; j < ball.length; j++) {
            if (doBallsOverlap(ball[i], ball[j])) {
                let avstand = avstandPunkt(ball[i], ball[j]);

                let overlap = (avstand - ball[i].r - ball[j].r) / 2;

                //FLytter ball1
                ball[i].x -= overlap * (ball[i].x - ball[j].x) / avstand;
                ball[i].y -= overlap * (ball[i].y - ball[j].y) / avstand;

                //Flytter target-ball i motsatt retning
                ball[j].x += overlap * (ball[i].x - ball[j].x) / avstand;
                ball[j].y += overlap * (ball[i].y - ball[j].y) / avstand;
                /*
                c.beginPath();
                c.moveTo(ball[i].x, ball[i].y);
                c.lineTo(ball[j].x, ball[j].y);
                c.stroke();
                */
            }
        }


        //Om museknapp er trykket ned, sjekker om posisjonen til musepekeren ligger inni ball[i] og om state er static, setter da posisjon til ball[i] = posision til musepeker
        if (mouseState == 1 && state == "static") {
            if (isPointInCircle(ball[i], x, y)) {
                selectedId = ball[i].id;
                ball[i].x = x;
                ball[i].y = y;
            }
            else if (ball[i].id == selectedId) {
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
            }
            else if (ball[i].id == selectedId) {
                c.beginPath();
                c.moveTo(ball[i].x, ball[i].y);
                c.lineTo(x, y);
                c.stroke();
            }
        
        }
        if (mouseState == 0 || state == "elastic") {
            ball[i].vx = (ball[i].x - x)/50;
            ball[i].vy = (ball[i].y - y)/50;
            selectedId = "no";
        }
        else if (mouseState == 0 || state == "static") {
            selectedId = "no";
        }
       

        //tegner alle sirklene
        c.beginPath();
        c.arc(ball[i].x, ball[i].y, ball[i].r, 0, 2 * Math.PI);
        c.stroke();
    }


}



setup();
setInterval(draw, fps(950));
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
Optimalisering:
Bruke Math. objekter kan noen ganger være krevende, bruk løsninger rundt dette
f.eks sqrt kan bli unngått ved å opphøye på begge sider av en likning
dersom det begynner å lagge, prøv å bytte ut alle matematiske operasjoner med bedre metoder.
Når jeg sjekkeer om musepeker ligger på en ball og om man trykker, sjekker jeg alle ballene om og om igjen, selv om en ball et selected.


Bedre kolisjoner (detection): kjør på høyere framerate, men kanskje ikke animer alle frames, (loop gjennom hele drawloopen uten å animere hver gang, ved å ha en ekstra for loop inni draw)

*/