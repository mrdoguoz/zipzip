function handleBalls() {
  switch (mode) {

    case "training":
      trainingTimer--;
      for (let b of balls) {
        if (b.alive) {
          b.act();
        }
      }
      updateHighscore();
      if (ballsAlive < 1 || trainingTimer < 0) {
        updateScores();
        resetTraining("new");
      }
      focusedBall = findFirstBall("alive");
      break;

    case "singleRun":
      champion.act();
      if (!champion.alive) {
        resetSingleRun();
      }
      focusedBall = champion;
      break;
  }
  focusedBall.focused = true;
}

function resetTraining(populationHandling) {
  mode = "training";
  if (populationHandling == "new") {
    balls = ga.nextGen();
  } else if (populationHandling == "keep") {
    for (let b of balls) {
      b.reset();
    }
  }
  terrain.reset();
  cam.reset();
  tempHighscore = 0;
  ballsAlive = total;
  trainingTimer = maxTrainingTime;
}

function resetSingleRun() {
  mode = "singleRun";
  champion = new Ball(bestBrain);
  champion.brain.initVisualization(width / 2 - 150, height - 155, 300, 130);
  champion.brain.inputLabels = ["velocity (x)", "height next obstacle", "distance next obstacle"];
  champion.brain.outputLabels = ["left", "right", "acceleration", "jump (yes/no)", "jump force"];
  terrain.reset();
  cam.reset();
}

function updateHighscore() {
  for (let b of balls) {
    if (b.loc.x > tempHighscore) {
      tempHighscore = b.loc.x;
      if (tempHighscore >= highscore) {
        highscore = tempHighscore;
        bestBrain = b.brain.copy();
      }
    }
  }
}

function updateScores() {
  scores.push(tempHighscore);
}