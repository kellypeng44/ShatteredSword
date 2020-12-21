import Vec2 from "../../../../DataTypes/Vec2";
import GameEvent from "../../../../Events/GameEvent";
import AnimatedSprite from "../../../../Nodes/Sprites/AnimatedSprite";
import { EaseFunctionType } from "../../../../Utils/EaseFunctions";
import MathUtils from "../../../../Utils/MathUtils";
import { CustomGameEventType } from "../../../CustomGameEventType";
import Level1, { MarioEvents } from "../../../Mario/Level1";
import { PlayerStates } from "./PlayerController";
import PlayerState from "./PlayerState";

export default class Jump extends PlayerState {
	owner: AnimatedSprite;

	onEnter(): void {
		this.owner.animation.play("JUMP", true);
	}

	handleInput(event: GameEvent): void {}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.collidedWithTilemap && this.owner.onCeiling){
			// We collided with a tilemap above us. First, get the tile right above us
			let pos = this.owner.position.clone();

			// Go up plus some extra
			pos.y -= (this.owner.collisionShape.halfSize.y + 10);
			pos.x -= 16;
			let rowCol = this.parent.tilemap.getColRowAt(pos);
			let tile1 = this.parent.tilemap.getTileAtRowCol(rowCol);
			pos.x += 16;
			rowCol = this.parent.tilemap.getColRowAt(pos);
			let tile2 = this.parent.tilemap.getTileAtRowCol(rowCol);
			pos.x += 16;
			rowCol = this.parent.tilemap.getColRowAt(pos);
			let tile3 = this.parent.tilemap.getTileAtRowCol(rowCol);

			let t1 = tile1 === 17;
			let t2 = tile2 === 17;
			let t3 = tile3 === 17;
			let air1 = tile1 === 0;
			let air2 = tile2 === 0;
			let air3 = tile3 === 0;
			let majority = (t1 && t2) || (t1 && t3) || (t2 && t3) || (t1 && t2 && t3);
			let minorityButAir = (t1 && air2 && air3) || (air1 && t2 && air3) || (air1 && air2 && t3);
			
			// If coin block, change to empty coin block
			if(majority || minorityButAir){
				if(minorityButAir){
					// Get the correct position
					if(t1){
						pos.x -= 32;
					} else if(t2){
						pos.x -= 16;
					}
					rowCol = this.parent.tilemap.getColRowAt(pos);
				} else {
					pos.x -= 16;
					rowCol = this.parent.tilemap.getColRowAt(pos);
				}

				this.parent.tilemap.setTileAtRowCol(rowCol, 18);
				this.emitter.fireEvent(MarioEvents.PLAYER_HIT_COIN_BLOCK);

				let tileSize = this.parent.tilemap.getTileSize();
				this.parent.coin.position.copy(rowCol.scale(tileSize.x, tileSize.y).add(tileSize.scaled(0.5)));

				// Animate collision
				this.parent.coin.tweens.add("coin", {
					startDelay: 0,
					duration: 300,
					effects: [{
						property: "positionY",
						resetOnComplete: false,
						start: this.parent.coin.position.y,
						end: this.parent.coin.position.y - 2*tileSize.y,
						ease: EaseFunctionType.OUT_SINE
					},
					{
						property: "alpha",
						resetOnComplete: false,
						start: 1,
						end: 0,
						ease: EaseFunctionType.OUT_SINE
					}]
				});

				this.parent.coin.tweens.play("coin");
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

	onExit(): void {
		this.owner.animation.stop();
	}
}