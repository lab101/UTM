


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
        
        this.lastActive = Date.now();

        this.counter = 0;
        this.wave = 1;
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


let currentGridIndex = -1;
let lastRender = Date.now();



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
    let gridIndex = -1;
    for(let i = 0; i < grids.length; i++){
        if(grids[i].contains(x,y)){
            gridIndex = i;
            break;
        }
    }

    if(gridIndex != -1 ){
        if(grids[gridIndex].counter < 50){
            grids[gridIndex].counter++;
        }

    }

    return gridIndex;
}

function draw() {
    background(0);

    let now = Date.now();
    let delta = (now - lastRender)/1000;
    lastRender = now;
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
    currentGridIndex = -1;
    // own circle
    if (mouseIsPressed) {
        // stroke(255, 0, 255);
        // strokeWeight(4);
        // snap to grid
        var stepSizeX = innerWidth / 7;
        var stepSizeY = innerHeight / 9;
        var gridX = (Math.floor(mouseX / stepSizeX) +0.55)  * stepSizeX;
        var gridY = (Math.floor(mouseY / stepSizeY) +0.6)  * stepSizeY;
     //   circle(gridX, gridY, 20);
        websocketmanager.send(gridX / innerWidth, gridY / innerHeight)

        var gridIndex = checkIfInGrid(gridX,gridY);
        currentGridIndex = gridIndex;
    

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
        if(gridIndex != -1){
            grids[gridIndex].lastActive = Date.now();
        }
        
        //colorMode(HSB, 100);
        var id = user.id;
        var hue = (id * 20) % 100;

        
        noFill();
        stroke(255,255,255);

        if(user.isActive()){
            //fill(100);
            strokeWeight(10);            
            pushParticles(screenX,screenY,hue);
        }
           
        strokeWeight(4);

       // circle(screenX,screenY, radius);

        
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
        radius = Math.min(radius,4);

        //fill(particles[i].hue,saturation,100,particles[i].lifeTime/400*100);
        fill(255,255,255);
        circle(particles[i].x,particles[i].y,radius);
    }
    noFill();

    // draw the grid
    for(let i = 0; i < grids.length; i++){
        var grid = grids[i];

         if(grid.wave != 0){
        //     stroke(grid.wave*300);
            noStroke();
             fill(grid.wave*100);
             rect(grid.x,grid.y,grid.w,grid.h);
        //   //  fill(0);
        }

        // stroke(255);

        noFill();




        if(grid.counter > 0){        
           grid.counter-= (delta*6);
        }else{
            grid.counter = 0;
        }

            // draw text
            strokeWeight(1);
            stroke(244);
          //  text(grid.counter,grid.x+grid.w/2,grid.y+grid.h/2);
        
          let waveCounter = (grid.counter);

        if(grid.counter > 0){
            let w = map(waveCounter,0,40,2,20);
            w = constrain(w,2,20);

            strokeWeight(w);
    
            let c = map(waveCounter,0,100,200,255);

            stroke(c);
           // noStroke();

            if(Date.now()-grid.lastActive < 10){            
                stroke(255,255,0);
                strokeWeight(8);
            }

            rect(grid.innerX,grid.innerY,grid.innerW,grid.innerH);

            // outer grid
            if(grid.counter > 10){

                let w = map(waveCounter,0,30,1,3);
                w = constrain(w,1,3);

               
                strokeWeight(w);
                let c = map(waveCounter,0,40,240,255);
                
                
                stroke(c);
    
                rect(grid.x,grid.y,grid.w,grid.h);

            }
           
        }

      


     

    }

    //remove dead particles
    for(var i = 0; i < particles.length; i++){
        if(!particles[i].isAlive()){
            particles.splice(i,1);
            i--;
        }
    }


    if(currentGridIndex != -1){
        let grid = grids[currentGridIndex];
        stroke(255,255,0);
        strokeWeight(8);
        rect(grid.x,grid.y,grid.w,grid.h);
    }

    wave()

}


function wave(){
    let now = Date.now()-2000000;
    for(let i = 0; i < grids.length; i++){

        let grid = grids[i];

        let waveX = Math.sin((grid.x)*0.004 + (now/500)) * 0.2;
        let waveY = Math.sin((grid.y)*0.008 + (now/600)) * 0.2;

        let wave = waveX + waveY;
        //wave = Math.abs(wave);
    //    console.log(wave);
       //grid.wave  = Math.pow(wave,3);
       grid.wave = wave;
        // if(grid.counter>=0){
        //     grid.counter *= Math.max(0.5,wave);
        // }
       // grid.counter += wave;
       
    }
   // console.log(now/4000);
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