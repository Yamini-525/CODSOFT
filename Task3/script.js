class Calculator {
  constructor(calculatorScreen) {
    this.calculatorScreen = calculatorScreen;
    this.reset();
  }

  reset() {
    this.displayValue = "0";
    this.firstOperand = null;
    this.waitingForSecondOperand = false;
    this.operator = null;
  }

  inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = this;

    if (waitingForSecondOperand === true) {
      this.displayValue = digit;
      this.waitingForSecondOperand = false;
    } else {
      this.displayValue = displayValue === "0" ? digit : displayValue + digit;
    }
  }

  inputDecimal(dot) {
    if (this.waitingForSecondOperand) return;

    if (!this.displayValue.includes(dot)) {
      this.displayValue += dot;
    }
  }

  handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = this;
    const inputValue = parseFloat(displayValue);

    if (operator && this.waitingForSecondOperand) {
      this.operator = nextOperator;
      return;
    }

    if (firstOperand == null) {
      this.firstOperand = inputValue;
    } else if (operator) {
      const result = this.performCalculation[operator](
        firstOperand,
        inputValue
      );

      this.displayValue = String(result);
      this.firstOperand = result;
    }

    this.waitingForSecondOperand = true;
    this.operator = nextOperator;
  }

  performCalculation = {
    "/": (firstOperand, secondOperand) => firstOperand / secondOperand,

    "*": (firstOperand, secondOperand) => firstOperand * secondOperand,

    "+": (firstOperand, secondOperand) => firstOperand + secondOperand,

    "-": (firstOperand, secondOperand) => firstOperand - secondOperand,

    "=": (firstOperand, secondOperand) => secondOperand,
  };

  updateDisplay() {
    this.calculatorScreen.value = this.displayValue;
  }
}

const calculator = new Calculator(document.querySelector(".calculator-screen"));

const keys = document.querySelector(".calculator-keys");
keys.addEventListener("click", (event) => {
  const { target } = event;
  if (!target.matches("button")) {
    return;
  }

  if (target.classList.contains("operator")) {
    calculator.handleOperator(target.value);
    calculator.updateDisplay();
    return;
  }

  if (target.classList.contains("decimal")) {
    calculator.inputDecimal(target.value);
    calculator.updateDisplay();
    return;
  }

  if (target.classList.contains("all-clear")) {
    calculator.reset();
    calculator.updateDisplay();
    return;
  }

  calculator.inputDigit(target.value);
  calculator.updateDisplay();
});
