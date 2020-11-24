import CanvasNode from "../CanvasNode";
import ResourceManager from "../../ResourceManager/ResourceManager";
import Vec2 from "../../DataTypes/Vec2";

/**
 * The representation of a sprite - an in-game image
 */
export default class Sprite extends CanvasNode {
    imageId: string;
    imageOffset: Vec2;

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
}