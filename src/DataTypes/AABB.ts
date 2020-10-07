import Shape from "./Shape";
import Vec2 from "./Vec2";
import MathUtils from "../Utils/MathUtils";

export default class AABB extends Shape {

    protected center: Vec2;
    protected halfSize: Vec2;

    constructor(center?: Vec2, halfSize?: Vec2){
        super();
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

    get top(): number {
        return this.y - this.hh;
    }

    get bottom(): number {
        return this.y + this.hh;
    }

    get left(): number {
        return this.x - this.hw;
    }

    get right(): number {
        return this.x + this.hw;
    }

    getCenter(): Vec2 {
        return this.center;
    }

    setCenter(center: Vec2): void {
        this.center = center;
    }

    getBoundingRect(): AABB {
        return this;
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
     * Returns the data from the intersection of this AABB with a line segment from a point in a direction
     * @param point The point that the line segment starts from
     * @param direction The direction the point will go
     * @param distance The length of the line segment, if the direction is a unit vector
     * @param paddingX Pads the AABB in the x axis
     * @param paddingY Pads the AABB in the y axis
     */
    intersectSegment(point: Vec2, direction: Vec2, distance?: number, paddingX?: number, paddingY?: number): Hit {
        // Scale by the distance if it has been provided
        if(distance){
            direction = direction.scaled(distance);
        }

        let _paddingX = paddingX ? paddingX : 0;
        let _paddingY = paddingY ? paddingY : 0;

        let scaleX = 1/direction.x;
        let scaleY = 1/direction.y;

        let signX = MathUtils.sign(scaleX);
        let signY = MathUtils.sign(scaleY);

        let tnearx = scaleX*(this.center.x - signX*(this.halfSize.x + _paddingX) - point.x);
        let tneary = scaleX*(this.center.y - signY*(this.halfSize.y + _paddingY) - point.y);
        let tfarx = scaleY*(this.center.x + signX*(this.halfSize.x + _paddingX) - point.x);
        let tfary = scaleY*(this.center.y + signY*(this.halfSize.y + _paddingY) - point.y);
        
        if(tnearx > tfary || tneary > tfarx){
            // We aren't colliding - we clear one axis before intersecting another
            return null;
        }

        let tnear = Math.max(tnearx, tneary);
        let tfar = Math.min(tfarx, tfary);

        if(tnear >= 1 || tfar <= 0){
            return null;
        }

        // We are colliding
        let hit = new Hit();
        hit.t = MathUtils.clamp01(tnear);

        if(tnearx > tneary){
            // We hit on the left or right size
            hit.normal.x = -signX;
            hit.normal.y = 0;
        } else {
            hit.normal.x = 0;
            hit.normal.y = -signY;
        }

        hit.delta.x = (1.0 - hit.t) * -direction.x;
        hit.delta.y = (1.0 - hit.t) * -direction.y;
        hit.pos.x = point.x + direction.x * hit.t;
        hit.pos.y = point.y + direction.y * hit.t;

        return hit;
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

    // TODO - Implement this generally and use it in the tilemap
    overlapArea(other: AABB): number {
        let leftx = Math.max(this.x - this.hw, other.x - other.hw);
        let rightx = Math.min(this.x + this.hw, other.x + other.hw);
        let dx = rightx - leftx;

        let lefty = Math.max(this.y - this.hh, other.y - other.hh);
        let righty = Math.min(this.y + this.hh, other.y + other.hh);
        let dy = righty - lefty;

        if(dx < 0 || dy < 0) return 0;
        
        return dx*dy;
    }
}

export class Hit {
    t: number;
    pos: Vec2 = Vec2.ZERO;
    delta: Vec2 = Vec2.ZERO;
    normal: Vec2 = Vec2.ZERO;
}