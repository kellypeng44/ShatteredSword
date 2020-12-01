import State from "../../DataTypes/State/State";
import StateMachine from "../../DataTypes/State/StateMachine";
import GameEvent from "../../Events/GameEvent";
import GameNode from "../../Nodes/GameNode";
import GoombaController, { GoombaStates } from "./GoombaController";

export default abstract class GoombaState extends State {
	owner: GameNode;
	gravity: number = 1000;
	parent: GoombaController

	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		
		this.owner = owner;
	}

	handleInput(event: GameEvent): void {}

	update(deltaT: number): void {
		// Do gravity
		this.parent.velocity.y += this.gravity*deltaT;
	}
}