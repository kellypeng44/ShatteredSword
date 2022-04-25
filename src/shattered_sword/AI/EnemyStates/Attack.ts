import EnemyAI, { EnemyStates } from "../EnemyAI";
import EnemyState from "./EnemyState";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class Attack extends EnemyState {
    protected charged: string;
    protected attacked: string;

    onEnter(options: Record<string, any>): void {
        let event = this.owner.id+"charged";
        (<AnimatedSprite>this.owner).animation.play("DYING", false, event);
        this.receiver.subscribe(event);
    }

    update(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.receiver.getNextEvent();

        }
        let position = this.parent.getPlayerPosition();
        if (position) {
            this.parent.velocity.x = this.parent.maxSpeed * Math.sign(position.x - this.owner.position.x);
        }
        else {
            this.parent.velocity.x = 0;
            this.finished(EnemyStates.PATROL);
        }

        this.parent.direction = this.parent.velocity.x >= 0 ? 1 : -1;
        if (!this.canWalk()) {
            this.parent.velocity.x = 0;
        }

        (<Sprite>this.owner).invertX = this.parent.direction === 1 ? true : false ;
        super.update(deltaT);
    }

    onExit(): Record<string, any> {
        (<AnimatedSprite>this.owner).animation.stop();
        return null;
    }
}