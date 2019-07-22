class Calculator {

   private readonly _operators: string[] = ["-", "+", "/", "*"];

   public calculate(exp: string): number {
      const eq: string[] = exp.split(" ");
      const stack: number[] = [];

      const evaluate: Function = (a: number, b: number, operator: string) => {
         let result: number;

         switch (operator) {
            case "+":
               result = a + b;
               break;
            case "-":
               result = a - b;
               break;
            case "/":
               result = a / b;
               break;
            case "*":
               result = a * b;
               break;
            default:
               throw new Error(`${operator} is not a valid operand`);
         }

         return result;
      };

      for (let i = 0; i < eq.length; i++) {
         const char: string = eq[i];
         if (!this.checkOperator(char)) {
            stack.push(parseFloat(char));
         }
         else {
            let a: number | undefined = stack.pop();
            let b: number | undefined = stack.pop();
            let result: number = evaluate(b, a, char);
            stack.push(result);
         }
      }
      return stack.pop() as number;
   };

   public refactor(exp: string): string {
      const eq: string[] = exp.split(" ");
      const stack: string[] = [];
      let postFix: string = "";
      const precedence = [1, 1, 3, 3];

      //this returns TRUE if precedence of op2 is greater or equal than op1
      const checkPrecedence = (op1: string, op2: string): boolean =>
         precedence[this._operators.indexOf(op1)] <= precedence[this._operators.indexOf(op2)]
            ? true
            : false;

      for (let i = 0; i < eq.length; i++) {
         const char: string = eq[i];

         if (char == " ") {
            //do nothing if it is whitespace
         }
         else if (!this.checkOperator(char) && char != "(" && char != ")") {
            postFix = postFix.concat(char + " ");
         }
         else if (char == "(") {
            stack.push(char);
         }
         else if (char == ")") {
            while (stack.length > 0 && stack[stack.length - 1] != "(") {
               postFix = postFix.concat(stack.pop() + " ");
            }
            stack.pop();
         }
         else if (this.checkOperator(char)) {
            if (stack.length == 0 || stack[stack.length - 1] == "(") {
               stack.push(char);
            }
            else {
               while (
                  stack.length > 0 &&
                  stack[stack.length - 1] != "(" &&
                  checkPrecedence(char, stack[stack.length - 1])
               ) {
                  postFix = postFix.concat(stack.pop() + " ");
               }
               stack.push(char);
            }
         }
      }

      while (stack.length != 0) {
         postFix = postFix.concat(stack.pop() + " ");
      }

      postFix = postFix.trim();

      return postFix;
   };


   private checkOperator(character: string): boolean {
      return this._operators.some(operand => operand == character);
   }

}

export function calculateExpression(exp: string): number {
   const calc: Calculator = new Calculator();

   let postFix: string = calc.refactor(exp);

   console.log(postFix);

   let result: number = calc.calculate(postFix);

   return result;
}

