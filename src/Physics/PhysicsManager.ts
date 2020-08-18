import PhysicsNode from "./PhysicsNode";
import Vec2 from "../DataTypes/Vec2";
import StaticBody from "./StaticBody";
import Debug from "../Debug/Debug";

export default class PhysicsManager {

    physicsNodes: Array<PhysicsNode>;
    movements: Array<MovementData>;

    constructor(){
        this.physicsNodes = new Array();
        this.movements = new Array();
    }

    add(node: PhysicsNode): void {
        this.physicsNodes.push(node);
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
            // Get velocity of node
            let velocity = null;
            for(let data of this.movements){
                if(data.node === movingNode){
                    velocity = new Vec2(data.velocity.x, data.velocity.y);
                }
            }

            for(let staticNode of staticSet){
                this.handleCollision(movingNode, staticNode, velocity, (<StaticBody>staticNode).id);
            }

            movingNode.finishMove(velocity);
        }
        
        // Reset movements
        this.movements = new Array();
    }

    handleCollision(movingNode: PhysicsNode, staticNode: PhysicsNode, velocity: Vec2, id: String){
        let sizeA = movingNode.getCollider().getSize();
        let A = movingNode.getPosition();
        let velA = velocity;
        let sizeB = staticNode.getCollider().getSize();
        let B = staticNode.getPosition();
        let velB = new Vec2(0, 0);
        
        let firstContact = new Vec2(0, 0);
        let lastContact = new Vec2(0, 0);

        let collidingX = false;
        let collidingY = false;

        // Sort by position
        if(B.x < A.x){
            // Swap, because B is to the left of A
            let temp: Vec2;
            temp = sizeA;
            sizeA = sizeB;
            sizeB = temp;

            temp = A;
            A = B;
            B = temp;

            temp = velA;
            velA = velB;
            velB = temp;
        }

        // A is left, B is right
        firstContact.x = Infinity;
        lastContact.x = Infinity;

        if (B.x >= A.x + sizeA.x){
            // If we aren't currently colliding
            let relVel = velA.x - velB.x;
            
            if(relVel > 0){
                // If they are moving towards each other
                firstContact.x = (B.x - (A.x + (sizeA.x)))/(relVel);
                lastContact.x = ((B.x + sizeB.x) - A.x)/(relVel);
            }
        } else {
            collidingX = true;
        }

        if(B.y < A.y){
            // Swap, because B is above A
            let temp: Vec2;
            temp = sizeA;
            sizeA = sizeB;
            sizeB = temp;

            temp = A;
            A = B;
            B = temp;

            temp = velA;
            velA = velB;
            velB = temp;
        }

        // A is top, B is bottom
        firstContact.y = Infinity;
        lastContact.y = Infinity;

        if (B.y >= A.y + sizeA.y){
            // If we aren't currently colliding
            let relVel = velA.y - velB.y;
            
            if(relVel > 0){
                // If they are moving towards each other
                firstContact.y = (B.y - (A.y + (sizeA.y)))/(relVel);
                lastContact.y = ((B.y + sizeB.y) - A.y)/(relVel);
            }
        } else {
            collidingY = true;
        }

        if( (firstContact.x < 1 || collidingX) && (firstContact.y < 1 || collidingY)){
            if(collidingX && collidingY){
                // If we're already intersecting, freak out I guess?
            } else {
                let contactTime = Math.min(firstContact.x, firstContact.y);
                velocity.scale(contactTime);
            }
        }
    }
}

class MovementData{
    node: PhysicsNode;
    velocity: Vec2;
    constructor(node: PhysicsNode, velocity: Vec2){
        this.node = node;
        this.velocity = velocity;
    }
}