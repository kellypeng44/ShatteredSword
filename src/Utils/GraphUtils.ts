import Graph, { EdgeNode } from "../DataTypes/Graphs/Graph";

export default class GraphUtils {

	static djikstra(g: Graph, start: number): Array<number> {
		let i: number;		// Counter
		let p: EdgeNode;	// Pointer to edgenode
		let inTree: Array<boolean> = new Array(g.numVertices);
		let distance: Array<number> = new Array(g.numVertices);
		let parent: Array<number> = new Array(g.numVertices);
		let v: number;		// Current vertex to process
		let w: number; 		// Candidate for next vertex
		let weight: number;	// Edge weight
		let dist;			// Best current distance from start

		for(i = 0; i < g.numVertices; i++){
			inTree[i] = false;
			distance[i] = Infinity;
			parent[i] = -1;
		}

		distance[start] = 0;
		v = start;

		while(!inTree[v]){
			inTree[v] = true;
			p = g.edges[v];

			while(p !== null){
				w = p.y;
				weight = p.weight;

				if(distance[w] > distance[v] + weight){
					distance[w] = distance[v] + weight;
					parent[w] = v;
				}

				p = p.next;
			}

			v = 0;

			dist = Infinity;

			for(i = 0; i <= g.numVertices; i++){
				if(!inTree[i] && dist > distance[i]){
					dist = distance;
					v = i;
				}
			}
		}

		return parent;

	}
}