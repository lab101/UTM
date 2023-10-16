


var websocket = 0;
var timer = 0;
var socketUrl = "ws://utm.lab101.be";


var users = [];

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


function processMessage(txt){
    var incomingData = JSON.parse(txt);
    
    // check if user exists if yes update ohterwise create new
    var found = false;
    for(var i = 0; i < users.length; i++){
        if(users[i].id == incomingData.id){
            users[i].updateData(incomingData.x,incomingData.y);
            found = true;
            break;
        }
    }
    if(!found){
        users.push(new User(incomingData.id,incomingData.x,incomingData.y));
    }

}

function setupCallbacks(){

    websocket.onmessage = (event) => {
       // event.data.text().then(txt => processMessage(txt));   
       processMessage(event.data)
    }

    websocket.onclose = (event) => {
        console.log("websocket closed!");
        if(timer==0) tryConnect();
    }
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


        if(websocket){
            var mouseCoords = {x: mouseX, y: mouseY};
            websocket.send(JSON.stringify(mouseCoords),false);
        }
        // websocket.send('{"x":' + mouseX + ',"y":' + mouseY + '}',false);
    } 
    strokeWeight(weight);
    circle(mouseX, mouseY, radius);


    for(var i = 0; i < users.length; i++){
        var time = users[i].getTimeDiv();
        var radius = 100 - time/100;
        if(radius < 0) radius = 10;
        circle(users[i].x, users[i].y, radius);
    }


}   

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

  }