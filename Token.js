class Token {
	constructor(data) {
		this.data = data;
		this.next = null;
	}

	isOperator() {
		return (
			this.data === '+' ||
			this.data === '-' ||
			this.data === '*' ||
			this.data === '/' ||
			this.data === '^' ||
			this.data === '(' ||
			this.data === ')'
		);
	}

	precedence() {
		if (this.isOperand()) return -10;
		if (this.data === '+' || this.data === '-') return 1;
		if (this.data === '*' || this.data === '/') return 2;
		if (this.data === '^') return 3;
		if (this.data === '(') return 4;
		if (this.data === ')') return 5;
	}

	isOperand() {
		return !this.isOperator();
	}

	printData() {
		console.log(
			this.data +
				': ' +
				(this.isOperator() ? 'op' : 'operand') +
				': precedence = ' +
				this.precedence()
		);
	}
}
