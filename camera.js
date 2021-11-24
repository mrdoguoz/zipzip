class Camera {
    constructor(screenCenter, offset) {
      this.loc = offset.copy();
      //console.log(this.loc) x: 509.4597564219265 y: -80 z: 0
      this.offset = offset.copy();
      //console.log(this.offset) x: 0 y: -80 z: 0
      this.screenCenter = screenCenter;
      //console.log(this.screenCenter) x: 350 y: 275 z: 0
      this.visXMin = this.loc.x - screenCenter.x;
      this.visXMax = this.loc.x + (width - screenCenter.x);
      this.maxSpeed = maxSpeed * 1.5; //12
      this.target = undefined;
      this.locked = false;
    }
  
    reset() {
      this.loc = this.offset.copy();
      //butun toplar öldüğünde aktif olacak
    }
  
    update() {
      // if leader not target -> make leader the target hedefi lider yap
      if (focusedBall != this.target) {
        this.target = focusedBall;
        this.locked = false;
      }
  
      // if not locked: search leader ball, pursue leader burda lider topa kitleniyoruz
      if (!this.locked) {
        let targetX = this.target.loc.x;
        let dist = targetX - this.loc.x;
  
        // if leader too far -> pursue
        if (abs(dist) > maxSpeed) {
          //mutlak değere alıp 12 den buyukse 
          let velX = map(abs(dist), 0, 100, 0, this.maxSpeed);
          //mutlak değer dist i maxSpeed e kadar değişen bir değere dönüştürüyoruz
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
        //lider topun aldığı mesafe
      }
  
      this.visXMin = this.loc.x - this.screenCenter.x;
      //ekranın sol kose değeri
      this.visXMax = this.loc.x + (width - this.screenCenter.x);
      //ekranın sağ köşe değeri
    }
  
    toScreenX(input) {
      //en yuksek puanla çağrılacak
      
      return this.screenCenter.x + (input - this.loc.x);
     
    }
  
    toScreenY(input) {
      //input:30
      
      return this.screenCenter.y + (input - this.loc.y);
    }
  }