import Scene from "./Scene";
import ResourceManager from "../ResourceManager/ResourceManager";
import Viewport from "../SceneGraph/Viewport";
import GameLoop from "../Loop/GameLoop";
import RenderingManager from "../Rendering/RenderingManager";

/**
 * The SceneManager of the game engine. There is only one of theses.
 * The SceneManager acts as an interface to create Scenes, and handles the lifecycle methods of Scenes.
 * The Scene manager keeps track of systems that are constant across scene, such as the @reference[ResourceManager]
 */
export default class SceneManager {
	/** The current Scene of the game */
	protected currentScene: Scene;
	/** The Viewport of the game */
	protected viewport: Viewport;
	/** A reference to the ResourceManager */
	protected resourceManager: ResourceManager;
	/** The GameLoop this SceneManager belongs to */
	protected game: GameLoop;
	/** A counter to keep track of game ids */
	protected idCounter: number;
	/** The RenderingManager of the game */
	protected renderingManager: RenderingManager;

	/**
	 * Creates a new SceneManager
	 * @param viewport The Viewport of the game
	 * @param game The GameLoop instance
	 * @param renderingManager The RenderingManager of the game
	 */
	constructor(viewport: Viewport, game: GameLoop, renderingManager: RenderingManager){
		this.resourceManager = ResourceManager.getInstance();
		this.viewport = viewport;
		this.game = game;
		this.renderingManager = renderingManager;
		this.idCounter = 0;
	}

	/**
	 * Add a scene as the main scene.
	 * Use this method if you've created a subclass of Scene, and you want to add it as the main Scene.
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
	 * Change from the current scene to this new scene.
	 * Use this method if you've created a subclass of Scene, and you want to add it as the main Scene.
	 * @param constr The constructor of the scene to change to
	 */
	public changeScene<T extends Scene>(constr: new (...args: any) => T, options: Record<string, any>): void {
		// unload current scene
		this.currentScene.unloadScene();

		this.resourceManager.unloadAllResources();

		this.viewport.setCenter(0, 0);

		this.addScene(constr, options);
	}

	/**
	 * Generates a unique ID
	 * @returns A new ID
	 */
	public generateId(): number {
		return this.idCounter++;
	}

	/**
	 * Renders the current Scene
	 */
	public render(): void {
		this.currentScene.render();
	}

	/**
	 * Updates the current Scene
	 * @param deltaT The timestep of the Scene
	 */
	public update(deltaT: number){
		if(this.currentScene.isRunning()){
			this.currentScene.update(deltaT);
		}
	}
}