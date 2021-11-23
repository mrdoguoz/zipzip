function sigmoid(x) {
    //return 1 / (1 + Math.exp(-x)); 
    return (Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x)) //hiperbolik tanjant // sinh(arg)/cosh(arg) 
    //return Math.sqrt(x);
  }
  
  function dSigmoid(x) {
    // calculates derivative of sigmoid function
    //return sigmoid(x) * (1 - sigmoid(x));

    return 1-Math.sqrt(sigmoid(x))
    //return 2*x;
    //https://sefiks.com/2017/01/29/hyperbolic-tangent-as-neural-network-activation-function/
    //https://tr.wikipedia.org/wiki/Hiperbolik_fonksiyon

  }