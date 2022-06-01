let width;
let height;
let interval = 12000;
let d = 1;
let x1 = -5;
let x2 = 5;
let y1 = -50;
let y2 = 50;
let x = x1;
let step = (x2 - x1) / interval;
let y = 0;
const colors = [
	'#ff1a1a',
	'#ffff00',
	'#ff6600',
	'#ff0066',
	'#0000ff',
	'#00ff00',
	'#ff1aff',
	'#bfff00',
	'#ff3385',
	'#1affff',
	'#80ffbf',
	'#ff80bf',
	'#ffff80',
	'#99bbff',
];

function setup() {
	width = windowWidth - 20;
	height = windowHeight - 115;
	createCanvas(width, height);
	// colorMode(HSB, 50);
	colorMode(RGB);
	drawAxis();
}

function drawAll() {
	drawAxis();

	let expressions = document.getElementById('expressions').value;
	const expressionsList = expressions.split(';');

	for (let exp of expressionsList) {
		drawFunction(exp.trim());
	}
}

function drawAxis() {
	stroke(255);
	background(0);
	strokeWeight(1);
	line(0, height / 2, width, height / 2);
	line(width / 2, 0, width / 2, height);

	x1 = +document.getElementById('x1').value;
	if (x1 > 0) x1 = -x1;
	if (x1 === 0) x1 = -10;
	if (x1 < -200) x1 = -200;
	document.getElementById('x1').value = x1;
	x2 = -x1;
	document.getElementById('x2').innerHTML = x2;

	y1 = +document.getElementById('y1').value;
	if (y1 > 0) y1 = -y1;
	if (y1 === 0) y1 = -10;
	if (y1 < -200) y1 = -200;
	document.getElementById('y1').value = y1;
	y2 = -y1;
	document.getElementById('y2').innerHTML = y2;

	interval = +document.getElementById('interval').value;
	if (interval < 100) interval = 100;
	if (interval > 200000) interval = 100000;
	document.getElementById('interval').value = interval;
	step = (x2 - x1) / interval;
	let xInterval = int((x2 - x1) / 20);
	if (xInterval < 1) xInterval = 1;
	let yInterval = int((y2 - y1) / 20);
	if (yInterval < 1) yInterval = 1;
	x = 0;
	while (x < x2) {
		x += xInterval;
		line(
			map(x, x1, x2, 0, width),
			height / 2 - 10,
			map(x, x1, x2, 0, width),
			height / 2 + 10
		);
	}
	x = 0;
	while (x > x1) {
		x -= xInterval;
		line(
			map(x, x1, x2, 0, width),
			height / 2 - 10,
			map(x, x1, x2, 0, width),
			height / 2 + 10
		);
	}
	y = 0;
	while (y < y2) {
		y += yInterval;
		line(
			width / 2 - 10,
			map(y, y1, y2, 0, height),
			width / 2 + 10,
			map(y, y1, y2, 0, height)
		);
	}
	y = 0;
	while (y > y1) {
		y -= yInterval;
		line(
			width / 2 - 10,
			map(y, y1, y2, 0, height),
			width / 2 + 10,
			map(y, y1, y2, 0, height)
		);
	}

	noStroke();
}

function drawFunction(expression) {
	if (expression === '') return;

	let expressionTree = createExpressionTree(expression);
	if (!expressionTree) return;
	x = x1;
	stroke(colors[int(random(0, colors.length - 1))]);
	strokeWeight(1);
	while (x < x2) {
		x += step;
		y = evalExpressionTree(expressionTree, x);
		circle(map(x, x1, x2, 0, width), map(y, y1, y2, 0, height), d);
	}
}

function infixToPostfix(tokenQueue) {
	if (!tokenQueue) return;

	let stack;
	stack = new Stack();
	let resultQueue;
	resultQueue = new Queue();
	let result = '';
	const size = tokenQueue.size;
	let count = 0;

	while (!tokenQueue.isEmpty() && count++ < size) {
		const token = tokenQueue.dequeue();
		if (token.isOperand()) {
			result += ' ' + token.data;
			resultQueue.enqueue(token.data);
		} else if (stack.isEmpty() || token.data === '(') {
			stack.push(token);
		} else if (token.data === ')') {
			while (!stack.isEmpty()) {
				const op = stack.pop();
				if (op.precedence() === 4) break;
				result += ' ' + op.data;
				resultQueue.enqueue(op.data);
			}
		} else {
			let op = stack.peek();
			while (
				op &&
				op.precedence() !== 4 &&
				op.precedence() >= token.precedence()
			) {
				op = stack.pop();
				result += ' ' + op.data;
				resultQueue.enqueue(op.data);
				op = stack.peek();
			}
			stack.push(token);
		}
		tokenQueue.enqueue(token.data);
	}
	while (!stack.isEmpty()) {
		const op = stack.pop();
		result += ' ' + op.data;
		resultQueue.enqueue(op.data);
	}
	// console.log(result.trim());
	// resultQueue.printList2();
	return resultQueue;
}

