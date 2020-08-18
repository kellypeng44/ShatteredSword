import GameNode from "../../Nodes/GameNode";
import Vec2 from "../../DataTypes/Vec2";

export default abstract class Collider extends GameNode {
    protected size: Vec2;

    getSize(): Vec2 {
        return this.size;
    }

    setSize(size: Vec2): void {
        this.size = size;
    }

    abstract isCollidingWith(other: Collider): boolean;

    abstract willCollideWith(other: Collider, thisVel: Vec2, otherVel: Vec2): boolean;
}