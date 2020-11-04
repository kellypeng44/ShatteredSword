import PositionGraph from "../DataTypes/Graphs/PositionGraph";
import { Navigable } from "../DataTypes/Interfaces/Descriptors";
import Stack from "../DataTypes/Stack";
import Vec2 from "../DataTypes/Vec2";
import GraphUtils from "../Utils/GraphUtils";
import NavigationPath from "./NavigationPath";

export default class Navmesh implements Navigable {
	protected graph: PositionGraph;

	constructor(graph: PositionGraph){
		this.graph = graph;
	}

	getNavigationPath(fromPosition: Vec2, toPosition: Vec2): NavigationPath {
		let start = this.getClosestNode(fromPosition);
		let end = this.getClosestNode(toPosition);

		let parent = GraphUtils.djikstra(this.graph, start);

		let pathStack = new Stack<Vec2>(this.graph.numVertices);
		
		// Push the final position and the final position in the graph
		pathStack.push(toPosition.clone());
		pathStack.push(this.graph.positions[end]);

		// Add all parents along the path
		let i = end;
		while(parent[i] !== -1){
			pathStack.push(this.graph.positions[parent[i]]);
			i = parent[i];
		}

		return new NavigationPath(pathStack);
	}

	getClosestNode(position: Vec2): number {
		let n = this.graph.numVertices;
		let i = 1;
		let index = 0;
		let dist = position.distanceSqTo(this.graph.positions[0]);
		while(i < n){
			let d = position.distanceSqTo(this.graph.positions[i]);
			if(d < dist){
				dist = d;
				index = i;
			}
			i++;
		}

		return index;
	}
}