import EventQueue from "../Events/EventQueue";
import InputReceiver from "../Input/InputReceiver";
import InputHandler from "../Input/InputHandler";
import Recorder from "../Playback/Recorder";
import Debug from "../Debug/Debug";
import ResourceManager from "../ResourceManager/ResourceManager";
import Viewport from "../SceneGraph/Viewport";
import SceneManager from "../Scene/SceneManager";
import AudioManager from "../Sound/AudioManager";
import Stats from "../Debug/Stats";
import RenderingManager from "../Rendering/RenderingManager";
import CanvasRenderer from "../Rendering/CanvasRenderer";
import Color from "../Utils/Color";
import GameOptions from "./GameOptions";
import GameLoop from "./GameLoop";
import FixedUpdateGameLoop from "./FixedUpdateGameLoop";

/**
 * The main loop of the game engine.
 * Handles the update order, and initializes all subsystems.
 * The Game manages the update cycle, and requests animation frames to render to the browser.
 */
export default class Game {
    gameOptions: GameOptions;

    // The game loop
    private loop: GameLoop;

    // Game canvas and its width and height
    readonly GAME_CANVAS: HTMLCanvasElement;
    readonly DEBUG_CANVAS: HTMLCanvasElement;
	readonly WIDTH: number;
    readonly HEIGHT: number;
    private viewport: Viewport;
    private ctx: CanvasRenderingContext2D;
    private clearColor: Color;
    
    // All of the necessary subsystems that need to run here
	private eventQueue: EventQueue;
	private inputHandler: InputHandler;
	private inputReceiver: InputReceiver;
	private recorder: Recorder;
    private resourceManager: ResourceManager;
    private sceneManager: SceneManager;
    private audioManager: AudioManager;
    private renderingManager: RenderingManager;

    /**
     * Creates a new Game
     * @param options The options for Game initialization
     */
    constructor(options?: Record<string, any>){
        // Typecast the config object to a GameConfig object
        this.gameOptions = GameOptions.parse(options);

        // Create an instance of a game loop
        this.loop = new FixedUpdateGameLoop();

        // Get the game canvas and give it a background color
        this.GAME_CANVAS = <HTMLCanvasElement>document.getElementById("game-canvas");
        this.DEBUG_CANVAS = <HTMLCanvasElement>document.getElementById("debug-canvas");
    
        // Give the canvas a size and get the rendering context
        this.WIDTH = this.gameOptions.viewportSize.x;
        this.HEIGHT = this.gameOptions.viewportSize.y;

        // For now, just hard code a canvas renderer. We can do this with options later
        this.renderingManager = new CanvasRenderer();
        this.initializeGameWindow();
        this.ctx = this.renderingManager.initializeCanvas(this.GAME_CANVAS, this.WIDTH, this.HEIGHT);
        this.clearColor = new Color(this.gameOptions.clearColor.r, this.gameOptions.clearColor.g, this.gameOptions.clearColor.b);

        // Initialize debugging and stats
        Debug.initializeDebugCanvas(this.DEBUG_CANVAS, this.WIDTH, this.HEIGHT);
        Stats.initStats();

        // Size the viewport to the game canvas
        this.viewport = new Viewport();
        this.viewport.setCanvasSize(this.WIDTH, this.HEIGHT);
        this.viewport.setSize(this.WIDTH, this.HEIGHT);

        // Initialize all necessary game subsystems
        this.eventQueue = EventQueue.getInstance();
        this.inputHandler = new InputHandler(this.GAME_CANVAS);
        this.inputReceiver = InputReceiver.getInstance();
        this.inputReceiver.setViewport(this.viewport);
        this.recorder = new Recorder();
        this.resourceManager = ResourceManager.getInstance();
        this.sceneManager = new SceneManager(this.viewport, this.renderingManager);
        this.audioManager = AudioManager.getInstance();

        
    }

    /**
     * Set up the game window that holds the canvases
     */
    private initializeGameWindow(): void {
        const gameWindow = document.getElementById("game-window");
        
        // Set the height of the game window
        gameWindow.style.width = this.WIDTH + "px";
        gameWindow.style.height = this.HEIGHT + "px";
    }

    /**
     * Retreives the SceneManager from the Game
     * @returns The SceneManager
     */
    getSceneManager(): SceneManager {
        return this.sceneManager;
    }

    /**
     * Starts the game
     */
    start(): void {
        // Set the update function of the loop
        this.loop.doUpdate = (deltaT: number) => this.update(deltaT);

        // Set the render function of the loop
        this.loop.doRender = () => this.render();

        // Start the loop
        this.loop.start();
    }

    /**
     * Updates all necessary subsystems of the game. Defers scene updates to the sceneManager
     * @param deltaT The time sine the last update
     */
    update(deltaT: number): void {
        // Handle all events that happened since the start of the last loop
        this.eventQueue.update(deltaT);

        // Update the input data structures so game objects can see the input
        this.inputReceiver.update(deltaT);

        // Update the recording of the game
        this.recorder.update(deltaT);

        // Update all scenes
        this.sceneManager.update(deltaT);

        // Update all sounds
        this.audioManager.update(deltaT);
        
        // Load or unload any resources if needed
        this.resourceManager.update(deltaT);
    }

    /**
     * Clears the canvas and defers scene rendering to the sceneManager. Renders the debug canvas
     */
    render(): void {
        // Clear the canvases
        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        Debug.clearCanvas();

        // Game Canvas
        this.ctx.fillStyle = this.clearColor.toString();
        this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        this.sceneManager.render();

        // Debug render
        Debug.render();
        Stats.render();
    }
}