import Map from "../DataTypes/Map";
import CanvasNode from "../Nodes/CanvasNode";
import Graphic from "../Nodes/Graphic";
import Point from "../Nodes/Graphics/Point";
import Rect from "../Nodes/Graphics/Rect";
import Sprite from "../Nodes/Sprites/Sprite";
import Tilemap from "../Nodes/Tilemap";
import OrthogonalTilemap from "../Nodes/Tilemaps/OrthogonalTilemap";
import UIElement from "../Nodes/UIElement";
import UILayer from "../Scene/Layers/UILayer";
import Scene from "../Scene/Scene";
import GraphicRenderer from "./CanvasRendering/GraphicRenderer";
import RenderingManager from "./RenderingManager"
import TilemapRenderer from "./CanvasRendering/TilemapRenderer";
import UIElementRenderer from "./CanvasRendering/UIElementRenderer";
import Label from "../Nodes/UIElements/Label";
import Button from "../Nodes/UIElements/Button";
import Slider from "../Nodes/UIElements/Slider";
import TextInput from "../Nodes/UIElements/TextInput";
import AnimatedSprite from "../Nodes/Sprites/AnimatedSprite";

export default class CanvasRenderer extends RenderingManager {
    protected ctx: CanvasRenderingContext2D;
    protected graphicRenderer: GraphicRenderer;
    protected tilemapRenderer: TilemapRenderer;
    protected uiElementRenderer: UIElementRenderer;

    constructor(){
        super();;
    }

    setScene(scene: Scene){
        this.scene = scene;
        this.graphicRenderer.setScene(scene);
        this.tilemapRenderer.setScene(scene);
        this.uiElementRenderer.setScene(scene);
    }

    initializeCanvas(canvas: HTMLCanvasElement, width: number, height: number): CanvasRenderingContext2D {
        canvas.width = width;
        canvas.height = height;

        this.ctx = canvas.getContext("2d");

        this.graphicRenderer = new GraphicRenderer(this.ctx);
        this.tilemapRenderer = new TilemapRenderer(this.ctx);
        this.uiElementRenderer = new UIElementRenderer(this.ctx)

        // For crisp pixel art
        this.ctx.imageSmoothingEnabled = false;

        return this.ctx;
    }

    render(visibleSet: CanvasNode[], tilemaps: Tilemap[], uiLayers: Map<UILayer>): void {
        // Sort by depth, then by visible set by y-value
        visibleSet.sort((a, b) => {
            if(a.getLayer().getDepth() === b.getLayer().getDepth()){
                return (a.boundary.bottom) - (b.boundary.bottom);
            } else {
                return a.getLayer().getDepth() - b.getLayer().getDepth();
            }
        });

        // Render tilemaps
        tilemaps.forEach(tilemap => {
            this.renderTilemap(tilemap);
        });

        // Render visible set
        visibleSet.forEach(node => {
            if(node.visible){
                this.renderNode(node);
            }
        });

        // Render the uiLayers
        uiLayers.forEach(key => uiLayers.get(key).getItems().forEach(node => this.renderNode(<CanvasNode>node)));
    }

    protected renderNode(node: CanvasNode): void {
        if(node instanceof AnimatedSprite){
            this.renderAnimatedSprite(<AnimatedSprite>node);
        } else if(node instanceof Sprite){
            this.renderSprite(<Sprite>node);
        } else if(node instanceof Graphic){
            this.renderGraphic(<Graphic>node);
        } else if(node instanceof UIElement){
            this.renderUIElement(<UIElement>node);
        }
    }

    protected renderSprite(sprite: Sprite): void {
        // Get the image from the resource manager
        let image = this.resourceManager.getImage(sprite.imageId);

        // Calculate the origin of the viewport according to this sprite
        let origin = this.scene.getViewTranslation(sprite);

        // Get the zoom level of the scene
        let zoom = this.scene.getViewScale();

        /*
            Coordinates in the space of the image:
                image crop start -> x, y
                image crop size  -> w, h
            Coordinates in the space of the world
                image draw start -> x, y
                image draw size  -> w, h
        */
        this.ctx.drawImage(image,
            sprite.imageOffset.x, sprite.imageOffset.y,
            sprite.size.x, sprite.size.y,
            (sprite.position.x - origin.x - sprite.size.x*sprite.scale.x/2)*zoom, (sprite.position.y - origin.y - sprite.size.y*sprite.scale.y/2)*zoom,
            sprite.size.x * sprite.scale.x*zoom, sprite.size.y * sprite.scale.y*zoom);

        // Debug mode
        if(this.debug){
            this.ctx.lineWidth = 4;
            this.ctx.strokeStyle = "#00FF00"
            let b = sprite.boundary;
            this.ctx.strokeRect(b.x - b.hw - origin.x, b.y - b.hh - origin.y, b.hw*2*zoom, b.hh*2*zoom);
        }
    }

    protected renderAnimatedSprite(sprite: AnimatedSprite): void {
        // Get the image from the resource manager
        let image = this.resourceManager.getImage(sprite.imageId);

        // Calculate the origin of the viewport according to this sprite
        let origin = this.scene.getViewTranslation(sprite);

        // Get the zoom level of the scene
        let zoom = this.scene.getViewScale();

        let animationIndex = sprite.animation.getIndexAndAdvanceAnimation();

        let animationOffset = sprite.getAnimationOffset(animationIndex);

        /*
            Coordinates in the space of the image:
                image crop start -> x, y
                image crop size  -> w, h
            Coordinates in the space of the world
                image draw start -> x, y
                image draw size  -> w, h
        */
        this.ctx.drawImage(image,
            sprite.imageOffset.x + animationOffset.x, sprite.imageOffset.y + animationOffset.y,
            sprite.size.x, sprite.size.y,
            (sprite.position.x - origin.x - sprite.size.x*sprite.scale.x/2)*zoom, (sprite.position.y - origin.y - sprite.size.y*sprite.scale.y/2)*zoom,
            sprite.size.x * sprite.scale.x*zoom, sprite.size.y * sprite.scale.y*zoom);

        // Debug mode
        if(this.debug){
            this.ctx.lineWidth = 4;
            this.ctx.strokeStyle = "#00FF00"
            let b = sprite.boundary;
            this.ctx.strokeRect(b.x - b.hw - origin.x, b.y - b.hh - origin.y, b.hw*2*zoom, b.hh*2*zoom);
        }
    }

    protected renderGraphic(graphic: Graphic): void {
        if(graphic instanceof Point){
            this.graphicRenderer.renderPoint(<Point>graphic);
        } else if(graphic instanceof Rect){
            this.graphicRenderer.renderRect(<Rect>graphic);
        }
    }

    protected renderTilemap(tilemap: Tilemap): void {
        if(tilemap instanceof OrthogonalTilemap){
            this.tilemapRenderer.renderOrthogonalTilemap(<OrthogonalTilemap>tilemap);
        }
    }

    protected renderUIElement(uiElement: UIElement): void {
        if(uiElement instanceof Label){
            this.uiElementRenderer.renderLabel(uiElement);
        } else if(uiElement instanceof Button){
            this.uiElementRenderer.renderButton(uiElement);
        } else if(uiElement instanceof Slider){
            this.uiElementRenderer.renderSlider(uiElement);
        } else if(uiElement instanceof TextInput){
            this.uiElementRenderer.renderTextInput(uiElement);
        }
    }
}