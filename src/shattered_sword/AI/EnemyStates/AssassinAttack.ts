import EnemyAI, { EnemyStates } from "../EnemyAI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Attack from "./Attack";
import AssassinAI from "../ArcherAI";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

//TODO - unfinished 
export default class AssassinAttack extends Attack {
    runTimer: Timer;
    startPosition : Vec2;
    pauseTimer : Timer;

    onEnter(options: Record<string, any>): void {
        super.onEnter(options);
        this.runTimer = new Timer(500);
        this.pauseTimer = new Timer(1000);

        
        this.owner.alpha = 1;  //unstealth to attack
        this.startPosition = this.owner.position;
        
        if(this.parent.getPlayerPosition() !==null)
            this.owner.position = this.parent.getPlayerPosition().clone().add(new Vec2( (<Sprite>this.parent.player).invertX ? 64 : -64 ,0));
        
        this.pauseTimer.start();
        
    }

    
    update(deltaT: number): void {
       

        if( this.pauseTimer.isStopped()){
            if (this.runTimer.isStopped() && this.parent.isAttacking || !this.canWalk()) {
                this.emitter.fireEvent(this.attacked);
            }
            while (this.receiver.hasNextEvent()) {
                let event = this.receiver.getNextEvent().type;
                switch (event) {
                    case this.charged:
                        this.parent.isCharging = false;
                        this.parent.isAttacking = true;
                        this.runTimer.start();
                        (<AnimatedSprite>this.owner).animation.play("ATTACK", true);
                        if(this.parent.getPlayerPosition() !==null)
                            this.parent.direction = this.parent.getPlayerPosition().x - this.owner.position.x >= 0 ? 1 : -1;
                        break;
                    case this.attacked:
                        this.parent.isAttacking = false;
                        this.finished(EnemyStates.ALERT);
                        break;
                }
            }
            this.parent.velocity.x = this.parent.direction * 500;
            (<Sprite>this.owner).invertX = this.parent.direction === 1 ? true : false ;
            super.update(deltaT);
        }
        
        
        
    }

    onExit(): Record<string, any> {
        this.owner.alpha = .2;  //stealth again
        //this.owner.position = this.startPosition;
        return null;
    }
}