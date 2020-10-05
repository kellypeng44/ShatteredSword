import Scene from "./Scene";
import ResourceManager from "../ResourceManager/ResourceManager";
import Viewport from "../SceneGraph/Viewport";
import GameLoop from "../Loop/GameLoop";

export default class SceneManager {

	private currentScene: Scene;
	private viewport: Viewport;
	private resourceManager: ResourceManager;
	private game: GameLoop;
	private idCounter: number;

	constructor(viewport: Viewport, game: GameLoop){
		this.resourceManager = ResourceManager.getInstance();
		this.viewport = viewport;
		this.game = game;
		this.idCounter = 0;
	}

	/**
	 * Add a scene as the main scene
	 * @param constr The constructor of the scene to add
	 */
	public addScene<T extends Scene>(constr: new (...args: any) => T): void {
		console.log("Adding Scene");
		let scene = new constr(this.viewport, this, this.game);
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
	}

	/**
	 * Change from the current scene to this new scene
	 * @param constr The constructor of the scene to change to
	 */
	public changeScene<T extends Scene>(constr: new (...args: any) => T): void {
		// unload current scene
		this.currentScene.unloadScene();

		this.resourceManager.unloadAllResources();

		this.viewport.setCenter(0, 0);

		this.addScene(constr);
	}

	public generateId(): number {
		return this.idCounter++;
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