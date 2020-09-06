import CanvasNode from "./CanvasNode";
import Color from "../Utils/Color";

export default abstract class Graphic extends CanvasNode {

    color: Color;

    setColor(color: Color){
        this.color = color;
    }
}