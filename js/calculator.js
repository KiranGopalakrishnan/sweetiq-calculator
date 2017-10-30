//Not enclosing in a ASIF because the main.js requires the caclulator object
'use strict';
//Stack implemented as a constructor function
function Stack(){
  this.stack=[];
  this.push = function(item){
    this.stack.push(item);
  }
  this.size = function(){
    return this.stack.length;
  }
  this.pop = function(){
    return this.stack.pop();
  }
}

function Calculator() {
  this.opList=["*","/","+","-"],
  //Characters allowed on the calculator
  this.allowedCharacters=["0","1","2","3","4","5","6","7","8","9",".","(",")"].concat(this.opList),
  this.getAllowedCharacters = function(){
    return this.allowedCharacters;
  }
  this.decimalPrecision=5,
  this.setDecimalPrecision=function(number){
    this.decimalPrecision = number;
  },
  this.opFunctions=[
    //Same presidence operators are grouped together in left to right order
    {
      '*': function(a, b){ return a * b},
      '/': function(a, b){ return a / b}
    },
    {
      '+': function(a, b){ return a + b},
      '-': function(a, b){ return a - b}
    }
  ]
}

Calculator.prototype.calculate = function(string){
  var response;
  var stack = new Stack();
  var error = this.checkError(string);
if(!error){
    var generatedOpStack = this.generateOpStack(string,stack);
    response = this.calculateStackItems(generatedOpStack);
  }else{
    response = "Error";
  }
  console.log(error);
  //calculatedOutput = calculatedOutput.toFixed(this.decimalPrecision);
  return response;
}

Calculator.prototype.generateOpStack = function(string,stackObj){
  var stack = stackObj;
  var array = string.split("");
  let selfe = this;
  array.forEach(function(item){
    if(item === ')'){
      //keep popping items out of stack until the matching opening bracket is found
      var tempArray=[];
      var nextItem= stack.pop();

      while(nextItem !== '('){
        tempArray.push(nextItem);
        nextItem= stack.pop();
      }
      //reverseing the array to ensure operation order is kept as the original string
      var bracketString = tempArray.reverse().join("");
      var parsedOperationArray = selfe.parseOperationString(bracketString);
      var clearedOperationArray = selfe.clearArray(parsedOperationArray);

      //console.log(clearedOperationArray);

      var output = selfe.performOperations(clearedOperationArray);

      //console.log(output);
      var result = output;
      stack.push(result);
    }else{
      stack.push(item);
    }
  });
  //returning the filled stack

  //console.log(stack.stack);
  return stack;
}
Calculator.prototype.calculateStackItems= function(stack){
  let currentStack = stack;
  let tempArray = [];
  var stackSize = stack.size();
  //emptying the stack
  while(stackSize>0){
    tempArray.push(currentStack.pop());
    stackSize = stack.size();
  }
  //joining the stack items together for parsing
  var stackOpString = tempArray.reverse().join("");
  var parsedOperationArray = this.parseOperationString(stackOpString);
  var output = this.performOperations(parsedOperationArray);
  return output;
}
Calculator.prototype.performOperations= function(array){
  //getting the operation functions from the calculator object
  var opList = this.opFunctions;
  var newArray = [];
  var currentOperator;
  for (var i = 0; i < opList.length; i++) {
    for (var j = 0; j < array.length; j++) {
      if (opList[i][array[j]]) {
        currentOperator = opList[i][array[j]];
      } else if (currentOperator) {
        newArray[newArray.length - 1] =
        currentOperator(newArray[newArray.length - 1], array[j]);
        currentOperator = null;
      } else {
        newArray.push(array[j]);
      }
    }
    //assigning back to the array
    array = newArray;
    newArray = [];
  }
  if (array.length > 1) {
    console.log('Error :(');
    return array;
  } else {
    return array[0];
  }
}

//Parses the provided operation string into floats and operands
Calculator.prototype.parseOperationString = function(opString) {
  var calculation = [];
  var current = '';
  var string = opString;
  //join the op list for determining operator positions from opString
  var operationsList = this.opList.join("");
  for (var i = 0, ch; ch = string.charAt(i); i++) {
    //find the indexes of al the operators present in the opString
    var operaterPosition = operationsList.indexOf(ch);
    if ( operaterPosition > -1) {
      if (current == '' && ch == '-') {
        current = '-';
      } else {
        if(current !== ''){
          //number
          calculation.push(parseFloat(current), ch);
          current = '';
        }else{
          //operator
          calculation.push(current,ch);
        }
      }
    } else {
      //No operators
      current += string.charAt(i);
    }
  }
  if (current !== '') {
    calculation.push(parseFloat(current));
  }
  return calculation;
}
//Clearing out the empty values from the array
Calculator.prototype.clearArray =  function(array){
  var newArray = [];
  for (var i = 0; i < array.length; i++) {
    if (array[i] !== undefined && array[i] !== null && array[i] !== "") {
      newArray.push(array[i]);
    }
  }
  return newArray;
}
Calculator.prototype.checkError = function(string){
  var response = false;
  var stringArray = string.split("");
  var openBracketsCount=0,closedBracketCount=0;
  stringArray.forEach(function(item){
    if(item ==='('){
      openBracketsCount++;
    }
    if(item === ')'){
      closedBracketCount++;
    }
  });
  console.log(openBracketsCount);
  console.log(closedBracketCount);
  response = openBracketsCount===closedBracketCount?false:true;
  return response;
}
