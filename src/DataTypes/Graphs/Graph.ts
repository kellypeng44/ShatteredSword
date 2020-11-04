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

		if(this.edges[x]){
			edge.next = this.edges[x];
		}
		
		this.edges[x] = edge;

		if(!this.directed){
			edge = new EdgeNode(x, weight);

			if(this.edges[y]){
				edge.next = this.edges[y];
			}
			
			this.edges[y] = edge;
		}

		this.numEdges += 1;
	}

	getEdges(x: number): EdgeNode {
		return this.edges[x];
	}

	getDegree(x: number): number {
		return this.degree[x];
	}

	protected nodeToString(index: number): string {
		return "Node " + index;
	}

	toString(): string {
		let retval = "";

		for(let i = 0; i < this.numVertices; i++){
			let edge = this.edges[i];
			let edgeStr = "";
			while(edge !== null){
				edgeStr += edge.y.toString();
				if(this.weighted){
					edgeStr += " (" + edge.weight + ")";
				}
				if(edge.next !== null){
					edgeStr += ", ";
				}

				edge = edge.next;
			}

			retval += this.nodeToString(i) + ": " + edgeStr + "\n";
		}

		return retval;
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