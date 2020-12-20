var points = [];
var font;
var middle;
var oldDisplayText;
var oldTSize;

var activateColors = true;
var pointSize = 8;
var tSize = 350;
var force = 300;
var distancePower = 1.4;
var lerping = 0.21;
var displayText = "Hello!";

function preload() {
  font = loadFont("cubic.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);
  textSize(tSize);
  textFont(font);
  colorMode(HSB);
  middle = createVector(width / 2, height / 2);
  let ps = font.textToPoints(
    displayText,
    width / 2 - textWidth(displayText) / 2,
    height / 2 + tSize / 2,
    tSize
  );
  for (let p of ps) {
    points.push(
      new Point(
        createVector(random(width), random(height)),
        createVector(p.x, p.y)
      )
    );
  }

  let gui = createGui("options", 50, 0);
  sliderRange(50, 1000, 50);
  gui.addGlobals("force");
  sliderRange(0.1, 0.5, 0.05);
  gui.addGlobals("lerping");
  sliderRange(1, 2, 0.1);
  gui.addGlobals("distancePower");
  gui.addGlobals("displayText");
  sliderRange(50, 1000, 50);
  gui.addGlobals("tSize");
  sliderRange(3, 15, 1);
  gui.addGlobals("pointSize");
  gui.addGlobals("activateColors");
}

function draw() {
  background(0);
  stroke(255);
  if (!(oldTSize == tSize && oldDisplayText == displayText)) {
    setWord();
  }

  push();
  for (let p of points) {
    p.update();
    p.draw();
  }
  pop();

  if (mouseIsPressed) {
    let v = createVector(mouseX, mouseY);
    for (let p of points) {
      p.addForce(v);
    }
  }
}

function setWord() {
  oldTSize = tSize;
  oldDisplayText = displayText;

  textSize(tSize);
  let ps = font.textToPoints(
    displayText,
    width / 2 - textWidth(displayText) / 2,
    height / 2 + tSize / 2,
    tSize
  );

  for (let pi in ps) {
    let p = ps[pi];
    if (pi < points.length) {
      points[pi].setTarget(createVector(p.x, p.y));
    } else {
      if (points.length) {
        points.push(
          new Point(random(points).pos.copy(), createVector(p.x, p.y))
        );
      } else {
        points.push(
          new Point(
            p5.Vector.random2D().setMag(middle.mag()),
            createVector(p.x, p.y)
          )
        );
      }
    }
  }
  for (let pi = ps.length; pi < points.length; pi++) {
    points.splice(ps.length, points.length);
  }
}

class Point {
  constructor(pos, target) {
    this.pos = pos;
    this.target = target;
    this.vel = createVector(0, 0);
    this.color = this.target.dist(middle);
  }

  update() {
    this.vel.lerp(p5.Vector.sub(this.target, this.pos), lerping);
    this.pos.add(this.vel);
  }

  addForce(vec) {
    let d = vec.dist(this.pos);
    let v = p5.Vector.sub(this.pos, vec).mult(
      (1 / pow(d, distancePower)) * force
    );
    this.vel.add(v);
  }

  draw() {
    push();
    noStroke();
    fill(activateColors ? this.color % 360 : 0, 100, 100);
    ellipse(this.pos.x, this.pos.y, pointSize);
    pop();
  }

  setTarget(vec) {
    this.target = vec;
  }
}
