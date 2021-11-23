
class NeuralNetwork {
    constructor(argument) {
      if (argument instanceof NeuralNetwork) {
        this.structure = argument.structure;
        this.nLayers = this.structure.length;
  
        this.weights = new Array(this.nLayers - 1); // stores weights of each layer
        for (let i = 0; i < this.weights.length; i++) {
          this.weights[i] = argument.weights[i].copy();
        }
  
        this.biases = new Array(this.nLayers - 1);
        for (let i = 0; i < this.biases.length; i++) {
          this.biases[i] = argument.biases[i].copy();
        }
      } else {
        this.structure = argument; // stores number of nodes for each layer
        this.nLayers = this.structure.length;
  
        this.weights = new Array(this.nLayers - 1); // stores weights of each layer
        for (let i = 0; i < this.weights.length; i++) {
          this.weights[i] = new Matrix(this.structure[i + 1], this.structure[i]);
          this.weights[i].randomize(-1, 1, "float");
        }
  
        this.biases = new Array(this.nLayers - 1);
        for (let i = 0; i < this.biases.length; i++) {
          this.biases[i] = new Matrix(this.structure[i + 1], 1);
          this.biases[i].randomize(-1, 1, "float");
        }
      }
    }
  
  
    feedForward(inputArray, targetLayer) {
      let weights = this.weights[targetLayer - 1];
      let biases = this.biases[targetLayer - 1];
  
      let inputs = Matrix.fromArray(inputArray);
      let outputs = Matrix.dot(weights, inputs);
      outputs.add(biases);
  
      return outputs.toArray();
    }
  
    train(inputArray, targetArray) {
      let input = inputArray; // gets overwritten in each feedForward iteration
      let outputs_unmapped = [];
      let outputs = [];
  
      let errors = new Array(this.nLayers - 1); // create array with fixed length because it gets filled backwards
  
      // feedForward through all layers
      for (let i = 0; i < this.nLayers - 1; i++) {
        outputs_unmapped.push(this.feedForward(input, i + 1));
        outputs.push(Matrix.mapArray(outputs_unmapped[i], sigmoid));
        input = outputs[i];
      }
  
      // convert arrays to matrix objects
      for (let i = 0; i < outputs.length; i++) {
        outputs[i] = Matrix.fromArray(outputs[i]);
      }
      let targets = Matrix.fromArray(targetArray);
  
      // calculate final errors
      errors[errors.length - 1] = Matrix.subtract(targets, outputs[outputs.length - 1]);
  
      let weights_trans;
      let output_trans;
      let gradients;
      let deltas;
  
      for (let i = this.nLayers - 2; i >= 0; i--) {
        // calculate errors
        if (i < this.nLayers - 2) {
          weights_trans = Matrix.transpose(this.weights[i + 1]);
          errors[i] = Matrix.dot(weights_trans, errors[i + 1]);
        }
  
        // calculate gradients
        gradients = Matrix.fromArray(Matrix.mapArray(outputs_unmapped[i], dSigmoid));
        gradients.multiply(errors[i]);
        gradients.multiply(this.learningRate);
  
        // calculate deltas
        if (i > 0) {
          output_trans = Matrix.transpose(outputs[i - 1]);
        } else {
          output_trans = Matrix.transpose(Matrix.fromArray(inputArray));
        }
        deltas = Matrix.dot(gradients, output_trans);
  
        // adjust weights by deltas
        this.weights[i].add(deltas);
  
        // adjust biases by deltas
        this.biases[i].add(gradients);
      }
    }
  
    guess(inputArray) {
      let input = inputArray;
      let output_unmapped;
      let output;
  
      // feedForward through all layers
      for (let i = 0; i < this.nLayers - 1; i++) {
        output_unmapped = this.feedForward(input, i + 1);
        output = Matrix.mapArray(output_unmapped, sigmoid);
        input = output;
  
        if (this.visualize) {
          this.layerOutputs[i] = output;
        }
      }
      return output;
    }
  
    copy() {
      return new NeuralNetwork(this);
    }
  
    mutate(rate, strength) {
      // adjust weights
      function mutate(x) {
        if (random() < rate) {
          let offset = randomGaussian() * strength;
          let newx = x + offset;
          return newx;
        } else {
          return x;
        }
      }
  
      for (let w of this.weights) {
        w.map(mutate);
      }
      for (let b of this.biases) {
        b.map(mutate);
      }
    }
  
