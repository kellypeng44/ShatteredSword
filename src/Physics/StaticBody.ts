import PhysicsNode from "./PhysicsNode";
import Vec2 from "../DataTypes/Vec2";
import AABB from "./Colliders/AABB";

export default class StaticBody extends PhysicsNode {

    id: string;
    static numCreated: number = 0;

    constructor(position: Vec2, size: Vec2){
        super();
        this.setPosition(position.x, position.y);
        this.collider = new AABB();
        this.collider.setPosition(position.x, position.y);
        this.collider.setSize(new Vec2(size.x, size.y));
        this.id = StaticBody.numCreated.toString();
        StaticBody.numCreated += 1;
    }
    
    create(): void {}

    update(deltaT: number): void {}

}