class Ball {
    constructor(brain) {
      this.d = 20;
  
      this.acc = createVector();//https://p5js.org/reference/#/p5.Vector
      this.vel = createVector();
      this.loc = createVector(0, terrain.y - this.d / 2);
  
      this.oldLocs = []; // helps to determine if ball is stuck
  
      this.maxBoost = 0.8; //maksimum Güçlendirme
      this.friction = 0.01;//sürtünme
      this.maxJumpForce = 12; //atlama gücü
      this.grav = 0.35; //yer çekimi
  
      this.alive = true;
  
      if (brain) {
        this.brain = brain;
      } else {
        this.brain = new NeuralNetwork([3, 7, 5]);
      }
  
      this.score = 0;
      this.fitness = 0;
  
      this.focused = false;
      this.inputs = [];
      this.outputs = [];
  
      // for evaluation of jumps
      this.totalJumpHeight = 0;
      this.nJumps = 0;
      this.jumpCounted = false;
      this.nJumpedObstacles = 0;
      this.totalHeightJumpedObstacles = 0;
      this.nextObstacle = undefined;
    }
  
    reset() {
      this.acc.mult(0);
      this.vel.mult(0);
      this.loc.set(0, terrain.y - this.d / 2);
      this.oldLocs = [];
      this.alive = true;
      this.score = 0;
      this.fitness = 0;
      this.jumpTimer = 0;
      this.focused = false;
      this.inputs = [];
      this.outputs = [];
  
      // for evaluation of jumps
      this.totalJumpHeight = 0;
      this.nJumps = 0;
      this.jumpCounted = false;
      this.nJumpedObstacles = 0;
      this.totalHeightJumpedObstacles = 0;
      this.nextObstacle = undefined;
    }
  
    act() {
      this.perceive();
      if (this.focused) this.storeInputs();
      this.think();
      this.update();
    }
  
    perceive() {
      let obstacleRight1 = this.findObstacleToRight();
  
      let obstacleRight1DX = (obstacleRight1.x - this.loc.x) / dMaxObstacle;
      let obstacleRight1H = obstacleRight1.h / hMaxObstacle;
  
      let inAir;
      if (this.inAir()) inAir = -1;
      else if (!this.inAir()) inAir = 1;
  
      this.inputs = [];
      this.inputs.push(this.vel.x / maxSpeed);
      this.inputs.push(obstacleRight1H);
      this.inputs.push(obstacleRight1DX);
    }
  
    think() {
      // outputs: left, right, driveForce, jump, jumpforce
      this.outputs = this.brain.guess(this.inputs);
    }
  
    storeInputs() {
      this.brain.inputs = this.inputs
    }
  
    move(dir, force) {
      switch (dir) {
        case "left":
          this.acc.add(createVector(-this.maxBoost * abs(force), 0));
          break;
        case "right":
          this.acc.add(createVector(this.maxBoost * abs(force), 0));
          break;
      }
    }
  
    jump(force) {
      this.acc.y -= this.maxJumpForce * force;
      this.jumpTimer = this.maxJumpTimer;
      this.jumpCounted = false;
  
      let preCalcVelX = this.preCalcVelX();
  
      // for jump analysis
      if (preCalcVelX > 0) {
        this.nextObstacle = this.findObstacleToRight();
      }
      if (preCalcVelX < 0) {
        this.nextObstacle = this.findObstacleToLeft();
      }
      if (preCalcVelX == 0) {
        this.nextObstacle = undefined;
      }
    }
  
    update() {
      this.focused = false;
      if (!this.inAir()) {
        if (this.outputs[0] > this.outputs[1]) {
          this.move("left", this.outputs[2]);
        } else if (this.outputs[1] > this.outputs[0]) {
          this.move("right", this.outputs[2]);
        }
      }
      if (!this.inAir()) {
        if (this.outputs[3] >= 0.5) {
          this.jump(this.outputs[4]);
        }
      }
  
      this.updateKin();
  
      if (this.inAir()) {
        this.analyzeJump();
      }
      this.checkFloor();
      this.checkCollision();
      this.jumpTimer--;
  
      if (mode == "training") {
        this.checkIfStuck();
        this.checkIfWrong();
      }
    }
  
    analyzeJump() {
      if (this.vel.x > 0) {
        if (this.nextObstacle.x < this.loc.x) {
          this.nJumpedObstacles++;
          this.totalHeightJumpedObstacles += this.nextObstacle.h;
          this.nextObstacle = this.findObstacleToRight();
        }
      } else if (this.vel.x < 0) {
        if (this.nextObstacle.x > this.loc.x) {
          this.nJumpedObstacles++;
          this.totalHeightJumpedObstacles += this.nextObstacle.h;
          this.nextObstacle = this.findObstacleToLeft();
        }
      }
      if (!this.jumpCounted) {
        if (this.vel.y > 0) {
          this.jumpCounted = true;
          this.totalJumpHeight += (abs(this.loc.y) - this.d / 2);
          this.nJumps++;
        }
      }
    }
  
