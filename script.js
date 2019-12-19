class Balle {
    constructor(canvas, rayon, planche){
        this.canvas = canvas, this.ctx = canvas.getContext('2d');
        this.vX = 3, this.vY = 3;                                   // Vecteur directeur (dans le repère du canvas)
        this.X = Math.floor(Math.random()*canvas.width), this.Y = 0;      // Coordonées de départ
        this.rayon = rayon;
        this.planche = planche;
    }

    dessiner(){
        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.arc(this.X, this.Y, this.rayon, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    avancer(){
        this.X += this.vX;
        this.Y += this.vY;
        if (this.X<0 || this.X>this.canvas.width){
            this.vX *= -1;
        }
        if (this.Y<0){
            this.vY *= -1;
        }
        if (this.Y+this.rayon>=this.canvas.height-this.planche.alti && this.Y+this.rayon<=this.canvas.height-(this.planche.alti-this.planche.ep) && this.planche.X-(this.planche.l/2)<this.X && this.X<this.planche.X+this.planche.l/2){
            this.Y = this.canvas.height-(this.planche.alti+1)-this.rayon;
            this.vY *= -1;
        }
    }

}

class Planche {
    constructor(canvas, altitude, longueur, epaisseur){
        this.canvas = canvas, this.ctx = canvas.getContext('2d');
        this.alti = altitude, this.l = longueur, this.ep = epaisseur;
        this.X = canvas.width/2;
    }

    dessiner(){
        this.ctx.fillStyle = "navy";
        this.ctx.beginPath();
        this.ctx.rect(this.X-(this.l/2), this.canvas.height-this.alti, this.l, this.ep);
        this.ctx.closePath();
        this.ctx.fill();
    }
}


class Jeu {
    constructor(){
        this.canvas = document.querySelector("canvas");
        this.p = new Planche(this.canvas, 30, 100, 10);
        this.b = new Balle(this.canvas, 6, this.p);
        this.canvas.onmousemove = (e)=>{
            this.p.X = e.offsetX;
        }

    }

    animation(intervale){
        this.intervaleId = window.setInterval((t)=>{
            this.canvas.getContext('2d').clearRect(0,0,this.canvas.width, this.canvas.height)
            this.b.avancer();
            this.b.dessiner();
            this.p.dessiner();
        },intervale);
    }
}

class Brique {
  constructor (x, y, w, h, balle){
    return;
  }
}

window.onload = ()=>{
    (new Jeu()).animation(5);
};
