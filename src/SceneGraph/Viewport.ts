import Vec2 from "../DataTypes/Vec2";
import Vec4 from "../DataTypes/Vec4";
import GameNode from "../Nodes/GameNode";
import CanvasNode from "../Nodes/CanvasNode";
import MathUtils from "../Utils/MathUtils";

export default class Viewport {
	private position: Vec2;
	private size: Vec2;
	private bounds: Vec4;
	private following: GameNode;

    constructor(){
        this.position = new Vec2(0, 0);
        this.size = new Vec2(0, 0);
        this.bounds = new Vec4(0, 0, 0, 0);
    }

    /**
     * Returns the position of the viewport as a Vec2
     */
    getPosition(): Vec2 {
        return this.position;
    }

    /**
     * Set the position of the viewport
     * @param vecOrX 
     * @param y 
     */
    setPosition(vecOrX: Vec2 | number, y: number = null): void {
		if(vecOrX instanceof Vec2){
			this.position.set(vecOrX.x, vecOrX.y);
		} else {
			this.position.set(vecOrX, y);
        }
    }

    /**
     * Returns the size of the viewport as a Vec2
     */
    getSize(): Vec2{
        return this.size;
    }
    
    /**
     * Sets the size of the viewport
     * @param vecOrX 
     * @param y 
     */
    setSize(vecOrX: Vec2 | number, y: number = null): void {
		if(vecOrX instanceof Vec2){
			this.size.set(vecOrX.x, vecOrX.y);
		} else {
			this.size.set(vecOrX, y);
		}
    }
    
    /**
     * Returns true if the CanvasNode is inside of the viewport
     * @param node 
     */
    includes(node: CanvasNode): boolean {
        let nodePos = node.getPosition();
        let nodeSize = node.getSize();
        let parallax = node.getLayer().getParallax();
        let originX = this.position.x*parallax.x;
        let originY = this.position.y*parallax.y;
        if(nodePos.x + nodeSize.x > originX && nodePos.x < originX + this.size.x){
            if(nodePos.y + nodeSize.y > originY && nodePos.y < originY + this.size.y){
                return true;
            }
        }

        return false;
    }

	// TODO: Put some error handling on this for trying to make the bounds too small for the viewport
    // TODO: This should probably be done automatically, or should consider the aspect ratio or something
    /**
     * Sets the bounds of the viewport
     * @param lowerX 
     * @param lowerY 
     * @param upperX 
     * @param upperY 
     */
    setBounds(lowerX: number, lowerY: number, upperX: number, upperY: number): void {
        this.bounds = new Vec4(lowerX, lowerY, upperX, upperY);
    }

    /**
     * Make the viewport follow the specified GameNode
     * @param node The GameNode to follow
     */
    follow(node: GameNode): void {
        this.following = node;
    }

    update(deltaT: number): void {
        // If viewport is following an object
        if(this.following){
            // Set this position either to the object or to its bounds
            this.position.x = this.following.getPosition().x - this.size.x/2;
            this.position.y = this.following.getPosition().y - this.size.y/2;
            let [min, max] = this.bounds.split();
            this.position.x = MathUtils.clamp(this.position.x, min.x, max.x - this.size.x);
            this.position.y = MathUtils.clamp(this.position.y, min.y, max.y - this.size.y);
        }
    }
}