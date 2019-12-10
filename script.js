const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

class Balle {
    constructor(canvas, rayon){
        this.canvas = canvas, this.ctx = canvas.getContext('2d');
        this.vX = 3, this.vY = 3;                                   // Vecteur directeur (dans le repère du canvas)
        this.X = Math.floor(Math.random()*canvas.width), this.Y = 0;      // Coordonées de départ
        this.rayon = rayon;
    }
    
    dessiner(){
        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.arc(this.X, this.Y, this.rayon, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    avancer(planche){                                   // On met la planche en argument afin de calculer un éventuel rebond
        this.X += this.vX;
        this.Y += this.vY;
        if (this.X<0 || this.X>canvas.width){
            this.vX *= -1;
        }
        if (this.Y<0){
            this.vY *= -1;
        }
        if (this.Y+this.rayon>=this.canvas.height-planche.alti && this.Y+this.rayon<=this.canvas.height-(planche.alti-planche.ep) && planche.X-(planche.l/2)<this.X && this.X<planche.X+planche.l/2){
            this.Y = this.canvas.height-(planche.alti+1)-this.rayon;
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

const b = new Balle(canvas, 6);
const p = new Planche(canvas, 30, 100, 10);

window.setInterval((t)=>{
    ctx.clearRect(0,0,canvas.width, canvas.height)
    b.avancer(p);
    b.dessiner();
    p.dessiner();
},10
);

canvas.onmousemove = (e)=>{
    p.X = e.offsetX;
}