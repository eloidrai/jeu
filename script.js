const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

class Balle {
    constructor(){
        this.vX = 1;
        this.vY = 1;
        this.X = Math.floor(Math.random()*400+50);
        this.Y = 1;
    }
    
    dessiner(ctx){
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.X, this.Y, 6, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }
    
    avancer(planche){
        if (this.X<0 || this.X>500){
            this.vX *= -1;
        }
        if (this.Y<0 || (this.Y+6==400-30 && planche.x-50<this.X && this.X<planche.x+50)){
            this.vY *= -1;
        }
        this.X += this.vX;
        this.Y += this.vY;
    }
    
}

class Planche {
    constructor(){
        this.x = 500/2;
    }
    
    dessiner(ctx){
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.rect(this.x-50, 400-30, 100, 10);
        ctx.closePath();
        ctx.fill();
    }
}

const b = new Balle();
const p = new Planche();

window.setInterval((t)=>{
    ctx.clearRect(0,0,canvas.width, canvas.height)
    b.avancer(p);
    b.dessiner(ctx);
    p.dessiner(ctx);
},6
);

canvas.onmousemove = (e)=>{
    p.x = e.offsetX;
}

/*Beurk*/
canvas.style.border = "black 2px dashed";
canvas.style.backgroundColor = "lightgrey";