import State from "../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import EnemyAI from "../EnemyAI";

export default abstract class EnemyState extends State {
    protected parent: EnemyAI;
    protected owner: GameNode;
    gravity: number = 1500; //TODO - can change later

    constructor(parent: EnemyAI, owner: GameNode){
      super(parent);
      this.owner = owner;
    }


    
	update(deltaT: number): void {
		// Do gravity
		this.parent.velocity.y += this.gravity*deltaT;
	}
    
}

