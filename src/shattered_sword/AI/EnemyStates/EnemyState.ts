import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import State from "../../../Wolfie2D/DataTypes/State/State";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import EnemyAI from "../EnemyAI";
import Receiver from "../../../Wolfie2D/Events/Receiver";

export default abstract class EnemyState extends State {
  protected parent: EnemyAI;
  protected owner: GameNode;
  protected receiver: Receiver;
  gravity: number = 1500; //TODO - can change later

  constructor(parent: EnemyAI, owner: GameNode) {
    super(parent);
    this.owner = owner;
    this.receiver = new Receiver();
  }

  handleInput(event: GameEvent): void { }

  canWalk() {
    let collision = <AABB>this.owner.collisionShape;
    let colrow = this.parent.tilemap.getColRowAt(collision.center.clone().add(new Vec2(this.parent.direction * (collision.hw+2))));
    return !this.parent.tilemap.isTileCollidable(colrow.x, colrow.y) && this.parent.tilemap.isTileCollidable(colrow.x,colrow.y+1);
  }

  update(deltaT: number): void {
    // Do gravity
    this.parent.velocity.y += this.gravity * deltaT;
    this.owner.move(this.parent.velocity.scaled(deltaT));
  }
}

