import Vec2 from "../DataTypes/Vec2";
import Vec4 from "../DataTypes/Vec4";
import GameNode from "../Nodes/GameNode";
import CanvasNode from "../Nodes/CanvasNode";
import MathUtils from "../Utils/MathUtils";
import Queue from "../DataTypes/Queue";

export default class Viewport {
	private position: Vec2;
	private size: Vec2;
	private bounds: Vec4;
    private following: GameNode;

    /**
     * A queue of previous positions of what this viewport is following. Used for smoothing viewport movement
     */
    private lastPositions: Queue<Vec2>;

    /**
     * The number of previous positions this viewport tracks
     */
    private smoothingFactor: number;

    constructor(){
        this.position = new Vec2(0, 0);
        this.size = new Vec2(0, 0);
        this.bounds = new Vec4(0, 0, 0, 0);
        this.lastPositions = new Queue();
        this.smoothingFactor = 10;
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
        let pos: Vec2;
		if(vecOrX instanceof Vec2){
            pos = vecOrX;
        } else {
            pos = new Vec2(vecOrX, y);
        }

        this.lastPositions.clear();
        this.lastPositions.enqueue(pos);
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
     * Sets the smoothing factor for the viewport movement.
     * @param smoothingFactor The smoothing factor for the viewport
     */
    setSmoothingFactor(smoothingFactor: number): void {
        if(smoothingFactor < 1) smoothingFactor = 1;
        this.smoothingFactor = smoothingFactor;
    }
    
    /**
     * Returns true if the CanvasNode is inside of the viewport
     * @param node 
     */
    includes(node: CanvasNode): boolean {
        let nodePos = node.getPosition();
        let nodeSize = node.getSize();
        let nodeScale = node.getScale();
        let parallax = node.getLayer().getParallax();
        let originX = this.position.x*parallax.x;
        let originY = this.position.y*parallax.y;
        if(nodePos.x + nodeSize.x * nodeScale.x > originX && nodePos.x < originX + this.size.x){
            if(nodePos.y + nodeSize.y * nodeScale.y > originY && nodePos.y < originY + this.size.y){
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
            // Update our list of previous positions
            this.lastPositions.enqueue(this.following.getPosition().clone());
            if(this.lastPositions.getSize() > this.smoothingFactor){
                this.lastPositions.dequeue();
            }
            
            // Get the average of the last 10 positions
            let pos = Vec2.ZERO;
            this.lastPositions.forEach(position => pos.add(position));
            pos.scale(1/this.lastPositions.getSize());

            // Set this position either to the object or to its bounds
            this.position.x = pos.x - this.size.x/2;
            this.position.y = pos.y - this.size.y/2;
            let [min, max] = this.bounds.split();
            this.position.x = MathUtils.clamp(this.position.x, min.x, max.x - this.size.x);
            this.position.y = MathUtils.clamp(this.position.y, min.y, max.y - this.size.y);
        }
    }
}