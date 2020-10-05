import PhysicsNode from "./PhysicsNode";
import Vec2 from "../DataTypes/Vec2";
import StaticBody from "./StaticBody";
import Debug from "../Debug/Debug";
import MathUtils from "../Utils/MathUtils";
import Tilemap from "../Nodes/Tilemap";
import OrthogonalTilemap from "../Nodes/Tilemaps/OrthogonalTilemap";
import AABB from "../DataTypes/AABB";
import { getTimeOfCollision } from "./Colliders/Collisions";
import Collider from "./Colliders/Collider";

export default class PhysicsManager {

    private physicsNodes: Array<PhysicsNode>;
    private tilemaps: Array<Tilemap>;
    private movements: Array<MovementData>;
    private tcols: Array<TileCollisionData> = [];
 
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
        let startPos = node.getCollider().getPosition();

        // Get the end position of the moving node
        let endPos = startPos.clone().add(velocity);
        let size = node.getCollider().getBoundingRect().getHalfSize();

        // Get the min and max x and y coordinates of the moving node
        let min = new Vec2(Math.min(startPos.x - size.x, endPos.x - size.x), Math.min(startPos.y - size.y, endPos.y - size.y));
        let max = new Vec2(Math.max(startPos.x + size.x, endPos.x + size.x), Math.max(startPos.y + size.y, endPos.y + size.y));

        // Convert the min/max x/y to the min and max row/col in the tilemap array
        let minIndex = tilemap.getColRowAt(min);
        let maxIndex = tilemap.getColRowAt(max);

        // Create an empty set of tilemap collisions (We'll handle all of them at the end)
        let tilemapCollisions = new Array<TileCollisionData>();
        this.tcols = [];
        let tileSize = tilemap.getTileSize();

        Debug.log("tilemapCollision", "");

        // Loop over all possible tiles
        for(let col = minIndex.x; col <= maxIndex.x; col++){
            for(let row = minIndex.y; row <= maxIndex.y; row++){
                if(tilemap.isTileCollidable(col, row)){
                    Debug.log("tilemapCollision", "Colliding with Tile");

                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);

                    // Create a new collider for this tile
                    let collider = new Collider(new AABB(tilePos, tileSize.scaled(1/2)));

                    // Calculate collision area between the node and the tile
                    let dx = Math.min(startPos.x, tilePos.x) - Math.max(startPos.x + size.x, tilePos.x + size.x);
                    let dy = Math.min(startPos.y, tilePos.y) - Math.max(startPos.y + size.y, tilePos.y + size.y);

                    // If we overlap, how much do we overlap by?
                    let overlap = 0;
                    if(dx * dy > 0){
                        overlap = dx * dy;
                    }

                    this.tcols.push(new TileCollisionData(collider, overlap))
                    tilemapCollisions.push(new TileCollisionData(collider, overlap));
                }
            }
        }

        // Now that we have all collisions, sort by collision area highest to lowest
        tilemapCollisions = tilemapCollisions.sort((a, b) => a.overlapArea - b.overlapArea);
        let areas = "";
        tilemapCollisions.forEach(col => areas += col.overlapArea + ", ")
        Debug.log("cols", areas)

        // Resolve the collisions in order of collision area (i.e. "closest" tiles are collided with first, so we can slide along a surface of tiles)
        tilemapCollisions.forEach(collision => {
            let [firstContact, _, collidingX, collidingY] = getTimeOfCollision(node.getCollider(), velocity, collision.collider, Vec2.ZERO);

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
        let [firstContact, _, collidingX, collidingY] = getTimeOfCollision(movingNode.getCollider(), velocity, staticNode.getCollider(), Vec2.ZERO);

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

    render(ctx: CanvasRenderingContext2D): void {
        let vpo;
        for(let node of this.physicsNodes){
            vpo = node.getViewportOriginWithParallax();
            let pos = node.getPosition().sub(node.getViewportOriginWithParallax());
            let size = (<AABB>node.getCollider().getCollisionShape()).getHalfSize();

            ctx.lineWidth = 2;
            ctx.strokeStyle = "#FF0000";
            ctx.strokeRect(pos.x - size.x, pos.y-size.y, size.x*2, size.y*2);
        }

        for(let node of this.tcols){
            let pos = node.collider.getPosition().sub(vpo);
            let size = node.collider.getBoundingRect().getHalfSize();

            ctx.lineWidth = 2;
            ctx.strokeStyle = "#FF0000";
            ctx.strokeRect(pos.x - size.x, pos.y-size.y, size.x*2, size.y*2);
        }
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
    collider: Collider;
    overlapArea: number;

    constructor(collider: Collider, overlapArea: number){
        this.collider = collider;
        this.overlapArea = overlapArea;
    }
}