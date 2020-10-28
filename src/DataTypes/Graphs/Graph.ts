export const MAX_V = 100;

export default class Graph {
	edges: Array<EdgeNode>;
	degree: Array<number>;
	numVertices: number;
	numEdges: number;
	directed: boolean;
	weighted: boolean;

	constructor(directed: boolean = false){
		this.directed = directed;
		this.weighted = false;

		this.numVertices = 0;
		this.numEdges = 0;

		this.edges = new Array(MAX_V);
		this.degree = new Array(MAX_V);
	}

	addNode(): number {
		this.numVertices++;
		return this.numVertices;
	}

	addEdge(x: number, y: number, weight?: number){
		let edge = new EdgeNode(y, weight);

		edge.next = this.edges[x];

		this.edges[x] = edge;
		this.numEdges += 1;
	}

	getEdges(x: number): EdgeNode {
		return this.edges[x];
	}

	getDegree(x: number): number {
		return this.degree[x];
	}
}

export class EdgeNode {
	y: number;
	next: EdgeNode;
	weight: number;

	constructor(index: number, weight?: number){
		this.y = index;
		this.next = null;
		this.weight = weight ? weight : 1;
	}
}