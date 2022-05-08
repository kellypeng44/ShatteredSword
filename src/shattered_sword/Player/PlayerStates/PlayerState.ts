import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { GameState, Player_Events } from "../../sword_enums";
import InputWrapper from "../../Tools/InputWrapper";
import PlayerController from "../PlayerController";


export default abstract class PlayerState extends State {
	owner: GameNode;
	gravity: number = 2500; //TODO - can change later
	parent: PlayerController;
	positionTimer: Timer;
	static dashTimer: Timer;
	static dashCoolDownTimer: Timer;

	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		this.owner = owner;
		this.positionTimer = new Timer(250);
		this.positionTimer.start();
		PlayerState.dashTimer = new Timer(100);
		PlayerState.dashCoolDownTimer = new Timer(600);

	}

	
	handleInput(event: GameEvent): void {
		
	}

	doDash(): void {
		if (PlayerState.dashCoolDownTimer.isStopped()) {
			//TODO - decide how to implement dash - could be a flash - maybe allow in air as well
			//play dash anim maybe
			//TODO - might give buffed speed stat to dash speed
			//TODO - give player i frame
			PlayerState.dashCoolDownTimer.start();
			PlayerState.dashTimer.start();
		}
	}

	/** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
	getInputDirection(): Vec2 {
		let direction = Vec2.ZERO;
		direction.x = (InputWrapper.isLeftPressed() ? -1 : 0) + (InputWrapper.isRightPressed() ? 1 : 0);
		direction.y = (InputWrapper.isJumpJustPressed() ? -1 : 0);
		return direction;
	}

	

	update(deltaT: number): void {
		// Do gravity
		
		if (this.positionTimer.isStopped()){
			this.emitter.fireEvent(Player_Events.PLAYER_MOVE, {position: this.owner.position.clone()});
			this.positionTimer.start();
		}
		

		if(InputWrapper.isDashJustPressed()){
			this.doDash();
		}
		if (!PlayerState.dashTimer.isStopped()) {
			this.parent.velocity.x = (<Sprite>this.owner).invertX ? -800 : 800;
		}
		if (InputWrapper.getState() === GameState.GAMING) {
			(<AnimatedSprite>this.parent.owner).animation.resume();
			this.parent.velocity.y += this.gravity*deltaT;
			this.owner.move(this.parent.velocity.scaled(deltaT));
		}
		else {
			(<AnimatedSprite>this.parent.owner).animation.pause();
		}
	}
}