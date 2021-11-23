function keyPressed() {
    // reset
    if (key === "r" || key === "R") {
      sliderSimSpeed.remove();
      setup();
    }
  
    //pause
    if (key === "p" || key === "P") {
      paused = !paused;
    }
  
    // brain display
    if (key === "d" || key === "D") {
      displayBrain = !displayBrain;
    }
  
    // new generation or new single run
    if (key === "n" || key === "N") {
      switch (mode) {
        case "training":
          resetTraining("keep");
          break;
        case "singleRun":
          resetSingleRun();
          break;
      }
    }
  
    // change mode
    if (key === "m" || key === "M") {
      if (mode == "training" && ga.gen > 1) {
        resetSingleRun();
      } else if (mode == "singleRun") {
        resetTraining("keep");
      }
    }
  
    // sim speed 
    if (key === "1") {
      sliderSimSpeed.value(1);
    }
    if (key === "2") {
      sliderSimSpeed.value(2);
    }
    if (key === "3") {
      sliderSimSpeed.value(100);
    }
  }