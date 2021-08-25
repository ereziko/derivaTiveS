///Script for finding polynomials derivatives

//The script contains 3 parts:
//1. Methods for handling a basic math node
//   in the form ax^b.

//2. Methods for handling a math expression,
//   which might consist of some math nodes.

//3. Several test cases.

/* TODO
1) Preprocessing - Add trigonometric functions support
2) Language Support - Aggergate of elements in input
3) Language Support - Add parenthesis handling
*/

// Math node handling
// A math node is the basic x polynom in the form ax^b.

//Debugging Suppprt

let isDebug : boolean = false;

function debugPrint(msg : string | number) : void {
 if (isDebug) {
	console.log(msg);
 }
}

interface MathNode {
    // 3 x ^ 2
    // factor = 3
    // name = 'x
    // degree = 2
        factor : number;
        name : string;
        degree : number;
}
	
function deriveNode (single : MathNode) : MathNode {
    let result = { factor:0,
    degree:0,
    name: "Hmmm..." };
    if (single.degree == 0) {
            result = { factor:0, degree:0,
            name: single.name  };
   } else {
   let newFactor = single.factor*single.degree;
   let newDegree = single.degree-1;
        result = { factor: newFactor,
         degree: newDegree,
         name:single.name};
   }
   return result;
}

function extractNode( node : string ) : MathNode {
    let result = { factor:0,  degree:0,
         name: "Hmmm..."};
    debugPrint("Extracting: " + node);
    //MathNode is in the form of:

   //Preparations
        let nodeParts = node.split('^');

        let factorRegx = /-*[0-9]+/i;
        let nameRegx= /([a-z]|[A-Z])+/i;
        let degreeRegx = /([0-9]+[\/][0-9]+)|[0-9]+/g

        //Work:
        let factor = 0;
        if (nodeParts[0].match(factorRegx) &&
        nodeParts[0].match(factorRegx).length >
         0 ) {
        factor = eval(
        nodeParts[0].match(factorRegx)[0]);
        }

    let name = "";
    if ( nodeParts[0].match(nameRegx) &&
    nodeParts[0].match(nameRegx).length >
    0 ) {
         name = nodeParts[0].match(nameRegx)[0];
    }

    let degree = 0;

        if ( nodeParts.length > 1){
                degree = eval(
                nodeParts[1].match(degreeRegx)[0]);
        }

        if (name !== "") {
        if (degree == 0) {
            degree = 1;
        }
        if (factor == 0) {
                factor = 1;
        }
        }
        result.factor = factor;
		debugPrint(factor);
        result.name = name;
		debugPrint(name);
        result.degree = degree;
		debugPrint(degree);
		debugPrint(showNode(result));
        return result;
}

function showNode(node : MathNode):string {
   if (node.degree == 0) {
       return "" + node.factor;
   }
   if (node.degree == 1) {
       if (node.factor == 1) {
           return node.name;
       } else {
           return node.factor +  node.name ;
       }
   }
   return node.factor + node.name + "^" +
   node.degree;
}

// Math Expression handling 
// A math expression consists of one or more math nodes.


interface MathExpression {
   //"x^2 + x";
   //first = { factor:1, degree:2,name:"x" }
   //op = "plus";
   //rest = "x"
   first : MathNode;
   op : string;
   rest : string;
   elements?: MathNode[];
}

function showExp(exp : MathExpression):string {
    let result = "";
    if (exp.rest.length > 0) {
        let elements = exp.rest.split(' ');
        let current = elements[0];
		debugPrint(showNode(extractNode(current)));
        elements.shift();
        if (elements.length > 1) {
          let op = elements[0];
      elements.shift();
        exp.rest = elements.join(" ");
                showExp({first:exp.first,
                        op : exp.op,
                        rest: exp.rest});
			}
        }
        return result;
}

function deriveExp(exp : MathExpression ) : MathExpression {
       let result = { first : { factor:0, degree:0  , name: "" } ,
			op : "",
			rest: "" };
          exp.elements = [];
       if (exp.rest.length > 0) {
           let elements = exp.rest.split(' ');
           let current = elements[0];
          debugPrint(showNode(extractNode(current)));
          debugPrint("----->");
           let derived = showNode(deriveNode(
               extractNode(current)));
           elements.shift();
           if (elements.length > 1) {
              let op = elements[0];
              elements.shift();
              exp.rest = elements.join(" ");
              result = deriveExp({first:exp.first,
                   op : exp.op,
                   rest: exp.rest});
                   if (result.rest != "0") {
                     result.rest = op.concat( ' ',
                     result.rest)
                   }
           }
           if (result.rest == "0" ||
           result.rest == "") {
               result.rest = derived;
           } else {
               result.rest = derived.concat(' ',
               result.rest);
           }
       }
       return result;
}

function printNode(node : MathNode) {
        console.log(showNode(node));
}

// Testing

interface Test {
	input : string;
	expected : string;
}

let tests: Test[] = [

					//Math Node testing
					{input : "0", expected : "0"},
					{input : "1", expected : "0"},
					{input : "x", expected : "1"},
					{input : "5x", expected : "5"},
					{input : "x^2", expected : "2x"},
					{input : "3x^1/2", expected : "1.5x^-1/2"},

					//Math Expression testing					
					{input : "x^2 + x + 1", expected : "2x + 1"},
					{input : "x^2 - x", expected : "2x - 1"},
					{input : "x^4 + 25x^2 + 7", expected : "4x^3 + 50x"},
					{input : "-25x^2 - 14x + 1", expected : "-50x - 14"},
					
					//Parenthesis handling
					//{input : "2(x+3)", expected : "2"},
					//{input : "4(x^2-5x)", expected : "8x - 20"},
					
					//Aggergating elements
					//{input : "2x + 3x + 5x", expected : "8"},
					//{input : "3x^3 - x^3 + 2.5x^2", expected : "6x^2 + 5x"},
					
					//Trigonometric functions
					//{input : "sin x", expected : "cos x"},
					//{input : "cos x", expected : "- sin x"},
					//{input : "1", expected : "0"}
					];

console.log("Started testing derive...")

tests.forEach((test, index) => {
	let mathExp = {
      first: { factor:0, degree:0, name: "Hmmm..." } ,
      op : "",
      rest: tests[index].input};
      console.log(1+index+": For "+mathExp.rest);
      console.log("Result is : " +
      deriveExp( mathExp ).rest );
 console.log("Derivative should be "+ tests[index].expected + "\n");
});

console.log("Finished.")