class Camera {
    constructor(screenCenter, offset) {
      this.loc = offset.copy();
      this.offset = offset.copy();
      this.screenCenter = screenCenter;
      this.visXMin = this.loc.x - screenCenter.x;
      this.visXMax = this.loc.x + (width - screenCenter.x);
      this.maxSpeed = maxSpeed * 1.5;
      this.target = undefined;
      this.locked = false;
    }
  
    reset() {
      this.loc = this.offset.copy();
    }
  
    update() {
      // if leader not target -> make leader the target
      if (focusedBall != this.target) {
        this.target = focusedBall;
        this.locked = false;
      }
  
      // if not locked: search leader ball, pursue leader
      if (!this.locked) {
        let targetX = this.target.loc.x;
        let dist = targetX - this.loc.x;
  
        // if leader too far -> pursue
        if (abs(dist) > maxSpeed) {
          let velX = map(abs(dist), 0, 100, 0, this.maxSpeed);
          if (dist < 0) {
            velX *= -1;
          }
          this.loc.x += velX;
        }
  
        // if leader reached -> lock
        else {
          this.locked = true;
        }
      }
  
      // if locked: set location to ball
      if (this.locked) {
        this.loc.x = this.offset.x + this.target.loc.x;
      }
  
      this.visXMin = this.loc.x - this.screenCenter.x;
      this.visXMax = this.loc.x + (width - this.screenCenter.x);
    }
  
    toScreenX(input) {
      return this.screenCenter.x + (input - this.loc.x);
    }
  
    toScreenY(input) {
      return this.screenCenter.y + (input - this.loc.y);
    }
  }