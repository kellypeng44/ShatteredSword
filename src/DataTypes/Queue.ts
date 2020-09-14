import Collection from "./Collection";

/**
 * A FIFO queue with elements of type T
 */
export default class Queue<T> implements Collection {
	private readonly MAX_ELEMENTS: number;
	private q: Array<T>;
	private head: number;
    private tail: number;
    private size: number;

    constructor(maxElements: number = 100){
        this.MAX_ELEMENTS = maxElements;
        this.q = new Array(this.MAX_ELEMENTS);
        this.head = 0;
        this.tail = 0;
        this.size = 0;
    }

    /**
     * Adds an item to the back of the queue
     * @param item 
     */
    enqueue(item: T): void{
        if((this.tail + 1) % this.MAX_ELEMENTS === this.head){
            throw "Queue full - cannot add element"
        }

        this.size += 1;
        this.q[this.tail] = item;
        this.tail = (this.tail + 1) % this.MAX_ELEMENTS;
    }

    /**
     * Retrieves an item from the front of the queue
     */
    dequeue(): T {
        if(this.head === this.tail){
            throw "Queue empty - cannot remove element"
        }


        this.size -= 1;
        let item = this.q[this.head];
        // Now delete the item
        delete this.q[this.head];
        this.head = (this.head + 1) % this.MAX_ELEMENTS;
        
        return item;
    }

    /**
     * Returns the item at the front of the queue, but does not return it
     */
    peekNext(): T {
        if(this.head === this.tail){
            throw "Queue empty - cannot get element"
        }

        let item = this.q[this.head];
        
        return item;
    }

    /**
     * Returns true if the queue has items in it, false otherwise
     */
    hasItems(): boolean {
        return this.head !== this.tail;
    }

    /**
     * Returns the number of elements in the queue.
     */
    getSize(): number {
        return this.size;
    }

    clear(): void {
        this.forEach((item, index) => delete this.q[index]);
        this.size = 0;
        this.head = this.tail;
    }

    forEach(func: (item: T, index?: number) => void): void {
        let i = this.head;
        while(i !== this.tail){
            func(this.q[i], i);
            i = (i + 1) % this.MAX_ELEMENTS;
        }
    }
}