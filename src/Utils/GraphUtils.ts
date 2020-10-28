import Graph, { EdgeNode } from "../DataTypes/Graphs/Graph";

export default class GraphUtils {

	static djikstra(g: Graph, start: number): void {
		let i: number;		// Counter
		let p: EdgeNode;	// Pointer to edgenode
		let inTree: Array<boolean> 
		let distance: number;
		let v: number;		// Current vertex to process
		let w: number; 		// Candidate for next vertex
		let weight: number;	// Edge weight
		let dist;			// Best current distance from start

		for(i = 0; i < g.numVertices; i++){
			inTree[i] = false;
			distance[i] = Infinity;
			// parent[i] = -1;
		}
	}
}