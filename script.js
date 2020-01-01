class ElementJeu {                                                  // Base pour tous les élements du jeu
    constructor(canvas, couleur){
        this.canvas = canvas, this.ctx = canvas.getContext('2d');
        this.couleur = couleur;
    }
}

class Balle extends ElementJeu {
    constructor(canvas, couleur, rayon){
        super(canvas, couleur);
        this.rayon = rayon;
        this.vX = 3, this.vY = 3;                                                                       // Vecteur directeur (dans le repère du canvas)
        this.x = Math.floor(Math.random()*(canvas.width-2*this.rayon))+this.rayon, this.y = rayon;      // Coordonées de départ
    }

    dessiner(){
        this.ctx.fillStyle = this.couleur;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.rayon, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    avancer(){
        this.x += this.vX;
        this.y += this.vY;
        /*Gère l'arrivé sur les bords*/
        if (this.x<this.rayon || this.x>this.canvas.width-this.rayon){
            this.vX *= -1;
        }
        if (this.y<this.rayon){
            this.vY *= -1;
        }
    }

}

class Planche extends ElementJeu {
    constructor(canvas, couleur, altitudetude, longueur, epaisseur){
        super(canvas, couleur);
        this.altitude = altitudetude, this.l = longueur, this.ep = epaisseur;
        this.x = canvas.width/2;
        /*Contrôle avec la souris*/
        this.canvas.addEventListener('mousemove', e=>{
            this.x = e.offsetX;
        });
        /*Contrôle avec les touches du clavier*/
        this.deplacement = 0;
        document.addEventListener('keydown', e=>{
            switch (e.code){
                case 'ArrowLeft':
                    this.deplacement = -5;
                    break;
                case 'ArrowRight':
                    this.deplacement = 5;
                    break;
            }
        });
    }

    dessiner(){
        this.ctx.fillStyle = this.couleur;
        this.ctx.beginPath();
        this.ctx.rect(this.x-(this.l/2), this.canvas.height-this.altitude, this.l, this.ep);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    touche(balle){
    if (balle.y+balle.rayon >= this.canvas.height-this.altitude && balle.y+balle.rayon<=this.canvas.height-(this.altitude-this.ep) && this.x-(this.l/2)<balle.x && balle.x<this.x+this.l/2){
            balle.y = this.canvas.height-(this.altitude+1)-balle.rayon;
            balle.vY *= -1;
        }
    }
}

class Brique extends ElementJeu {
    constructor(canvas, couleur, x, y, L, l){
        super(canvas, couleur);
        this.x = x, this.y = y, this.L = L, this.l = l;
    }

    dessiner(){
        this.ctx.fillStyle = this.couleur;
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.L, this.l);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    touche(balle){
        if (this.x<balle.x && balle.x<this.x+this.L && this.y<balle.y && balle.y<this.y+this.l){
            if (this.y<balle.y-balle.vY && balle.y-balle.vY<this.y+this.l){                         // Quand la balle est arrivée par le coté
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
        /*Mise en place des éléments*/
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.planche = new Planche(this.canvas, 'blue', 30, 100, 10);
        this.balle = new Balle(this.canvas, 'red', 10);
        this.briques = Array(35).fill(null).map(e=>{
            const x = Math.floor(Math.random()*this.canvas.width), y = Math.floor(Math.random()*this.canvas.height/3);
            const L = Math.floor(Math.random()*15)+35
            const couleur = ["purple", "orange", "aqua", "green", "chocolate", "yellowgreen", "violet", "coral"][Math.floor(Math.random()*8)];
            return new Brique(this.canvas, couleur, x, y, L, 15);
        })
        /*Données pour l'animation*/
        document.addEventListener('keypress', e=>{
            if (e.code === 'Space'){
                if (this.pause){
                    this.animation();
                } else {
                    this.stop();
                }
                this.pause = !(this.pause);
            }
        });
        document.addEventListener('keyup', e=>{this.planche.deplacement = 0;});

    }

    animation(intervale){
        this.intervaleId = window.setInterval((t)=>{
            this.effacer();
            /*Balle*/
            this.balle.avancer();
            this.balle.dessiner();
            /*Planche*/
            this.planche.x += this.planche.deplacement;
            this.planche.dessiner();
            this.planche.touche(this.balle);    // Dévie la balle si elle touche la raquette
            /*Dessine les briques*/
            this.briques.forEach((brique, i, a)=>{
                brique.dessiner();
                if (brique.touche(this.balle)){
                    a.splice(i, 1);                 // Détruit une brique si elle est touchée
                }
            });
            /*Fin de la partie*/
            if (this.balle.y > this.canvas.height) this.fin();
        }, intervale);
    }
    
    effacer(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    }
    
    stop(){
        window.clearInterval(this.intervaleId);
    }
    
    fin(){
        this.ctx.font = '40px Arial';
        this.ctx.fillStyle = 'black'
        this.ctx.fillText("Jeu terminé !", 10, 50);
        this.stop();
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
