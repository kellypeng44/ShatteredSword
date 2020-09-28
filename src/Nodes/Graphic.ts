import CanvasNode from "./CanvasNode";
import Color from "../Utils/Color";

/**
 * The representation of a game object that doesn't rely on any resources to render - it is drawn to the screen by the canvas
 */
export default abstract class Graphic extends CanvasNode {

    protected color: Color;

    constructor(){
        super();
        this.color = Color.RED;
    }

    setColor(color: Color){
        this.color = color;
    }
}