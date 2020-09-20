import CanvasNode from "../CanvasNode";
import ResourceManager from "../../ResourceManager/ResourceManager";
import Vec2 from "../../DataTypes/Vec2";

/**
 * The representation of a sprite - an in-game image
 */
export default class Sprite extends CanvasNode {
    private imageId: string;
    private imageOffset: Vec2;

    constructor(imageId: string){
        super();
        this.imageId = imageId;
        let image = ResourceManager.getInstance().getImage(this.imageId);
        this.size = new Vec2(image.width, image.height);
        this.imageOffset = Vec2.ZERO;
    }

    /**
     * Sets the offset of the sprite from (0, 0) in the image's coordinates
     * @param offset 
     */
    setImageOffset(offset: Vec2): void {
        this.imageOffset = offset;
    }

    update(deltaT: number): void {}

    render(ctx: CanvasRenderingContext2D): void {
        let image = ResourceManager.getInstance().getImage(this.imageId);
        let origin = this.getViewportOriginWithParallax();
        ctx.drawImage(image,
            this.imageOffset.x, this.imageOffset.y, this.size.x, this.size.y,
            this.position.x - origin.x, this.position.y - origin.y, this.size.x * this.scale.x, this.size.y * this.scale.y);
    }
}