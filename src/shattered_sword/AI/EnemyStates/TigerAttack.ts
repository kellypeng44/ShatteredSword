import EnemyAI, { EnemyStates } from "../EnemyAI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Attack from "./Attack";

export default class TigerAttack extends Attack {
    protected velocity: number;
    protected distance: number;
    protected attacking: boolean = false;

    onEnter(options: Record<string, any>): void {
        super.onEnter(options);
        this.velocity = 0;
    }

    update(deltaT: number): void {
        if (this.attacking && this.owner.onGround) {
            this.emitter.fireEvent(this.attacked);
        }
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent().type;
            switch (event) {
                case this.charged:
                    this.parent.isCharging = false;
                    this.parent.isAttaking = true;
                    (<AnimatedSprite>this.owner).animation.play("ATTACK", true);
                    this.velocity = (this.parent.getPlayerPosition().x - this.owner.position.x)/2;
                    this.parent.direction = this.velocity >= 0 ? 1 : 0;
                    this.attacking = true;
                    break;
                case this.attacked:
                    this.parent.isAttaking = false;
                    this.finished(EnemyStates.ALERT);
                    break;
            }
        }
        this.parent.velocity.x = this.velocity;
        (<Sprite>this.owner).invertX = this.parent.direction === 1 ? true : false ;
        super.update(deltaT);
    }
}