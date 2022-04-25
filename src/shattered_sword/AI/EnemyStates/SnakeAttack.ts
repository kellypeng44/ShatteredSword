import EnemyAI, { EnemyStates } from "../EnemyAI";
import EnemyState from "./EnemyState";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Attack from "./Attack";

export default class SnakeAttack extends Attack {
    protected charged: string;
    protected attacked: string;

    onEnter(options: Record<string, any>): void {
        super.onEnter(options);
    }

    update(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent().type;
            switch (event) {
                case this.charged:
                    (<AnimatedSprite>this.owner).animation.play("ATTACK", false, this.attacked);
                    (<AABB>this.owner.collisionShape).halfSize.x += 3.5;
                    break;
                case this.attacked:
                    (<AABB>this.owner.collisionShape).halfSize.x -= 3.5;
                    this.finished(EnemyStates.ALERT);
                    break;
            }
        }
        (<Sprite>this.owner).invertX = this.parent.direction === 1 ? true : false ;
    }

    onExit(): Record<string, any> {
        (<AnimatedSprite>this.owner).animation.stop();
        return null;
    }
}