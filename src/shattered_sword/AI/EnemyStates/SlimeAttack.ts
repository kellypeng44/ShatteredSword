import EnemyAI, { EnemyStates } from "../EnemyAI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Attack from "./Attack";

export default class SlimeAttack extends Attack {
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
}