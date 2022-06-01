class Queue {
	constructor() {
		this.head = null;
		this.tail = null;
		this.size = 0;
	}

	enqueue(data) {
		const node = new Token(data);
		this.size++;
		if (!this.head) {
			this.head = node;
		}
		if (this.tail) {
			this.tail.next = node;
		}
		this.tail = node;
	}

	dequeue() {
		let temp = this.head;
		if (this.head) {
			this.head = this.head.next;
			this.size--;
		}
		return temp;
	}

	peek() {
		return this.head;
	}

	isEmpty() {
		return this.size === 0;
	}

	printList() {
		let temp = this.head;
		while (temp) {
			temp.printData();
			temp = temp.next;
		}
	}

	printList2() {
		let temp = this.head;
		let output = '';
		while (temp) {
			output += '(' + temp.data + ') ';
			temp = temp.next;
		}
		console.log(output);
	}

	getList() {
		let temp = this.head;
		let output = '';
		while (temp) {
			output += temp.data + ' ';
			temp = temp.next;
		}
		return output;
	}

	getList2() {
		let temp = this.head;
		let output = '';
		while (temp) {
			if (temp.isOperator()) output += temp.data + ' ';
			else output += '(' + temp.data + ') ';
			temp = temp.next;
		}
		return output;
	}
}
