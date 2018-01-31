var radius = 15;
var angle = 175.5;
var decreaseAngle = 0;
var len = 0.251;
var time = 1;
var enableStroke = true;

function setup() { 
	createCanvas(windowWidth, windowHeight);
	background(0);
	colorMode(HSB);
	angleMode(DEGREES);


	gui = createGui('Reset with <space>',50,0)
	sliderRange(5,50,5)
	gui.addGlobals('radius')
	sliderRange(175,176,0.01)
	gui.addGlobals('angle')
	sliderRange(0.1,1,0.01)
	gui.addGlobals('len')
	sliderRange(0,0.1,0.0001)
	gui.addGlobals('decreaseAngle')
	gui.addGlobals('enableStroke')
} 

function draw() { 
	if(enableStroke){
		stroke(0)
	}else{
		noStroke()
	}
	if(time*len + radius/2 <= createVector(width/2,height/2).mag()) {
		let a = angle - decreaseAngle*(time-1);
		translate(width/2,height/2);
		fill(time%361,100,100)
		var x = cos(time*a)*time*len;
		var y = sin(time*a)*time*len;

		ellipse(x,y,radius);
	}else{
		noLoop()
	}
	time++;
}

function keyPressed(){
	if(keyCode == 32) { //space resets
		background(0)
		time = 1;
		loop()
	}
}