


var websocket = 0;
var timer = 0;
var socketUrl = "ws://localhost:7007";

function tryConnect(){


    if(websocket!=0 && websocket.readyState == WebSocket.OPEN){
        // connection is good
        console.log("connection is good not trying to reconnect");
        timer = 0;

        return;
    }

    try{
        console.log("trying to connect to websocket");

        websocket = 0;
       
        websocket = new WebSocket(socketUrl);
        setupCallbacks();


        // ws.on('error', function error(msg){
        //     console.log('\x1b[31m%s\x1b[0m', msg)
        // } );


    }catch(error){

    }


    timer = setTimeout(() => {
        tryConnect();
    }, 5000);
}

function setupCallbacks(){

    websocket.onmessage = (event) => {
        console.log(event.data);
    }


    console.log("setup callbacks");
    websocket.on('error', console.error);

    websocket.on('open', function open() {
        console.log("websocket open!");
    });
    
    websocket.on('close', function close() {
        console.log("websocket closed!");
        if(timer==0) tryConnect();
    });
    
    websocket.on('message', function message(data) {
    
       console.log("message from server: " + data);
    
    });
}



function setup(){

    // get the canvas by its id
    var canvas = document.getElementById("canvas");
    createCanvas(canvas.clientWidth, canvas.clientHeight,canvas);
    background(0);
    noStroke();
    tryConnect();
}

function draw(){
    background(0);

    fill(255,255,255,10);

    var radius = 100 + Math.sin(frameCount/10)*10;
    stroke(255,255,255);

    var weight = mouseIsPressed ? 10 : 1;
    if(mouseIsPressed){
        radius = 120;
        //console.log(ws);
        if(websocket) websocket.send(mouseX + "," + mouseY);
    } 
    strokeWeight(weight);
    circle(mouseX, mouseY, radius);
}   

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

  }