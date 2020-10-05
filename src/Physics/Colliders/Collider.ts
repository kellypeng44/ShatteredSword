import AABB from "../../DataTypes/AABB";
import { Positioned } from "../../DataTypes/Interfaces/Descriptors";
import Shape from "../../DataTypes/Shape";
import Vec2 from "../../DataTypes/Vec2";

export default class Collider implements Positioned {
    protected shape: Shape;

    constructor(shape: Shape){
        this.shape = shape;
    }

    setPosition(position: Vec2): void {
        this.shape.setCenter(position);
    }

    getPosition(): Vec2 {
        return this.shape.getCenter();
    }

    getBoundingRect(): AABB {
        return this.shape.getBoundingRect();
    }

    /**
     * Sets the collision shape for this collider.
     * @param shape 
     */
    setCollisionShape(shape: Shape): void {
        this.shape = shape;
    }

    /**
     * Returns the collision shape this collider has
     */
    getCollisionShape(): Shape {
        return this.shape;
    }
}