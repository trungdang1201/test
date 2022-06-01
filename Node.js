class Node {
    constructor(data) {
        this.data = data;
        // this.next = null;
        this.left = null;
        this.right = null;
    }

    equal(value) {
        return this.data.value === value;
    }

    lessThan(value) {
        return this.data.value < value;
    }

    greaterThan(value) {
        return this.data.value > value;
    }

    greaterThanOrEqual(value) {
        return this.data.value >= value;
    }

    printData(left) {
        return this.data.printData(left);
    }
}
