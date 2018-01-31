var rockets = [];
var last = 0;
var player;
var rWidth = 80;
var rHeight = 30;
var fraction = 0.98;
var MAX_LOAD = 255;
var particles = [];
var begin;
var paused = 0;

var minTime = 500;
var maxTime = 800;
var minRocketSpeed = 10
var maxRocketSpeed = 10;
var particleAmount = 1;


function setup() {
	rectMode(CENTER)
	ellipseMode(RADIUS)
	createCanvas(windowWidth-250, windowHeight);
	player = new Player(mouseX,mouseY);
	begin = millis()


	gui = createGui('options',width+50,0)
	sliderRange(50,10000,50)
	gui.addGlobals('minTime','maxTime')
	sliderRange(5,100,5)
	gui.addGlobals('minRocketSpeed','maxRocketSpeed')
	sliderRange(0,30,1)
	gui.addGlobals('particleAmount')
}

function draw() {

	background(0)
	stroke(255)

	if(mouseX <= width){
		player.update()
	}
	player.draw()

	if(millis() > last){ //add rocket
		last = millis() + random(minTime,maxTime)
		rockets.push(new Rocket())
	}

	for(var r = 0; r < rockets.length; r++) {
		rockets[r].update()
		rockets[r].draw()

		if(player.checkHit(rockets[r])) {
			push()
			colorMode(HSB)
			stroke(0,100,100)
			strokeWeight(5)
			//line(0,0,width,height)
			//line(width,0,0,height)
			fill(255)
			textSize(32);
			text(ceil((millis()-begin)/1000),132,32)
			fill(255,0,0)
			pop()
			noLoop();
			//reset game when lost
			setTimeout(reset,1000)
			return
		}else{
			for(i in rockets){
				if(r != i){
					if(rockets[r].collision(rockets[i])){
						var ma = max(r,i)
						var mi = min(r,i)
						//draw particles for explosion
						if(particleAmount != 0){
							particles.push(new Particle(p5.Vector.add(rockets[i].p,p5.Vector.sub(rockets[r].p,rockets[i].p).mult(0.5))))
						}
						rockets.splice(ma,1)
						rockets.splice(mi,1)
						r--;
						break
					}

				}
			}
			if(rockets[r] && rockets[r].wallCollision()){
				particles.push(new Particle(rockets[r].p.copy()))
				rockets.splice(r,1)
				r--;
				break
			}
		}
	}

	for(var i = 0; i < particles.length; i++){
		if(particles[i].lifespan){
			particles[i].draw();
		}else{
			particles.splice(i,1)
			i--;
		}
	}

	push()
	fill(255)
	textSize(32);
	text(ceil((millis()-begin)/1000),132,32)
	pop()
}

function reset() {
	last = 0
	rockets = [];
	player = new Player(mouseX,mouseY);
	particles = [];
	begin = millis();
	loop()
}

function keyPressed() {
  if (keyCode === 32) {
    if(paused == 0){
    	noLoop();
    	paused = millis() - begin;
    }else{
    	console.log(begin,millis())
    	begin = millis() - paused;
    	paused = 0;
    	loop();
    }
  }
}

class Rocket {
	constructor() {
		var x = width*random();
		var y = height*random();
		while(createVector(x,y).dist(player.p) < 250){
			x = width*random();
			y = height*random();
		}

		this.p = createVector(x,y);
		this.v = createVector(random(minRocketSpeed,maxRocketSpeed),0);
		this.load = 55;
		this.angle = 0;
		this.flying = false;
	}

	update() {
		if(!this.flying){
			this.angle = atan2(mouseY-this.p.y,mouseX-this.p.x)
			this.load += random(1,10)/this.v.mag() * 10;
			if(this.load >= MAX_LOAD){
				this.flying = true;
			}
		}else{
			if(this.load >= MAX_LOAD){
				this.load = 55
				this.v.rotate(this.angle)
			}
			push()
			this.p.add(this.v)
			this.v.mult(fraction)
			pop()

			if(this.v.mag() == 0){
				this.flying = false;
			}
		}




	}

	draw() {
		push()
		fill(this.load)
		translate(this.p.x,this.p.y);
		rotate(this.angle)
		rect(0,0,rWidth,rHeight)
		pop()
	}

	collision(r) {
		var distX = Math.abs(this.p.x - r.p.x);
	    var distY = Math.abs(this.p.y - r.p.y);

	    if (distX > (rWidth)) {
	        return false;
	    }
	    if (distY > (rHeight)) {
	        return false;
	    }

	    if (distX <= (rWidth/2)) {
	        return true;
	    }
	    if (distY <= (rHeight/2)) {
	        return true;
	    }

	    var dx = distX;
	    var dy = distY;

	    return (dx * dx + dy * dy <= (rWidth*rHeight));
	}

	wallCollision() {
		return (this.p.x < 0 || this.p.x > width || this.p.y < 0 || this.p.y > height)

	}

}

class Player {
	constructor(x,y) {
		this.p = createVector(x,y)
		this.radius = 10
	}

	update() {
		this.p.x = mouseX;
		this.p.y = mouseY;
	}

	draw() {
		ellipse(this.p.x,this.p.y,this.radius);

	}

	checkHit(r){
		var p = this.p.copy()
		var angle = -(r.angle);
		//rotate the circle, so the rotation of the rocket is neglected
		p.set(cos(angle) * (p.x - r.p.x) - sin(angle) * (p.y - r.p.y) + r.p.x,
			  sin(angle) * (p.x - r.p.x) + cos(angle) * (p.y - r.p.y) + r.p.y)


		var distX = abs(p.x - r.p.x);
	    var distY = abs(p.y - r.p.y);


	    if (distX > (rWidth / 2 + this.radius)) {
	        return false;
	    }
	    if (distY > (rHeight / 2 + this.radius)) {
	        return false;
	    }

	    if (distX <= (rWidth/2 + this.radius)) {
	        return true;
	    }
	    if (distY <= (rHeight/2 + this.radius)) {
	        return true;
	    }

	    var dx = distX;
	    var dy = distY;

	    return (dx * dx + dy * dy <= (this.radius * this.radius));
	}

}

class Particle {
	constructor(pos) {
		this.p = pos;
		this.lifespan = 255;
		this.particles = [];
		for(var i = 0; i < particleAmount; i++){
			//position, velocity
			this.particles.push([this.p.copy(),createVector(random(-1,1),random(-1,1)).mult(3*particleAmount)])
		}
	}

	draw() {
		if(this.lifespan > 50){
			this.lifespan-= 0.2;
			push()
			noStroke()
			for(var p of this.particles) {
				p[0].add(p[1])
				p[1].mult(fraction)
				fill(color('rgba(255,0,0,'+1/(256-this.lifespan)+')'))
				ellipse(p[0].x,p[0].y,15)
			}
			pop()
		}else{
			this.lifespan = 0;
		}

	}
}