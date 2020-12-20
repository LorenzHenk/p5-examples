var scaling = 5;
var probability = 0.5;

var x = 0;
var y = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  colorMode(HSB);

  var gui = createGui("reset with <space>", 50, 0);
  sliderRange(0, 1, 0.1);
  gui.addGlobals("probability");
  sliderRange(2, 50, 1);
  gui.addGlobals("scaling");
}

function draw() {
  stroke(dist(x, y, width / 2, height / 2) % 360, 100, 100);
  if (random(0, 1) < probability) {
    line(x, y, x + scaling, y + scaling);
  } else {
    line(x, y + scaling, x + scaling, y);
  }
  x += scaling;
  if (x >= width) {
    x = 0;
    y += scaling;
  }
  if (y >= height) {
    noLoop();
  }
}

function keyPressed() {
  if (keyCode == 32) {
    background(0);
    x = 0;
    y = 0;
  }
}