function validateExpression(expression) {
	let parentheses = 0;
	for (let i = 0; i < expression.length; i++) {
		if (expression[i] === '(') parentheses++;
		if (expression[i] === ')') parentheses--;
		if (parentheses < 0) return false;
	}
	return parentheses === 0;
}

function validateOperators(queue) {
	if (!queue) return true;
	let opCount = 1;
	const size = queue.size;
	let count = 0;
	while (!queue.isEmpty() && count++ < size) {
		const token = queue.dequeue();
		if (token.isOperand()) {
			opCount = 0;
		} else if (token.data !== '(' && token.data !== ')') {
			opCount++;
			if (opCount > 1) {
				queue.enqueue(token.data);
				return false;
			}
		} else if (token.data === '(') {
			if (opCount === 0) {
				queue.enqueue(token.data);
				return false;
			}
		}
		queue.enqueue(token.data);
	}
	return true;
}

function validateTokens(queue) {
	if (!queue) return true;

	const size = queue.size;
	let count = 0;
	while (!queue.isEmpty() && count++ < size) {
		const token = queue.dequeue();
		if (token.isOperand()) {
			if (token.data.toString() !== (+token.data).toString()) {
				queue.enqueue(token.data);
				return false;
			}
		}
		queue.enqueue(token.data);
	}
	return true;
}

function evaluate(queue) {
	if (!queue) return 0;

	let stack;
	stack = new Stack();
	while (!queue.isEmpty()) {
		const token = queue.dequeue();
		if (token.isOperand()) {
			stack.push(token);
		} else {
			const operand2 = +stack.pop().data;
			const operand1 = +stack.pop().data;
			let value = 0;
			if (token.data === '+') {
				value = operand1 + operand2;
			} else if (token.data === '-') {
				value = operand1 - operand2;
			} else if (token.data === '*') {
				value = operand1 * operand2;
			} else if (token.data === '/') {
				value = operand1 / operand2;
			} else if (token.data === '^') {
				value = Math.pow(operand1, int(operand2));
			}
			// console.log(
			// 	operand1 + ' ' + token.data + ' ' + operand2 + ' = ',
			// 	value
			// );
			stack.push(new Token(value));
		}
	}
	let value = 0;
	if (!stack.isEmpty()) value = +stack.pop().data;

	return value;
}

function toTokens(expression) {
	if (expression.includes('%')) {
		console.log('Invalid expression');
		return null;
	}
	let tokenQueue;
	tokenQueue = new Queue();

	let exp = expression.replace(/\=/g, '');
	exp = exp.replace(/\=/g, '%');
	exp = exp.replace(/\=/g, '&');
	exp = exp.replace(/\(/g, ' ( ');
	exp = exp.replace(/\)/g, ' ) ');
	exp = exp.replace(/\+/g, ' + ');
	exp = exp.replace(/\-/g, ' - ');
	exp = exp.replace(/\*/g, ' * ');
	exp = exp.replace(/\//g, ' / ');
	exp = exp.replace(/\^/g, ' ^ ');
	exp = exp.replace(/  +/g, ' ');
	exp = exp.trim();
	if (!validateExpression(exp)) {
		console.log('Invalid expression');
		return null;
	}
	const tokens = exp.split(' ');
	tokens.forEach((token) => {
		tokenQueue.enqueue(token);
	});
	if (!validateOperators(tokenQueue)) {
		console.log('Invalid operators');
		return null;
	}
	console.log(tokenQueue.getList());
	return tokenQueue;
}

function createExpressionTree(expression) {
	let resultQueue;
	const queue = toTokens(expression);
	resultQueue = infixToPostfix(queue);

	if (!resultQueue) return null;

	let stack;
	stack = new Stack();
	let expressionTree;
	while (!resultQueue.isEmpty()) {
		const token = resultQueue.dequeue();
		if (token.isOperand()) {
			stack.push(token);
		} else {
			const operand2 = stack.pop().data;
			const operand1 = stack.pop().data;
			let operand1Node;
			let operand2Node;
			if (operand1 instanceof Node) {
				operand1Node = operand1;
			} else {
				operand1Node = new Node(operand1);
			}
			if (operand2 instanceof Node) {
				operand2Node = operand2;
			} else {
				operand2Node = new Node(operand2);
			}
			const operatorNode = new Node(token.data);
			operatorNode.left = operand1Node;
			operatorNode.right = operand2Node;
			expressionTree = operatorNode;
			stack.push(new Token(operatorNode));
		}
	}
	return expressionTree;
}

function evalAtNode(tree, x) {
	if (!tree) return 0;
	const leftValue = +evalAtNode(tree.left, x);
	const rightValue = +evalAtNode(tree.right, x);
	if (tree.data === '+') return leftValue + rightValue;
	if (tree.data === '-') return leftValue - rightValue;
	if (tree.data === '*') return leftValue * rightValue;
	if (tree.data === '/') return leftValue / rightValue;
	if (tree.data === '^') return Math.pow(leftValue, int(rightValue));
	return tree.data === 'x' ? x : +tree.data;
}

function evalExpressionTree(expressionTree, x) {
	return evalAtNode(expressionTree, +x);
}
