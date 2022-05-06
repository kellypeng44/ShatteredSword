import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyAI, { EnemyStates } from "./EnemyAI";
import ArcherAttack from "./EnemyStates/ArcherAttack";
import Weapon from "../GameSystems/items/Weapon";




export default class ArcherAI extends EnemyAI {

    /** The weapon this AI has */
    weapon: Weapon;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);
        this.addState(EnemyStates.ATTACK, new ArcherAttack(this, owner));
        this.weapon = options.weapon;
    }
}