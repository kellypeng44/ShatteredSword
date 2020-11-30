import Graphic from "../Graphic";
import Vec2 from "../../DataTypes/Vec2";

export default class Point extends Graphic {

    constructor(position: Vec2){
        super();
        this.position = position;
        this.size.set(5, 5);
    }
}