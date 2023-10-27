

var websocket = 0;
var timer = 0;

var socketUrl = "ws://utm.lab101.be";
var websocketmanager = new WebSocketManager(socketUrl);
// particle array
var particles = [];

function setup() {

    // get the canvas by its id
    var canvas = document.getElementById("canvas");
    createCanvas(canvas.clientWidth, canvas.clientHeight, canvas);
    background(0);
}

function draw() {
    background(0);

    // own circle
    if (mouseIsPressed) {
        radius = 120;
        websocketmanager.send(mouseX / innerWidth, mouseY / innerHeight)
        stroke(255, 0, 0);
        strokeWeight(4);
        circle(mouseX, mouseY, radius);

    }

    // other circles    
    for (var i = 0; i < websocketmanager.users.length; i++) {
        var user = websocketmanager.users[i];
        var time = user.getTimeDiv();
        var radius = 100 - time / 100;
        if (radius < 0) radius = 10;

        var screenX = innerWidth * user.x;
        var screenY = innerHeight * user.y;

        colorMode(HSB, 100);
        var id = user.id;
        var hue = (id * 2) % 100;

        
        noFill();
        stroke(hue,20,100);

        if(user.isActive()){
            //fill(100);
            strokeWeight(10);            
            pushParticles(screenX,screenY);
        }
           
        strokeWeight(4);

        circle(screenX,screenY, radius);
    }

    for(var i = 0; i < particles.length; i++){
      //  console.log(particles[i]);
        particles[i].update();
        strokeWeight(1);
        noStroke();
        fill(100,0,100,particles[i].lifeTime/400*100);
        circle(particles[i].x,particles[i].y,4);
    }
    noFill();

    //remove dead particles
    for(var i = 0; i < particles.length; i++){
        if(!particles[i].isAlive()){
            particles.splice(i,1);
            i--;
        }
    }

    // write text that prints hallo in a loop
    


}


function pushParticles(x,y){
   // console.log("push particles");
    var rndX = random(-1,1);
    var rndY = random(-1,1);
    var direction = createVector(rndX,rndY);

    x += direction.x*60;
    y += direction.y*60;

    // normalize the direction vector
    direction.normalize();
    particles.push(new Particle(x,y,direction));
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

}