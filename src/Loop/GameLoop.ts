import EventQueue from "../Events/EventQueue";
import InputReceiver from "../Input/InputReceiver";
import InputHandler from "../Input/InputHandler";
import Recorder from "../Playback/Recorder";
import Debug from "../Debug/Debug";
import ResourceManager from "../ResourceManager/ResourceManager";
import Viewport from "../SceneGraph/Viewport";
import SceneManager from "../Scene/SceneManager";
import AudioManager from "../Sound/AudioManager";

export default class GameLoop {
	// The amount of time to spend on a physics step
	private maxFPS: number;
	private simulationTimestep: number;

	// The time when the last frame was drawn
	private lastFrameTime: number;

	// The current frame of the game
	private frame: number;

	// Keeping track of the fps
	private runningFrameSum: number;
	private numFramesInSum: number;
	private maxFramesInSum: number;
	private fps: number;

	private started: boolean;
	private running: boolean;
    private frameDelta: number;
    private panic: boolean;
    private numUpdateSteps: number;

    // Game canvas and its width and height
	readonly GAME_CANVAS: HTMLCanvasElement;
	readonly WIDTH: number;
    readonly HEIGHT: number;
    private viewport: Viewport;
    private ctx: CanvasRenderingContext2D;
    
    // All of the necessary subsystems that need to run here
	private eventQueue: EventQueue;
	private inputHandler: InputHandler;
	private inputReceiver: InputReceiver;
	private recorder: Recorder;
    private resourceManager: ResourceManager;
    private sceneManager: SceneManager;
    private audioManager: AudioManager;

    constructor(config?: object){
        // Typecast the config object to a GameConfig object
        let gameConfig = config ? <GameConfig>config : new GameConfig();

        this.maxFPS = 60;
        this.simulationTimestep = Math.floor(1000/this.maxFPS);
        this.frame = 0;
        this.runningFrameSum = 0;
        this.numFramesInSum = 0;
        this.maxFramesInSum = 30;
        this.fps = this.maxFPS;

        this.started = false;
        this.running = false;

        // Get the game canvas and give it a background color
        this.GAME_CANVAS = <HTMLCanvasElement>document.getElementById("game-canvas");
        this.GAME_CANVAS.style.setProperty("background-color", "whitesmoke");
    
        // Give the canvas a size and get the rendering context
        this.WIDTH = gameConfig.viewportSize ? gameConfig.viewportSize.x : 800;
        this.HEIGHT = gameConfig.viewportSize ? gameConfig.viewportSize.y : 500;
        this.ctx = this.initializeCanvas(this.GAME_CANVAS, this.WIDTH, this.HEIGHT);

        // Size the viewport to the game canvas
        this.viewport = new Viewport();
        this.viewport.setSize(this.WIDTH, this.HEIGHT);

        // Initialize all necessary game subsystems
        this.eventQueue = EventQueue.getInstance();
        this.inputHandler = new InputHandler(this.GAME_CANVAS);
        this.inputReceiver = InputReceiver.getInstance();
        this.inputReceiver.setViewport(this.viewport);
        this.recorder = new Recorder();
        this.resourceManager = ResourceManager.getInstance();
        this.sceneManager = new SceneManager(this.viewport, this);
        this.audioManager = AudioManager.getInstance();
    }

    private initializeCanvas(canvas: HTMLCanvasElement, width: number, height: number): CanvasRenderingContext2D {
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");

        // For crisp pixel art
        ctx.imageSmoothingEnabled = false;

        return ctx;
    }

    // TODO - This currently also changes the rendering framerate
    /**
     * Changes the maximum allowed physics framerate of the game
     * @param initMax 
     */
    setMaxFPS(initMax: number): void {
        this.maxFPS = initMax;
        this.simulationTimestep = Math.floor(1000/this.maxFPS);
    }

    getSceneManager(): SceneManager {
        return this.sceneManager;
    }

    /**
     * Updates the frame count and sum of time for the framerate of the game
     * @param timestep 
     */
    private updateFrameCount(timestep: number): void {
        this.frame += 1;
        this.numFramesInSum += 1;
        this.runningFrameSum += timestep;
        if(this.numFramesInSum >= this.maxFramesInSum){
            this.fps = 1000 * this.numFramesInSum / this.runningFrameSum;
            this.numFramesInSum = 0;
            this.runningFrameSum = 0;
        }

        Debug.log("fps", "FPS: " + this.fps.toFixed(1));
    }

    /**
     * Starts up the game loop and calls the first requestAnimationFrame
     */
    start(): void {
        if(!this.started){
            this.started = true;

            window.requestAnimationFrame(this.startFrame);
        }
    }

    /**
     * The first game frame - initializes the first frame time and begins the render
     * @param timestamp 
     */
    startFrame = (timestamp: number): void => {
        this.running = true;

        this.render();

        this.lastFrameTime = timestamp;

        window.requestAnimationFrame(this.doFrame);
    }

    /**
     * The main loop of the game. Updates and renders every frame
     * @param timestamp 
     */
    doFrame = (timestamp: number): void => {
        // Request animation frame to prepare for another update or render
        window.requestAnimationFrame(this.doFrame);

        // If we are trying to update too soon, return and do nothing
        if(timestamp < this.lastFrameTime + this.simulationTimestep){
            return
        }

        // Currently, update and draw are synced - eventually it would probably be good to desync these
        this.frameDelta = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        // Update while we can (This will present problems if we leave the window)
        this.numUpdateSteps = 0;
        while(this.frameDelta >= this.simulationTimestep){
            this.update(this.simulationTimestep/1000);
            this.frameDelta -= this.simulationTimestep;

            this.numUpdateSteps++;
            if(this.numUpdateSteps > 100){
                this.panic = true;
            }

            // Update the frame of the game
            this.updateFrameCount(this.simulationTimestep);
        }

        // Updates are done, draw
        this.render();

        // End the frame
        this.end();

        this.panic = false;
    }

    end(){
        if(this.panic) {
            var discardedTime = Math.round(this.resetFrameDelta());
            console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
        }
    }

    resetFrameDelta() : number {
        var oldFrameDelta = this.frameDelta;
        this.frameDelta = 0;
        return oldFrameDelta;
    }

    /**
     * Updates all necessary subsystems of the game. Defers scene updates to the sceneManager
     * @param deltaT 
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
     * Clears the canvas and defers scene rendering to the sceneManager. Renders the debug
     */
    render(): void {
        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.sceneManager.render(this.ctx);
        Debug.render(this.ctx);
    }
}

class GameConfig {
    viewportSize: {x: number, y: number}
}