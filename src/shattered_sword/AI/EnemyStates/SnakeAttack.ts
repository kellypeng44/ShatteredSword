import EnemyAI, { EnemyStates } from "../EnemyAI";
import EnemyState from "./EnemyState";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Shape from "../../../Wolfie2D/DataTypes/Shapes/Shape";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";

export default class Attack extends EnemyState {
    protected charged: string;
    protected attacked: string;

    onEnter(options: Record<string, any>): void {
        this.parent.attackTimer.start();
        this.parent.velocity.x = 0;
        this.charged = this.owner.id+"charged";
        this.attacked = this.owner.id+"attacked";

        // TODO replace DYING with CHARGING
        (<AnimatedSprite>this.owner).animation.play("DYING", false, this.charged);
        this.receiver.subscribe(this.charged);
        this.receiver.subscribe(this.attacked);
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
        console.log(this.parent.direction);
        (<Sprite>this.owner).invertX = this.parent.direction === 1 ? true : false ;
    }

    onExit(): Record<string, any> {
        (<AnimatedSprite>this.owner).animation.stop();
        return null;
    }
}