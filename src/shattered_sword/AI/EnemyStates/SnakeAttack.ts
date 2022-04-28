import EnemyAI, { EnemyStates } from "../EnemyAI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Attack from "./Attack";

export default class SnakeAttack extends Attack {
    update(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent().type;
            switch (event) {
                case this.charged:
                    this.parent.isCharging = false;
                    this.parent.isAttaking = true;
                    (<AnimatedSprite>this.owner).animation.play("ATTACK", false, this.attacked);
                    (<AABB>this.owner.collisionShape).halfSize.x += 3.5;
                    break;
                case this.attacked:
                    this.parent.isAttaking = false;
                    (<AABB>this.owner.collisionShape).halfSize.x -= 3.5;
                    this.finished(EnemyStates.ALERT);
                    break;
            }
        }
        (<Sprite>this.owner).invertX = this.parent.direction === 1 ? true : false ;
    }
}