function makeText(str, x, y, alignHorizontal, alignVertical) {
    fill(255);
    noStroke();
    textSize(14);
    textAlign(alignHorizontal, alignVertical);
    text(str, x, y);
  }
  
  function findMax(array) {
    let max = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] > max) {
        max = array[i];
      }
    }
    return max;
  }
  
  function findFirstBall(state) {
    var first;
    var maxDist = -Infinity;
  
    switch (state) {
      case "alive":
        for (let b of balls) {
          if (b.alive) {
            if (b.loc.x > maxDist) {
              first = b;
              maxDist = b.loc.x
            }
          }
        }
        break;
      case "all":
        for (let b of balls) {
          if (b.loc.x > maxDist) {
            first = b;
            maxDist = b.loc.x
          }
        }
        break;
    }
    return first;
  }
  
  function findLastBall(state) {
    var last;
    var minDist = Infinity;
  
    switch (state) {
      case "alive":
        for (let b of balls) {
          if (b.alive) {
            if (b.loc.x < minDist) {
              last = b;
              minDist = b.loc.x
            }
          }
        }
        break;
      case "all":
        for (let b of balls) {
          if (b.loc.x < minDist) {
            last = b;
            minDist = b.loc.x
          }
        }
  
        break;
    }
    return last;
  }
  
  
  function updateFrameRate() {
    let lArray = 30;
    if (logFrameRate.length >= lArray) {
      logFrameRate.splice(0, 1);
    }
    logFrameRate.push(frameRate());
    let avg = 0;
  
    for (let i = 0; i < logFrameRate.length; i++) {
      avg += logFrameRate[i];
    }
    avgFrameRate = avg / logFrameRate.length;
  }
  
  function displayBackground() {
    let r, g, b;
    let r0 = 25;
    let g0 = 25;
    let b0 = 77;
    let r1 = 103;
    let g1 = 10;
    let b1 = 10;
  
    if (mode == "training") {
      r = round(map(cam.visXMin, 0, xMaxDifficulty, r0, r1));
      g = round(map(cam.visXMin, 0, xMaxDifficulty, g0, g1));
      b = round(map(cam.visXMin, 0, xMaxDifficulty, b0, b1));
  
      if (cam.visXMin < 0) {
        r = r0;
        g = g0;
        b = b0;
      }
      if (cam.visXMin > xMaxDifficulty) {
        r = r1;
        g = g1;
        b = b1;
      }
    } else if (mode == "singleRun") {
      r = 105;
      g = 30;
      b = 15;
    }
    background(r, g, b);
  }