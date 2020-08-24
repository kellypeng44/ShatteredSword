import Collider from "./Colliders/Collider";
import GameNode from "../Nodes/GameNode";
import PhysicsManager from "./PhysicsManager";
import Vec2 from "../DataTypes/Vec2";

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

    protected move(velocity: Vec2): void {
        this.moving = true;
        this.manager.addMovement(this, velocity);
    }

    finishMove(velocity: Vec2): void {
        this.position.add(velocity);
        this.collider.getPosition().add(velocity);
        for(let child of this.children){
            child.getPosition().add(velocity);
        }
    }

    abstract create(): void;
}