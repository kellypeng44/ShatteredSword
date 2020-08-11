import Map from "../DataTypes/Map";

export default class Debug {
	private static instance: Debug = null;

	logIds: number;
	logMessages: Map<string>;
	

	constructor(){
		this.logIds = 0;
		this.logMessages = new Map();
	};

	static getInstance(): Debug {
		if(this.instance === null){
			this.instance = new Debug();
		}

		return this.instance;
	}

	log(id: string, message: string): void {
		this.logMessages.add(id, message);
	}

	render(ctx: CanvasRenderingContext2D): void {
		let y = 20;
		ctx.font = "20px Arial";
		ctx.fillStyle = "#000000";
		this.logMessages.forEach((key: string) => {
			ctx.fillText(this.logMessages.get(key), 10, y)
			y += 30;	
		});
	}
}