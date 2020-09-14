import Map from "../DataTypes/Map";

export default class Debug {

	// A map of log messages to display on the screen
	private static logMessages: Map<string> = new Map();

	static log(id: string, message: string): void {
		this.logMessages.add(id, message);
	}

	// TODO: Create a method that can delete messages from the log

	static render(ctx: CanvasRenderingContext2D): void {
		let y = 20;
		ctx.font = "20px Arial";
		ctx.fillStyle = "#000000";
		this.logMessages.forEach((key: string) => {
			ctx.fillText(this.logMessages.get(key), 10, y)
			y += 30;	
		});
	}
}