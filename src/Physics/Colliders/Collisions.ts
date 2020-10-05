import Shape from "../../DataTypes/Shape";
import AABB from "../../DataTypes/AABB";
import Vec2 from "../../DataTypes/Vec2";
import Collider from "./Collider";
import Debug from "../../Debug/Debug";

export function getTimeOfCollision(A: Collider, velA: Vec2, B: Collider, velB: Vec2): [Vec2, Vec2, boolean, boolean]  {
    let shapeA = A.getCollisionShape();
    let shapeB = B.getCollisionShape();
    
    if(shapeA instanceof AABB && shapeB instanceof AABB){
        return getTimeOfCollision_AABB_AABB(shapeA, velA, shapeB, velB);
    }
}

// TODO - Make this work with centered points to avoid this initial calculation
function getTimeOfCollision_AABB_AABB(A: AABB, velA: Vec2, B: AABB, velB: Vec2): [Vec2, Vec2, boolean, boolean] {
    let posA = A.getCenter().clone();
    let posB = B.getCenter().clone();
    let sizeA = A.getHalfSize();
    let sizeB = B.getHalfSize();

    let firstContact = new Vec2(0, 0);
    let lastContact = new Vec2(0, 0);

    let collidingX = false;
    let collidingY = false;

    // Sort by position
    if(posB.x < posA.x){
        // Swap, because B is to the left of A
        let temp: Vec2;
        temp = sizeA;
        sizeA = sizeB;
        sizeB = temp;

        temp = posA;
        posA = posB;
        posB = temp;

        temp = velA;
        velA = velB;
        velB = temp;
    }

    // A is left, B is right
    firstContact.x = Infinity;
    lastContact.x = Infinity;

    if (posB.x - sizeB.x >= posA.x + sizeA.x){
        // If we aren't currently colliding
        let relVel = velA.x - velB.x;
        
        if(relVel > 0){
            // If they are moving towards each other
            firstContact.x = ((posB.x - sizeB.x) - (posA.x + sizeA.x))/(relVel);
            lastContact.x = ((posB.x + sizeB.x) - (posA.x - sizeA.x))/(relVel);
        }
    } else {
        collidingX = true;
    }

    if(posB.y < posA.y){
        // Swap, because B is above A
        let temp: Vec2;
        temp = sizeA;
        sizeA = sizeB;
        sizeB = temp;

        temp = posA;
        posA = posB;
        posB = temp;

        temp = velA;
        velA = velB;
        velB = temp;
    }

    // A is top, B is bottom
    firstContact.y = Infinity;
    lastContact.y = Infinity;

    if (posB.y - sizeB.y >= posA.y + sizeA.y){
        // If we aren't currently colliding
        let relVel = velA.y - velB.y;
        
        if(relVel > 0){
            // If they are moving towards each other
            firstContact.y = ((posB.y - sizeB.y) - (posA.y + sizeA.y))/(relVel);
            lastContact.y = ((posB.y + sizeB.y) - (posA.y - sizeA.y))/(relVel);
        }
    } else {
        collidingY = true;
    }

    return [firstContact, lastContact, collidingX, collidingY];
}