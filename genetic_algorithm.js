class geneticAlgorithm {
    constructor() {
      this.gen = 1;
    }
  
    nextGen() {
      // generates the next generation of balls
      let nextGen = new Array(total);
      this.calcFitness();
  
      for (let i = 0; i < balls.length; i++) {
        nextGen[i] = this.makeNewBall();
      }
      this.gen++;
      return nextGen;
    }
  
    calcFitness() {
      this.highestFitness = 0;
      this.lowestFitness = Infinity; //sonsuz
  
      // calculates fitness of each ball; all fitness levels add up to 1
      let sum = 0;
      for (let b of balls) {
  
        b.evaluate();
        if (b.score < 0) b.score = 1;
        sum += b.score;
      }
      for (let b of balls) {
        b.fitness = b.score / sum;
        if (b.fitness < this.lowestFitness) {
          this.lowestFitness = b.fitness;
        }
        if (b.fitness > this.highestFitness) {
          this.highestFitness = b.fitness;
          this.bestBall = b;
        }
      }
    }
  
    makeNewBall() {
      // "father" of a new ball is picked randomly from old generation   Yeni bir topun "babası" eski nesilden rastgele seçilir
      // balls with high fitness value are more likely to get picked     uygunluk değeri yüksek topların seçilme olasılığı daha yüksektir
      let r = random();
      let i;
      while (r > 0) {
        i = round(random(total - 1));
        r -= balls[i].fitness;
      }
      let father = balls[i];
      let child = new Ball(father.brain.copy());
      let mutationRate = map(father.fitness, this.lowestFitness, this.highestFitness, 0.8, 0.08);
      let mutationStrength = map(father.fitness, this.lowestFitness, this.highestFitness, 0.8, 0.08);
      child.brain.mutate(mutationRate, mutationStrength);
      return child;
    }
  }