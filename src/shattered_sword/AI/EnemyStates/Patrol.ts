import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";

import EnemyAI, { EnemyStates } from "../EnemyAI";
import EnemyState from "./EnemyState";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import OnGround from "./OnGround";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class Patrol extends EnemyState {

    

    // A return object for exiting this state
    protected retObj: Record<string, any>;

    constructor(parent: EnemyAI, owner: GameNode){
        super(parent, owner);
      
    }

    onEnter(options: Record<string, any>): void {
        //this.currentPath = this.getNextPath();
        (<AnimatedSprite>this.owner).animation.play("IDLE", true);
    }

    handleInput(event: GameEvent): void { }

    update(deltaT: number): void {
        super.update(deltaT);
        
        //no goap rn, just adding some moving
        let colrow = this.parent.tilemap.getColRowAt(this.owner.position.clone());
        
        //check if next tile on walking path is collidable
        if(this.parent.tilemap.isTileCollidable(colrow.x+this.parent.direction,colrow.y) || this.parent.tilemap.isTileCollidable(colrow.x+this.parent.direction,colrow.y-1)){
            //turn around
            //console.log(this.parent.tilemap.getTileAtRowCol(colrow));
            this.parent.direction *= -1;
            console.log((<Sprite>this.owner).invertX);
            //(<Sprite>this.owner).invertX != (<Sprite>this.owner).invertX ;
            //console.log("turn around cus wall in front");
        }
        //check if next ground tile is collidable 
        else if(!this.parent.tilemap.isTileCollidable(colrow.x+this.parent.direction,colrow.y+1)){
            //turn around 
            this.parent.direction *=-1;
            console.log((<Sprite>this.owner).invertX);
            //console.log("turn around cus no floor in front");
        }
        else{
            //keep moving
            //this.velocity.x =  this.speed;
            //console.log("there is floor ahead");
        }
        //move
        this.parent.velocity.x = this.parent.direction * this.parent.speed;
        (<Sprite>this.owner).invertX = this.parent.direction ==1? true: false ;

        //move this elsewhere later
        this.owner.move(this.parent.velocity.scaled(deltaT));
        //console.log("enemy moving");
    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

    

}