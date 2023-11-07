class Particle{
    constructor(x, y, direction,hue){
        this.x = x;
        this.y = y;
        this.direction = direction;
        // set a random lifetime
        this.lifeTime = random(10,400);
        this.speed = random(0.1,4);
        this.hue = hue;
        //this.lifeTime = ;
    }

    update(){
        this.x += this.direction.x * this.speed; 
        this.y += this.direction.y * this.speed;
        this.lifeTime--;
        this.speed *= 0.99;
    }

    isAlive(){
        return this.lifeTime > 0;
    }
}