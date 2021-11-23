class Obstacle {
    constructor(x) {
      this.x = x;
      this.w = 15;
  
      if (mode == "training" && abs(this.x) < xMaxDifficulty) {
        let hRange = round((hMaxObstacle - hMinObstacle) * 0.3);
  
        let hMin = map(abs(x), 0, xMaxDifficulty, hMinObstacle, hMaxObstacle - hRange);
        let hMax = map(abs(x), 0, xMaxDifficulty, hMinObstacle + hRange, hMaxObstacle);
  
        this.h = round(random(hMin, hMax));
      } else if (mode == "singleRun" || (mode == "training" && abs(this.x) >= xMaxDifficulty)) {
        this.h = round(random(hMinObstacle, hMaxObstacle));
      }
    }
  
    visible() {
      if (cam.toScreenX(this.x) < -this.w / 2 || cam.toScreenX(this.x) > width + this.w / 2) {
        return false;
      } else return true;
    }
  
    display() {
      noFill();
      stroke(0, 235, 20, 200);
      strokeWeight(3);
      rect(cam.toScreenX(this.x - this.w / 2), cam.toScreenY(0), this.w, -this.h);
    }
  }