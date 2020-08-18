import Collider from "./Collider";
import Vec2 from "../../DataTypes/Vec2";

export default class AABB extends Collider {

    isCollidingWith(other: Collider): boolean {
        if(other instanceof AABB){
            if(other.position.x > this.position.x && other.position.x < this.position.x + this.size.x){
                return other.position.y > this.position.y && other.position.y < this.position.y + this.size.y;
            }
        }
        return false;
    }
    
    willCollideWith(other: Collider, thisVel: Vec2, otherVel: Vec2): boolean {
        if(other instanceof AABB){
            let thisPos = new Vec2(this.position.x + thisVel.x, this.position.y + thisVel.y);
            let otherPos = new Vec2(other.position.x + otherVel.x, other.position.y + otherVel.y);

            if(otherPos.x > thisPos.x && otherPos.x < thisPos.x + this.size.x){
                return otherPos.y > thisPos.y && otherPos.y < thisPos.y + this.size.y;
            }
        }
        return false;
    }

    update(deltaT: number): void {}

}