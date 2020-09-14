import Collection from "./Collection";

/**
 * Associates strings with elements of type T
 */
export default class Map<T> implements Collection {
	private map: Record<string, T>;

	constructor(){
		this.map = {};
	}

	/**
	 * Adds a value T stored at a key.
	 * @param key 
	 * @param value 
	 */
	add(key: string, value: T): void {
		this.map[key] = value;
	}

	/**
	 * Get the value associated with a key.
	 * @param key 
	 */
	get(key: string): T {
		return this.map[key];
	}

	/**
	 * Sets the value stored at key to the new specified value
	 * @param key 
	 * @param value 
	 */
	set(key: string, value: T): void {
		this.add(key, value);
	}

	/**
	 * Returns true if there is a value stored at the specified key, false otherwise.
	 * @param key 
	 */
	has(key: string): boolean {
		return this.map[key] !== undefined;
	}

	/**
	 * Returns an array of all of the keys in this map.
	 */
	keys(): Array<string> {
		return Object.keys(this.map);
	}
	
	forEach(func: (key: string) => void): void {
		Object.keys(this.map).forEach(key => func(key));
	}

	clear(): void {
		this.forEach(key => delete this.map[key]);
	}
}