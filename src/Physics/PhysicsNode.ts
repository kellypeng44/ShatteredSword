import Collider from "./Colliders/Collider";
import GameNode from "../Nodes/GameNode";
import PhysicsManager from "./PhysicsManager";
import Vec2 from "../DataTypes/Vec2";

/**
 * The representation of a physic-affected object in the game world. Sprites and other game nodes can be associated with
 * a physics node to move them around as well.
 */
export default abstract class PhysicsNode extends GameNode {

    protected collider: Collider = null;
    protected children: Array<GameNode>;
    private manager: PhysicsManager;
    protected moving: boolean;
    protected grounded: boolean;

    constructor(){
        super();
        this.children = new Array();
        this.grounded = false;
        this.moving = false;
    }

    setGrounded(grounded: boolean): void {
        this.grounded = grounded;
    }

    addManager(manager: PhysicsManager): void {
        this.manager = manager;
    }

    addChild(child: GameNode): void {
        this.children.push(child);
    }

    isCollidable(): boolean {
        return this.collider !== null;
    }

    getCollider(): Collider {
        return this.collider;
    }

    setMoving(moving: boolean): void {
        this.moving = moving;
    }

    isMoving(): boolean {
        return this.moving;
    }

    /**
     * Register a movement to the physics manager that can be handled at the end of the frame
     * @param velocity 
     */
    protected move(velocity: Vec2): void {
        this.moving = true;
        this.manager.addMovement(this, velocity);
    }

    /**
     * Called by the physics manager to finish the movement and actually move the physics object and its children
     * @param velocity 
     */
    finishMove(velocity: Vec2): void {
        this.position.add(velocity);
        this.collider.getPosition().add(velocity);
        for(let child of this.children){
            child.position.add(velocity);
        }
    }

    abstract create(): void;
}