//we're in the javascrpit file
window.onload = init;
var prefixstack;
var preceMap = {"-":1,"+":1,"/":2,"*":2};
var postfix = [];
var operatorStack = [];
var operatorfxns = {
  '-' : function(x,y){
    return y - x;
  },
  '+' : function(x,y){
    return y + x;
  },
  '*' : function(x,y){
    return y * x;
  },
  '/' : function(x,y){
     return y / x;
  }
};

function init(){
 prefixstack = [];
};//End of init function.

function addToStack(value){
 prefixstack.push(value);
 display(prefixstack);
}

function getID(num){
  var idnum = num;
  return idnum;
}

function display(stack){
 var stackstring = "";
 for(var i = 0; i < stack.length;i++){
  stackstring = stackstring + stack[i];
 }
 document.getElementById("entry-box").innerHTML = stackstring;
}

function allClear(){
 operatorStack = [];
 prefixstack = [];
 postfix = [];
 document.getElementById("entry-box").innerHTML = 0;
}

function inToPost(prestack){
 var stack = prestack;
 //alert("infix");
 //alert(stack);
 for(var j = 0; j < stack.length; j++){
 //if it's an operator
  if((stack[j] in preceMap)){
  if(operatorStack.length > 0){//if stack is not empty.
if(preceMap[String(operatorStack[operatorStack.length-1])] >= preceMap[String(stack[j])]){    while(preceMap[String(operatorStack[operatorStack.length-1])] >= preceMap[String(stack[j])]){
      //postfix = postfix + String(operatorStack.pop());
       postfix.push(operatorStack.pop());
      }
}//end if topstack has higher precedence 
    if(preceMap[stack[j]] > preceMap[String(operatorStack[operatorStack.length-1])]){
      operatorStack.push(stack[j]);
     }
   }//end else if opstack is not empty
      if(operatorStack.length == 0){//put on operator stack
    operatorStack.push(stack[j]);
   }//end if opstack is empty
  }//end of if statement
//if it's an operand  
else{
 //postfix = postfix + String(stack[j]);
  postfix.push(stack[j]);
 }//end of else push it onto the parsed string.
}//end of For loop for infix notation.
 if(operatorStack.length >= 1){
  while(operatorStack.length > 0){
   //postfix = postfix + String(operatorStack.pop());
   postfix.push(operatorStack.pop());
  }//end of while opstack empty loop
 }//end of check if opstack is empty.
 //alert("end! Postfix:");
 //alert(postfix);
 operatorStack = [];
 prefixstack = [];
 var returnme = postfix;
 postfix = [];
 return returnme;
}//end of function


function hasDecimals(inputstack){
   if(inputstack.indexOf('.') == -1){
    return false;
   }
 return true;
}
//Need to add a function to convert decimals to floats before doing the infix to postfix conversion
//suggested logic: scan through list until you find a dot combine all bfeore and after dot that is not seperated
//by an operator.
//Then, concatenate all this onto a string and parseFlaot.
function decConsistencyCheck(inputstack){
   var isvalid = true;
   var opcheck = false;
   var abort = false;
   indicesarray = [];
   
   //find the dot indicies
   for(var k = 0; k < inputstack.length; k++){
    //alert(inputstack[k])
    if(String(inputstack[k]) == '.') {
     if((k != (inputstack.length-1))){
       if(String(inputstack[k+1]) == '.'){
         //alert("False in the first consistency check consecutive");
         isvalid = false;
         abort  = true;
       }
       if((k != 0) && (inputstack[k-1] in preceMap) && (inputstack[k+1] in preceMap)){
        isvalid = false;
        abort = true;
       }//checks for config like +.+
      }//end if decimals are next to each other
     indicesarray.push(k);
    }//end of index is a dot.
   }//end of filling indices array loop
    //UP TO the first dot.
   for(var m = 0; m < indicesarray[0] && !abort; m++){
      //if it's not all numbers up to the first decimal, then it's a bad expression.
      if(isNaN(inputstack[m]) && !(inputstack[m] in preceMap)){
        //alert("false because not number before decimal")
       isvalid = false;
       abort = true;
      }//end of isNaN if
     }//end of UP TO FIRST check loop
  //if there is just one decimal, and there is an operator after it.
   if(indicesarray.length == 1){
    for(var v = indicesarray[0]; v < inputstack.length; v++){
     if(inputstack[v] in preceMap){
       abort = true;
       opcheck = true;
     }
    }
   }
    //now check the rest of the string at this point, you should only need to check for operators
    //between decimals
  
    while(indicesarray.length >= 1 && !abort){
     firstdot = indicesarray[0];
     //if this isn't the last dot.
     if(indicesarray.length > 1){
       seconddot = indicesarray[1];
      }
     //if this is the last dot, then go to the end of the inputstack.
     else{
      seconddot = inputstack.length -1;
     }
     if((firstdot == seconddot) && (inputstack[firstdot-1] in preceMap)){
      isvalid = false;
     }
    
     for(var l = firstdot + 1; l < seconddot && !abort; l++){
      //if there is an operator seperating decimals, that's fine.
      //tihs stems the front of the indices array before it can find anything
      if(inputstack[l] in preceMap){
       opcheck = true;
      }//end of check for operators
     }//end of for loop.
      
     if((seconddot == (inputstack.length-1)) && (indicesarray.length == 1)){
      for(var n = firstdot + 1; n < seconddot && !abort; n++){
       if((firstdot != seconddot) && (isNaN(inputstack[n]) && !(String(inputstack[n]) in preceMap))){
        isvalid = false;
       }//end of makes ure the end has all numbers or operators
      }//end of for loop that iterates through indicesarray.
      }//end if second dot is the end of the list
      indicesarray.shift();
    }//end of while loop for indices array.
  if(!opcheck){
  // alert("opcheck did it");
   return false;
  }
  if(!isvalid){
   //alert("didn't pass consitency check isvalid false")
   return false;
  }
  return true;
}

