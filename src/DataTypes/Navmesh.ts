import PositionGraph from "./Graphs/PositionGraph"
import Vec2 from "./Vec2";

export default class Navmesh {
	protected graph: PositionGraph;

	getNavigationPath(fromPosition: Vec2, toPosition: Vec2): Array<number> {
		return [];
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