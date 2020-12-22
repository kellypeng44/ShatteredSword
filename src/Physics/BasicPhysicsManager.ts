import { Physical } from "../DataTypes/Interfaces/Descriptors";
import Vec2 from "../DataTypes/Vec2";
import GameNode from "../Nodes/GameNode";
import Tilemap from "../Nodes/Tilemap";
import PhysicsManager from "./PhysicsManager";
import BroadPhase from "./BroadPhaseAlgorithms/BroadPhase";
import SweepAndPrune from "./BroadPhaseAlgorithms/SweepAndPrune";
import Shape from "../DataTypes/Shapes/Shape";
import MathUtils from "../Utils/MathUtils";
import OrthogonalTilemap from "../Nodes/Tilemaps/OrthogonalTilemap";
import AABB from "../DataTypes/Shapes/AABB";
import Debug from "../Debug/Debug";

export default class BasicPhysicsManager extends PhysicsManager {

	/** The array of static nodes */
	protected staticNodes: Array<Physical>;

	/** The array of dynamic nodes */
	protected dynamicNodes: Array<Physical>;

	/** The array of tilemaps */
	protected tilemaps: Array<Tilemap>;

	/** The broad phase collision detection algorithm used by this physics system */
	protected broadPhase: BroadPhase;

	/** A 2D array that contains information about which layers interact with each other */
	protected layerMask: number[][];

	constructor(physicsOptions: Record<string, any>){
		super();
		this.staticNodes = new Array();
		this.dynamicNodes = new Array();
		this.tilemaps = new Array();
		this.broadPhase = new SweepAndPrune();

		let i = 0;
		if(physicsOptions.physicsLayerNames !== null){
			for(let layer of physicsOptions.physicsLayerNames){
				if(i >= physicsOptions.numPhysicsLayers){
					// If we have too many string layers, don't add extras
				}

				this.layerNames[i] = layer;
				this.layerMap.add(layer, i);
				i += 1;
			}
		}

		for(i; i < physicsOptions.numPhysicsLayers; i++){
			this.layerNames[i] = "" + i;
			this.layerMap.add("" + i, i);
		}

		this.layerMask = physicsOptions.physicsLayerCollisions;
	}

	/**
	 * Add a new physics object to be updated with the physics system
	 * @param node The node to be added to the physics system
	 */
	registerObject(node: GameNode): void {
		if(node.isStatic){
			// Static and not collidable
			this.staticNodes.push(node);
		} else {
			// Dynamic and not collidable
			this.dynamicNodes.push(node);
		}
		this.broadPhase.addNode(node);
	}

	/**
	 * Add a new tilemap to be updated with the physics system
	 * @param tilemap The tilemap to be added to the physics system
	 */
	registerTilemap(tilemap: Tilemap): void {
		this.tilemaps.push(tilemap);
	}

