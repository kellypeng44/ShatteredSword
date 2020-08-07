import Collection from "./Collection";

export default class Map<T> implements Collection{
	private map: Record<string, T>;

	constructor(){
		this.map = {};
	}

	add(key: string, value: T): void {
		this.map[key] = value;
	}

	get(key: string): T {
		return this.map[key];
	}

	set(key: string, value: T): void {
		this.add(key, value);
	}

	has(key: string): boolean {
		return this.map[key] !== undefined;
	}

	keys(): Array<string> {
		return Object.keys(this.map);
	}
	
	forEach(func: Function): void {
		Object.keys(this.map).forEach(key => func(key));
	}
}