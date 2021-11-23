class Matrix {
    constructor(nRows, nCols) {
      this.nRows = nRows;
      this.nCols = nCols;
      this.data = [];
  
      for (let i = 0; i < this.nRows; i++) {
        this.data[i] = [];
  
        for (let j = 0; j < this.nCols; j++) {
          this.data[i][j] = 0;
        }
      }
    }
  
    copy() {
      let m = new Matrix(this.nRows, this.nCols);
      for (let i = 0; i < this.nRows; i++) {
        for (let j = 0; j < this.nCols; j++) {
          m.data[i][j] = this.data[i][j];
        }
      }
      return m;
    }
  
    static fromArray(array) {
      // receives array, returns matrix object
      let m = new Matrix(array.length, 1);
  
      for (let i = 0; i < array.length; i++) {
        m.data[i][0] = array[i];
      }
      // returns a matrix
      return m;
    }
  
    toArray() {
      // creates array from matrix object
      let array = [];
      for (let i = 0; i < this.nRows; i++) {
        for (let j = 0; j < this.nCols; j++) {
          array.push(this.data[i][j]);
        }
      }
      // returns an array
      return array;
    }
  
    randomize(min, max, type) {
      for (let i = 0; i < this.nRows; i++) {
        for (let j = 0; j < this.nCols; j++) {
          switch (type) {
            case "int":
              this.data[i][j] = floor(random(min, max)); //random() * 2 - 1;  
              break;
            case "float":
              this.data[i][j] = random(min, max); //random() * 2 - 1;  
              break;
          }
        }
      }
    }
  
    add(input) {
      // receives matrix object or number
      if (input instanceof Matrix) {
        if (this.nRows == input.nRows && this.nCols == input.nCols) {
          for (let i = 0; i < this.nRows; i++) {
            for (let j = 0; j < this.nCols; j++) {
              this.data[i][j] += input.data[i][j];
            }
          }
        } else {
          print("wrong matrix dimensions");
        }
      } else if (!isNaN(input)) {
        for (let i = 0; i < this.nRows; i++) {
          for (let j = 0; j < this.nCols; j++) {
            this.data[i][j] += input;
          }
        }
      } else {
        print("wrong argument provided");
      }
    }
  
    static subtract(inputA, inputB) {
      // receives two matrix objects
      if (inputA.nRows == inputB.nRows && inputA.nCols == inputB.nCols) {
        let result = new Matrix(inputA.nRows, inputB.nCols);
        for (let i = 0; i < inputA.nRows; i++) {
          for (let j = 0; j < inputA.nCols; j++) {
            result.data[i][j] = inputA.data[i][j] - inputB.data[i][j];
          }
        }
        // returns a matrix
        return result;
      } else {
        print("wrong matrix dimensions");
        return undefined;
      }
  
    }
  
    static dot(inputA, inputB) {
      // receives two matrix objects 
      // matrix product / dot product
      if (inputA instanceof Matrix && inputB instanceof Matrix) {
        if (inputA.nCols == inputB.nRows) {
  
          let result = new Matrix(inputA.nRows, inputB.nCols);
          for (let i = 0; i < result.nRows; i++) {
            for (let j = 0; j < result.nCols; j++) {
              // dot product of values in col
              var sum = 0;
              for (let k = 0; k < inputA.nCols; k++) {
                sum += inputA.data[i][k] * inputB.data[k][j];
              }
              result.data[i][j] = sum;
            }
          }
          // returns a matrix
          return result;
        } else {
          print("wrong matrix dimensions");
          return undefined;
        }
      } else {
        print("wrong arguments provided");
        return undefined;
      }
    }
  
    multiply(input) {
      // receives a single number -> scalar product
      // OR
      // receives a martrix object -> element wise multiplication
  
      if (!isNaN(input)) {
        for (let i = 0; i < this.nRows; i++) {
          for (let j = 0; j < this.nCols; j++) {
            this.data[i][j] *= input;
          }
        }
      } else if (input instanceof Matrix) {
        if (this.nCols == input.nCols && this.nRows == input.nRows) {
          for (let i = 0; i < this.nRows; i++) {
            for (let j = 0; j < this.nCols; j++) {
              this.data[i][j] *= input.data[i][j];
            }
          }
        } else {
          print("wrong matrix dimensions");
        }
      } else {
        print("wrong argument provided");
      }
    }
  
    static mapArray(array, fn) {
      let result = new Array(array.length);
      // receives an array and a function
      for (let i = 0; i < array.length; i++) {
        result[i] = fn(array[i]);
      }
  
      // returns an array
      return result;
    }
  
    map(fn) {
      // apply a function to every element of matrix
      for (let i = 0; i < this.nRows; i++) {
        for (let j = 0; j < this.nCols; j++) {
          let val = this.data[i][j];
          this.data[i][j] = fn(val);
        }
      }
    }
  
    static transpose(input) {
      // receives a matrix object
      let result = new Matrix(input.nCols, input.nRows);
  
      for (let i = 0; i < input.nRows; i++) {
        for (let j = 0; j < input.nCols; j++) {
          result.data[j][i] = input.data[i][j];
        }
      }
      // returns a matrix
      return result;
    }
  }