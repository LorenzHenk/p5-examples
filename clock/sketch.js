var radius
var w = 25


function setup() {
	createCanvas(windowWidth, windowHeight)
	colorMode(HSB)
	angleMode(DEGREES)
	rectMode(CENTER)
	radius = min(width,height)/3
}

function draw() {
	background(0)
	translate(width/2,height/2)
	rotate(-90)

	textSize(w-5)
	strokeWeight(w)
	stroke(255)
	noFill()

	//seconds
	let sc = second()
	let sa = map(sc,0,60,0.001,360)
	stroke(0,100,100)
	push()
	rotate(sa)
	line(0,0,radius*0.8,0)
	noStroke()
	fill(0)
	translate(radius*0.8,0)
	rotate(-90)
	text((sc < 10)?"0"+sc:sc,0,0,w,w)
	pop()
	arc(0,0,radius*2,radius*2,0,sa)

	//minutes
	let mi = minute()
	let ma = map(mi+sa/360,0,60,0.001,360)
	stroke(100,100,100)
	push()
	rotate(ma)
	line(0,0,radius*0.8*0.8,0)
	noStroke()
	fill(0)
	translate(radius*0.8*0.8,0)
	rotate(-90)
	text((mi < 10)?"0"+mi:mi,0,0,w,w)
	pop()
	arc(0,0,radius*2+2*w,radius*2+2*w,0,ma)

	//hours
	let hr = hour()
	let ha = map((hr+ma/360)%12,0,12,0.001,360)
	stroke(200,100,100)
	push()
	rotate(ha)
	line(0,0,radius*0.8*0.8*0.8,0)
	noStroke()
	fill(0)
	translate(radius*0.8*0.8*0.8,0)
	rotate(-90)
	text((hr < 10)?"0"+hr:hr,0,0,w,w)
	pop()
	arc(0,0,radius*2+4*w,radius*2+4*w,0,ha)

	pastClockSetup();
}

function pastClockSetup() {
	//lines on circle
	push()
	stroke(0)
	strokeWeight(2)
	let pos = createVector(radius-w/3*2+3,0)
	let pos2 = pos.copy().setMag(pos.mag()+1*w)
	for(let i = 0; i < 12; i++) {
		
		line(pos.x,pos.y,pos2.x,pos2.y)
		rotate(360/12)
	}

	pop()

	//black point in the middle
	push()
	stroke(255)
	strokeWeight(w+2)
	point(0,0)
	pop()
}

function windowResized() { //resize the clock
  resizeCanvas(windowWidth, windowHeight)
  radius = min(width,height)/3
}