import EnemyAI, { EnemyStates } from "../EnemyAI";
import EnemyState from "./EnemyState";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class Attack extends EnemyState {
    protected charged: string;
    protected attacked: string;

    onEnter(options: Record<string, any>): void {
        this.parent.attackTimer.start();
        this.parent.velocity.x = 0;
        this.parent.isAttaking = true;
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
                    break;
                case this.attacked:
                    this.finished(EnemyStates.ALERT);
                    break;
            }
        }
        super.update(deltaT);
    }

    onExit(): Record<string, any> {
        this.parent.isAttaking = false;
        (<AnimatedSprite>this.owner).animation.stop();
        return null;
    }
}