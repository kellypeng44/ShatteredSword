import CanvasNode from "../CanvasNode";
import ResourceManager from "../../ResourceManager/ResourceManager";
import Vec2 from "../../DataTypes/Vec2";

/**
 * The representation of a sprite - an in-game image
 */
export default class Sprite extends CanvasNode {
    private imageId: string;
    private scale: Vec2;

    constructor(imageId: string){
        super();
        this.imageId = imageId;
        let image = ResourceManager.getInstance().getImage(this.imageId);
        this.size = new Vec2(image.width, image.height);
        this.scale = new Vec2(1, 1);
    }

    /**
     * Returns the scale of the sprite
     */
    getScale(): Vec2 {
        return this.scale;
    }

    /**
     * Sets the scale of the sprite to the value provided
     * @param scale 
     */
    setScale(scale: Vec2): void {
        this.scale = scale;
    }

    update(deltaT: number): void {}

    render(ctx: CanvasRenderingContext2D): void {
        let image = ResourceManager.getInstance().getImage(this.imageId);
        let origin = this.getViewportOriginWithParallax();
        ctx.drawImage(image,
            0, 0, this.size.x, this.size.y,
            this.position.x - origin.x, this.position.y - origin.y, this.size.x * this.scale.x, this.size.y * this.scale.y);
    }
}