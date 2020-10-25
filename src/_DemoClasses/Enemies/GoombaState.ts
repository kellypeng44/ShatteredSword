import State from "../../DataTypes/State/State";
import StateMachine from "../../DataTypes/State/StateMachine";
import GameNode from "../../Nodes/GameNode";
import GoombaController from "./GoombaController";

export default abstract class GoombaState extends State {
	owner: GameNode;
	gravity: number = 7000;
	parent: GoombaController

	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		
		this.owner = owner;
	}

	update(deltaT: number): void {
		// Do gravity
		this.parent.velocity.y += this.gravity*deltaT;
	}
}