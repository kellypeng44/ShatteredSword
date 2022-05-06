import EnemyAI, { EnemyStates } from "../EnemyAI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Attack from "./Attack";
import ArcherAI from "../ArcherAI";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";

//TODO - unfinished 
export default class ArcherAttack extends Attack {
    onEnter(options: Record<string, any>): void {
    }
    update(deltaT: number): void {

       
        this.parent.direction = this.parent.getPlayerPosition().x - this.owner.position.x >= 0 ? 1 : 0;
        let dir = this.parent.getPlayerPosition().clone().sub(this.owner.position).normalize();
        (<ArcherAI>this.parent).weapon.use(this.owner, "enemy", dir.scale(1,0));

        (<Sprite>this.owner).invertX = this.parent.direction === 1 ? true : false ;
        
        this.finished(EnemyStates.ALERT);
    }
    onExit(): Record<string, any> {
        return null;
    }
}