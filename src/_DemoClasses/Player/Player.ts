import Vec2 from "../../DataTypes/Vec2";
import Rect from "../../Nodes/Graphics/Rect";
import PlayerController, { PlayerType } from "./PlayerController";

export default class Player extends Rect {
    controller: PlayerController;

    constructor(position: Vec2){
        super(position, new Vec2(20, 20));

        this.controller = new PlayerController(this, PlayerType.TOPDOWN);
    }

    update(deltaT: number): void {
        this.controller.update(deltaT);
    }
}