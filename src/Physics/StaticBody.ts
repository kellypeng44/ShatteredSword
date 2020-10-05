import PhysicsNode from "./PhysicsNode";
import Vec2 from "../DataTypes/Vec2";
import Collider from "./Colliders/Collider";
import AABB from "../DataTypes/AABB";

export default class StaticBody extends PhysicsNode {

    constructor(position: Vec2, size: Vec2){
        super();
        this.setPosition(position.x, position.y);
        let aabb = new AABB(position.clone(), size.scaled(1/2));
        this.collider = new Collider(aabb);
        this.moving = false;
    }
    
    create(): void {}

    update(deltaT: number): void {}

}