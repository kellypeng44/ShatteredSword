import Vec2 from "../Vec2";
import AABB from "./AABB";
import Circle from "./Circle";

export default abstract class Shape {
    abstract get center(): Vec2;

    abstract set center(center: Vec2);

    abstract get halfSize(): Vec2;

    /** Gets a bounding rectangle for this shape */
    abstract getBoundingRect(): AABB;

    /** Gets a bounding circle for this shape */
    abstract getBoundingCircle(): Circle;

    /** Returns a copy of this Shape */
    abstract clone(): Shape;

    /** Checks if this shape overlaps another */
    abstract overlaps(other: Shape): boolean;

    static getTimeOfCollision(A: Shape, velA: Vec2, B: Shape, velB: Vec2): [Vec2, Vec2, boolean, boolean] {
		if(A instanceof AABB && B instanceof AABB){
			return Shape.getTimeOfCollision_AABB_AABB(A, velA, B, velB);
		}
    }
    
    private static getTimeOfCollision_AABB_AABB(A: AABB, velA: Vec2, B: Shape, velB: Vec2): [Vec2, Vec2, boolean, boolean] {
        let posSmaller = A.center;
        let posLarger = B.center;
        
        let sizeSmaller = A.halfSize;
        let sizeLarger = B.halfSize;
    
        let firstContact = new Vec2(0, 0);
        let lastContact = new Vec2(0, 0);
    
        let collidingX = false;
        let collidingY = false;
    
        // Sort by position
        if(posLarger.x < posSmaller.x){
            // Swap, because smaller is further right than larger
            let temp: Vec2;
            temp = sizeSmaller;
            sizeSmaller = sizeLarger;
            sizeLarger = temp;
    
            temp = posSmaller;
            posSmaller = posLarger;
            posLarger = temp;
    
            temp = velA;
            velA = velB;
            velB = temp;
        }
    
        // A is left, B is right
        firstContact.x = Infinity;
        lastContact.x = Infinity;
    
        if (posLarger.x - sizeLarger.x >= posSmaller.x + sizeSmaller.x){
            // If we aren't currently colliding
            let relVel = velA.x - velB.x;
            
            if(relVel > 0){
                // If they are moving towards each other
                firstContact.x = ((posLarger.x - sizeLarger.x) - (posSmaller.x + sizeSmaller.x))/(relVel);
                lastContact.x = ((posLarger.x + sizeLarger.x) - (posSmaller.x - sizeSmaller.x))/(relVel);
            }
        } else {
            collidingX = true;
        }
    
        if(posLarger.y < posSmaller.y){
            // Swap, because smaller is further up than larger
            let temp: Vec2;
            temp = sizeSmaller;
            sizeSmaller = sizeLarger;
            sizeLarger = temp;
    
            temp = posSmaller;
            posSmaller = posLarger;
            posLarger = temp;
    
            temp = velA;
            velA = velB;
            velB = temp;
        }
    
        // A is top, B is bottom
        firstContact.y = Infinity;
        lastContact.y = Infinity;
    
        if (posLarger.y - sizeLarger.y >= posSmaller.y + sizeSmaller.y){
            // If we aren't currently colliding
            let relVel = velA.y - velB.y;
            
            if(relVel > 0){
                // If they are moving towards each other
                firstContact.y = ((posLarger.y - sizeLarger.y) - (posSmaller.y + sizeSmaller.y))/(relVel);
                lastContact.y = ((posLarger.y + sizeLarger.y) - (posSmaller.y - sizeSmaller.y))/(relVel);
            }
        } else {
            collidingY = true;
        }
    
        return [firstContact, lastContact, collidingX, collidingY];
    }
}