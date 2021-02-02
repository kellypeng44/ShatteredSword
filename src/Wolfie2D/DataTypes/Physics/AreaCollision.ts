import AABB from "../Shapes/AABB";

/**
 * A class that contains the area of overlap of two colliding objects to allow for sorting by the physics system.
 */
export default class AreaCollision {
    /** The area of the overlap for the colliding objects */
    area: number;
    /** The AABB of the other collider in this collision */
    collider: AABB;
    
    /**
     * Creates a new AreaCollision object
     * @param area The area of the collision
     * @param collider The other collider
     */
	constructor(area: number, collider: AABB){
		this.area = area;
		this.collider = collider;
	}
}