import Stack from "../DataTypes/Stack";
import Vec2 from "../DataTypes/Vec2";
import GameNode from "../Nodes/GameNode";

/**
 * A path that AIs can follow. Uses finishMove() in Physical to determine progress on the route
 */
export default class NavigationPath {
	protected path: Stack<Vec2>
	protected currentMoveDirection: Vec2;
	protected distanceThreshold: number;

	constructor(path: Stack<Vec2>){
		this.path = path;
		console.log(path.toString())
		this.currentMoveDirection = Vec2.ZERO;
		this.distanceThreshold = 20;
	}

	isDone(): boolean {
		return this.path.isEmpty();
	}

	getMoveDirection(node: GameNode): Vec2 {
		// Return direction to next point in the nav
		return node.position.dirTo(this.path.peek());
	}

	handlePathProgress(node: GameNode): void {
		if(node.position.distanceSqTo(this.path.peek()) < this.distanceThreshold*this.distanceThreshold){
			// We've reached our node, move on to the next destination
			this.path.pop();
		}
	}
}