    checkIfStuck() {
      // checks if ball moves too slowly
      this.oldLocs.push(this.loc.x);
      if (this.oldLocs.length > 600) {
        this.oldLocs.splice(0, 1);
  
        if (abs(this.loc.x - this.oldLocs[0]) < 500) {
          this.die();
        }
      }
    }
  
    checkIfWrong() {
      // check if ball is moving too far to left
      if (trainingTimer < maxTrainingTime * 0.95) {
        if (this.loc.x < 500) {
          this.die();
        }
      }
    }
  
    preCalcVelX() {
      let velX = this.vel.copy().x + this.acc.copy().x;
  
      velX *= (1 - this.friction);
      if (velX > maxSpeed) {
        velX = maxSpeed;
      } else if (velX < -maxSpeed) {
        velX = -maxSpeed;
      }
      return velX;
    }
  
    updateKin() {
      this.vel.add(this.acc);
      this.vel.y += this.grav;
      this.vel.x *= (1 - this.friction);
  
      if (this.vel.x > maxSpeed) {
        this.vel.x = maxSpeed;
      } else if (this.vel.x < -maxSpeed) {
        this.vel.x = -maxSpeed;
      }
  
      this.acc.mult(0);
      this.loc.add(this.vel);
    }
  
    die() {
      this.alive = false;
      ballsAlive--;
    }
  
    checkCollision() {
      let testX = this.loc.x;
      let testY = this.loc.y;
      let oX;
      let oY;
      let oW;
      let oH;
      let distX;
      let distY;
      let dist;
  
      for (let i = 0; i < terrain.obstacles.length; i++) {
        testX = this.loc.x;
        testY = this.loc.y;
  
        oX = terrain.obstacles[i].x;
        oW = terrain.obstacles[i].w;
        oH = terrain.obstacles[i].h;
  
        if (this.loc.x < oX - oW / 2) {
          testX = oX - oW / 2; // left edge
        } else if (this.loc.x > oX + oW / 2) {
          testX = oX + oW / 2; // right edge
        }
  
        if (this.loc.y < -oH) {
          testY = -oH; // top edge
        }
  
        distX = this.loc.x - testX;
        distY = this.loc.y - testY;
        dist = sqrt(sq(distX) + sq(distY));
  
        if (dist <= this.d / 2) {
          this.die();
          break;
        }
      }
    }
  
    evaluate() {
      this.efficiency = 0.01;
      if (this.nJumps > 0) {
        this.efficiency = this.totalHeightJumpedObstacles / this.totalJumpHeight;
        if (this.efficiency < 0.01) {
          this.efficiency = 0.01;
        }
      }
  
      this.score = this.loc.x * this.efficiency;
    }
  
    checkFloor() {
      if (this.loc.y > terrain.y - this.d / 2) {
        this.loc.y = terrain.y - this.d / 2;
      }
  
      if (!this.inAir()) {
        this.vel.y = 0;
      }
    }
  
    inAir() {
      let buffer = 1;
      if (this.loc.y < terrain.y - this.d / 2 - 1) {
        return true;
      } else {
        return false;
      }
    }
  
    visible() {
      if (cam.toScreenX(this.loc.x) < -this.d / 2 || cam.toScreenX(this.loc.x) > width + this.d / 2) {
        return false;
      } else return true;
    }
  
    findObstacleToRight() {
      let xMax = Infinity;
      let x;
      let index;
  
      for (let i = 0; i < terrain.obstacles.length; i++) {
        x = terrain.obstacles[i].x;
        if (x < xMax && x > this.loc.x) {
          xMax = x;
          index = i;
        }
      }
      return (terrain.obstacles[index]);
    }
  
    findObstacleToLeft() {
      let xMin = -Infinity;
      let x;
      let index;
  
      for (let i = 0; i < terrain.obstacles.length; i++) {
        x = terrain.obstacles[i].x;
        if (x > xMin && x < this.loc.x) {
          xMin = x;
          index = i;
        }
      }
      return (terrain.obstacles[index]);
    }
  
    display() {
      if (this.focused) {
        strokeWeight(3);
        stroke(255, 232, 61, 200);
        fill(255, 232, 61, 30);
      } else {
        strokeWeight(2);
        noFill();
        if (this.alive) {
  
          stroke(255, 200);
        } else {
  
          stroke(255, 0, 0, 150);
        }
      }
  
      circle(cam.toScreenX(this.loc.x), cam.toScreenY(this.loc.y), this.d);
    }
  }