


class HitBox {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.innerX = 0;
        this.innerY = 0;
        this.innerW = 0;
        this.innerH = 0;
     

        this.counter = 0;
    }

    setInner(){
        this.innerX = this.x + (this.w * 0.25);
        this.innerY = this.y + (this.h * 0.25);
        this.innerW = this.w * 0.5;
        this.innerH = this.h * 0.5;
    }

    contains(x, y) {
        return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
    }
}

var websocket = 0;
var timer = 0;

var socketUrl = "wss://grid.lab101.be";
var websocketmanager = new WebSocketManager(socketUrl);
// particle array
var particles = [];

var grids = [];

var gridImage;





function preload() {
    gridImage = loadImage('grid.png');
}

function resize() {
    resizeCanvas(windowWidth, windowHeight);
    console.log("resized");
    //grids = [];
    let i = 0;
    for(let row = 0; row < 9; row++){
        for(let col = 0; col < 7; col++){
            let x = col*innerWidth/7 + (innerWidth/7 * 0.17);
            let y = row*innerHeight/9 + (innerHeight/9 * 0.21);
            let width = innerWidth/7 * 0.83;
            let height = innerHeight/9 * 0.83;
            var hitBox = new HitBox(x,y,width,height);
            
            grids[i].x = x;
            grids[i].y = y;
            grids[i].w = width;
            grids[i].h = height;

            grids[i].setInner();
            i++;
            
            //grids.push(hitBox);
        }
    }
}    

function setup() {

    // document resize
window.addEventListener('resize', function(event){
    resize();

});
    // get the canvas by its id
    var canvas = document.getElementById("canvas");
    createCanvas(canvas.clientWidth, canvas.clientHeight, canvas);
    background(0);

    for(let row = 0; row < 9; row++){
        for(let col = 0; col < 7; col++){
            let x = col*innerWidth/7 + (innerWidth/7 * 0.17);
            let y = row*innerHeight/9 + (innerHeight/9 * 0.21);
            let width = innerWidth/7 * 0.83;
            let height = innerHeight/9 * 0.83;
            var hitBox = new HitBox(x,y,width,height);
            hitBox.setInner();
            grids.push(hitBox);
        }
    }

   // gridImage.src = "/grid.png";
}

function checkIfInGrid(x,y){
    for(let i = 0; i < grids.length; i++){
        if(grids[i].contains(x,y)){
            return i;
        }
    }
    return -1;
}

function draw() {
    background(0);
// draw the grid image

    // get parameters from the url
    var url = new URL(window.location.href);
    var debug = url.searchParams.get("debug");
    if(debug){
        

        if(gridImage){
            fill(255);
           // console.log("draw grid");
            image(gridImage,0,0,innerWidth,innerHeight);
        }
    }
    // own circle
    if (mouseIsPressed) {
        stroke(255, 0, 255);
        strokeWeight(4);
        // snap to grid
        var stepSizeX = innerWidth / 7;
        var stepSizeY = innerHeight / 9;
        var gridX = (Math.floor(mouseX / stepSizeX) +0.55)  * stepSizeX;
        var gridY = (Math.floor(mouseY / stepSizeY) +0.6)  * stepSizeY;
        circle(gridX, gridY, 20);
        websocketmanager.send(gridX / innerWidth, gridY / innerHeight)

        var gridIndex = checkIfInGrid(gridX,gridY);
        if(gridIndex != -1){
            if(grids[gridIndex].counter < 20){
                grids[gridIndex].counter++;
            }
        }

    }

    // other circles    
    for (var i = 0; i < websocketmanager.users.length; i++) {
        var user = websocketmanager.users[i];
        var time = user.getTimeDiv();

        if (time > 100) {
            continue;
        }
        var radius = 50 - time / 100;
        if (radius < 0) radius = 10;

        var screenX = innerWidth * user.x;
        var screenY = innerHeight * user.y;

        var gridIndex = checkIfInGrid(screenX,screenY);
        if(gridIndex != -1 ){
            if(grids[gridIndex].counter < 20){
                grids[gridIndex].counter++;
            }

        }

        colorMode(HSB, 100);
        var id = user.id;
        var hue = (id * 20) % 100;

        
        noFill();
        stroke(hue,60,100);

        if(user.isActive()){
            //fill(100);
            strokeWeight(10);            
            pushParticles(screenX,screenY,hue);
        }
           
        strokeWeight(4);

        circle(screenX,screenY, radius);

        
    }

    for(var i = 0; i < particles.length; i++){
      //  console.log(particles[i]);
        particles[i].update();
        strokeWeight(1);
        noStroke();
        var lifetime = particles[i].lifeTime;
        var saturation = map(lifetime,0,100,0,80);
        saturation = Math.min(saturation,80);
        var radius = map(lifetime,0,100,0,2);
        radius = Math.min(radius,2);

        //fill(particles[i].hue,saturation,100,particles[i].lifeTime/400*100);
        fill(255,0,255);
        circle(particles[i].x,particles[i].y,radius);
    }
    noFill();

    // draw the grid
    for(let i = 0; i < grids.length; i++){
        stroke(255);

        if(grids[i].counter > 0){
           grids[i].counter-=0.02;
        }

        if(grids[i].counter > 0){
            var grid = grids[i];
            let w = map(grids[i].counter,0,40,1,15);
            if(w > 15){
                w = 15;
            }
            strokeWeight(w);
    
            let c = map(grids[i].counter,0,100,40,255);
            stroke(c);

            rect(grid.innerX,grid.innerY,grid.innerW,grid.innerH);

            if(grid.counter > 10){

                let w = map(grids[i].counter,0,30,0.5,2);
                if(w > 2){
                    w = 2;
                }
                strokeWeight(w);
                let c = map(grids[i].counter,0,40,40,255);
                stroke(c);
    
                rect(grid.x,grid.y,grid.w,grid.h);

            }
            // draw text
            strokeWeight(1);
           // text(grid.counter,grid.x+grid.w/2,grid.y+grid.h/2);
        }

    }

    //remove dead particles
    for(var i = 0; i < particles.length; i++){
        if(!particles[i].isAlive()){
            particles.splice(i,1);
            i--;
        }
    }

    // write text that prints hallo in a loop
    


}


function pushParticles(x,y,hue){
   // console.log("push particles");
    var rndX = random(-1,1);
    var rndY = random(-1,1);
    var direction = createVector(rndX,rndY);

    x += direction.x*60;
    y += direction.y*60;

    // normalize the direction vector
    direction.normalize();
    particles.push(new Particle(x,y,direction,hue));
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

}