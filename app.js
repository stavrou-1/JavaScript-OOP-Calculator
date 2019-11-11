// JS Calculator written in OOP class inheritance pattern.
class Config {
  constructor(name, lang) {
    // basic configuration variables for our app.
    this.name = name;
    this.lang = lang;
    this.result = 0;
    this.previous = 0;
    this.reset = false;
    this.opValues = ["+","-","*","/"];
  }
}

class Calculator extends Config {
  constructor(name, lang) {
    super(name, lang);
    // utility public variable for our messaging/history system.
    this.messages = [];
  }
  // determine if value passed in is a number and finite (not infinity).
  isNumeric(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  }
  // convert expressions to integers based on string argument.
  convertStringExpressions(str) {
    if (str.length === 0) return 0;
    
    let a = [];
    a = str.split(' ');
    for (let i = 0; i < a.length; i++) {
      if (this.isNumeric(a[i])) {
        a[i] = Number(a[i]);
      }
    }
    return a;
  }
  multiplyOrDivide(num) {
    let total = 0;
    if (num.indexOf('*') !== -1 || num.indexOf('/') !== -1) {
      for (let i = 0; i < num.length; i++) {
        try {
          switch(num[i]) {
            case '*':
              total = num[i - 1] * num[i + 1];
              num.splice(i - 1, 3, total);
              i--;
              break;
            case '/':
              if (num[i + 1] === 0) {
                throw new Error("dividing by zero");
              } else {
                total = num[i - 1] / num[i + 1];
              }
              num.splice(i - 1, 3, total);
              i--;
              break;
            default:
              break;
          }
        } catch(error) {
          this.messages.unshift(error.name + ': ' + error.message);
        }
      }
    }
    return num;
  }
  // return name of calculator
  returnName() {
    return this.name;
  }
  // determine weather to add or subtract.
  addOrSubtract(num) {
    let total = 0;
    if (num.indexOf('+') !== -1 || num.indexOf('-') !== -1) {
      for (let i = 0; i < num.length; i++) {
        try {
          switch(num[i]) {
            case '+':
              total = num[i - 1] + num[i + 1];
              num.splice(i - 1, 3, total);
              i--;
              break;
            case '-':
              total = num[i - 1] - num[i + 1];
              num.splice(i - 1, 3, total);
              i--;
              break;
            default:
              break;
          }
        } catch(error) {
          this.messages.unshift(error.name + ': ' + error.message);
        }
      }
    }
    return num;
  }
  computeEquals(str) {
    if (str.length === 0) {
      return "";
    }
    let expression = this.convertStringExpressions(str);
    this.previous = this.result;
    if (expression.length === 0) {
      this.result = 0;
    }
    
    // order of operations
    expression = this.multiplyOrDivide(expression);
    expression = this.addOrSubtract(expression);
    
    try {
      if (expression.length !== 1 || !Number(expression[0])) {
        let message = "Order of operations incomplete";
        this.messages.unshift(message);
        throw new Error(message);
      }
      this.result = expression[0];
    } catch(error) {
        this.messages.unshift(error.name + ': ' + error.message);
        this.result = "error";
    }
    
    return this.result;
  }
  setReset(values) {
    this.reset = values;
  }
  getReset() {
    return this.reset;
  }
  clearAll() {
    this.result = "";
    this.previous = "";
    return this.result;
  }
  // go back to last answer
  clearLast() {
    this.result = this.previous;
    this.previous = "";
    return this.result;
  }
}

// DOM Interactions
(function($) {//
  var init = function() {
    let app = new Calculator('JS Calculator', 'EN');
    let print = document.getElementById("inputOutput");
     
    // print out application name.
    $('.calcTitle').html(app.returnName());
    console.log(app.returnName())
    // any button actions.
    $('.calculator table button').each(function() {
    $(this).click(function() {
      let values = $(this).text();
      let appVals = app.opValues;
      
      console.log(values)
      
        // any initial functions
        try {
          // checks if a number was entered and assigns the print value to the entered number.
          // if this.reset is not false.
          if (app.isNumeric(values)) {
            if (app.getReset()) {
              print.value = values;
              // if it is false then we are adding more numbers to our first operation. (i.e. 4445555)
            } else {
              print.value += values;
            }
            app.setReset(false);
          }
          // checks if the user entered a decimal character.
          else if (values === ".") {
            if (app.isNumeric(print.value.substr(-1))) {
              print.value += values;
              app.setReset(false);
            }
          }
          // checks for a specific math operator function (i.e '+','-','/','*');
          // from our appVals array and concatinates the print value with the next value.
          else if (appVals.indexOf(values) !== -1) {
            if (appVals.indexOf(print.value.substr(-2, 1)) === -1) {
              print.value += " " + values + " ";
              app.setReset(false);
            }
          }
          // checks for the sum operator.
          else if (values === "=" && !app.getReset()) {
            print.value = app.computeEquals(print.value);
            app.setReset(true);
          } 
          else if (values === "CE") {
            print.value = app.clearLast();
            app.setReset(true);
          }
          else if (values === "AC") {
            app.clearAll();
            print.value = "";
            app.setReset(true);
          }
          else {
            const errorMessage = "Unknown entry";
            app.messages.unshift(errorMessage);
            throw new Error(errorMessage);
          }
        } catch(error) {
          app.messages.unshift(error.name + ": " + error.message);
          print.value = "error";
        }
      
       
      console.log(app.messages);
      });
    });
  }
  init();
})(jQuery);
