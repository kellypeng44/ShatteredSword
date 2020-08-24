import Collection from "./Collection";

export default class Queue<T> implements Collection{
	private readonly MAX_ELEMENTS: number;
	private q: Array<T>;
	private head: number;
	private tail: number;

    constructor(maxElements: number = 100){
        this.MAX_ELEMENTS = maxElements;
        this.q = new Array(this.MAX_ELEMENTS);
        this.head = 0;
        this.tail = 0;
    }

    enqueue(item: T): void{
        if((this.tail + 1) % this.MAX_ELEMENTS === this.head){
            throw "Queue full - cannot add element"
        }

        this.q[this.tail] = item;
        this.tail = (this.tail + 1) % this.MAX_ELEMENTS;
    }

    dequeue(): T {
        if(this.head === this.tail){
            throw "Queue empty - cannot remove element"
        }

        let item = this.q[this.head];
        this.head = (this.head + 1) % this.MAX_ELEMENTS;
        
        return item;
    }

    peekNext(): T {
        if(this.head === this.tail){
            throw "Queue empty - cannot get element"
        }

        let item = this.q[this.head];
        
        return item;
    }

    hasItems(): boolean {
        return this.head !== this.tail;
    }

    clear(): void {
        this.head = this.tail;
    }

    forEach(func: Function): void {
        let i = this.head;
        while(i !== this.tail){
            func(this.q[i]);
            i = (i + 1) % this.MAX_ELEMENTS;
        }
    }
}