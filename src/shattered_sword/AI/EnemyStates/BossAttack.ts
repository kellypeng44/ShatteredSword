import EnemyAI, { EnemyStates } from "../EnemyAI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Attack from "./Attack";
import BossAI from "../BossAI";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
//TODO - unfinished 
export default class BossAttack extends Attack {
    runTimer: Timer;
    startPosition : Vec2;
    pauseTimer : Timer;
    atknum : number;
    protected velocity: number;
    protected distance: number;

    onEnter(options: Record<string, any>): void {
        super.onEnter(options);
        this.pauseTimer = new Timer(1000);
        this.pauseTimer.start();
        this.atknum = Math.floor(Math.random() * 5);
        
        this.owner.alpha = 1;  //unstealth to attack
        switch( this.atknum){
            case 0: //archer atk
                this.pauseTimer = new Timer(1000);
                this.pauseTimer.start();
                break;
            case 1: //assassin atk
                this.runTimer = new Timer(500);
                this.pauseTimer = new Timer(1000);
                this.startPosition = this.owner.position;
                if(this.parent.getPlayerPosition() !==null)
                    this.owner.position = this.parent.getPlayerPosition().clone().add(new Vec2( (<Sprite>this.parent.player).invertX ? 64 : -64 ,0));
                
                this.pauseTimer.start();
                break;
            case 2: //bull atk
                this.runTimer = new Timer(2000);
                break;
            case 3: //tiger atk
                this.velocity = 0;
                break;
            case 4: //snake atk
                break;
            default:
                break;
        }

    }

    update(deltaT: number): void {

        //get random atk 
        switch( this.atknum){
            case 0: //archer atk
                if(this.pauseTimer.isStopped()){
                    this.parent.direction = this.parent.getPlayerPosition().x - this.owner.position.x >= 0 ? 1 : -1;
                    let dir = this.parent.getPlayerPosition().clone().sub(this.owner.position).normalize();
                    
                    (<BossAI>this.parent).weapon.use(this.owner, "enemy", dir.scale(1,0));
                    (<Sprite>this.owner).invertX = this.parent.direction === 1 ? true : false ;
                    this.finished(EnemyStates.ALERT);
                }
                super.update(deltaT);
                break;
            case 1: //assassin atk
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
                    this.owner.alpha = .2;
                    super.update(deltaT);
                }
                break;
            case 2: //bull atk
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
                            this.parent.direction = this.parent.getPlayerPosition().x - this.owner.position.x >= 0 ? 1 : -1;
                            break;
                        case this.attacked:
                            this.parent.isAttacking = false;
                            this.finished(EnemyStates.ALERT);
                            break;
                    }
                }
                this.parent.velocity.x = this.parent.direction * 1000;
                (<Sprite>this.owner).invertX = this.parent.direction === 1 ? true : false ;
                super.update(deltaT);
                break;
            case 3: //tiger atk
                if (this.parent.isAttacking && this.owner.onGround) {
                    this.emitter.fireEvent(this.attacked);
                }
                while (this.receiver.hasNextEvent()) {
                    let event = this.receiver.getNextEvent().type;
                    switch (event) {
                        case this.charged:
                            this.parent.isCharging = false;
                            this.parent.isAttacking = true;
                            (<AnimatedSprite>this.owner).animation.play("ATTACK", true);
                            this.velocity = (this.parent.getPlayerPosition().x - this.owner.position.x)/1.5;
                            this.parent.direction = this.velocity >= 0 ? 1 : -1;
                            this.parent.velocity.y = -800;
                            break;
                        case this.attacked:
                            this.parent.isAttacking = false;
                            this.finished(EnemyStates.ALERT);
                            break;
                    }
                }
                this.parent.velocity.x = this.velocity;
                (<Sprite>this.owner).invertX = this.parent.direction === 1 ? true : false ;
                super.update(deltaT);
                break;
            case 4: //snake atk
                while (this.receiver.hasNextEvent()) {
                    let event = this.receiver.getNextEvent().type;
                    switch (event) {
                        case this.charged:
                            this.parent.isCharging = false;
                            this.parent.isAttacking = true;
                            (<AnimatedSprite>this.owner).animation.play("ATTACK", false, this.attacked);
                            (<AABB>this.owner.collisionShape).halfSize.x += 3.5;
                            break;
                        case this.attacked:
                            this.parent.isAttacking = false;
                            (<AABB>this.owner.collisionShape).halfSize.x -= 3.5;
                            this.finished(EnemyStates.ALERT);
                            break;
                    }
                }
                (<Sprite>this.owner).invertX = this.parent.direction === 1 ? true : false ;
                break;
            default:
                while (this.receiver.hasNextEvent()) {
                    let event = this.receiver.getNextEvent().type;
                    switch (event) {
                        case this.charged:
                            this.parent.isCharging = false;
                            this.parent.isAttacking = true;
                            (<AnimatedSprite>this.owner).animation.play("ATTACK", false, this.attacked);
                            (<AABB>this.owner.collisionShape).halfSize.x += 3.5;
                            break;
                        case this.attacked:
                            this.parent.isAttacking = false;
                            (<AABB>this.owner.collisionShape).halfSize.x -= 3.5;
                            this.finished(EnemyStates.ALERT);
                            break;
                    }
                }
                (<Sprite>this.owner).invertX = this.parent.direction === 1 ? true : false ;
                break;
        }

        
    }
    onExit(): Record<string, any> {
        
        return null;
    }
}