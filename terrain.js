class Terrain {
    constructor() {
      this.y = 0;
      this.dMinObstacle = dMinObstacle;
      this.dMaxObstacle = dMaxObstacle;
      this.obstacles = [];
  
      this.init();
    }
  
    reset() {
      this.obstacles = [];
      this.init();
    }
  
    init() {
      for (let i = -perceivedObstacles; i < 0; i++) {
        this.obstacles.push(new Obstacle(i * this.dMaxObstacle));
      }
      for (let i = 1; i <= perceivedObstacles; i++) {
        this.obstacles.push(new Obstacle(i * this.dMaxObstacle));
      }
      if (mode == "training") {
        for (let o of this.obstacles) {
          o.h = hMinObstacle;
        }
      }
    }
  
    update() {
      let lastBall;
      if (mode == "training") {
        lastBall = findLastBall("alive"); //first Ball is focusedBall
      } else if (mode == "singleRun") {
        lastBall = champion;
      }
  
      let maxXObstacle = this.obstacles[this.obstacles.length - 1].x;
      let minXObstacle = this.obstacles[0].x;
  
      let addInFront = false;
      let addBehind = false;
  
      if (focusedBall.loc.x >= this.obstacles[this.obstacles.length - perceivedObstacles].x) {
        addInFront = true;
      }
  
      if (lastBall.loc.x <= this.obstacles[perceivedObstacles - 1].x) {
        addBehind = true;
      }
  
      let dMin, dMax, newX;
      let dRange = round((dMinObstacle - dMaxObstacle) * 0.2);
  
      if (addInFront) {
        if (mode == "training" && abs(maxXObstacle) < xMaxDifficulty) {
          dMin = map(abs(maxXObstacle), 0, xMaxDifficulty, dMaxObstacle - dRange, dMinObstacle);
          dMax = map(abs(maxXObstacle), 0, xMaxDifficulty, dMaxObstacle, dMinObstacle + dRange);
          newX = maxXObstacle + round(random(dMin, dMax));
        } else if (mode == "singleRun" || (mode == "training" && abs(maxXObstacle) >= xMaxDifficulty)) {
          newX = maxXObstacle + round(random(dMinObstacle, dMaxObstacle));
        }
        this.obstacles.push(new Obstacle(newX));
      }
  
      if (addBehind) {
        if (mode == "training") {
          if (abs(minXObstacle) > xMaxDifficulty) {
            dMin = dMinObstacle;
            dMax = dMinObstacle + dRange;
          } else {
            dMin = map(abs(minXObstacle), 0, xMaxDifficulty, dMaxObstacle - dRange, dMinObstacle);
            dMax = map(abs(minXObstacle), 0, xMaxDifficulty, dMaxObstacle, dMinObstacle + dRange);
          }
          newX = minXObstacle - round(random(dMin, dMax));
        } else if (mode == "singleRun") {
          newX = minXObstacle - round(random(dMinObstacle, dMaxObstacle));
        }
        this.obstacles.unshift(new Obstacle(newX));
      }
    }
  
    display() {
      // obstacles
      for (let o of this.obstacles) {
        if (o.visible()) {
          o.display();
        }
      }
  
      // ground
      noStroke();
      fill(15);
      rect(0, cam.toScreenY(this.y), width, cam.toScreenY(-cam.offset.y));
      stroke(255);
      strokeWeight(1);
      line(0, cam.toScreenY(this.y), width, cam.toScreenY(this.y));
  
      // zero mark
      stroke(255);
      strokeWeight(2);
      line(cam.toScreenX(0), cam.toScreenY(0), cam.toScreenX(0), cam.toScreenY(20));
      strokeWeight(1);
      stroke(255, 50);
      line(cam.toScreenX(0), cam.toScreenY(0), cam.toScreenX(0), 0);
  
      // display marks
      let xMarkMin = round(cam.visXMin / 100) * 100;
      let xMarkMax = round(cam.visXMax / 100) * 100;
  
      for (let i = xMarkMin; i <= xMarkMax; i += 100) {
        if (i != 0) {
          noStroke();
          fill(255);
          textSize(14);
          textAlign(CENTER, CENTER);
          text(i, cam.toScreenX(i), cam.toScreenY(15));
  
          stroke(255);
          strokeWeight(1);
          line(cam.toScreenX(i), cam.toScreenY(0), cam.toScreenX(i), cam.toScreenY(5));
        }
      }
    }
  }