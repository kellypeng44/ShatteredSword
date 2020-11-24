import Map from "../DataTypes/Map";
import CanvasNode from "../Nodes/CanvasNode";
import Graphic from "../Nodes/Graphic";
import AnimatedSprite from "../Nodes/Sprites/AnimatedSprite";
import Sprite from "../Nodes/Sprites/Sprite";
import Tilemap from "../Nodes/Tilemap";
import UIElement from "../Nodes/UIElement";
import ResourceManager from "../ResourceManager/ResourceManager";
import UILayer from "../Scene/Layers/UILayer";
import Scene from "../Scene/Scene";

export default abstract class RenderingManager {
    // Give the renderer access to the resource manager
    protected resourceManager: ResourceManager;
    protected scene: Scene;
    debug: boolean;

    constructor(){
        this.resourceManager = ResourceManager.getInstance();
        this.debug = false;
    }

    setScene(scene: Scene): void {
        this.scene = scene;
    }

    abstract initializeCanvas(canvas: HTMLCanvasElement, width: number, height: number): any;

    abstract render(visibleSet: Array<CanvasNode>, tilemaps: Array<Tilemap>, uiLayers: Map<UILayer>): void;

    protected abstract renderSprite(sprite: Sprite): void;

    protected abstract renderAnimatedSprite(sprite: AnimatedSprite): void;

    protected abstract renderGraphic(graphic: Graphic): void;

    protected abstract renderTilemap(tilemap: Tilemap): void;

    protected abstract renderUIElement(uiElement: UIElement): void;
}