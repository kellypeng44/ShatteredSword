import PhysicsNode from "./PhysicsNode";
import Vec2 from "../DataTypes/Vec2";
import StaticBody from "./StaticBody";
import Debug from "../Debug/Debug";
import MathUtils from "../Utils/MathUtils";
import Tilemap from "../Nodes/Tilemap";
import OrthogonalTilemap from "../Nodes/Tilemaps/OrthogonalTilemap";

export default class PhysicsManager {

    private physicsNodes: Array<PhysicsNode>;
    private tilemaps: Array<Tilemap>;
    private movements: Array<MovementData>;
 
    constructor(){
        this.physicsNodes = new Array();
        this.tilemaps = new Array();
        this.movements = new Array();
    }

    /**
     * Adds a PhysicsNode to the manager to be handled in case of collisions
     * @param node 
     */
    add(node: PhysicsNode): void {
        this.physicsNodes.push(node);
    }

    /**
     * Adds a tilemap node to the manager to be handled for collisions
     * @param tilemap 
     */
    addTilemap(tilemap: Tilemap): void {
        this.tilemaps.push(tilemap);
    }

    /**
     * Adds a movement to this frame. All movements are handled at the end of the frame
     * @param node 
     * @param velocity 
     */
    addMovement(node: PhysicsNode, velocity: Vec2): void {
        this.movements.push(new MovementData(node, velocity));
    }

    /**
     * Handles a collision between a physics node and a tilemap
     * @param node 
     * @param tilemap 
     * @param velocity 
     */
    private collideWithTilemap(node: PhysicsNode, tilemap: Tilemap, velocity: Vec2): void {
        if(tilemap instanceof OrthogonalTilemap){
            this.collideWithOrthogonalTilemap(node, tilemap, velocity);
        }
    }

    /**
     * Specifically handles a collision for orthogonal tilemaps
     * @param node 
     * @param tilemap 
     * @param velocity 
     */
    private collideWithOrthogonalTilemap(node: PhysicsNode, tilemap: OrthogonalTilemap, velocity: Vec2): void {
        // Get the starting position of the moving node
        let startPos = node.getPosition();

        // Get the end position of the moving node
        let endPos = startPos.clone().add(velocity);
        let size = node.getCollider().getSize();

        // Get the min and max x and y coordinates of the moving node
        let min = new Vec2(Math.min(startPos.x, endPos.x), Math.min(startPos.y, endPos.y));
        let max = new Vec2(Math.max(startPos.x + size.x, endPos.x + size.x), Math.max(startPos.y + size.y, endPos.y + size.y));

        // Convert the min/max x/y to the min and max row/col in the tilemap array
        let minIndex = tilemap.getColRowAt(min);
        let maxIndex = tilemap.getColRowAt(max);

        // Create an empty set of tilemap collisions (We'll handle all of them at the end)
        let tilemapCollisions = new Array<TileCollisionData>();
        let tileSize = tilemap.getTileSize();

        Debug.log("tilemapCollision", "");

        // Loop over all possible tiles
        for(let col = minIndex.x; col <= maxIndex.x; col++){
            for(let row = minIndex.y; row <= maxIndex.y; row++){
                if(tilemap.isTileCollidable(col, row)){
                    Debug.log("tilemapCollision", "Colliding with Tile");
                
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x, row * tileSize.y);

                    // Calculate collision area between the node and the tile
                    let dx = Math.min(startPos.x, tilePos.x) - Math.max(startPos.x + size.x, tilePos.x + size.x);
                    let dy = Math.min(startPos.y, tilePos.y) - Math.max(startPos.y + size.y, tilePos.y + size.y);

                    // If we overlap, how much do we overlap by?
                    let overlap = 0;
                    if(dx * dy > 0){
                        overlap = dx * dy;
                    }

                    tilemapCollisions.push(new TileCollisionData(tilePos, overlap));
                }
            }
        }

        // Now that we have all collisions, sort by collision area highest to lowest
        tilemapCollisions = tilemapCollisions.sort((a, b) => a.overlapArea - b.overlapArea);

