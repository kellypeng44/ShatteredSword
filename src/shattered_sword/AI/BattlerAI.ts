import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";


//TODO - 
export default interface BattlerAI extends AI {
    owner: GameNode;

    CURRENT_HP: number;     //changed health to CURRENT_HP

    damage: (damage: number) => void;
}


