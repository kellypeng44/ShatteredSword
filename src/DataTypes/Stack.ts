import Collection from "./Collection";

/**
 * A LIFO stack with items of type T
 */
export default class Stack<T> implements Collection {
	readonly MAX_ELEMENTS: number;
	private stack: Array<T>;
	private head: number;

    constructor(maxElements: number = 100){
        this.MAX_ELEMENTS = maxElements;
        this.stack = new Array<T>(this.MAX_ELEMENTS);
        this.head = -1;
    }
    
    /**
     * Adds an item to the top of the stack
     * @param item The new item to add to the stack
     */
    push(item: T): void {
        if(this.head + 1 === this.MAX_ELEMENTS){
            throw "Stack full - cannot add element";
        }
        this.head += 1;
        this.stack[this.head] = item;
    }

    /**
     * Removes an item from the top of the stack
     */
    pop(): T {
        if(this.head === -1){
            throw "Stack empty - cannot remove element";
        }
        this.head -= 1;
        return this.stack[this.head + 1];
    }

    /**
     * Returns the element currently at the top of the stack
     */
    peek(): T {
        if(this.head === -1){
            throw "Stack empty - cannot get element";
        }
        return this.stack[this.head];
    }

    clear(): void {
        this.forEach((item, index) => delete this.stack[index]);
        this.head = -1;
    }

    /**
     * Returns the number of items currently in the stack
     */
    size(): number {
        return this.head + 1;
    }

    forEach(func: (item: T, index?: number) => void): void{
        let i = 0;
        while(i <= this.head){
            func(this.stack[i]);
            i += 1;
        }
    }
}