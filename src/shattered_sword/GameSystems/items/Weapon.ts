//TODO import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import BattleManager from "../BattleManager";
import Item from "./Item";
import WeaponType from "./WeaponTypes/WeaponType";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";

export default class Weapon extends Item {
    /** The type of this weapon */
    type: WeaponType;

    /** A list of assets this weapon needs to be animated */
    assets: Array<any>;

    /** An event emitter to hook into the EventQueue */
    emitter: Emitter

    /** The battle manager */
    battleManager: BattleManager;

    cooldown : number = 0;
    /** The cooldown timer for this weapon's use */
    cooldownTimer: Timer;

    EXTRA_DAMAGE : number;  //flat extra damage value

    EXTRA_RANGE: number ;   //percentage value -> .1 = 10% extra range

    constructor(sprite: Sprite, type: WeaponType, battleManager: BattleManager){
        super(sprite);

        // Set the weapon type
        this.type = type.clone();

        // Keep a reference to the sprite of this weapon
        this.sprite = sprite;

        // Create an event emitter
        this.emitter = new Emitter();

        // Save a reference to the battler manager
        this.battleManager = battleManager;

        // Create the cooldown timer
        this.cooldownTimer = new Timer(type.cooldown);  
        this.cooldown = type.cooldown;

        this.EXTRA_DAMAGE = 0;
        this.EXTRA_RANGE=0; 
    }

    // @override
    /**
     * Uses this weapon in the specified direction.
     * This only works if the cooldown timer has ended
     */
    use(user: GameNode, userType: string, direction: Vec2): boolean {
        // If the cooldown timer is still running, we can't use the weapon
        if(!this.cooldownTimer.isStopped()){
            return false;
        }
        // Rely on the weapon type to create any necessary assets
        this.assets = this.type.createRequiredAssets(this.sprite.getScene());

        // Do a type specific weapon animation
        this.type.doAnimation(user, direction,  ...this.assets, this.EXTRA_RANGE);

        // Apply damage
        this.battleManager.handleInteraction(userType, this, user);
    
        // Reset the cooldown timer
        this.cooldownTimer.start();
        //TODO - may have to move elsewhere
        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "sword", loop: false, holdReference: false});
        
        return true;
    }

    /**
     * A check for whether or not this weapon hit a node
     */
    hits(node: GameNode): boolean {
        return this.type.hits(node, ...this.assets);
    }
}