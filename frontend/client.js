function setup(){

    // get the canvas by its id
    var canvas = document.getElementById("canvas");
    createCanvas(canvas.clientWidth, canvas.clientHeight,canvas);
    background(0);
    noStroke();
}

function draw(){
    fill(255,255,255,10);

    ellipse(mouseX, mouseY, 20, 20);
}   