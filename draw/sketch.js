var drawing = false;
var sketch;
var time = 0;
var mouseDown = false;

var cursors = 4;
var lineColor = 0
var fraction = 0.93
var symmetry = false
var spiral = false
var lineWidth = 3
var pointDistance = 50;


function setup() {
	createCanvas(windowWidth-250, windowHeight);
	colorMode(HSB)
	stroke(255)

	gui = createGui('p5.gui',width+50,0)
	sliderRange(1,100,1)
	gui.addGlobals('cursors')
	sliderRange(0,320,5)
	gui.addGlobals('lineColor')
	sliderRange(0.8,0.999,0.001)
	gui.addGlobals('fraction')
	sliderRange(1,30,1)
	gui.addGlobals('lineWidth')
	sliderRange(5,200,5)
	gui.addGlobals('pointDistance')
	gui.addGlobals('symmetry','spiral')


	sketch = new Sketch()
}

function draw() {
	background(0)
	translate(width/2,height/2)
	if(mouseDown && time < millis()) {
		sketch.addLine(mouseX-width/2,mouseY-height/2,pmouseX-width/2,pmouseY-height/2)
		time = millis() + pointDistance
	}

	sketch.draw()
	var x = mouseX-width/2
	var y = mouseY-height/2
	for(var j = 0; j < (spiral?4:1); j++,x *= (0.67),y *= (0.67)){
		for(var pi = 0;pi < TWO_PI; pi += TWO_PI/cursors){

			push()	
			fill('rgba(255,255,255,0.7)')
			strokeWeight(lineWidth)

			rotate(pi)
			point(x,y)
			symmetry && point(-x,y)

			pop()
		}
	}
	drawing = mouseDown;
}


function keyPressed() {
	if(keyCode == 32) {
		sketch = new Sketch()
	}
}

function mousePressed() {
	if(!(mouseX > width || mouseY > height || mouseX < 0 || mouseY < 0)){
		mouseDown = true;
	}else{
		mouseDown = false;
	}
}


function mouseReleased() {
	mouseDown = false;
}


class Sketch {
	constructor() {
		this.lines = [];
		this.points = [];
	}

	//mouseX mouseY pmouseX pmouseY
	addLine(mx,my,pmx,pmy) {
		if(drawing && this.points.length) {
			//i1 i2 color cursors symmetry spiral
			this.lines.push([this.points.length-1,this.points.length,lineColor+this.points[this.points.length-1].v.mag()*4,cursors,symmetry,spiral,lineWidth]);
		}
			
		var v = createVector(pmx-mx,pmy-my)
		this.points.push(new Point(mx,my,v.mult(-0.1)))
	}

	draw() {
		for(let l of this.lines) {
			push()
			stroke(l[2],100,100) //color
			strokeWeight(l[6])
			var p1 = this.points[l[0]].p.copy();
			var p2 = this.points[l[1]].p.copy();
			//spiral
			for(var j = 0; j < ((l[5])?4:1); j++,p1.mult(0.67),p2.mult(0.67)){
				for(let i = 0; i < l[3]; i++){ //draw each cursors lines
					let pi = i * TWO_PI/l[3]
					push()
					rotate(pi)
					line(p1.x,p1.y,p2.x,p2.y)
					//if symmetry enabled
					l[4] && line(-p1.x,p1.y,-p2.x,p2.y)
					pop()
				}
			}
			pop()
		}

		for(let p of this.points) {
			p.update()
		}

	}
}

class Point {
	constructor(x,y,v) {
		this.p = createVector(x,y)

		this.v = v.limit(10)
	}

	update() {
		this.p.add(this.v)
		this.v.mult(fraction)
	}

}