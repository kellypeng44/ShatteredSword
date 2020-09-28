import PhysicsNode from "./PhysicsNode";
import Vec2 from "../DataTypes/Vec2";
import AABBCollider from "./Colliders/AABBCollider";

export default class StaticBody extends PhysicsNode {

    constructor(position: Vec2, size: Vec2){
        super();
        this.setPosition(position.x, position.y);
        this.collider = new AABBCollider();
        this.collider.setPosition(position.x, position.y);
        this.collider.setSize(new Vec2(size.x, size.y));
        this.moving = false;
    }
    
    create(): void {}

    update(deltaT: number): void {}

}