import Graph from "../DataTypes/Graphs/Graph";
import Map from "../DataTypes/Map";
import Vec2 from "../DataTypes/Vec2";
import CanvasNode from "../Nodes/CanvasNode";
import Graphic from "../Nodes/Graphic";
import { GraphicType } from "../Nodes/Graphics/GraphicTypes";
import Point from "../Nodes/Graphics/Point";
import Rect from "../Nodes/Graphics/Rect";
import AnimatedSprite from "../Nodes/Sprites/AnimatedSprite";
import Sprite from "../Nodes/Sprites/Sprite";
import Tilemap from "../Nodes/Tilemap";
import UIElement from "../Nodes/UIElement";
import ShaderRegistry from "../Registry/Registries/ShaderRegistry";
import Registry from "../Registry/Registry";
import ResourceManager from "../ResourceManager/ResourceManager";
import UILayer from "../Scene/Layers/UILayer";
import RenderingUtils from "../Utils/RenderingUtils";
import RenderingManager from "./RenderingManager";
import ShaderType from "./WebGLRendering/ShaderType";

export default class WebGLRenderer extends RenderingManager {

	protected origin: Vec2;
	protected zoom: number;
	protected worldSize: Vec2;

	protected gl: WebGLRenderingContext;

	initializeCanvas(canvas: HTMLCanvasElement, width: number, height: number): WebGLRenderingContext {
		canvas.width = width;
        canvas.height = height;

		this.worldSize = Vec2.ZERO;
		this.worldSize.x = width;
		this.worldSize.y = height;

		// Get the WebGL context
        this.gl = canvas.getContext("webgl");

		this.gl.viewport(0, 0, canvas.width, canvas.height);

		this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.CULL_FACE);

		// Tell the resource manager we're using WebGL
		ResourceManager.getInstance().useWebGL(true, this.gl);

        return this.gl;
	}

	render(visibleSet: CanvasNode[], tilemaps: Tilemap[], uiLayers: Map<UILayer>): void {
		for(let node of visibleSet){
			this.renderNode(node);
		}
	}

	protected renderNode(node: CanvasNode): void {
		// Calculate the origin of the viewport according to this sprite
        this.origin = this.scene.getViewTranslation(node);

        // Get the zoom level of the scene
        this.zoom = this.scene.getViewScale();
		
		if(node.hasCustomShader){
			// If the node has a custom shader, render using that
			this.renderCustom(node);
		} else if(node instanceof Graphic){
			this.renderGraphic(node);
		} else if(node instanceof Sprite){
			if(node instanceof AnimatedSprite){
				this.renderAnimatedSprite(node);
			} else {
				this.renderSprite(node);
			}
		}
	}

	protected renderSprite(sprite: Sprite): void {
		let shader = Registry.shaders.get(ShaderRegistry.SPRITE_SHADER);

		let options = shader.getOptions(sprite);
		options.worldSize = this.worldSize;
		options.origin = this.origin;

		shader.render(this.gl, options);
	}

	protected renderAnimatedSprite(sprite: AnimatedSprite): void {
		let shader = Registry.shaders.get(ShaderRegistry.SPRITE_SHADER);

		let options = shader.getOptions(sprite);
		options.worldSize = this.worldSize;
		options.origin = this.origin;

		Registry.shaders.get(ShaderRegistry.SPRITE_SHADER).render(this.gl, options);
	}

	protected renderGraphic(graphic: Graphic): void {

		if(graphic instanceof Point){
			let shader = Registry.shaders.get(ShaderRegistry.POINT_SHADER);
			let options = shader.getOptions(graphic);
			options.worldSize = this.worldSize;
			options.origin = this.origin;

			shader.render(this.gl, options);
		} else if(graphic instanceof Rect) {
			let shader = Registry.shaders.get(ShaderRegistry.RECT_SHADER);
			let options = shader.getOptions(graphic);
			options.worldSize = this.worldSize;
			options.origin = this.origin;
			
			shader.render(this.gl, options);
		} 
	}

	protected renderTilemap(tilemap: Tilemap): void {
		throw new Error("Method not implemented.");
	}

	protected renderUIElement(uiElement: UIElement): void {
		throw new Error("Method not implemented.");
	}

	protected renderCustom(node: CanvasNode): void {
		let shader = Registry.shaders.get(node.customShaderKey);
		let options = shader.getOptions(node);
		options.worldSize = this.worldSize;
		options.origin = this.origin;

		shader.render(this.gl, options);
	}

}