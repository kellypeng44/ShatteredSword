import Scene from "./Scene";
import ResourceManager from "../ResourceManager/ResourceManager";
import Viewport from "../SceneGraph/Viewport";
import GameLoop from "../Loop/GameLoop";
import RenderingManager from "../Rendering/RenderingManager";

export default class SceneManager {
	protected currentScene: Scene;
	protected viewport: Viewport;
	protected resourceManager: ResourceManager;
	protected game: GameLoop;
	protected idCounter: number;
	protected renderingManager: RenderingManager;

	constructor(viewport: Viewport, game: GameLoop, renderingManager: RenderingManager){
		this.resourceManager = ResourceManager.getInstance();
		this.viewport = viewport;
		this.game = game;
		this.renderingManager = renderingManager;
		this.idCounter = 0;
	}

	/**
	 * Add a scene as the main scene
	 * @param constr The constructor of the scene to add
	 */
	public addScene<T extends Scene>(constr: new (...args: any) => T, options: Record<string, any>): void {
		let scene = new constr(this.viewport, this, this.renderingManager, this.game, options);
		this.currentScene = scene;

		// Enqueue all scene asset loads
		scene.loadScene();

		// Load all assets
		console.log("Starting Scene Load");
		this.resourceManager.loadResourcesFromQueue(() => {
			console.log("Starting Scene");
			scene.startScene();
			scene.setRunning(true);
		});

		this.renderingManager.setScene(scene);
	}

	/**
	 * Change from the current scene to this new scene
	 * @param constr The constructor of the scene to change to
	 */
	public changeScene<T extends Scene>(constr: new (...args: any) => T, options: Record<string, any>): void {
		// unload current scene
		this.currentScene.unloadScene();

		this.resourceManager.unloadAllResources();

		this.viewport.setCenter(0, 0);

		this.addScene(constr, options);
	}

	public generateId(): number {
		return this.idCounter++;
	}

	public render(){
		this.currentScene.render();
	}

	public update(deltaT: number){
		if(this.currentScene.isRunning()){
			this.currentScene.update(deltaT);
		}
	}
}