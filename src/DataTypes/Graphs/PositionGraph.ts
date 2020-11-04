import Graph, { MAX_V } from "./Graph";
import Vec2 from "../Vec2";
import { Debug_Renderable } from "../Interfaces/Descriptors";

export default class PositionGraph extends Graph implements Debug_Renderable{
	positions: Array<Vec2>;

	constructor(directed: boolean = false){
		super(directed);
		this.positions = new Array(MAX_V);
	}

	addPositionedNode(position: Vec2){
		this.positions[this.numVertices] = position;
		this.addNode();
	}

	setNodePosition(index: number, position: Vec2): void {
		this.positions[index] = position;
	}

	getNodePosition(index: number): Vec2 {
		return this.positions[index];
	}

	addEdge(x: number, y: number): void {
		if(!this.positions[x] || !this.positions[y]){
			throw "Can't add edge to un-positioned node!";
		}

		// Weight is the distance between the nodes
		let weight = this.positions[x].distanceTo(this.positions[y]);

		super.addEdge(x, y, weight);
	}

	protected nodeToString(index: number): string {
		return "Node " + index + " - " + this.positions[index].toString();
	}

	debug_render(ctx: CanvasRenderingContext2D, origin: Vec2, zoom: number): void {
		for(let point of this.positions){
			ctx.fillRect((point.x - origin.x - 4)*zoom, (point.y - origin.y - 4)*zoom, 8, 8);
		}
	}
}