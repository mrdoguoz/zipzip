function displayAll() {
    displayBackground();
    terrain.display();
    if (mode == "training") {
      for (let b of balls) {
        if (b.visible()) {
          b.display();
        }
      }
      displayHighscore();
      displayPopulation(240, height - 60, 148, 44);
      displayTimer(20, height - 60, 148, 44);
      displayGen();
      displayProgress(width - 260, height - 110, 240, 90);
      displayMap(20, height - 110, 360, 20);
    } else if (mode == "singleRun") {
      champion.display();
      if (displayBrain) {
        champion.brain.display();
      }
    }
    displayLvl();
    displayMode(5, 5);
  
    displaySpeedAndFramerate(width - 125, 5, 120, 82);
    if (!focused) {
      displayClickRequest();
    }
  }
  
  function displayMode(x, y) {
    let str;
    if (mode == "training") {
      str = "TRAINING MODE";
    } else if (mode == "singleRun") {
      str = "TEST RUN MODE";
    }
  
    textSize(16);
    fill(255);
    noStroke();
    textAlign(LEFT, TOP);
    text(str, x, y);
  }
  
  function displayLvl() {
    let str;
    if (cam.target.loc.x < xMaxDifficulty && mode == "training") {
      str = "LEVEL " + (1 + floor(cam.target.loc.x / 1000));
    } else {
      str = "random obstacles";
    }
    makeText(str, width / 2, 30, CENTER, CENTER);
  
    let lLine = 130;
    stroke(255);
    strokeWeight(1);
    line(width / 2 - lLine / 2, 45, width / 2 + lLine / 2, 45);
  }
  
  function displayGen() {
    let lLine = 100;
    stroke(255);
    strokeWeight(1);
    line(width / 2 - lLine / 2, 45, width / 2 + lLine / 2, 45);
  
    let str = "generation " + ga.gen;
    makeText(str, width / 2, 60, CENTER, CENTER);
  }
  
  function displayTimer(x, y, w, h) {
    let hBar = 12;
    let wBar = w - 4;
    let wFillBar = map(trainingTimer, 0, maxTrainingTime, 0, wBar);
  
    stroke(255);
    strokeWeight(1);
    fill(0, 0, 255);
    rect(x + 2, y + 24, wFillBar, hBar);
  
    noFill();
    rect(x + 2, y + 24, wBar, hBar);
  
    makeText("remaining time:", x + 2, y + 2, LEFT, TOP);
    makeText(trainingTimer, x + w - 2, y + 2, RIGHT, TOP);
  }
  
  function displayHighscore() {
    let yCircle = 30;
    if (cam.toScreenX(highscore) > 0 && cam.toScreenX(highscore) <= width) {
      noStroke();
      fill(255, 0, 0);
      circle(cam.toScreenX(highscore), cam.toScreenY(yCircle), 8);
      
      stroke(255, 0, 0);
      strokeWeight(1);
      line(cam.toScreenX(highscore), cam.toScreenY(yCircle), cam.toScreenX(highscore), cam.toScreenY(0)); 
    }
    if (cam.toScreenX(highscore) > width - 60) {
      noStroke();
      fill(255, 0, 0);
      triangle(width - 60, cam.toScreenY(yCircle) - 5, width - 50, cam.toScreenY(yCircle), width - 60, cam.toScreenY(yCircle) + 5);
  
      stroke(255, 0, 0);
      strokeWeight(3);
      line(width - 70, cam.toScreenY(yCircle), width - 60, cam.toScreenY(yCircle));
    }
  
    textAlign(CENTER, TOP);
    textSize(14);
    fill(255);
    noStroke();
    let x;
    let y = cam.toScreenY(yCircle) + 9;
    if (cam.toScreenX(highscore) < width - 60) {
      x = cam.toScreenX(highscore);
    } else {
      x = width - 60;
    }
    let str = "highscore: " + round(highscore);
    text(str, x, y);
  }
  
  function displayPopulation(x, y, w, h) {
    let hBar = 12;
    let wBar = w - 4;
    let wFillBar = map(ballsAlive, 0, total, 0, wBar);
  
    stroke(255);
    strokeWeight(1);
    fill(0, 0, 255);
    rect(x + 2, y + 24, wFillBar, hBar);
  
    noFill();
    rect(x + 2, y + 24, wBar, hBar);
  
    makeText("balls alive:", x + 2, y + 2, LEFT, TOP);
    let str = ballsAlive + " / " + total;
    makeText(str, x + w - 2, y + 2, RIGHT, TOP);
  }
  
  function displayRatioHighscore(x, y, w, h) {
    let hBar = 12;
    let wBar = w - 4;
    let wFillBar = map(tempHighscore, 0, highscore, 0, wBar);
  
    stroke(255);
    strokeWeight(1);
    fill(0, 0, 255);
    rect(x + 2, y + 24, wFillBar, hBar);
  
    noFill();
    rect(x + 2, y + 24, wBar, hBar);
  
    makeText("new highscore:", x + 2, y + 2, LEFT, TOP);
  
    let str = round(tempHighscore / highscore * 100) + "%";
    makeText(str, x + w - 2, y + 2, RIGHT, TOP);
  }
  
  function displayProgress(x, y, w, h) {
    fill(255, 10);
    noStroke();
    rect(x, y, w, h);
  
    let x1, x2, y1, y2;
    let dX = w / scores.length;
  
    for (let i = 0; i < scores.length; i++) {
      x1 = x + (i * dX);
      x2 = x + ((i + 1) * dX);
  
      y1 = y + h - (map(scores[i], 0, highscore, 0, h));
  
      if (i < scores.length - 1) {
  
        y2 = y + h - (map(scores[i + 1], 0, highscore, 0, h));
        stroke(0, 0, 255);
      } else {
        y2 = y + h - (map(tempHighscore, 0, highscore, 0, h));
        stroke(0, 230, 230);
      }
  
      strokeWeight(2);
      line(x1, y1, x2, y2);
    }
  
    noFill();
    stroke(255);
    strokeWeight(1);
    rect(x, y, w, h);
  
    stroke(255);
    strokeWeight(1);
    line(x2, y2, x2 + 5, y2);
  
    stroke(255, 50);
    line(x, y2, x + w, y2);
  
    fill(255);
    noStroke();
    textSize(12);
    textAlign(RIGHT, BOTTOM);
    let str = "generation's highscore: " + round(tempHighscore);
    text(str, x + w - 2, y2 - 2);
  
    noStroke();
    fill(255);
    textAlign(RIGHT, TOP);
    textSize(12);
    text("generation", x + w - 2, y + h + 2);
  
    push();
    translate(x, y);
    rotate(-HALF_PI);
    textAlign(RIGHT, BOTTOM);
    text("score", -2, -2);
    pop();
  }
  
  function displayMap(x, y, w, h) {
    makeText("relative ball locations:", x + 2, y - 7, LEFT, BOTTOM);
  
    let realXLast = findLastBall("all").loc.x;
    let realXFirst = findFirstBall("all").loc.x;
    let realMaxDist;
  
    if (realXLast < 0) {
      realMaxDist = realXFirst - realXLast;
    } else if (realXLast >= 0) {
      realMaxDist = realXFirst;
    }
  
    let opac = 150;
    let realXPos, xBall;
    for (let b of balls) {
      if (b.loc.x >= 0) {
        if (realXLast < 0) {
          realXPos = abs(realXLast) + b.loc.x;
        } else {
          realXPos = b.loc.x;
        }
      } else if (b.loc.x < 0) {
        realXPos = realMaxDist - realXFirst - abs(b.loc.x);
      }
      xBall = map(realXPos, 0, realMaxDist, 0, w);
      if (b.alive) {
        stroke(255, opac);
        strokeWeight(1);
        if (b.focused) {
          stroke(255, 232, 61);
          strokeWeight(2);
        }
      }
      if (!b.alive) {
        stroke(255, 0, 0, opac);
        strokeWeight(1);
  
      }
  
      line(x + xBall, y, x + xBall, y + h);
    }
  
    // Cam
    if (realXLast < 0) {
      realXPos = abs(realXLast) + cam.loc.x;
    } else {
      realXPos = cam.loc.x;
    }
    let xCam = map(realXPos, 0, realMaxDist, 0, w);
    noStroke();
    fill(255);
    triangle(x + xCam, y + h, x + xCam + 3, y + h + 10, x + xCam - 3, y + h + 10);
  
    // Zero Mark
    let xZero;
    if (realXLast < 0) {
      xZero = map(abs(realXLast), 0, realMaxDist, 0, w);
    } else if (realXLast > 0) {
      xZero = 0;
    }
    stroke(255);
    strokeWeight(4);
    line(x + xZero, y - 3, x + xZero, y + h - 2);
  
    fill(255);
    textSize(12);
    textAlign(CENTER, TOP);
    noStroke();
    text("start", x + xZero, y + h + 2)
  
    // floor
    stroke(255);
    strokeWeight(1);
    line(x, y + h, x + w, y + h);
  }
  
  function displaySpeedAndFramerate(x, y, w, h) {
    stroke(255);
    strokeWeight(1);
    fill(255, 20);
    rect(x, y, w, h);
  
    sliderSimSpeed.position(x + 3, y + 19);
    let wSlider = (w - 10) + "px";
    sliderSimSpeed.style('width', wSlider);
  
    fill(255);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);
    text("sim speed:", x + 4, y + 4);
    let str = "x" + sliderSimSpeed.value();
    textAlign(RIGHT, TOP);
    text(str, x + w - 4, y + 4);
  
    stroke(255);
    strokeWeight(1);
    line(x + (w / 2) - 40, y + 50, x + (w / 2) + 40, y + 50);
  
    str = parseInt(avgFrameRate) + " fps";
  
    let notRed = map(avgFrameRate, 30, 55, 0, 255);
    fill(255, notRed, notRed);
    textAlign(CENTER, TOP);
    textSize(14);
    noStroke();
    text(str, x + (w / 2), y + 60);
  }
  
  function displayClickRequest() {
    fill(255, 50);
    noStroke();
    rect(0, 0, width, height);
  
    noStroke();
    textSize(20);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Click here to start the sketch", width / 2, height / 2 - 80);
  }