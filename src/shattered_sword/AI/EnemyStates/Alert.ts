import EnemyAI, { EnemyStates } from "../EnemyAI";
import EnemyState from "./EnemyState";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class Alert extends EnemyState {
    onEnter(options: Record<string, any>): void {
        (<AnimatedSprite>this.owner).animation.playIfNotAlready("IDLE", true);
    }

    update(deltaT: number): void {
        if(!this.canWalk()){
            this.parent.direction *= -1;
        }

        let position = this.parent.getPlayerPosition();
        if (position) {
            this.parent.velocity.x = this.parent.maxSpeed * Math.sign(position.x - this.owner.position.x);
        }
        else {
            this.parent.velocity.x = 0;
            this.finished(EnemyStates.PATROL);
        }

        (<Sprite>this.owner).invertX = this.parent.velocity.x > 0 ? true : false ;
        super.update(deltaT);
    }

    onExit(): Record<string, any> {
        (<AnimatedSprite>this.owner).animation.stop();
        return null;
    }
}