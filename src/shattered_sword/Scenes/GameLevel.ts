import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Point from "../../Wolfie2D/Nodes/Graphics/Point";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import PlayerController from "../Player/PlayerController";
import MainMenu from "./MainMenu";
import { Player_Events, Statuses } from "../sword_enums";
import RegistryManager from "../../Wolfie2D/Registry/RegistryManager";
import WeaponType from "../GameSystems/items/WeaponTypes/WeaponType";
import Weapon from "../GameSystems/items/Weapon";
import BattleManager from "../GameSystems/BattleManager";
import EnemyAI from "../AI/EnemyAI";
import BattlerAI from "../AI/BattlerAI";
import InventoryManager from "../GameSystems/InventoryManager";
import Item from "../GameSystems/items/Item";





//  TODO
/**
 * Add in some level music.
 * This can be done here in the base GameLevel class or individual level files
 */
export default class GameLevel extends Scene {
    // Every level will have a player, which will be an animated sprite
    protected playerSpawn: Vec2;
    protected player: AnimatedSprite;
    protected respawnTimer: Timer;

    // Labels for the UI
    protected static livesCount: number = 3;
    protected livesCountLabel: Label;

    // Stuff to end the level and go to the next level
    protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => GameLevel;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;
    
    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;

    // The battle manager for the scene
    private battleManager: BattleManager;

    // Health UI
    protected healthLabel: Label;

    //seed UI
    protected seedLabel: Label;   

    // A list of items in the scene
    private items: Array<Item>;

     // A list of enemies
    private enemies: Array<AnimatedSprite>;
    
    randomSeed: number;
    loadScene(): void {
        //can load player sprite here

        //can load enemy sprite here

        // Load the scene info
        this.load.object("weaponData", "shattered_sword_assets/data/weaponData.json");

        // Load in the enemy info
        //this.load.object("enemyData", "shattered_sword_assets/data/enemy.json");

        // Load in item info
        //this.load.object("itemData", "shattered_sword_assets/data/items.json");


        this.load.image("knife", "shattered_sword_assets/sprites/knife.png");
        this.load.spritesheet("slice", "shattered_sword_assets/spritesheets/slice.json");
        this.load.image("inventorySlot", "shattered_sword_assets/sprites/inventory.png");

        this.load.spritesheet("test_dummy","shattered_sword_assets/spritesheets/test_dummy.json")
    }

    startScene(): void {

       

        // Do the game level standard initializations
        this.initLayers();
        this.initViewport();

        // Create the battle manager
        this.battleManager = new BattleManager();

        // TODO
        this.initializeWeapons();
        // Initialize the items array - this represents items that are in the game world
        this.items = new Array();

         // Create an enemies array
        this.enemies = new Array();

        this.initPlayer();
        this.subscribeToEvents();
        this.addUI();

        
        // Send the player and enemies to the battle manager
        this.battleManager.setPlayers([<PlayerController>this.player._ai]);
        // Initialize all enemies
        //this.initializeEnemies();
        this.battleManager.setEnemies(this.enemies.map(enemy => <BattlerAI>enemy._ai));

        // Subscribe to relevant events
        //this.receiver.subscribe("");
      

        // Initialize the timers
        this.respawnTimer = new Timer(1000, () => {
            if(GameLevel.livesCount === 0){
                this.sceneManager.changeToScene(MainMenu);
            } else {
                this.respawnPlayer();
                this.player.enablePhysics();
                this.player.unfreeze();
            }
        });
        this.levelTransitionTimer = new Timer(500);
        this.levelEndTimer = new Timer(3000, () => {
            // After the level end timer ends, fade to black and then go to the next scene
            this.levelTransitionScreen.tweens.play("fadeIn");
        });


        
        // Start the black screen fade out
        this.levelTransitionScreen.tweens.play("fadeOut");

        //TODO - uncomment when done testing
        // Initially disable player movement
        //Input.disableInput();
        Input.enableInput();
    }


