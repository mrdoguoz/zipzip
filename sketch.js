
perceivedObstacles = 2;
maxSpeed = 8;

total = 100;

maxTrainingTime = 9000;
xMaxDifficulty = 10000;

hMaxObstacle = 120;
hMinObstacle = 20;
dMinObstacle = 150;
dMaxObstacle = 450;

function setup() {
  mode = "training";
  //mode = "singleRun"; iptal
  displayBrain = true;
  paused = false;

  createCanvas(700, 550);
  sliderSimSpeed = createSlider(1, 100, 1);

  tempHighscore = 0;
  highscore = 0;
  scores = [0];

  logFrameRate = [];
  avgFrameRate = frameRate();

  cam = new Camera(createVector(width / 2, height / 2), createVector(0, -80));
  //console.log(createVector(width / 2, height / 2)) x: 350 y: 275 z: 0
  //console.log(createVector(0, -80)) x: 0 y: -80 z: 0 
  terrain = new Terrain();
  ga = new geneticAlgorithm();
  balls = [];
  for (let i = 0; i < total; i++) {
    balls[i] = new Ball();
  }

  ballsAlive = total;
  trainingTimer = maxTrainingTime;
}

function draw() {
  if (!paused && (focused || frameCount <= 1)) {
    for (let i = 0; i < sliderSimSpeed.value(); i++) {
      handleBalls();
      terrain.update();
      cam.update();
    }
    updateFrameRate();
  }
  displayAll();
}