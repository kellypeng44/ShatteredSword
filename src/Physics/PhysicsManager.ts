import PhysicsNode from "./PhysicsNode";
import Vec2 from "../DataTypes/Vec2";
import StaticBody from "./StaticBody";
import Debug from "../Debug/Debug";
import MathUtils from "../Utils/MathUtils";
import Tilemap from "../Nodes/Tilemap";
import OrthogonalTilemap from "../Nodes/Tilemaps/OrthogonalTilemap";

export default class PhysicsManager {

    physicsNodes: Array<PhysicsNode>;
    tilemaps: Array<Tilemap>;
    movements: Array<MovementData>;

    constructor(){
        this.physicsNodes = new Array();
        this.tilemaps = new Array();
        this.movements = new Array();
    }

    add(node: PhysicsNode): void {
        this.physicsNodes.push(node);
    }

    addTilemap(tilemap: Tilemap): void {
        this.tilemaps.push(tilemap);
    }

    addMovement(node: PhysicsNode, velocity: Vec2){
        this.movements.push(new MovementData(node, velocity));
    }

    update(deltaT: number): void {
        for(let node of this.physicsNodes){
            node.update(deltaT);
        }
        
        let staticSet = new Array<PhysicsNode>();
        let dynamicSet = new Array<PhysicsNode>();

        // TODO: REALLY bad, the physics system has to be improved, but that isn't the focus for now
        for(let node of this.physicsNodes){
            if(node.isMoving){
                dynamicSet.push(node);
                node.isMoving = false;
            } else {
                staticSet.push(node);
            }
        }

        // For now, we will only have the moving player, don't bother checking for collisions with other moving things
        for(let movingNode of dynamicSet){
            movingNode.setIsGrounded(false);
            // Get velocity of node
            let velocity = null;
            for(let data of this.movements){
                if(data.node === movingNode){
                    velocity = new Vec2(data.velocity.x, data.velocity.y);
                }
            }

            // TODO handle collisions between dynamic nodes
            // We probably want to sort them by their left edges

            // TODO: handle collisions between dynamic nodes and static nodes

            // Handle Collisions with the tilemaps
            for(let tilemap of this.tilemaps){
                this.collideWithTilemap(movingNode, tilemap, velocity);
            }

            movingNode.finishMove(velocity);
        }
        
        // Reset movements
        this.movements = new Array();
    }

    collideWithTilemap(node: PhysicsNode, tilemap: Tilemap, velocity: Vec2){
        if(tilemap instanceof OrthogonalTilemap){
            this.collideWithOrthogonalTilemap(node, tilemap, velocity);
        }
    }

    collideWithOrthogonalTilemap(node: PhysicsNode, tilemap: OrthogonalTilemap, velocity: Vec2){
        let startPos = node.getPosition();
        let endPos = startPos.clone().add(velocity);
        let size = node.getCollider().getSize();
        let min = new Vec2(Math.min(startPos.x, endPos.x), Math.min(startPos.y, endPos.y));
        let max = new Vec2(Math.max(startPos.x + size.x, endPos.x + size.x), Math.max(startPos.y + size.y, endPos.y + size.y));

        let minIndex = tilemap.getColRowAt(min);
        let maxIndex = tilemap.getColRowAt(max);

        let tilemapCollisions = new Array<TileCollisionData>();
        let tileSize = tilemap.getTileSize();

        Debug.getInstance().log("tilemapCollision", "");
        // Loop over all possible tiles
        for(let col = minIndex.x; col <= maxIndex.x; col++){
            for(let row = minIndex.y; row <= maxIndex.y; row++){
                if(tilemap.isTileCollidable(col, row)){
                    Debug.getInstance().log("tilemapCollision", "Colliding with Tile");
                
                    // Tile position
                    let tilePos = new Vec2(col * tileSize.x, row * tileSize.y);

                    // Calculate collision area
                    let dx = Math.min(startPos.x, tilePos.x) - Math.max(startPos.x + size.x, tilePos.x + size.x);
                    let dy = Math.min(startPos.y, tilePos.y) - Math.max(startPos.y + size.y, tilePos.y + size.y);

                    let overlap = 0;
                    if(dx * dy > 0){
                        overlap = dx * dy;
                    }

                    tilemapCollisions.push(new TileCollisionData(tilePos, overlap));
                }
            }
        }

        // Now that we have all collisions, sort by collision area
        tilemapCollisions = tilemapCollisions.sort((a, b) => a.overlapArea - b.overlapArea);

        // Resolve the collisions
        tilemapCollisions.forEach(collision => {
            let [firstContact, _, collidingX, collidingY] = this.getTimeOfCollision(startPos, size, velocity, collision.position, tileSize, new Vec2(0, 0));

            // Handle collision
            if( (firstContact.x < 1 || collidingX) && (firstContact.y < 1 || collidingY)){
                if(collidingX && collidingY){
                    // If we're already intersecting, freak out I guess?
                } else {
                    // let contactTime = Math.min(firstContact.x, firstContact.y);
                    // velocity.scale(contactTime);
                    let xScale = MathUtils.clamp(firstContact.x, 0, 1);
                    let yScale = MathUtils.clamp(firstContact.y, 0, 1);
                    
                    // Handle special case of stickiness on corner to corner collisions
                    if(xScale === yScale){
                        xScale = 1;
                    }

                    if(yScale !== 1){
                        node.setIsGrounded(true);
                    }

                    velocity.scale(xScale, yScale);
                }
            }
        })
    }

    handleCollision(movingNode: PhysicsNode, staticNode: PhysicsNode, velocity: Vec2, id: String){
        let sizeA = movingNode.getCollider().getSize();
        let posA = movingNode.getPosition();
        let velA = velocity;
        let sizeB = staticNode.getCollider().getSize();
        let posB = staticNode.getPosition();
        let velB = new Vec2(0, 0);

        let [firstContact, _, collidingX, collidingY] = this.getTimeOfCollision(posA, sizeA, velA, posB, sizeB, velB);

        if( (firstContact.x < 1 || collidingX) && (firstContact.y < 1 || collidingY)){
            if(collidingX && collidingY){
                // If we're already intersecting, freak out I guess?
            } else {
                // let contactTime = Math.min(firstContact.x, firstContact.y);
                // velocity.scale(contactTime);
                let xScale = MathUtils.clamp(firstContact.x, 0, 1);
                let yScale = MathUtils.clamp(firstContact.y, 0, 1);
                if(yScale !== 1){
                    movingNode.setIsGrounded(true);
                }
                velocity.scale(xScale, yScale);
            }
        }
    }

    /**
     * Gets the collision time of two AABBs using continuous collision checking. Returns vectors representing the time
     * of the start and end of the collision and booleans for whether or not the objects are currently overlapping
     * (before they move).
     */
    getTimeOfCollision(posA: Vec2, sizeA: Vec2, velA: Vec2, posB: Vec2, sizeB: Vec2, velB: Vec2): [Vec2, Vec2, boolean, boolean] {
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
}

// Helper classes for internal data
class MovementData{
    node: PhysicsNode;
    velocity: Vec2;
    constructor(node: PhysicsNode, velocity: Vec2){
        this.node = node;
        this.velocity = velocity;
    }
}

class TileCollisionData {
    position: Vec2;
    overlapArea: number;
    constructor(position: Vec2, overlapArea: number){
        this.position = position;
        this.overlapArea = overlapArea;
    }
}