import Map from "../DataTypes/Map";
import Vec2 from "../DataTypes/Vec2";
import InputHandler from "../Input/InputHandler";
import GameNode from "../Nodes/GameNode";
import Color from "../Utils/Color";

type DebugRenderFunction = (ctx: CanvasRenderingContext2D) => void;

export default class Debug {

	/** A map of log messages to display on the screen */ 
	private static logMessages: Map<string> = new Map();

	/** An array of game nodes to render debug info for */
	private static nodes: Array<GameNode>;

	/** The rendering context for any debug messages */
	private static debugRenderingContext: CanvasRenderingContext2D;

	/**	The size of the debug canvas */
	private static debugCanvasSize: Vec2;

	/** The rendering color for text */
	private static defaultTextColor: Color = Color.WHITE;

	/**
	 * Add a message to display on the debug screen
	 * @param id A unique ID for this message
	 * @param messages The messages to print to the debug screen
	 */
	static log(id: string, ...messages: any): void {
		// let message = "";
		// for(let i = 0; i < messages.length; i++){
		// 	message += messages[i].toString();
		// }
		// Join all messages with spaces
		let message = messages.map((m: any) => m.toString()).join(" ");
		this.logMessages.add(id, message);
	}

	/**
	 * Deletes a a key from the log and stops it from keeping up space on the screen
	 * @param id 
	 */
	static clearLogItem(id: string): void {
		this.logMessages.delete(id);
	}

	/**
	 * Sets the list of nodes to render with the debugger
	 * @param nodes The new list of nodes
	 */
	static setNodes(nodes: Array<GameNode>): void {
		this.nodes = nodes;
	}

	/**
	 * Draws a box at the specified position
	 * @param center The center of the box
	 * @param halfSize The dimensions of the box
	 * @param filled A boolean for whether or not the box is filled
	 */
	static drawBox(center: Vec2, halfSize: Vec2, filled: boolean, color: Color): void {
		if(filled){
			this.debugRenderingContext.fillStyle = color.toString();
			this.debugRenderingContext.fillRect(center.x - halfSize.x, center.y - halfSize.y, halfSize.x*2, halfSize.y*2);
		} else {
			let lineWidth = 2;
			this.debugRenderingContext.lineWidth = lineWidth;
			this.debugRenderingContext.strokeStyle = color.toString();
			this.debugRenderingContext.strokeRect(center.x - halfSize.x, center.y - halfSize.y, halfSize.x*2, halfSize.y*2);
		}
	}

	static drawRay(from: Vec2, to: Vec2, color: Color): void {
		this.debugRenderingContext.lineWidth = 2;
		this.debugRenderingContext.strokeStyle = color.toString();

		this.debugRenderingContext.beginPath();
		this.debugRenderingContext.moveTo(from.x, from.y);
		this.debugRenderingContext.lineTo(to.x, to.y);
		this.debugRenderingContext.closePath();
		this.debugRenderingContext.stroke();
	}

	static drawPoint(pos: Vec2, color: Color): void {
		let pointSize = 6;
		this.debugRenderingContext.fillStyle = color.toString();
		this.debugRenderingContext.fillRect(pos.x - pointSize/2, pos.y - pointSize/2, pointSize, pointSize);
	}

	static setDefaultTextColor(color: Color): void {
		this.defaultTextColor = color;
	}

	static initializeDebugCanvas(canvas: HTMLCanvasElement, width: number, height: number): CanvasRenderingContext2D {
        canvas.width = width;
		canvas.height = height;
		
		this.debugCanvasSize = new Vec2(width, height);

        this.debugRenderingContext = canvas.getContext("2d");

        return this.debugRenderingContext;
	}

	static clearCanvas(): void {
		this.debugRenderingContext.clearRect(0, 0, this.debugCanvasSize.x, this.debugCanvasSize.y);
	}

	static render(): void {
		this.renderText();
		this.renderNodes();
	}

	static renderText(): void {
		let y = 20;
		this.debugRenderingContext.font = "20px Arial";
		this.debugRenderingContext.fillStyle = this.defaultTextColor.toString();

		// Draw all of the text
		this.logMessages.forEach((key: string) => {
			this.debugRenderingContext.fillText(this.logMessages.get(key), 10, y)
			y += 30;	
		});
	}

	static renderNodes(): void {
		if(this.nodes){
			this.nodes.forEach(node => {
				node.debugRender();
			});
		}
	}
}