import { Physical } from "../../DataTypes/Interfaces/Descriptors";
import PhysicsUtils from "../../Utils/PhysicsUtils";
import SortingUtils from "../../Utils/SortingUtils";
import BroadPhase from "./BroadPhase";

export default class SweepAndPrune extends BroadPhase {
	protected xList: Array<Physical>;
	protected yList: Array<Physical>;

	constructor(){
		super();
		this.xList = new Array();
		this.yList = new Array();
	}

	addNode(node: Physical): void {
		this.xList.push(node);
		this.yList.push(node);
	}

	// TODO - Can optimize further by doing a callback whenever a swap occurs
	// TODO - And by using better pair management
	runAlgorithm(): Array<Physical[]> {
		// Sort the xList
		SortingUtils.insertionSort(this.xList, (a, b) => (a.sweptRect.left - b.sweptRect.left) );

		let xCollisions = [];
		for(let i = 0; i < this.xList.length; i++){
			let node = this.xList[i];

			let index = 1;
			while(i + index < this.xList.length && node.sweptRect.right >= this.xList[i + index].sweptRect.left){
				// Colliding pair in x-axis
				xCollisions.push([node, this.xList[i + index]]);
				index++;
			}
		}

		// Sort the y-list
		SortingUtils.insertionSort(this.yList, (a, b) => (a.sweptRect.top - b.sweptRect.top) );

		let yCollisions = [];
		for(let i = 0; i < this.yList.length; i++){
			let node = this.yList[i];

			let index = 1;
			while(i + index < this.yList.length && node.sweptRect.bottom >= this.yList[i + index].sweptRect.top){
				// Colliding pair in y-axis
				yCollisions.push([node, this.yList[i + index]]);
				index++;
			}
		}

		// Check the pairs
		let collisions = []
		for(let xPair of xCollisions){
			for(let yPair of yCollisions){
				if((xPair[0] === yPair[0] && xPair[1] === yPair[1])
				||(xPair[0] === yPair[1] && xPair[1] === yPair[0])){
					// Colliding in both axes, add to set
					collisions.push(xPair);
				}
			}
		}
		
		return collisions;
	}

}