import Vec2 from "../../DataTypes/Vec2";
import Point from "../../Nodes/Graphics/Point";
import Rect from "../../Nodes/Graphics/Rect";
import ResourceManager from "../../ResourceManager/ResourceManager";
import Scene from "../../Scene/Scene";

export default class GraphicRenderer {
    protected resourceManager: ResourceManager;
    protected scene: Scene;
    protected ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D){
        this.resourceManager = ResourceManager.getInstance();
        this.ctx = ctx;
    }

    setScene(scene: Scene): void {
        this.scene = scene;
    }

    renderPoint(point: Point, origin: Vec2, zoom: number): void {
		this.ctx.fillStyle = point.color.toStringRGBA();
        this.ctx.fillRect((-point.size.x/2)*zoom, (-point.size.y/2)*zoom,
        point.size.x*zoom, point.size.y*zoom);
    }

    renderRect(rect: Rect, origin: Vec2, zoom: number): void {
        // Draw the interior of the rect
        if(rect.color.a !== 0){
            this.ctx.fillStyle = rect.color.toStringRGB();
            this.ctx.fillRect((-rect.size.x/2)*zoom, (-rect.size.y/2)*zoom, rect.size.x*zoom, rect.size.y*zoom);
        }

        // Draw the border of the rect
        this.ctx.strokeStyle = rect.getBorderColor().toStringRGB();
        this.ctx.lineWidth = rect.getBorderWidth();
        this.ctx.strokeRect((-rect.size.x/2)*zoom, (-rect.size.y/2)*zoom, rect.size.x*zoom, rect.size.y*zoom);
    }
}