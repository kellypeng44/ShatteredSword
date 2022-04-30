import EnemyAI, { EnemyStates } from "../EnemyAI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Attack from "./Attack";
import Timer from "../../../Wolfie2D/Timing/Timer";

export default class TigerAttack extends Attack {
    runTimer: Timer;

    onEnter(options: Record<string, any>): void {
        super.onEnter(options);
        this.runTimer = new Timer(2000);
    }

    update(deltaT: number): void {
        if (this.runTimer.isStopped() && this.parent.isAttaking || !this.canWalk()) {
            this.emitter.fireEvent(this.attacked);
        }
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent().type;
            switch (event) {
                case this.charged:
                    this.parent.isCharging = false;
                    this.parent.isAttaking = true;
                    this.runTimer.start();
                    (<AnimatedSprite>this.owner).animation.play("ATTACK", true);
                    this.parent.direction = this.parent.getPlayerPosition().x - this.owner.position.x >= 0 ? 1 : 0;
                    break;
                case this.attacked:
                    this.parent.isAttaking = false;
                    this.finished(EnemyStates.ALERT);
                    break;
            }
        }
        this.parent.velocity.x = this.parent.direction * 1000;
        (<Sprite>this.owner).invertX = this.parent.direction === 1 ? true : false ;
        super.update(deltaT);
    }
}