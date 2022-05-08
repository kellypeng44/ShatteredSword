import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyAI, { EnemyStates } from "./EnemyAI";
import ArcherAttack from "./EnemyStates/ArcherAttack";
import Weapon from "../GameSystems/items/Weapon";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";


export default class ArcherAI extends EnemyAI {

    /** The weapon this AI has */
    weapon: Weapon;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);
        this.addState(EnemyStates.ATTACK, new ArcherAttack(this, owner));
        this.weapon = options.weapon;
    }

    canAttack(position: Vec2): boolean {
        return this.attackTimer.isStopped() && this.owner.position.distanceTo(position)<=96;
    }
}