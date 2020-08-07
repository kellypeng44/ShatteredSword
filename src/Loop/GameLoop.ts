import EventQueue from "../Events/EventQueue";
import InputReceiver from "../Input/InputReceiver";
import InputHandler from "../Input/InputHandler";
import Recorder from "../Playback/Recorder";
import GameState from "../GameState/GameState";

export default class GameLoop{
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

	readonly GAME_CANVAS: HTMLCanvasElement;
	readonly WIDTH: number;
	readonly HEIGHT: number;
	private ctx: CanvasRenderingContext2D;
	private eventQueue: EventQueue;
	private inputHandler: InputHandler;
	private inputReceiver: InputReceiver;
	private recorder: Recorder;
	private gameState: GameState;

    constructor(){
        this.maxFPS = 60;
        this.simulationTimestep = Math.floor(1000/this.maxFPS);
        this.frame = 0;
        this.runningFrameSum = 0;
        this.numFramesInSum = 0;
        this.maxFramesInSum = 30;
        this.fps = this.maxFPS;

        this.started = false;
        this.running = false;

        this.GAME_CANVAS = document.getElementById("game-canvas") as HTMLCanvasElement;
        this.GAME_CANVAS.style.setProperty("background-color", "whitesmoke");
    
        this.WIDTH = 800;
        this.HEIGHT = 500;
        this.ctx = this.initializeCanvas(this.GAME_CANVAS, this.WIDTH, this.HEIGHT);

        this.eventQueue = EventQueue.getInstance();
        this.inputHandler = new InputHandler(this.GAME_CANVAS);
        this.inputReceiver = InputReceiver.getInstance();
        this.recorder = new Recorder();
        this.gameState = new GameState();
    }

    private initializeCanvas(canvas: HTMLCanvasElement, width: number, height: number): CanvasRenderingContext2D {
        canvas.width = width;
        canvas.height = height;
        return canvas.getContext("2d");
    }

    setMaxFPS(initMax: number): void {
        this.maxFPS = initMax;
        this.simulationTimestep = Math.floor(1000/this.maxFPS);
    }

    getGameState(): GameState {
        return this.gameState;
    }

    private renderFPS(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "black";
		ctx.font = "30px Arial"
		ctx.fillText(this.fps.toFixed(1), 5, 5 + 30);
    }

    private updateFrameCount(timestep: number): void {
        this.frame += 1;
        this.numFramesInSum += 1;
        this.runningFrameSum += timestep;
        if(this.numFramesInSum >= this.maxFramesInSum){
            this.fps = 1000 * this.numFramesInSum / this.runningFrameSum;
            this.numFramesInSum = 0;
            this.runningFrameSum = 0;
        }
    }

    start(): void {
        if(!this.started){
            this.started = true;

            window.requestAnimationFrame(this.startFrame);
        }
    }

    startFrame = (timestamp: number): void => {
        this.running = true;

        this.render();

        this.lastFrameTime = timestamp;

        window.requestAnimationFrame(this.doFrame);
    }

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
        let i = 0;
        while(this.frameDelta >= this.simulationTimestep){
            this.update(this.simulationTimestep/1000);
            this.frameDelta -= this.simulationTimestep;

            // Update the frame of the game
            this.updateFrameCount(this.simulationTimestep);
        }

        // Updates are done, draw
        this.render();
    }

    update(deltaT: number): void {
        this.eventQueue.update(deltaT);
        this.inputReceiver.update(deltaT);
        this.recorder.update(deltaT);
        this.gameState.update(deltaT);
    }

    render(): void {
        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.gameState.render(this.ctx);
        this.renderFPS(this.ctx);
    }
}