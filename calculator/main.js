class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    addNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return
        if (this.previousOperand !== '') {
            this.compute()
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    changeSign() {
        if (!this.currentOperand) return
        if (this.currentOperand < 0) {
            this.currentOperand = Math.abs(this.currentOperand);
        } else {
            this.currentOperand = '-' + this.currentOperand;
            return
        }
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('ru', {maximumFractionDigits: 0})
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }

    compute() {
        let computation
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (!isNaN(prev) && (this.operation === '√' || this.operation === 'a ²')) {
            switch (this.operation) {
                case 'a ²':
                    computation = Math.pow(prev, 2);
                    break
                case '√':
                    prev < 0 ? computation = errorMessage : computation = Math.sqrt(prev);
                    break
                default:
                    return
            }
        } else {
            if (isNaN(prev) || (isNaN(current))) return
            switch (this.operation) {
                case '+':
                    computation = (prev*10 + current*10)/10
                    break
                case '-':
                    computation = (prev*10 - current*10)/10
                    break
                case '*':
                    computation = (prev*10 * current*10)/100
                    break
                case '÷':
                    computation = (prev*10 / current*10)/100
                    break
                default:
                    return
            }
        }
        this.currentOperand = computation.toFixed(15);
        this.operation = undefined;
        this.previousOperand = '';
    }

    updateDisplay() {
        if (this.currentOperand === errorMessage)  {
            this.currentOperandTextElement.innerText = this.currentOperand;
            calculator.clear();
        } else {
            this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        }
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const deleteButton = document.querySelector('[data-delete]');
const acButton = document.querySelector('[data-all-clear]');
const equalButton = document.querySelector('[data-equals]');

const squareButton = document.querySelector('[data-square-operation]');
const powButton = document.querySelector('[data-pow-operation]');

const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const changeSignButton = document.querySelector('[data-change-sign]');
const errorMessage = 'Don`t do it any more!)'

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

squareButton.addEventListener('click', (button) => {
    calculator.chooseOperation(button.target.innerText);
    calculator.compute();
    calculator.updateDisplay();
})

powButton.addEventListener('click', (button) => {
    calculator.chooseOperation(button.target.innerText);
    calculator.compute();
    calculator.updateDisplay();
})

changeSignButton.addEventListener('click', (button) => {
    calculator.changeSign();
    calculator.updateDisplay();
})

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.addNumber(button.innerText);
        calculator.updateDisplay();
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    })
})

equalButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
})

acButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
})

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
})
