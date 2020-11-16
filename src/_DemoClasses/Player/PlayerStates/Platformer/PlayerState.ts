import State from "../../../../DataTypes/State/State";
import StateMachine from "../../../../DataTypes/State/StateMachine";
import Vec2 from "../../../../DataTypes/Vec2";
import InputReceiver from "../../../../Input/InputReceiver";
import GameNode from "../../../../Nodes/GameNode";
import PlayerController from "../../PlayerController";


export default abstract class PlayerState extends State {
	input: InputReceiver = InputReceiver.getInstance();
	owner: GameNode;
	gravity: number = 7000;
	parent: PlayerController;

	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		this.owner = owner;
	}

	getInputDirection(): Vec2 {
		let direction = Vec2.ZERO;
		direction.x = (this.input.isPressed("a") ? -1 : 0) + (this.input.isPressed("d") ? 1 : 0);
		direction.y = (this.input.isJustPressed("w") ? -1 : 0);
		return direction;
	}

	updateLookDirection(direction: Vec2): void {
		// Update the owners look direction
	}

	update(deltaT: number): void {
		// Do gravity
		this.parent.velocity.y += this.gravity*deltaT;
	}
}