import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";

import EnemyAI, { EnemyStates } from "../EnemyAI";
import EnemyState from "./EnemyState";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";

export default class Patrol extends EnemyState {
    onEnter(options: Record<string, any>): void {
        (<AnimatedSprite>this.owner).animation.playIfNotAlready("IDLE", true);
    }

    update(deltaT: number): void {
        if(!this.canWalk()){
            this.parent.direction *= -1;
        }

        //move
        this.parent.velocity.x = this.parent.direction * this.parent.speed;
        (<Sprite>this.owner).invertX = this.parent.direction === 1 ? true : false ;

        super.update(deltaT);
    }

    onExit(): Record<string, any> {
        (<AnimatedSprite>this.owner).animation.stop();
        return null;
    }
}