    initVisualization(x, y, w, h) {
      this.visualize = true;
      this.x = x;
      this.y = y;
      this.h = h;
      this.w = w;
      let maxNNodes = findMax(this.structure);
      let dXLayer = w / (this.structure.length - 1);
      let dYNode = h / (maxNNodes - 1);
      let offsetY;
  
      // data for visualization
      this.inputs = [];
      for (let i = 0; i < this.structure[0]; i++) {
        this.inputs[i] = 0;
      }
      this.layerOutputs = [];
      for (let i = 0; i < this.structure.length - 1; i++) {
        this.layerOutputs[i] = [];
        for (let j = 0; j < this.structure[i + 1]; j++) {
          this.layerOutputs[i][j] = 0;
        }
      }
  
      // populate node array
      this.nodes = [];
  
      for (let i = 0; i < this.nLayers; i++) { // goes through layers
        this.nodes[i] = [];
        offsetY = (h - (this.structure[i] - 1) * dYNode) / 2;
  
        for (let j = 0; j < this.structure[i]; j++) {
          this.nodes[i].push(new Node(x + i * dXLayer, y + offsetY + j * dYNode));
        }
      }
  
      // populate connections array
      this.connections = [];
      for (let i = 0; i < this.nLayers - 1; i++) { // loop through "between"-layers
        this.connections[i] = new Matrix(this.structure[i + 1], this.structure[i]);
  
        for (let j = 0; j < this.structure[i + 1]; j++) { // loop through sink nodes
          for (let k = 0; k < this.structure[i]; k++) { // loop through source nodes
            this.connections[i].data[j][k] = new Connection(this.nodes[i][k], this.nodes[i + 1][j]);
          }
        }
      }
    }
  
    display() {
      // display connections
      let weight, clr, strength;
      for (let i = 0; i < this.connections.length; i++) { // loop through "between"-layers
        for (let j = 0; j < this.structure[i + 1]; j++) { // loop through sink nodes
          for (let k = 0; k < this.structure[i]; k++) {
            weight = this.weights[i].data[j][k];
            strength = map(abs(weight), 0, 1, 0, 255);
            if (weight < 0) {
              clr = color(0, 0, 255, strength);
            } else {
              clr = color(255, 0, 0, strength);
            }
            this.connections[i].data[j][k].display(clr);
          }
        }
      }
  
      // display nodes
      // input nodes
      let a, b;
      for (let i = 0; i < this.structure[0]; i++) {
  
        strength = map(abs(this.inputs[i]), 0, 1, 0, 255);
        this.nodes[0][i].display(strength);
      }
      // layer nodes
      for (let i = 1; i < this.nLayers; i++) {
        for (let j = 0; j < this.structure[i]; j++) {
          strength = map(this.layerOutputs[i - 1][j], 0, 1, 0, 255);
          this.nodes[i][j].display(strength);
        }
      }
      this.displayLabels();
    }
  
    displayLabels() {
      textSize(12);
      textAlign(RIGHT, CENTER);
      fill(255);
      noStroke();
  
      for (let i = 0; i < this.nodes[0].length; i++) {
        text(this.inputLabels[i], this.nodes[0][i].x - 9, this.nodes[0][i].y);
      }
  
      textAlign(LEFT, CENTER);
      for (let i = 0; i < this.nodes[this.nodes.length - 1].length; i++) {
        text(this.outputLabels[i], this.nodes[this.nodes.length - 1][i].x + 9, this.nodes[this.nodes.length - 1][i].y);
      }
    }
  }
  
  class Node {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.d = 10;
    }
  
    display(strength) {
      if (strength != undefined) {
        fill(strength)
      } else {
        fill(0);
      }
      stroke(255);
      strokeWeight(1);
      circle(this.x, this.y, this.d);
    }
  }
  
  class Connection {
    constructor(nodeA, nodeB) {
      this.x1 = nodeA.x;
      this.x2 = nodeB.x;
      this.y1 = nodeA.y;
      this.y2 = nodeB.y;
    }
  
    display(clr) {
      stroke(clr);
      strokeWeight(2);
      line(this.x1, this.y1, this.x2, this.y2);
    }
  }