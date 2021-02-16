import AABB from "../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Graphic from "../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../Wolfie2D/Nodes/Graphics/GraphicTypes";
import AnimatedSprite from "../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../Wolfie2D/Scene/Scene";
import { Homework1Event, Homework1Shaders } from "./HW1_Enums";
import SpaceshipPlayerController from "./SpaceshipPlayerController";

/**
 * In Wolfie2D, custom scenes extend the original scene class.
 * This gives us access to lifecycle methods to control our game.
 */
export default class Homework1_Scene extends Scene {
	// Here we define member variables of our game, and object pools for adding in game objects
	private player: AnimatedSprite;

	// Create an object pool for our fleet
	private MAX_FLEET_SIZE = 20;
	private fleet: Array<AnimatedSprite> = new Array(this.MAX_FLEET_SIZE);

	// Create an object pool for our fleet
	private MAX_NUM_ASTEROIDS = 6;
	private asteroids: Array<Graphic> = new Array(this.MAX_NUM_ASTEROIDS);

	// Create an object pool for our fleet
	private MAX_NUM_MINERALS = 20;
	private minerals: Array<Graphic> = new Array(this.MAX_NUM_MINERALS);

	/*
	 * loadScene() overrides the parent class method. It allows us to load in custom assets for
	 * use in our scene.
	 */
	loadScene(){
		/* ##### DO NOT MODIFY ##### */
		// Load in the player spaceship spritesheet
		this.load.spritesheet("player", "hw1_assets/spritesheets/player_spaceship.json");

		/* ##### YOUR CODE GOES BELOW THIS LINE ##### */
	}

	/*
	 * startScene() allows us to add in the assets we loaded in loadScene() as game objects.
	 * Everything here happens strictly before update
	 */
	startScene(){
		/* ##### DO NOT MODIFY ##### */
		// Create a layer to serve as our main game - Feel free to use this for your own assets
		// It is given a depth of 5 to be above our background
		this.addLayer("primary", 5);

		// Add in the player as an animated sprite
		// We give it the key specified in our load function and the name of the layer
		this.player = this.add.animatedSprite("player", "primary");
		
		// Set the player's position to the middle of the screen, and scale it down
		this.player.position.set(this.viewport.getCenter().x, this.viewport.getCenter().y);
		this.player.scale.set(0.5, 0.5);

		// Play the idle animation by default
		this.player.animation.play("idle");

		// Add physics to the player
		let playerCollider = new AABB(Vec2.ZERO, new Vec2(64, 64));

		// We'll specify a smaller collider centered on the player.
		// Also, we don't need collision handling, so disable it.
		this.player.addPhysics(playerCollider, Vec2.ZERO, false);

		// Add a a playerController to the player
		this.player.addAI(SpaceshipPlayerController, {owner: this.player, spawnFleetEventKey: "spawnFleet"});
		
		/* ##### YOUR CODE GOES BELOW THIS LINE ##### */
		// Initialize the fleet object pool

		// Initialize the mineral object pool
		for(let i = 0; i < this.minerals.length; i++){
			this.minerals[i] = this.add.graphic(GraphicType.RECT, "primary", {position: new Vec2(0, 0), size: new Vec2(32, 32)});
			this.minerals[i].visible = false;
		}

		// Initialize the asteroid object pool
		let gc = this.add.graphic(GraphicType.RECT, "primary", {position: new Vec2(400, 400), size: new Vec2(100, 100)});
		gc.useCustomShader(Homework1Shaders.GRADIENT_CIRCLE);

		// Subscribe to events
		this.receiver.subscribe(Homework1Event.PLAYER_DAMAGE);
		this.receiver.subscribe(Homework1Event.SPAWN_FLEET);
	}

	/*
	 * updateScene() is where the real work is done. This is where any custom behavior goes.
	 */
	updateScene(){
		// Handle events we care about
		while(this.receiver.hasNextEvent()){
			let event = this.receiver.getNextEvent();
		}

		// Check for collisions
		for(let i = 0; i < this.minerals.length; i++){
			if(this.player.collisionShape.overlaps(this.minerals[i].boundary)){
				console.log(true);
			}
		}
	}
}