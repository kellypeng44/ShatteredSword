import PhysicsNode from "./PhysicsNode";
import Vec2 from "../DataTypes/Vec2";

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
                if(movingNode.getCollider().willCollideWith(staticNode.getCollider(), velocity, new Vec2(0, 0))){
                    this.handleCollision(movingNode, staticNode, velocity);
                }
            }

            movingNode.finishMove(velocity);
        }
        
        // Reset movements
        this.movements = new Array();
    }

    handleCollision(movingNode: PhysicsNode, staticNode: PhysicsNode, velocity: Vec2){
        let ASize = movingNode.getCollider().getSize();
        let A = new Vec2(movingNode.getPosition().x + ASize.x, movingNode.getPosition().y + ASize.y);
        let BSize = staticNode.getCollider().getSize();
        let B = new Vec2(staticNode.getPosition().x + BSize.x, staticNode.getPosition().y + BSize.y);
        
        let firstContact = new Vec2(0, 0);
        firstContact.x = (B.x-(BSize.x/2) - (A.x + (ASize.x/2)))/(velocity.x - 0);
        firstContact.y = (B.y-(BSize.y/2) - (A.y + (ASize.y/2)))/(velocity.y - 0);

        if(firstContact.x < 1 || firstContact.y < 1){
            // We collided
            let firstCollisionTime = Math.min(firstContact.x, firstContact.y);
            velocity.scale(firstCollisionTime);
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