function opConsistencyCheck(inputstack){
 if(inputstack[0] in preceMap || inputstack[inputstack.length-1] in preceMap){
  return false;
 }//end if ends check
 if((inputstack.length > 1) && (inputstack[0] in preceMap || inputstack[0] == '.')){
  if((inputstack[1] in preceMap) || (inputstack[1] == '.')){
   return false;
  }//end if next variable is operator or decimal
 }//end front operator and decimal check
 if(inputstack.length > 1 && ((inputstack[inputstack.length-1] in preceMap) || (inputstack[inputstack.length-1] == '.'))){
  if((inputstack[inputstack[inputstack.length-1]] in preceMap) || (inputstack[inputstack[inputstack.length-2]] == '.')){
   return false;
  }
 }
 for(var k = 0; k < inputstack.length; k++){
  if(inputstack[k] in preceMap && inputstack[k+1] in preceMap){
   return false;
  }
  if((k != 0) && (k != inputstack.length-1) && inputstack[k] == '.'){
   if(inputstack[k-1] in preceMap && inputstack[k+1] in preceMap){
    return false;
   }
  }
 }
 return true;
}

function convertNums(inputstack){
 var opindicies = [];
 var returnstack = [];
 var numstring = "";
 var lastop = "";
 var firstindex = 0;
 for(var b =0; b < inputstack.length; b++){
  if(String(inputstack[b]) in preceMap){
   opindicies.push(b);
  }//checks for operators in your array.
 }//end of for loop for index check
 //alert("opindicies");
 //alert(opindicies);
 while(opindicies.length >= 1){
  for(var c = firstindex; c < opindicies[0]; c++){
   if(!(inputstack[c] in preceMap)){
      numstring = numstring + String(inputstack[c]);
   }//if it's not an operator, push it onto the string.
  }//end of for loop up to current index
  returnstack.push(parseFloat(numstring));
  returnstack.push(inputstack[opindicies[0]]);
  numstring = "";
  firstindex = opindicies[0] +1;
  opindicies.shift();
  if(opindicies.length == 1){
   lastop = opindicies[0];
  }
  if(opindicies.length == 0){
   lastop = firstindex - 1;
  }
 }//end of indicies loop.
 numstring = "";
 for(var t = lastop+1; t < inputstack.length; t++){
  numstring = numstring + String(inputstack[t]);
 }
 returnstack.push(parseFloat(numstring));
 numstring = "";
 return returnstack;
}

function processarg(){
 //Check for operator consistency
  if(!opConsistencyCheck(prefixstack)){
   //alert("operators not consistent");
   allClear();
   document.getElementById("entry-box").innerHTML = "ERROR";
  }
  
  //if there are decimals, check for consistency
  var consistent = true;
  if(hasDecimals(prefixstack)){
   if(decConsistencyCheck(prefixstack)){
    consistent = true;
    //alert(decConsistencyCheck(prefixstack));
    }
    else{
     //alert("Not Consistent");
     consistent = false;
    }
  }
 if(consistent){
   prefixstack = convertNums(prefixstack);
   var postfixstack = inToPost(prefixstack);
   prefixstack = [postToTotal(postfixstack)[0]];
   document.getElementById("entry-box").innerHTML = String(postToTotal(postfixstack)[0]);
 }
}

function postToTotal(postfixlist){
  var poststack = [];
  for(var p = 0; p < postfixlist.length; p++){
   if(!(postfixlist[p] in preceMap)){
    poststack.push(postfixlist[p]);
   }
   else{
    //operator is post postfixlist[p]
    var tempvar = poststack.pop();
    var retVal = operatorfxns[postfixlist[p]](tempvar,poststack.pop());
    poststack.push(retVal);
   }
  }
  //alert("poststack");
  //alert(poststack);
 return poststack;
}
