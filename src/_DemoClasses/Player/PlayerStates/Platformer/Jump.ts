import Vec2 from "../../../../DataTypes/Vec2";
import GameEvent from "../../../../Events/GameEvent";
import MathUtils from "../../../../Utils/MathUtils";
import { CustomGameEventType } from "../../../CustomGameEventType";
import { PlayerStates } from "./PlayerController";
import PlayerState from "./PlayerState";

export default class Jump extends PlayerState {

	onEnter(): void {}

	handleInput(event: GameEvent): void {}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.collidedWithTilemap && this.owner.onCeiling){
			// We collided with a tilemap above us. First, get the tile right above us
			let pos = this.owner.position.clone();

			// Go up plus some extra
			pos.y -= (this.owner.collisionShape.halfSize.y + 10);
			pos = this.parent.tilemap.getColRowAt(pos);
			let tile = this.parent.tilemap.getTileAtRowCol(pos);

			console.log("Hit tile: " + tile);

			// If coin block, change to empty coin block
			if(tile === 4){
				this.parent.tilemap.setTileAtRowCol(pos, 12);
			}
		}

		if(this.owner.onGround){
			this.finished(PlayerStates.PREVIOUS);
		}

		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
		}
		
		let dir = this.getInputDirection();

		this.parent.velocity.x += dir.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x;

		this.emitter.fireEvent(CustomGameEventType.PLAYER_MOVE, {position: this.owner.position.clone()});
		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): void {}
}