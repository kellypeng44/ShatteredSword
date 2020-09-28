import Vec2 from "./Vec2";

export default class AABB {

    protected center: Vec2;
    protected halfSize: Vec2;

    constructor(center?: Vec2, halfSize?: Vec2){
        this.center = center ? center : new Vec2(0, 0);
        this.halfSize = halfSize ? halfSize : new Vec2(0, 0);
    }

    get x(): number {
        return this.center.x;
    }

    get y(): number {
        return this.center.y;
    }

    get hw(): number {
        return this.halfSize.x;
    }

    get hh(): number {
        return this.halfSize.y;
    }

    getCenter(): Vec2 {
        return this.center;
    }

    setCenter(center: Vec2): void {
        this.center = center;
    }

    getHalfSize(): Vec2 {
        return this.halfSize;
    }

    setHalfSize(halfSize: Vec2): void {
        this.halfSize = halfSize;
    }

    /**
     * A simple boolean check of whether this AABB contains a point
     * @param point 
     */
    containsPoint(point: Vec2): boolean {
        return point.x >= this.x - this.hw && point.x <= this.x + this.hw
            && point.y >= this.y - this.hh && point.y <= this.y + this.hh
    }
    
    intersectPoint(point: Vec2): boolean {
        let dx = point.x - this.x;
        let px = this.hw - Math.abs(dx);
        
        if(px <= 0){
            return false;
        }

        let dy = point.y - this.y;
        let py = this.hh - Math.abs(dy);

        if(py <= 0){
            return false;
        }

        return true;
    }

    /**
     * A boolean check of whether this AABB contains a point with soft left and top boundaries.
     * In other words, if the top left is (0, 0), the point (0, 0) is not in the AABB
     * @param point 
     */
    containsPointSoft(point: Vec2): boolean {
        return point.x > this.x - this.hw && point.x <= this.x + this.hw
            && point.y > this.y - this.hh && point.y <= this.y + this.hh
    }

    /**
     * A simple boolean check of whether this AABB overlaps another
     * @param other 
     */
    overlaps(other: AABB): boolean {
        let dx = other.x - this.x;
        let px = this.hw + other.hw - Math.abs(dx);
        
        if(px <= 0){
            return false;
        }

        let dy = other.y - this.y;
        let py = this.hh + other.hh - Math.abs(dy);

        if(py <= 0){
            return false;
        }

        return true;
    }
}