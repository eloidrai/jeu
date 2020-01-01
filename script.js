class Balle {
    constructor(canvas, rayon, planche){
        this.canvas = canvas, this.ctx = canvas.getContext('2d');
        this.rayon = rayon;
        this.vX = 3, this.vY = 3;                                   // Vecteur directeur (dans le repère du canvas)
        this.x = Math.floor(Math.random()*(canvas.width-2*this.rayon))+this.rayon, this.y = rayon;      // Coordonées de départ
        this.planche = planche;
    }

    dessiner(){
        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.rayon, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    avancer(){
        this.x += this.vX;
        this.y += this.vY;
        if (this.x<this.rayon || this.x>this.canvas.width-this.rayon){
            this.vX *= -1;
        }
        if (this.y<this.rayon){
            this.vY *= -1;
        }
        if (this.y+this.rayon>=this.canvas.height-this.planche.alti && this.y+this.rayon<=this.canvas.height-(this.planche.alti-this.planche.ep) && this.planche.x-(this.planche.l/2)<this.x && this.x<this.planche.x+this.planche.l/2){
            this.y = this.canvas.height-(this.planche.alti+1)-this.rayon;
            this.vY *= -1;
        }
    }

}

class Planche {
    constructor(canvas, altitude, longueur, epaisseur){
        this.canvas = canvas, this.ctx = canvas.getContext('2d');
        this.alti = altitude, this.l = longueur, this.ep = epaisseur;
        this.x = canvas.width/2;
        this.dep = 0;
    }

    dessiner(){
        this.ctx.fillStyle = "navy";
        this.ctx.beginPath();
        this.ctx.rect(this.x-(this.l/2), this.canvas.height-this.alti, this.l, this.ep);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

class Brique {
    constructor(canvas, x, y, L, l){
        this.canvas = canvas, this.ctx = canvas.getContext('2d');
        this.x = x, this.y = y, this.L = L, this.l = l;
        this.coul = ["purple", "orange", "aqua", "green", "chocolate", "yellowgreen", "violet", "coral"][Math.floor(Math.random()*8)];
    }

    dessiner(){
        this.ctx.fillStyle = this.coul;
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.L, this.l);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    touche(balle){
        if (this.x<balle.x && balle.x<this.x+this.L && this.y<balle.y && balle.y<this.y+this.l){
            if (this.y<balle.y-balle.vY && balle.y-balle.vY<this.y+this.l){
                balle.vX *= -1;
            } else {
                balle.vY *= -1;
            }
            return true
        }
        return false
    }
}

class Jeu {
    constructor(){
        this.canvas = document.querySelector("canvas");
        this.p = new Planche(this.canvas, 30, 100, 10);
        this.b = new Balle(this.canvas, 10, this.p);
        this.pause = false;
        //this.briques = [new Brique(this.canvas, 50, 50, 50, 50), new Brique(this.canvas, 250, 100, 60, 20), new Brique(this.canvas, 200, 100, 30, 25), new Brique(this.canvas, 160, 150, 30, 25), new Brique(this.canvas, 180, 145, 34, 22),new Brique(this.canvas, 300, 40, 42, 17), new Brique(this.canvas, 350, 40, 42, 23)];
        this.briques = Array(35).fill(null).map(e=>{
            const x = Math.floor(Math.random()*this.canvas.width), y = Math.floor(Math.random()*this.canvas.height/3);
            const L = Math.floor(Math.random()*15)+35
            return new Brique(this.canvas, x, y, L, 15);
        })
        this.canvas.onmousemove = (e)=>{
            this.p.x = e.offsetX;
        }
        document.onkeydown = (e)=>{
            switch (e.key){
                case "ArrowLeft":
                    this.p.dep = -4;
                    break;
                case "ArrowRight":
                    this.p.dep = +4;
                    break;
                case " ":
                    if (this.pause){
                        this.animation(this.inter);
                    } else {
                        this.stop()
                    }
                    this.pause = !(this.pause);
                    break;
            }
        }
        document.onkeyup = (e)=> this.p.dep = 0;

    }

    animation(intervale){
        this.inter = intervale;
        this.intervaleId = window.setInterval((t)=>{
            this.canvas.getContext('2d').clearRect(0,0,this.canvas.width, this.canvas.height)
            this.b.avancer();
            this.b.dessiner();
            this.p.dessiner();
            this.p.x += this.p.dep;
            this.briques.forEach((bri, i, a)=>{bri.dessiner();
                if (bri.touche(this.b)){
                    a.splice(i, 1);
                }
            });
            if (this.b.y > this.canvas.height){
                const ctx = this.canvas.getContext('2d');
                ctx.font = "40px Arial";
                ctx.fillStyle = "black"
                ctx.fillText("Jeu terminé !", 10, 50);
                this.stop();
            }
        },intervale);
    }
    
    stop (){
        window.clearInterval(this.intervaleId);
    }
}

let jeu;

window.onload = ()=>{
    jeu = new Jeu();
    jeu.animation(10);
};

document.querySelector("#rejouer").onclick = e=>{
    document.querySelector("#rejouer").blur();
    jeu.stop();
    jeu = new Jeu();
    jeu.animation(10);
}