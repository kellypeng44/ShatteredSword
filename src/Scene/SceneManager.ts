import Scene from "./Scene";
import ResourceManager from "../ResourceManager/ResourceManager";
import Viewport from "../SceneGraph/Viewport";

export default class SceneManager{

	private currentScene: Scene;
	private viewport: Viewport;
	private resourceManager: ResourceManager;

	constructor(viewport: Viewport){
		this.resourceManager = ResourceManager.getInstance();
		this.viewport = viewport;
	}

	public addScene<T extends Scene>(constr: new (...args: any) => T){
		let scene = new constr(this.viewport);
		this.currentScene = scene;

		// Enqueue all scene asset loads
		scene.loadScene();

		// Load all assets
		this.resourceManager.loadResourcesFromQueue(() => {
			scene.start();
			scene.setRunning(true);
		})
	}

	public render(ctx: CanvasRenderingContext2D){
		this.currentScene.render(ctx);
	}

	public update(deltaT: number){
		if(this.currentScene.isRunning()){
			this.currentScene.update(deltaT);
		}
	}
}