        // Resolve the collisions in order of collision area (i.e. "closest" tiles are collided with first, so we can slide along a surface of tiles)
        tilemapCollisions.forEach(collision => {
            let [firstContact, _, collidingX, collidingY] = this.getTimeOfAABBCollision(startPos, size, velocity, collision.position, tileSize, new Vec2(0, 0));

            // Handle collision
            if( (firstContact.x < 1 || collidingX) && (firstContact.y < 1 || collidingY)){
                if(collidingX && collidingY){
                    // If we're already intersecting, freak out I guess? Probably should handle this in some way for if nodes get spawned inside of tiles
                } else {
                    // Get the amount to scale x and y based on their initial collision times
                    let xScale = MathUtils.clamp(firstContact.x, 0, 1);
                    let yScale = MathUtils.clamp(firstContact.y, 0, 1);
                    
                    // Handle special case of stickiness on perfect corner to corner collisions
                    if(xScale === yScale){
                        xScale = 1;
                    }

                    // If we are scaling y, we're on the ground, so tell the node it's grounded
                    // TODO - This is a bug, check to make sure our velocity is going downwards
                    // Maybe feed in a downward direction to check to be sure
                    if(yScale !== 1){
                        node.setGrounded(true);
                    }

                    // Scale the velocity of the node
                    velocity.scale(xScale, yScale);
                }
            }
        })
    }

    private collideWithStaticNode(movingNode: PhysicsNode, staticNode: PhysicsNode, velocity: Vec2){
        let sizeA = movingNode.getCollider().getSize();
        let posA = movingNode.getPosition();
        let velA = velocity;
        let sizeB = staticNode.getCollider().getSize();
        let posB = staticNode.getPosition();

        let [firstContact, _, collidingX, collidingY] = this.getTimeOfAABBCollision(posA, sizeA, velA, posB, sizeB, new Vec2(0, 0));

        if( (firstContact.x < 1 || collidingX) && (firstContact.y < 1 || collidingY)){
            if(collidingX && collidingY){
                // If we're already intersecting, freak out I guess?
            } else {
                // let contactTime = Math.min(firstContact.x, firstContact.y);
                // velocity.scale(contactTime);
                let xScale = MathUtils.clamp(firstContact.x, 0, 1);
                let yScale = MathUtils.clamp(firstContact.y, 0, 1);

                 // Handle special case of stickiness on perfect corner to corner collisions
                 if(xScale === yScale){
                    xScale = 1;
                }

                // If we are scaling y, we're on the ground, so tell the node it's grounded
                // TODO - This is a bug, check to make sure our velocity is going downwards
                // Maybe feed in a downward direction to check to be sure
                if(yScale !== 1){
                    movingNode.setGrounded(true);
                }

                // Scale the velocity of the node
                velocity.scale(xScale, yScale);
            }
        }
    }

    /**
     * Gets the collision time of two AABBs using continuous collision checking. Returns vectors representing the time
     * of the start and end of the collision and booleans for whether or not the objects are currently overlapping
     * (before they move).
     */
    private getTimeOfAABBCollision(posA: Vec2, sizeA: Vec2, velA: Vec2, posB: Vec2, sizeB: Vec2, velB: Vec2): [Vec2, Vec2, boolean, boolean] {
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

        if (posB.x >= posA.x + sizeA.x){
            // If we aren't currently colliding
            let relVel = velA.x - velB.x;
            
            if(relVel > 0){
                // If they are moving towards each other
                firstContact.x = (posB.x - (posA.x + (sizeA.x)))/(relVel);
                lastContact.x = ((posB.x + sizeB.x) - posA.x)/(relVel);
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

        if (posB.y >= posA.y + sizeA.y){
            // If we aren't currently colliding
            let relVel = velA.y - velB.y;
            
            if(relVel > 0){
                // If they are moving towards each other
                firstContact.y = (posB.y - (posA.y + (sizeA.y)))/(relVel);
                lastContact.y = ((posB.y + sizeB.y) - posA.y)/(relVel);
            }
        } else {
            collidingY = true;
        }

        return [firstContact, lastContact, collidingX, collidingY];
    }

    update(deltaT: number): void {
        for(let node of this.physicsNodes){
            if(!node.getLayer().isPaused()){
                node.update(deltaT);
            }
        }
        
        let staticSet = new Array<PhysicsNode>();
        let dynamicSet = new Array<PhysicsNode>();

        // TODO: REALLY bad, the physics system has to be improved, but that isn't the focus for now
        for(let node of this.physicsNodes){
            if(node.isMoving()){
                dynamicSet.push(node);
                node.setMoving(false);
            } else {
                staticSet.push(node);
            }
        }

        // For now, we will only have the moving player, don't bother checking for collisions with other moving things
        for(let movingNode of dynamicSet){
            movingNode.setGrounded(false);
            // Get velocity of node
            let velocity = null;
            for(let data of this.movements){
                if(data.node === movingNode){
                    velocity = new Vec2(data.velocity.x, data.velocity.y);
                }
            }

            // TODO handle collisions between dynamic nodes
            // We probably want to sort them by their left edges

            for(let staticNode of staticSet){
                this.collideWithStaticNode(movingNode, staticNode, velocity);
            }

            // Handle Collisions with the tilemaps
            for(let tilemap of this.tilemaps){
                this.collideWithTilemap(movingNode, tilemap, velocity);
            }

            movingNode.finishMove(velocity);
        }
        
        // Reset movements
        this.movements = new Array();
    }
}

// Helper classes for internal data
// TODO: Move these to data
// When an object moves, store it's data as MovementData so all movements can be processed at the same time at the end of the frame
class MovementData {
    node: PhysicsNode;
    velocity: Vec2;
    constructor(node: PhysicsNode, velocity: Vec2){
        this.node = node;
        this.velocity = velocity;
    }
}

// Collision data objects for tilemaps
class TileCollisionData {
    position: Vec2;
    overlapArea: number;
    constructor(position: Vec2, overlapArea: number){
        this.position = position;
        this.overlapArea = overlapArea;
    }
}