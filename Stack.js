class Stack {
	constructor() {
		this.head = null;
		this.size = 0;
	}

	push(node) {
		// const node = new Token(data);
		this.size++;
		node.next = this.head;
		this.head = node;
	}

	pop() {
		if (!this.head) {
			return null;
		}
		this.size--;
		let temp = this.head;
		this.head = this.head.next;
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
}