	/**
	 * Resolves a collision between two nodes, adjusting their velocities accordingly.
	 * @param node1 
	 * @param node2 
	 * @param firstContact 
	 * @param lastContact 
	 * @param collidingX 
	 * @param collidingY 
	 */
	resolveCollision(node1: Physical, node2: Physical, firstContact: Vec2, lastContact: Vec2, collidingX: boolean, collidingY: boolean): void {
		// Handle collision
		if( (firstContact.x < 1 || collidingX) && (firstContact.y < 1 || collidingY)){
			if(node1.isPlayer){
				node1.isColliding = true;
			} else if(node2.isPlayer){
				node2.isColliding = true;
			}

			// We are colliding. Check for any triggers
			let group1 = node1.group;
			let group2 = node2.group;

			// TODO - This is problematic if a collision happens, but it is later learned that another collision happens before it
			if(node1.triggers.has(group2)){
				// Node1 should send an event
				let eventType = node1.triggers.get(group2);
				this.emitter.fireEvent(eventType, {node: node1, other: node2, collision: {firstContact: firstContact}});
			}

			if(node2.triggers.has(group1)){
				// Node2 should send an event
				let eventType = node2.triggers.get(group1);
				this.emitter.fireEvent(eventType, {node: node2, other: node1, collision: {firstContact: firstContact}});
			}

			if(collidingX && collidingY){
				// If we're already intersecting, resolve the current collision
			} else if(node1.isCollidable && node2.isCollidable) {
				// We aren't already colliding, and both nodes can collide, so this is a new collision.

				// Get the amount to scale x and y based on their initial collision times
				let xScale = MathUtils.clamp(firstContact.x, 0, 1);
				let yScale = MathUtils.clamp(firstContact.y, 0, 1);

				MathUtils.floorToPlace(xScale, 4);
				MathUtils.floorToPlace(yScale, 4);
				
				// Handle special case of stickiness on perfect corner to corner collisions
				if(xScale === yScale){
					xScale = 1;
				}

				// Handle being stopped moving in the y-direction
				if(yScale !== 1){
					// Figure out which node is on top
					let node1onTop = node1.collisionShape.center.y < node2.collisionShape.center.y;

					// If either is moving, set their onFloor and onCeiling appropriately
					if(!node1.isStatic && node1.moving){
						node1.onGround = node1onTop;
						node1.onCeiling = !node1onTop;
					}
					
					if(!node2.isStatic && node2.moving){
						node2.onGround = !node1onTop;
						node2.onCeiling = node1onTop;
					}
				}

				// Handle being stopped moving in the x-direction
				if(xScale !== 1){
					// If either node is non-static and moving, set its onWall to true
					if(!node1.isStatic && node1.moving){
						node1.onWall = true;
					}
					
					if(!node2.isStatic && node2.moving){
						node2.onWall = true;
					}
				}

				// Scale velocity for either node if it is moving
				node1._velocity.scale(xScale, yScale);
				
				node2._velocity.scale(xScale, yScale);
			}
		}
	}

	collideWithTilemap(node: Physical, tilemap: Tilemap, velocity: Vec2): void {
		if(tilemap instanceof OrthogonalTilemap){
            this.collideWithOrthogonalTilemap(node, tilemap, velocity);
        }
	}

	collideWithOrthogonalTilemap(node: Physical, tilemap: OrthogonalTilemap, velocity: Vec2): void {
        // Get the starting position, ending position, and size of the node
        let startPos = node.collisionShape.center;
        let endPos = startPos.clone().add(velocity);
        let size = node.collisionShape.halfSize;

        // Get the min and max x and y coordinates of the moving node
        let min = new Vec2(Math.min(startPos.x - size.x, endPos.x - size.x), Math.min(startPos.y - size.y, endPos.y - size.y));
        let max = new Vec2(Math.max(startPos.x + size.x, endPos.x + size.x), Math.max(startPos.y + size.y, endPos.y + size.y));

        // Convert the min/max x/y to the min and max row/col in the tilemap array
        let minIndex = tilemap.getColRowAt(min);
        let maxIndex = tilemap.getColRowAt(max);

        // Create an empty set of tilemap collisions (We'll handle all of them at the end)
        let tilemapCollisions = new Array<TileCollisionData>();
        let tileSize = tilemap.getTileSize();

        // Loop over all possible tiles (which isn't many in the scope of the velocity per frame)
        for(let col = minIndex.x; col <= maxIndex.x; col++){
            for(let row = minIndex.y; row <= maxIndex.y; row++){
                if(tilemap.isTileCollidable(col, row)){

                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);

                    // Create a new collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1/2));

                    // Calculate collision area between the node and the tile
                    let dx = Math.min(startPos.x, tilePos.x) - Math.max(startPos.x + size.x, tilePos.x + size.x);
                    let dy = Math.min(startPos.y, tilePos.y) - Math.max(startPos.y + size.y, tilePos.y + size.y);

                    // If we overlap, how much do we overlap by?
                    let overlap = 0;
                    if(dx * dy > 0){
                        overlap = dx * dy;
                    }

                    tilemapCollisions.push(new TileCollisionData(collider, overlap));
                }
            }
        }

