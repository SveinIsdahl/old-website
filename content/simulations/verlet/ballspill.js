// @ts-check

function setup() {
    const divBrett = document.getElementById("brett");
    let width = 500;
    let height = 500;
    divBrett.style.width = width + "px";
    divBrett.style.height = height + "px";

    class Ball {
        constructor(x, y, prevX, prevY) {
            this.x = x;
            this.y = y;
            this.prevX = prevX;
            this.prevY = prevY;
            this.w = 20;
            this.h = 20;
            this.div = document.createElement("div");

            divBrett.append(this.div);
            this.div.className = "ball";
            this.div.style.width = this.w + "px";
            this.div.style.height = this.h + "px";

        }
        update() {
            //Finn fart
            let vx = this.x - this.prevX;
            let vy = this.y - this.prevY;
            //Sett inn nåværende pos til previous pos
            this.prevX = this.x;
            this.prevY = this.y;
            //Legg til fart i posisjon
            this.x += vx;
            this.y += vy;



            if (this.x > width - this.w) {
                this.x = width - this.w;
                this.prevX = this.x + vx;

            }
            if (this.x < 0) {
                this.x = 0;
                this.prevX = this.x + vx;
            }
            if (this.y > height - this.h) {
                this.xy = height - this.w;
                this.prevY = this.y + vy;
            }
            if (this.y < 0) {
                this.xy = 0;
                this.prevY = this.y + vy;

            }

            this.div.style.left = this.x + "px";
            this.div.style.top = this.y + "px";
        }

    }


    let b1 = new Ball(30, 30, 25, 29);
    let b2 = new Ball(30, 30, 20, 20)

    function draw() {
        b1.update();
        b2.update();

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);

}