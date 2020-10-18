import State from "../../DataTypes/State/State";
import StateMachine from "../../DataTypes/State/StateMachine";
import Goomba from "../MarioClone/Goomba";

export default abstract class GoombaState extends State {
	owner: Goomba;
	gravity: number = 7000;

	constructor(parent: StateMachine, owner: Goomba){
		super(parent);
		
		this.owner = owner;
	}

	update(deltaT: number): void {
		// Do gravity;
		this.owner.velocity.y += this.gravity*deltaT;
	}
}