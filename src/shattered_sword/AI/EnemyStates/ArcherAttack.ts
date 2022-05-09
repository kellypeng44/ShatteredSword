import EnemyAI, { EnemyStates } from "../EnemyAI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Attack from "./Attack";
import ArcherAI from "../ArcherAI";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../../Wolfie2D/Timing/Timer";

//TODO - unfinished 
export default class ArcherAttack extends Attack {
    pauseTimer : Timer;
    onEnter(options: Record<string, any>): void {
        super.onEnter(options);
        this.pauseTimer = new Timer(1000);
        this.pauseTimer.start();
    }

    update(deltaT: number): void {

        if(this.pauseTimer.isStopped()){
            this.parent.direction = this.parent.getPlayerPosition().x - this.owner.position.x >= 0 ? 1 : -1;
            let dir = this.parent.getPlayerPosition().clone().sub(this.owner.position).normalize();
            
            (<ArcherAI>this.parent).weapon.use(this.owner, "enemy", dir.scale(1,0));
            (<Sprite>this.owner).invertX = this.parent.direction === 1 ? true : false ;
            this.finished(EnemyStates.ALERT);
        }
        super.update(deltaT);
    }
    onExit(): Record<string, any> {
        
        return null;
    }
}