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
import Layer from "../../Wolfie2D/Scene/Layer";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { Buff } from "../Player/PlayerController";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import { Enemy } from "../Tools/RandomMapGenerator";



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
    protected battleManager: BattleManager;

    // Health UI
    protected healthLabel: Label;
    //may need exp label
    //may need mp label 

    //seed UI
    protected seedLabel: Label;   

    // A list of items in the scene
    protected items: Array<Item>;

     // A list of enemies
    protected enemies: Array<AnimatedSprite>;

    //buffs layer
    buffLayer: Layer;
    buffButton1 : Button;
    buffButton2 : Button;
    buffButton3 : Button;
    buffs: Array<Buff>;

    randomSeed: number;
    loadScene(): void {
        //can load player sprite here

        //can load enemy sprite here
        //sprites obtained from cse380 sprite wesbite
        this.load.spritesheet("Tiger","shattered_sword_assets/spritesheets/Tiger.json");
        this.load.spritesheet("remus_werewolf","shattered_sword_assets/spritesheets/remus_werewolf.json");
        this.load.spritesheet("black_pudding","shattered_sword_assets/spritesheets/black_pudding.json");


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
        this.enemies = new Array();
        this.battleManager = new BattleManager();


    }

    startScene(): void {

        //call super after extending story with scene
       
        
        // Do the game level standard initializations
        this.initViewport();
        this.initLayers();
        // Create the battle manager

        // TODO
        this.initializeWeapons();
        // Initialize the items array - this represents items that are in the game world
        this.items = new Array();

        this.initPlayer();
        //subscribe to relevant events
        this.subscribeToEvents();
        this.addUI();
        
        // Create an enemies array
        // Send the player and enemies to the battle manager
        this.battleManager.setPlayers([<PlayerController>this.player._ai]);
        // Initialize all enemies
        //this.initializeEnemies();
        this.battleManager.setEnemies(this.enemies.map(enemy => <BattlerAI>enemy._ai));

        
      
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

        /*
        this.levelTransitionTimer = new Timer(500);
        this.levelEndTimer = new Timer(3000, () => {
            // After the level end timer ends, fade to black and then go to the next scene
            this.levelTransitionScreen.tweens.play("fadeIn");
        });
        */

        // Start the black screen fade out
        /*
        this.levelTransitionScreen.tweens.play("fadeOut");
        */

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
                    node.destroy();
                    //TODO - this is for testing,  add some chance here later
                    this.emitter.fireEvent(Player_Events.GIVE_BUFF);
                    break;

                case Player_Events.GIVE_BUFF:
                    this.buffs = PlayerController.generateBuffs();
                    this.buffButton1.text = "Increase "+this.buffs[0].type.toString() + " by "+this.buffs[0].value;
                    this.buffButton2.text = "Increase "+this.buffs[1].type + " by "+this.buffs[1].value;
                    this.buffButton3.text = "Increase "+this.buffs[2].type + " by "+this.buffs[2].value;
                    
                    //pause game here 
                    this.buffLayer.enable();
                    
                    break;
                case "buff1":
                    (<PlayerController>this.player._ai).addBuff(this.buffs[0]);
                    this.buffLayer.disable();
                    break;
                case "buff2":
                    (<PlayerController>this.player._ai).addBuff(this.buffs[1]);
                    this.buffLayer.disable();
                    break;
                case "buff3":
                    (<PlayerController>this.player._ai).addBuff(this.buffs[2]);
                    this.buffLayer.disable();
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

        this.buffLayer = this.addUILayer("buffLayer");   //TODO - test depth later, may be just a regular Layer
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
            Player_Events.PLAYER_KILLED,
            Player_Events.GIVE_BUFF,
        ]);
        this.receiver.subscribe("buff1");
        this.receiver.subscribe("buff2");
        this.receiver.subscribe("buff3");
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
        //worldsize.x doesnt work how i want it to
        this.seedLabel = <Label> this.add.uiElement(UIElementType.LABEL, "UI",{position: new Vec2(this.worldSize.x - 50, 30), text: "Seed: "+ this.randomSeed });
        this.seedLabel.textColor = Color.WHITE;
        this.seedLabel.font = "PixelSimple";
      

        // End of level label (start off screen)
        /*
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
        */

        /*
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
        */


        //TODO - 
        //determine button location 
        this.buffButton1 = <Button>this.add.uiElement(UIElementType.BUTTON, "buffLayer", {position: new Vec2(100, 250),text:"buffButton1"});
        console.log("buffbutton pos:"+this.buffButton1.position);
        //this.buffButton1.position = this.buffButton1.position.clone().scale(this.viewport.getZoomLevel());
        this.buffButton1
        console.log("buffbutton pos:"+this.buffButton1.position);

        this.buffButton1.size.set(180,200);
        this.buffButton1.borderWidth = 5;
        this.buffButton1.borderColor = Color.RED;
        this.buffButton1.backgroundColor = Color.WHITE;
        this.buffButton1.textColor = Color.BLACK;
        this.buffButton1.onClickEventId = "buff1";
        this.buffButton1.fontSize = 20;


        this.buffButton2 = <Button>this.add.uiElement(UIElementType.BUTTON, "buffLayer", {position: new Vec2(300, 250),text:"buffButton1"});
        //this.buffButton2.setPosition(this.buffButton1.position.clone().scale(this.viewport.getZoomLevel()));
        //this.buffButton2.position = this.buffButton2.position.clone().scale(this.viewport.getZoomLevel());
        this.buffButton2.size.set(180,200);
        this.buffButton2.borderWidth = 5;
        this.buffButton2.borderColor = Color.RED;
        this.buffButton2.backgroundColor = Color.WHITE;
        this.buffButton2.textColor = Color.BLACK;
        this.buffButton2.onClickEventId = "buff2";
        this.buffButton2.fontSize = 20;

        this.buffButton3 = <Button>this.add.uiElement(UIElementType.BUTTON, "buffLayer", {position: new Vec2(500, 250),text:"buffButton1"});
        //this.buffButton3.setPosition(this.buffButton1.position.clone().scale(this.viewport.getZoomLevel()));
        //this.buffButton3.position = this.buffButton3.position.clone().scale(this.viewport.getZoomLevel());
        this.buffButton3.size.set(180,200);
        this.buffButton3.borderWidth = 5;
        this.buffButton3.borderColor = Color.RED;
        this.buffButton3.backgroundColor = Color.WHITE;
        this.buffButton3.textColor = Color.BLACK;
        this.buffButton3.onClickEventId = "buff3";
        this.buffButton3.fontSize = 20;

        this.buffs = this.buffs = PlayerController.generateBuffs();

        this.buffLayer.disable();

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
        this.player.scale.set(1, 1);
        if(!this.playerSpawn){
            console.warn("Player spawn was never set - setting spawn to (0, 0)");
            this.playerSpawn = Vec2.ZERO;
        }
        this.player.position.copy(this.playerSpawn);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(14, 16)));  //sets the collision shape
        this.player.colliderOffset.set(0, 16);
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
        
        if( "scale" in aiOptions){
            enemy.scale.set(aiOptions.scale,aiOptions.scale);
        }
        else{
            enemy.scale.set(2, 2);
        }

        //TODO - add custom collision shape for each enemy in an option variable 
        if( "size" in aiOptions){
            enemy.addPhysics(new AABB(Vec2.ZERO, aiOptions.size.clone()));
        }
        else{
            enemy.addPhysics(new AABB(Vec2.ZERO, new Vec2(16, 25)));
        }

        if("offset" in aiOptions){
            enemy.colliderOffset.set(aiOptions.offset.x,aiOptions.offset.y);
        }
        else{
            enemy.colliderOffset.set(0, 6);
        }

        enemy.addAI(EnemyAI, aiOptions); //TODO - add individual enemy AI
        enemy.setGroup("Enemy");
        
        //add enemy to the enemy array
        this.enemies.push(enemy);
        //this.battleManager.setEnemies(this.enemies.map(enemy => <BattlerAI>enemy._ai));
        this.battleManager.addEnemy(<BattlerAI>enemy._ai);
    }
    

    protected initializeEnemies( enemies: Enemy[]){
        for (let enemy of enemies) {
            switch (enemy.type) {
                case "test_dummy":
                    this.addEnemy("test_dummy", enemy.position.scale(32), {
                        player: this.player,
                        health: 100,
                        tilemap: "Main",
                        //actions:actions,
                        goal: Statuses.REACHED_GOAL,
                        //TODO - test Add collision shape for each enemy type
                        //size: new AABB(Vec2.ZERO, new Vec2(16, 25))
                    })
                    break;
                case "Snake":       //Snake enemies drop from sky("trees")? or could just be very abundant
                    this.addEnemy("Snake", enemy.position.scale(32), {
                        player: this.player,
                        health: 50,
                        tilemap: "Main",
                        //actions:actions,
                        goal: Statuses.REACHED_GOAL,
                        size: new Vec2(16,16),
                        offset : new Vec2(0, 16)
                    })
                    break;
                case "Tiger":       //Tiger can be miniboss for now? 
                    this.addEnemy("Tiger", enemy.position.scale(32), {
                        player: this.player,
                        health: 200,
                        tilemap: "Main",
                        //actions:actions,
                        goal: Statuses.REACHED_GOAL,
                    })
                    break;

                case "remus_werewolf":       
                    this.addEnemy("remus_werewolf", enemy.position.scale(32), {
                        player: this.player,
                        health: 200,
                        tilemap: "Main",
                        //actions:actions,
                        goal: Statuses.REACHED_GOAL,
                    })
                    break;
                case "black_pudding":       
                    this.addEnemy("black_pudding", enemy.position.scale(32), {
                        player: this.player,
                        health: 200,
                        tilemap: "Main",
                        //actions:actions,
                        goal: Statuses.REACHED_GOAL,
                        scale: .25,
                        size: new Vec2(16,16),
                        offset : new Vec2(0,0)
                    })
                    break;
                default:
                    break;
            }
        }

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