        // Now that we have all collisions, sort by collision area highest to lowest
		tilemapCollisions = tilemapCollisions.sort((a, b) => a.overlapArea - b.overlapArea);

        // Resolve the collisions in order of collision area (i.e. "closest" tiles are collided with first, so we can slide along a surface of tiles)
        tilemapCollisions.forEach(collision => {
            let [firstContact, _, collidingX, collidingY] = Shape.getTimeOfCollision(node.collisionShape, velocity, collision.collider, Vec2.ZERO);

            // Handle collision
            if( (firstContact.x < 1 || collidingX) && (firstContact.y < 1 || collidingY)){
				// We are definitely colliding, so add to this node's tilemap collision list
				node.collidedWithTilemap = true;

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

                    if(yScale !== 1){
                        // If the tile is below us
                        if(collision.collider.y > node.collisionShape.center.y){
                            node.onGround = true;
                        } else {
                            node.onCeiling = true;
                        }
                    }

                    if(xScale !== 1){
                        node.onWall = true;
                    }

                    // Scale the velocity of the node
                    velocity.scale(xScale, yScale);
                }
            }
        })
	}

	update(deltaT: number): void {
		/*---------- INITIALIZATION PHASE ----------*/
		for(let node of this.dynamicNodes){
			// Clear frame dependent boolean values for each node
			node.onGround = false;
			node.onCeiling = false;
			node.onWall = false;
			node.collidedWithTilemap = false;
			node.isColliding = false;

			if(node.isPlayer){
				Debug.log("pvel", "Player Velocity:", node._velocity.toString());
			}

			// Update the swept shapes of each node
			if(node.moving){
				// Round Velocity
				node._velocity.x = Math.round(node._velocity.x*1000)/1000;
				node._velocity.y = Math.round(node._velocity.y*1000)/1000;

				// If moving, reflect that in the swept shape
				node.sweptRect.sweep(node._velocity, node.collisionShape.center, node.collisionShape.halfSize);
			} else {
				node.sweptRect.sweep(Vec2.ZERO_STATIC, node.collisionShape.center, node.collisionShape.halfSize);
			}
		}

		/*---------- BROAD PHASE ----------*/
		// Get a potentially colliding set
		let potentialCollidingPairs = this.broadPhase.runAlgorithm();


		// TODO - Should I be getting all collisions first, sorting by the time they happen, the resolving them?
		/*---------- NARROW PHASE ----------*/
		for(let pair of potentialCollidingPairs){
			let node1 = pair[0];
			let node2 = pair[1];
			
			// Make sure both nodes are active
			if(!node1.active || !node2.active){
				continue;
			}

			// Make sure both nodes can collide with each other based on their physics layer
			if(!(node1.physicsLayer === -1 || node2.physicsLayer === -1 || this.layerMask[node1.physicsLayer][node2.physicsLayer] === 1)){
				// Nodes do not collide. Continue onto the next pair
				continue;
			}

			// Get Collision (which may or may not happen)
			let [firstContact, lastContact, collidingX, collidingY] = Shape.getTimeOfCollision(node1.collisionShape, node1._velocity, node2.collisionShape, node2._velocity);

			this.resolveCollision(node1, node2, firstContact, lastContact, collidingX, collidingY);
		}

		/*---------- TILEMAP PHASE ----------*/
		for(let node of this.dynamicNodes){
			if(node.moving && node.isCollidable){
				// If a node is moving and can collide, check it against every tilemap
				for(let tilemap of this.tilemaps){
					// Check if there could even be a collision
					if(node.sweptRect.overlaps(tilemap.boundary)){
						this.collideWithTilemap(node, tilemap, node._velocity);
					}
				}
			}
		}

		/*---------- ENDING PHASE ----------*/
		for(let node of this.dynamicNodes){
			if(node.moving){
				node.finishMove();
			}
		}
	}
}

// Collision data objects for tilemaps
class TileCollisionData {
    collider: AABB;
    overlapArea: number;

    constructor(collider: AABB, overlapArea: number){
        this.collider = collider;
        this.overlapArea = overlapArea;
    }
}