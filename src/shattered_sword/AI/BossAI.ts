import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyAI, { EnemyStates } from "./EnemyAI";
import BossAttack from "./EnemyStates/BossAttack";
import Weapon from "../GameSystems/items/Weapon";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";


export default class BossAI extends EnemyAI {

    /** The weapon this AI has */
    weapon: Weapon;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);
        this.addState(EnemyStates.ATTACK, new BossAttack(this, owner));
        this.weapon = options.weapon;
    }

    canAttack(position: Vec2): boolean {
        return this.attackTimer.isStopped() && this.owner.position.distanceTo(position)<=96;
    }
}