    updateScene(deltaT: number){
        // Handle events and update the UI if needed
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            
            switch(event.type){
                case Player_Events.ENEMY_KILLED:
                    
                    let node = this.sceneGraph.getNode(event.data.get("owner"));//get enemy id 
                    //remove enemy from enemies
                    this.enemies = this.enemies.filter(item => item !== event.data.get("ai"));
                    this.battleManager.removeEnemy(event.data.get("ai"));
                    
                    console.log("enemy destroyed");
                    node.destroy();
                    break;

                
            }
        }

        //update health UI 
        let playerAI = (<PlayerController>this.player.ai);
        this.healthLabel.text = "Player Health: "+ playerAI.CURRENT_HP +'/' + (playerAI.MAX_HP +playerAI.CURRENT_BUFFS.hp );

        //handle collisions - may be in battle manager instead

        //move background

        // Get the viewport center and padded size
		const viewportCenter = this.viewport.getCenter().clone();
		const baseViewportSize = this.viewport.getHalfSize().scaled(2);
        //check position of player
        this.playerFalloff(viewportCenter, baseViewportSize);

        //TODO - this is for testing
        if(Input.isJustPressed("spawn")){
            console.log("trying to spawn enemy");
            this.addEnemy("test_dummy",this.player.position,{player: this.player, 
                                health :100,
                                tilemap: "Main",
                                //actions:actions,
                                goal: Statuses.REACHED_GOAL,

                                });
        }

        

    }

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.addUILayer("UI");

        // Add a layer for players and enemies
        this.addLayer("primary", 1);
    }

    /**
     * Initializes the viewport
     */
    protected initViewport(): void {
        this.viewport.setZoomLevel(2);
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(){
        this.receiver.subscribe([
            Player_Events.PLAYER_HIT_ENEMY,
            Player_Events.ENEMY_KILLED,
            Player_Events.LEVEL_START,
            Player_Events.LEVEL_END,
            Player_Events.PLAYER_KILLED
        ]);
    }

    // TODO - 
    /**
     * Adds in any necessary UI to the game
     */
    protected addUI(){
        // In-game labels
        this.healthLabel = <Label> this.add.uiElement(UIElementType.LABEL, "UI",{position: new Vec2(120, 30), text: "Player Health: "+ (<PlayerController>this.player.ai).CURRENT_HP });
        this.healthLabel.textColor = Color.WHITE;
        this.healthLabel.font = "PixelSimple";

        //seed label
        
        //this.seedLabel = <Label> this.add.uiElement(UIElementType.LABEL, "UI",{position: new Vec2(400, 30), text: "Seed: "+ this.randomSeed });
        this.seedLabel = <Label> this.add.uiElement(UIElementType.LABEL, "UI",{position: new Vec2(this.worldSize.x - 50, 30), text: "Seed: "+ this.randomSeed });
        this.seedLabel.textColor = Color.WHITE;
        this.seedLabel.font = "PixelSimple";
      

        // End of level label (start off screen)
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(-300, 200), text: "Level Complete"});
        this.levelEndLabel.size.set(1200, 60);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        this.levelEndLabel.textColor = Color.WHITE;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "PixelSimple";

        // Add a tween to move the label on screen
        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -300,
                    end: 300,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        this.levelTransitionScreen = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: new Vec2(300, 200), size: new Vec2(600, 400)});
        this.levelTransitionScreen.color = new Color(34, 32, 52);
        this.levelTransitionScreen.alpha = 1;

        this.levelTransitionScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: Player_Events.LEVEL_END
        });

        this.levelTransitionScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: Player_Events.LEVEL_START
        });


    }

    //TODO - determine whether we will have weapon datatype
    /**
     * 
     * Creates and returns a new weapon
     * @param type The weaponType of the weapon, as a string
     */
     createWeapon(type: string): Weapon {
        let weaponType = <WeaponType>RegistryManager.getRegistry("weaponTypes").get(type);

        let sprite = this.add.sprite(weaponType.spriteKey, "primary");

        return new Weapon(sprite, weaponType, this.battleManager);
    }

    /**
     * Initalizes all weapon types based of data from weaponData.json
     */
     initializeWeapons(): void{
        let weaponData = this.load.getObject("weaponData");

        for(let i = 0; i < weaponData.numWeapons; i++){
            let weapon = weaponData.weapons[i];

            // Get the constructor of the prototype
            let constr = RegistryManager.getRegistry("weaponTemplates").get(weapon.weaponType);

            // Create a weapon type
            let weaponType = new constr();

            // Initialize the weapon type
            weaponType.initialize(weapon);

            // Register the weapon type
            RegistryManager.getRegistry("weaponTypes").registerItem(weapon.name, weaponType)
        }
    }
    /**
     * Initializes the player
     */
    protected initPlayer(): void {
        

        //create the inventory
        let inventory = new InventoryManager(this, 1, "inventorySlot", new Vec2(16, 16), 4, "slots1", "items1");
        

        //add starting weapon to inventory
        let startingWeapon = this.createWeapon("knife");
        inventory.addItem(startingWeapon);              //using slice to test right now


        // Add the player
        this.player = this.add.animatedSprite("player", "primary");
        this.player.scale.set(2, 2);
        if(!this.playerSpawn){
            console.warn("Player spawn was never set - setting spawn to (0, 0)");
            this.playerSpawn = Vec2.ZERO;
        }
        this.player.position.copy(this.playerSpawn);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(32, 32)));  //sets the collision shape
        this.player.colliderOffset.set(0, 0);
        this.player.addAI(PlayerController, {
                        playerType: "platformer", 
                        tilemap: "Main",
                        speed: 100,
                        health: 10,
                        inventory: inventory,
                        items: this.items,
                        inputEnabled: false,
                        range: 100
                    });

        this.player.setGroup("player");

        this.viewport.follow(this.player);
    }

    
    //TODO - 
    /**
     * Adds an Enemy into the game
     * @param spriteKey The key of the Enemy sprite
     * @param tilePos The tilemap position to add the Enemy to
     * @param aiOptions The options for the Enemy AI
     */
    
    protected addEnemy(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        //enemy.position.set(tilePos.x*32, tilePos.y*32);
        enemy.position.copy(tilePos);
        enemy.scale.set(2, 2);
        enemy.addPhysics(new AABB(Vec2.ZERO, new Vec2(16, 25)));
        enemy.colliderOffset.set(0, 6);
        enemy.addAI(EnemyAI, aiOptions); //TODO - add individual enemy AI
        enemy.setGroup("Enemy");
        
        //add enemy to the enemy array
        this.enemies.push(enemy);
        //this.battleManager.setEnemies(this.enemies.map(enemy => <BattlerAI>enemy._ai));
        this.battleManager.addEnemy(<BattlerAI>enemy._ai);
    }
    

   
    protected handlePlayerEnemyCollision(player: AnimatedSprite, enemy: AnimatedSprite) {
        //collisions are handled by the battleManager - no need for this in gamelevel for now 
    }

    /**
     * Increments the amount of life the player has
     * @param amt The amount to add to the player life
     */
    protected incPlayerLife(amt: number): void {
        GameLevel.livesCount += amt;
        this.livesCountLabel.text = "Lives: " + GameLevel.livesCount;
        if (GameLevel.livesCount == 0){
            Input.disableInput();
            this.player.disablePhysics();
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
            this.player.tweens.play("death");
        }
    }

    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        GameLevel.livesCount = 3;
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.sceneManager.changeToScene(MainMenu, {});
        Input.enableInput();
    }



    /**
     * 
     * handles the player falling off the map
     * 
     * @param viewportCenter The center of the viewport
     * @param viewportSize The size of the viewport
     */
    playerFalloff(viewportCenter: Vec2, viewportSize: Vec2):void{
         if(this.player.position.y >= viewportCenter.y +viewportSize.y/2.0){
			
			this.player.position.set(this.playerSpawn.x,this.playerSpawn.y);
		}
    }

    
}