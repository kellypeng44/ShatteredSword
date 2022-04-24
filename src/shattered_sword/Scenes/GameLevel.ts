import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Point from "../../Wolfie2D/Nodes/Graphics/Point";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label, { HAlign } from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import PlayerController from "../Player/PlayerController";
import MainMenu from "./MainMenu";
import { GameState, Player_Events, Statuses } from "../sword_enums";
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
import RandomMapGenerator, { Enemy } from "../Tools/RandomMapGenerator";
import Stack from "../../Wolfie2D/DataTypes/Stack";
import InputWrapper from "../Tools/InputWrapper";
import Story from "../Tools/DataTypes/Story";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Platformer from "../../demos/Platformer";
import TextInput from "../../Wolfie2D/Nodes/UIElements/TextInput";
import { TiledTilemapData } from "../../Wolfie2D/DataTypes/Tilesets/TiledData";
import AttackAction from "../AI/EnemyActions/AttackAction";
import Move from "../AI/EnemyActions/Move";
import GameOver from "./GameOver";

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
    //TODO - lives here or in playercontroller
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
    protected healthBar: Rect;
    //exp label
    protected expLabel : Label;
    protected expBar: Rect;

    //level label
    protected playerLevelLabel : Label;

    //shield label
    protected shieldLabel : Label;
    protected shieldBar: Rect;

    protected poisonStat: Sprite;
    protected burnStat: Sprite;
    protected bleedStat: Sprite;

    //seed UI
    protected seedLabel: Label;   

    // A list of items in the scene
    protected items: Array<Item>;

     // A list of enemies
    protected enemies: Array<AnimatedSprite>;

    protected gameStateStack: Stack<GameState>;

    // Story
    protected storytextLabel: Label;
    protected storyLayer: Layer;
    protected story: Story;
    protected storyProgress: number;
    protected storySprites: Array<Sprite>;
    protected storyBGMs: Array<string>;
    protected currentSpeaker: string;
    protected currentContent: string;

    //buffs layer
    protected buffLayer: Layer;
    protected buffButton1 : Button;
    protected buffLabel1 : Label;
    protected buffButton2 : Button;
    protected buffLabel2 : Label;
    protected buffButton3 : Button;
    protected buffLabel3: Label;
    protected buffs: Array<Buff>;

    //pause layer
    protected pauseLayer: Layer;
    protected pauseText: Label;
    protected pauseInput: TextInput;
    protected pauseSubmit: Label;
    protected pauseCheatText: Label;

    protected randomSeed: number;
    protected rmg: RandomMapGenerator;
    protected map: TiledTilemapData;

    protected startCheckPoint: Rect;
    protected endCheckPoint: Rect;
    protected touchedStartCheckPoint: boolean = false;
    protected touchedEndCheckPoint: boolean = false;
    protected static gameTimer: number = 0;
    protected gameStarted: boolean = false;
    protected timerLable: Label;

    startpos: Vec2; 
    loadScene(): void {
        //can load player sprite here
        this.load.spritesheet("player", "shattered_sword_assets/spritesheets/Hiro.json")
        // TODO - change when done testing
        this.load.spritesheet("slice", "shattered_sword_assets/spritesheets/slice.json");

        // Load the scene info
        this.load.object("weaponData", "shattered_sword_assets/data/weaponData.json");

        // Load in the enemy info
        //this.load.object("enemyData", "shattered_sword_assets/data/enemy.json");

        // Load in item info
        //this.load.object("itemData", "shattered_sword_assets/data/items.json");

        this.load.audio("jump", "shattered_sword_assets/sounds/jump2.wav");
        this.load.audio("hurt", "shattered_sword_assets/sounds/hurt.wav");
        this.load.audio("die", "shattered_sword_assets/sounds/die.wav");
        this.load.audio("level_up","shattered_sword_assets/sounds/level_up.wav");


        this.load.image("knife", "shattered_sword_assets/sprites/knife.png");
        this.load.image("inventorySlot", "shattered_sword_assets/sprites/inventory.png");
        this.load.image("black", "shattered_sword_assets/images/black.png");
        this.load.image("poisoning", "shattered_sword_assets/images/poisoning.png");
        this.load.image("burning", "shattered_sword_assets/images/burning.png");
        this.load.image("bleeding", "shattered_sword_assets/images/bleeding.png");

        //TODO - choose spritesheet for slice - modify the slice.json
        this.load.spritesheet("slice", "shattered_sword_assets/spritesheets/slice.json");
        this.load.spritesheet("test_dummy","shattered_sword_assets/spritesheets/test_dummy.json")
        this.enemies = new Array();
        this.battleManager = new BattleManager();

        this.randomSeed = Math.floor(Math.random() * 10000000000);
    }

    startScene(): void {
        this.add.tilemap("map", new Vec2(2, 2));
        console.log("width,height:" + this.map.width, this.map.height);
        this.viewport.setBounds(0, 0, this.map.width * 32, this.map.height * 32);
        this.viewport.follow(this.player);

        this.playerSpawn = this.rmg.getPlayer().scale(32);
        console.log(this.playerSpawn)

        this.startpos = this.rmg.getPlayer().scale(32);

        

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

        let startCheckPoint = this.rmg.getStartCheckPoint();
        this.startCheckPoint = this.addCheckPoint(new Vec2(startCheckPoint[0], startCheckPoint[1]), new Vec2(startCheckPoint[2], startCheckPoint[3]), "startStory", "startTimer");
        let endCheckPoint = this.rmg.getEndCheckPoint();
        this.endCheckPoint = this.addCheckPoint(new Vec2(endCheckPoint[0], endCheckPoint[1]), new Vec2(endCheckPoint[2], endCheckPoint[3]), "endStory", "nextLevel");
        
        // Create an enemies array
        // Send the player and enemies to the battle manager
        this.battleManager.setPlayers([<PlayerController>this.player._ai]);
        // Initialize all enemies
        //this.initializeEnemies();
        this.battleManager.setEnemies(this.enemies.map(enemy => <BattlerAI>enemy._ai));

        
      
        // Initialize the timers
        /*
        this.respawnTimer = new Timer(1000, () => {
            if(GameLevel.livesCount === 0){
                this.sceneManager.changeToScene(MainMenu);
            } else {
                this.respawnPlayer();
                this.player.enablePhysics();
                this.player.unfreeze();
            }
        });
        */

        let enemies = this.rmg.getEnemies();
        //may have to move this to start scene in gameLevel
        this.initializeEnemies(enemies);

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
        this.gameStateStack = new Stack();
        this.setGameState(GameState.GAMING);
        InputWrapper.enableInput();
    }


    updateScene(deltaT: number){
        if (this.gameStateStack.peek() === GameState.GAMING) {
            if (this.gameStarted) {
                GameLevel.gameTimer += deltaT;
                let minutes = Math.floor(GameLevel.gameTimer / 60);
                if (minutes >= 10) {
                    this.timerLable.text = minutes.toString();
                }
                else {
                    this.timerLable.text = "0" + minutes.toString();
                }
                let seconds = Math.floor(GameLevel.gameTimer % 60);
                if (seconds >= 10) {
                    this.timerLable.text += ":" + seconds.toString();
                }
                else {
                    this.timerLable.text += ":0" + seconds.toString();
                }
                this.timerLable.textColor = Color.BLACK;
            }
            else {
                this.timerLable.textColor = Color.RED;
            }
        }
    
        // Handle events and update the UI if needed
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if (this.gameStateStack.peek() === GameState.GAMING) {
                switch(event.type){
                    case Player_Events.PLAYER_COLLIDE:
                        let n = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));

                        if(n === this.player){
                            // Node is player, other is enemy
                            this.handlePlayerEnemyCollision(<AnimatedSprite>n, <AnimatedSprite>other);
                        } else {
                            // Other is player, node is balloon
                            this.handlePlayerEnemyCollision(<AnimatedSprite>other,<AnimatedSprite>n);

                        }
                        break;
                    case Player_Events.ENEMY_KILLED:
                        
                        let node = this.sceneGraph.getNode(event.data.get("owner"));//get enemy id 
                        //remove enemy from enemies
                        this.enemies = this.enemies.filter(item => item !== event.data.get("ai"));
                        this.battleManager.removeEnemy(event.data.get("ai"));
                        //give the player the exp value of the enemy killed
                        if(event.data.get("ai").exp_val !== undefined){
                            (<PlayerController>this.player._ai).giveExp(event.data.get("ai").exp_val);
                        }
                        node.destroy(); //destroy enemy node
                        //TODO - this is for testing,  add some chance here later
                        //this.emitter.fireEvent(Player_Events.GIVE_BUFF);
                        break;

                    case Player_Events.GIVE_BUFF:
                        this.buffs = (<PlayerController>this.player._ai).generateBuffs();
                        if(this.buffs[0].string !== undefined){
                            //this.buffButton1.text = this.buffs[0].string;
                            this.buffLabel1.text = this.buffs[0].string;
                        }
                        else{
                            //this.buffButton1.text = "Increase "+this.buffs[0].type + " by "+this.buffs[0].value;
                            this.buffLabel1.text = "Increase "+this.buffs[0].type + "\n by \n"+this.buffs[0].value;
                        }
                        
                        if(this.buffs[1].string !== undefined){
                            this.buffLabel2.text = this.buffs[1].string;
                        }
                        else{
                            this.buffLabel2.text = "Increase "+this.buffs[1].type + "\n by \n"+this.buffs[1].value;
                        }
                        
                        if(this.buffs[2].string !== undefined){
                            this.buffLabel3.text = this.buffs[2].string;
                        }
                        else{
                            this.buffLabel3.text = "Increase "+this.buffs[2].type + "\n by \n"+this.buffs[2].value;
                        }
                        
                        //pause game here 
                        this.setGameState(GameState.BUFF);
                        this.buffLayer.enable();
                        break;
                    case Player_Events.PLAYER_KILLED:
                        //respawn player if he has lives, otherwise end game
                        console.log("player Died");
                        (<AnimatedSprite>this.player).animation.play("DEAD", false);
                        InputWrapper.disableInput();
                        if((<PlayerController>this.player._ai).lives >0){
                            this.respawnPlayer();
                        }
                        else{ //no more lives
                            this.sceneManager.changeToScene(GameOver, {});
                        }
                        break;
                    case "startStory":
                        this.playStartStory();
                        break;
                    case "endStory":
                        this.playEndStory();
                        break;
                    case "startTimer":
                        this.startTimer();
                        break;
                    case "nextLevel":
                        this.goToNextLevel();
                        break;
                }
            }

            else if (this.gameStateStack.peek() === GameState.BUFF) {
                switch(event.type){
                    case "buff1":
                        (<PlayerController>this.player._ai).addBuff(this.buffs[0]);
                        this.buffLayer.disable();
                        this.setGameState();
                        break;
                    case "buff2":
                        (<PlayerController>this.player._ai).addBuff(this.buffs[1]);
                        this.buffLayer.disable();
                        this.setGameState();
                        break;
                    case "buff3":
                        (<PlayerController>this.player._ai).addBuff(this.buffs[2]);
                        this.buffLayer.disable();
                        this.setGameState();
                        break;
                }
            }
            if (event.type === "cheat") {
                this.enableCheat();
            }
        }
        if (this.gameStateStack.peek() === GameState.STORY) {
            if (InputWrapper.isNextJustPressed() && this.gameStateStack.peek() === GameState.STORY) {
                this.updateStory();
            }
        }
        if (InputWrapper.isPauseJustPressed()) {
            if (this.gameStateStack.peek() === GameState.GAMING) {
                this.setGameState(GameState.PAUSE);
                this.pauseLayer.enable();
            }
            else if (this.gameStateStack.peek() === GameState.PAUSE) {
                this.setGameState();    
                this.pauseLayer.disable();
            }
        }

        //update health UI 
        let playerAI = (<PlayerController>this.player.ai);
        this.healthLabel.text = "Health: "+ Math.round(playerAI.CURRENT_HP) +'/' + Math.round(playerAI.MAX_HP +playerAI.CURRENT_BUFFS.hp);
        this.healthBar.size.set(playerAI.MAX_HP*1.5, 10);
        this.healthBar.position.set(playerAI.MAX_HP*0.75+20, 20);
        this.healthBar.fillWidth = playerAI.CURRENT_HP*1.5;
        if (playerAI.CURRENT_HP/playerAI.MAX_HP >= 2/3) {
            this.healthBar.color = Color.GREEN;
            this.healthLabel.textColor = Color.GREEN;
        }
        else if (playerAI.CURRENT_HP/playerAI.MAX_HP >= 1/3) {
            this.healthBar.color = Color.YELLOW;
            this.healthLabel.textColor = Color.YELLOW;
        }
        else {
            this.healthBar.color = Color.RED;
            this.healthLabel.textColor = Color.RED;
        }
        // this.healthLabel.sizeToText();

        //update shield ui
        this.shieldLabel.text = "Shield: "+ Math.round(playerAI.CURRENT_SHIELD) +'/' + Math.round(playerAI.MAX_SHIELD);
        this.shieldBar.size.set(playerAI.CURRENT_SHIELD*1.5, 10);
        this.shieldBar.position.set(playerAI.CURRENT_SHIELD*0.75+20, 50);
        // this.shieldLabel.sizeToText();

        //update exp ui
        this.expLabel.text = "EXP: "+ Math.round(playerAI.CURRENT_EXP) +'/' + Math.round(playerAI.MAX_EXP);
        this.expBar.fillWidth = (playerAI.CURRENT_EXP/playerAI.MAX_EXP)*150;
        // this.expLabel.sizeToText();

        //update level ui
        this.playerLevelLabel.text = "lv." + playerAI.level;
        //update lives ui
        this.livesCountLabel.text = "Lives: " + playerAI.lives;


        //move background

        // Get the viewport center and padded size
		const viewportCenter = this.viewport.getCenter().clone();
		const baseViewportSize = this.viewport.getHalfSize().scaled(2);
        //check position of player
        this.playerFalloff(viewportCenter, baseViewportSize);
        
        // Update player safe position
        if (this.player.onGround) {
            this.playerSpawn = this.player.position.clone();
        }

        //TODO - this is for testing
        /*
        if(InputWrapper.isSpawnJustPressed()){
            console.log("trying to spawn enemy");
            this.addEnemy("test_dummy",this.player.position,{player: this.player, 
                                health :100,
                                tilemap: "Main",
                                //actions:actions,
                                goal: Statuses.REACHED_GOAL,
                                actions: [new AttackAction(3, [Statuses.IN_RANGE], [Statuses.REACHED_GOAL]),
                                new Move(2, [], [Statuses.IN_RANGE], {inRange: 60})],
                                status : [Statuses.CAN_RETREAT, Statuses.CAN_BERSERK],
                                weapon : this.createWeapon("knife")
                                });
        }
        */

        // if (InputWrapper.isInventoryJustPressed()) {
        //     console.log("LoadingStory");
        //     this.storyLoader("shattered_sword_assets/jsons/story.json");
        // }



    }

    // TODO put UI changes in here
    protected setGameState(gameState?: GameState) {
        if (gameState) {
            this.gameStateStack.push(gameState);
            InputWrapper.setState(gameState);
        }
        else {
            this.gameStateStack.pop();
            InputWrapper.setState(this.gameStateStack.peek());
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

        this.buffLayer = this.addUILayer("buffLayer");  
    

        this.storyLayer = this.addUILayer("story");
        this.storyLayer.disable();

        this.pauseLayer = this.addUILayer("pause");
        this.pauseLayer.disable();


        this.receiver.subscribe("loadStory");
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
            Player_Events.PLAYER_COLLIDE,
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
        this.receiver.subscribe("cheat");
        this.receiver.subscribe("startStory");
        this.receiver.subscribe("startTimer");
        this.receiver.subscribe("endStory");
        this.receiver.subscribe("nextLevel");
    }

    // TODO - 
    /**
     * Adds in any necessary UI to the game
     */
    protected addUI(){
        // In-game labels
        this.healthLabel = <Label> this.add.uiElement(UIElementType.LABEL, "UI",{position: new Vec2(70, 35), text: "Player Health: "+ (<PlayerController>this.player.ai).CURRENT_HP });
        this.healthLabel.size.set(200, 50);
        this.healthLabel.setHAlign(HAlign.LEFT);
        this.healthLabel.textColor = Color.GREEN;
        this.healthLabel.font = "PixelSimple";
        this.healthLabel.fontSize = 25;
        this.healthBar = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: new Vec2(0, 0), size: new Vec2(0, 0)});
        this.healthBar.borderColor = Color.BLACK;
        this.healthBar.borderWidth = 3;
        this.healthBar.color = Color.GREEN;

        // this.poisonStat = this.add.sprite("poisoning", "UI");
        // this.poisonStat.position.set(55, 25);
        // this.poisonStat.scale.set(0.3, 0.3);
        // this.burnStat = this.add.sprite("burning", "UI");
        // this.burnStat.position.set(70, 25);
        // this.burnStat.scale.set(0.3, 0.3);
        // this.bleedStat = this.add.sprite("bleeding", "UI");
        // this.bleedStat.position.set(85, 25);
        // this.bleedStat.scale.set(0.3, 0.3);

        this.shieldLabel = <Label> this.add.uiElement(UIElementType.LABEL, "UI",{position: new Vec2(70, 65), text: "shield: "+ (<PlayerController>this.player.ai).CURRENT_SHIELD });
        this.shieldLabel.size.set(200, 50);
        this.shieldLabel.setHAlign(HAlign.LEFT);
        this.shieldLabel.textColor = Color.ORANGE;
        this.shieldLabel.font = "PixelSimple";
        this.shieldLabel.fontSize = 25;
        this.shieldBar = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: new Vec2(0, 0), size: new Vec2(0, 0)});
        this.shieldBar.borderColor = Color.BLACK;
        this.shieldBar.borderWidth = 3;
        this.shieldBar.color = Color.ORANGE;



        this.playerLevelLabel = <Label> this.add.uiElement(UIElementType.LABEL, "UI",{position: new Vec2(30, 95), text: "lv. "+ (<PlayerController>this.player.ai).level });
        this.playerLevelLabel.textColor = Color.BLUE;

        this.expLabel = <Label> this.add.uiElement(UIElementType.LABEL, "UI",{position: new Vec2(100, 95), text: "EXP: "+ (<PlayerController>this.player.ai).CURRENT_EXP });
        this.expLabel.size.set(200, 50);
        this.expLabel.setHAlign(HAlign.LEFT);
        this.expLabel.textColor = Color.BLUE;
        this.expLabel.font = "PixelSimple";
        this.expLabel.fontSize = 25;
        this.expBar = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: new Vec2(95, 80), size: new Vec2(150, 10)});
        this.expBar.borderColor = Color.BLACK;
        this.expBar.borderWidth = 3;
        this.expBar.color = Color.BLUE;

        //seed label
        //worldsize.x doesnt work how i want it to
        this.seedLabel = <Label> this.add.uiElement(UIElementType.LABEL, "UI",{position: new Vec2(70, Math.floor(this.viewport.getHalfSize().y*2 - 30)), text: "Seed: "+ this.randomSeed });
        this.seedLabel.size.set(200, 50);
        this.seedLabel.setHAlign(HAlign.LEFT);
        this.seedLabel.textColor = Color.BLACK;
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


        this.add.sprite("black", "pause");
        this.add.sprite("black", "story");
        this.add.sprite("black", "buffLayer");

        //TODO - 
        //determine button location 
        this.buffButton1 = <Button>this.add.uiElement(UIElementType.BUTTON, "buffLayer", {position: new Vec2(Math.floor(this.viewport.getHalfSize().x*2/3-180/2), Math.floor(this.viewport.getHalfSize().y)),text:""});
        this.buffButton1.size.set(180,200);
        this.buffButton1.borderWidth = 5;
        this.buffButton1.borderColor = Color.RED;
        this.buffButton1.backgroundColor = Color.WHITE;
        this.buffButton1.textColor = Color.BLACK;
        this.buffButton1.onClickEventId = "buff1";
        this.buffButton1.fontSize = 20;
        this.buffLabel1 = <Label>this.add.uiElement(UIElementType.LABEL, "buffLayer", {position: new Vec2(this.buffButton1.position.x, this.buffButton1.position.y - 40),text:"buffLabel1"});
        this.buffLabel1.fontSize = 20;


        this.buffButton2 = <Button>this.add.uiElement(UIElementType.BUTTON, "buffLayer", {position: new Vec2(Math.floor(this.viewport.getHalfSize().x), Math.floor(this.viewport.getHalfSize().y)),text:""});
        this.buffButton2.size.set(180,200);
        this.buffButton2.borderWidth = 5;
        this.buffButton2.borderColor = Color.RED;
        this.buffButton2.backgroundColor = Color.WHITE;
        this.buffButton2.textColor = Color.BLACK;
        this.buffButton2.onClickEventId = "buff2";
        this.buffButton2.fontSize = 20;
        this.buffLabel2 = <Label>this.add.uiElement(UIElementType.LABEL, "buffLayer", {position: new Vec2(this.buffButton2.position.x, this.buffButton2.position.y - 40),text:"buffLabel2"});
        this.buffLabel2.fontSize = 20;

        this.buffButton3 = <Button>this.add.uiElement(UIElementType.BUTTON, "buffLayer", {position: new Vec2(Math.floor(this.viewport.getHalfSize().x*4/3+180/2), Math.floor(this.viewport.getHalfSize().y)), text:""});
        this.buffButton3.size.set(180,200);
        this.buffButton3.borderWidth = 5;
        this.buffButton3.borderColor = Color.RED;
        this.buffButton3.backgroundColor = Color.WHITE;
        this.buffButton3.textColor = Color.BLACK;
        this.buffButton3.onClickEventId = "buff3";
        this.buffButton3.fontSize = 20;
        this.buffLabel3 = <Label>this.add.uiElement(UIElementType.LABEL, "buffLayer", {position: new Vec2(this.buffButton3.position.x, this.buffButton3.position.y - 40), text:"buffLabel3"});
        this.buffLabel3.fontSize = 20;

        this.buffs =  (<PlayerController>this.player._ai).generateBuffs();

        this.buffLayer.disable();

        this.pauseText = <Label>this.add.uiElement(UIElementType.LABEL, "pause", {position: new Vec2(Math.floor(this.viewport.getHalfSize().x - 120), Math.floor(this.viewport.getHalfSize().y - 100)), text: ""});
        this.pauseInput = <TextInput>this.add.uiElement(UIElementType.TEXT_INPUT, "pause", {position: new Vec2(Math.floor(this.viewport.getHalfSize().x - 20), Math.floor(this.viewport.getHalfSize().y + 100)), text: ""});
        this.pauseCheatText = <Label>this.add.uiElement(UIElementType.LABEL, "pause", {position: new Vec2(Math.floor(this.viewport.getHalfSize().x - 120), Math.floor(this.viewport.getHalfSize().y + 80)), text: "⬇️⬇️⬇️Cheat Code⬇️⬇️⬇️"});
        this.pauseSubmit = <Label>this.add.uiElement(UIElementType.LABEL, "pause", {position: new Vec2(Math.floor(this.viewport.getHalfSize().x + 120), Math.floor(this.viewport.getHalfSize().y + 100)), text: "Submit"});

        
        this.pauseLayer.setAlpha(0.5);
        this.pauseText.textColor = Color.WHITE;
        this.pauseText.setHAlign(HAlign.LEFT);
        this.pauseText.size = new Vec2(0, 40);
        this.pauseText.text = "HP:\nATK:\nDamage Ratio:\nBuff1:\nBuff2:\nBuff3:\nBuff4:\nBuff5:\nBuff6:\nEnemy Killed:\n"
        this.pauseCheatText.textColor = Color.WHITE;
        this.pauseCheatText.size = new Vec2(0, 40);
        this.pauseCheatText.setHAlign(HAlign.LEFT);
        this.pauseInput.size.set(400, 30);
        this.pauseSubmit.textColor = Color.BLACK;
        this.pauseSubmit.borderColor = Color.BLACK;
        this.pauseSubmit.backgroundColor = Color.WHITE;
        this.pauseSubmit.onClickEventId = "cheat";
        this.pauseSubmit.borderWidth = 3;

        this.livesCountLabel =  <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(this.viewport.getHalfSize().x*2 - 100, 30), text:"Lives: "});
        this.livesCountLabel.textColor = Color.YELLOW;
        this.livesCountLabel.fontSize = 25;

        this.timerLable = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(Math.floor(this.viewport.getHalfSize().x), 30), text: "00:00"});
        this.timerLable.fontSize = 60;
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
        this.startpos = this.playerSpawn;
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
        (<EnemyAI>enemy._ai).healthBar = <Rect>this.add.graphic(GraphicType.RECT, "primary", {position: enemy.collisionShape.center.clone().add(new Vec2(0, -((<AABB>enemy.collisionShape).hh+5))), size: new Vec2((<AABB>enemy.collisionShape).hw*3, 5)});
        (<EnemyAI>enemy._ai).healthBar.borderColor = Color.BLACK;
        (<EnemyAI>enemy._ai).healthBar.borderWidth = 1;
        (<EnemyAI>enemy._ai).healthBar.color = Color.GREEN;
        (<EnemyAI>enemy._ai).poisonStat = this.add.sprite("poisoning", "primary");
        (<EnemyAI>enemy._ai).poisonStat.position = enemy.collisionShape.center.clone().add(new Vec2((((<AABB>enemy.collisionShape).hw)*-1, -((<AABB>enemy.collisionShape).hh+5))));
        (<EnemyAI>enemy._ai).poisonStat.scale.set(1, 1);
        (<EnemyAI>enemy._ai).burnStat = this.add.sprite("burning", "primary");
        (<EnemyAI>enemy._ai).burnStat.position = (<EnemyAI>enemy._ai).poisonStat.position.clone().add(new Vec2(15, 0));
        (<EnemyAI>enemy._ai).burnStat.scale.set(1, 1);
        (<EnemyAI>enemy._ai).bleedStat = this.add.sprite("bleeding", "primary");
        (<EnemyAI>enemy._ai).bleedStat.position = (<EnemyAI>enemy._ai).poisonStat.position.clone().add(new Vec2(30, 0));
        (<EnemyAI>enemy._ai).bleedStat.scale.set(1, 1);
        enemy.setGroup("Enemy");
        enemy.setTrigger("player", Player_Events.PLAYER_COLLIDE, null);
        let actionsDefault = [new AttackAction(3, [Statuses.IN_RANGE], [Statuses.REACHED_GOAL]),
        new Move(2, [], [Statuses.IN_RANGE], {inRange: 60}),
        ];

        let statusArray : Array<string> = [Statuses.CAN_RETREAT, Statuses.CAN_BERSERK];

        //TODO - not working correctly
        if ( "status" !in aiOptions ){
            aiOptions["status"] = statusArray;
        }
        if( "actions"  !in aiOptions){
            aiOptions["actions"] = actionsDefault;
        }
        //add enemy to the enemy array
        this.enemies.push(enemy);
        //this.battleManager.setEnemies(this.enemies.map(enemy => <BattlerAI>enemy._ai));
        this.battleManager.addEnemy(<BattlerAI>enemy._ai);
    }
    

    //TODO - give each enemy unique weapon
    protected initializeEnemies( enemies: Enemy[]){
        let actionsDefault = [new AttackAction(3, [Statuses.IN_RANGE], [Statuses.REACHED_GOAL]),
        new Move(2, [], [Statuses.IN_RANGE], {inRange: 60}),
        ];

        let statusArray : Array<string> = [Statuses.CAN_RETREAT, Statuses.CAN_BERSERK];
        
        for (let enemy of enemies) {
            switch (enemy.type) {
                case "test_dummy":
                    this.addEnemy("test_dummy", enemy.position.scale(32), {
                        player: this.player,
                        health: 100,
                        tilemap: "Main",
                        actions: actionsDefault,
                        status: statusArray,
                        goal: Statuses.REACHED_GOAL,
                        //size: new AABB(Vec2.ZERO, new Vec2(16, 25)),
                        exp: 100,
                        weapon : this.createWeapon("knife")
                    })
                    break;
                case "Snake":       //Snake enemies drop from sky("trees")? or could just be very abundant
                    this.addEnemy("Snake", enemy.position.scale(32), {
                        player: this.player,
                        health: 50,
                        tilemap: "Main",
                        actions: actionsDefault,
                        status: statusArray,
                        goal: Statuses.REACHED_GOAL,
                        size: new Vec2(14,10),
                        offset : new Vec2(0, 22),
                        exp: 50,
                        weapon : this.createWeapon("knife"),
                    })
                    break;
                case "Tiger":       //Tiger can be miniboss for now? 
                    this.addEnemy("Tiger", enemy.position.scale(32), {
                        player: this.player,
                        health: 200,
                        tilemap: "Main",
                        goal: Statuses.REACHED_GOAL,
                        exp: 100,
                        weapon : this.createWeapon("knife"),
                        actions: actionsDefault,
                        status: statusArray,
                    })
                    break;

                case "remus_werewolf":       
                    this.addEnemy("remus_werewolf", enemy.position.scale(32), {
                        player: this.player,
                        health: 200,
                        tilemap: "Main",
                        //actions:actions,
                        goal: Statuses.REACHED_GOAL,
                        exp: 50,
                        weapon : this.createWeapon("knife"),
                        actions: actionsDefault,
                        status: statusArray,
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
                        size: new Vec2(16,10),
                        offset : new Vec2(0,6),
                        exp: 50,
                        weapon : this.createWeapon("knife"),
                        actions: actionsDefault,
                        status: statusArray,
                    })
                    break;
                default:
                    break;
            }
        }

    }

    protected addCheckPoint(startingTile: Vec2, size: Vec2, enter: string, exit: string): Rect {
        let checkPoint = <Rect>this.add.graphic(GraphicType.RECT, "primary", {position: startingTile.scale(32), size: size.scale(32)});
        checkPoint.addPhysics(undefined, undefined, false, true);
        checkPoint.setTrigger("player", enter, null);
        checkPoint.color = new Color(0, 0, 0, 0);
        return checkPoint;
    }

   
    /**
     * damages the player if they collide with an enemy
     * @param player player sprite
     * @param enemy enemy sprite
     */
    protected handlePlayerEnemyCollision(player: AnimatedSprite, enemy: AnimatedSprite) {
        if(enemy === undefined){
            console.log("undefined enemy");
            return;
        }
        if( player === undefined){
            console.log("undefined player");
            return;
        }
        if(typeof enemy != undefined && typeof player != undefined){
                //damage the player 
                (<PlayerController>this.player._ai).damage(10); //10 collision dmg for now
        }
                
        

    }

    /**
     * Increments the amount of life the player has
     * @param amt The amount to add to the player life
     */
    /*
    protected incPlayerLife(amt: number): void {
        GameLevel.livesCount += amt;
        this.livesCountLabel.text = "Lives: " + GameLevel.livesCount;
        if (GameLevel.livesCount === 0){
            InputWrapper.disableInput();
            this.player.disablePhysics();
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
            this.player.tweens.play("death");
        }
    }
    */


    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        InputWrapper.enableInput();
        this.player.position.copy(this.startpos);
        (<PlayerController>this.player._ai).CURRENT_HP = (<PlayerController>this.player._ai).MAX_HP + (<PlayerController>this.player._ai).CURRENT_BUFFS.hp;
        //(<PlayerController>this.player._ai).lives --;

    }


    /**
     * 
     * handles the player falling off the map
     * 
     * @param viewportCenter The center of the viewport
     * @param viewportSize The size of the viewport
     */
    protected playerFalloff(viewportCenter: Vec2, viewportSize: Vec2):void{
         if(this.player.position.y >= viewportCenter.y +viewportSize.y/2.0){
			
			this.player.position.set(this.playerSpawn.x,this.playerSpawn.y);

            //TODO - decrease player health or can kill player here
            //(<PlayerController>this.player._ai).CURRENT_HP *= .75;
            //this.emitter.fireEvent(Player_Events.PLAYER_KILLED);
		}
        
    }


    protected playStartStory() {
        if (!this.touchedStartCheckPoint) {
            this.touchedStartCheckPoint = true;
            this.storyLoader("shattered_sword_assets/jsons/story.json");
            this.startTimer();
        }
    }

    protected playEndStory() {
        if (!this.touchedEndCheckPoint) {
            this.touchedEndCheckPoint = true;
            this.storyLoader("shattered_sword_assets/jsons/story.json");
            this.endTimer();
        }
    }

    protected startTimer() {
        this.gameStarted = true;
    }

    protected endTimer() {
        this.gameStarted = false;
    }

    protected goToNextLevel() {
        console.log("goToNextLevel")
    }


    protected async storyLoader(storyPath: string) {
        if (this.gameStateStack.peek() === GameState.STORY) {
            return;
        }
        this.setGameState(GameState.STORY);
        const response = await (await fetch(storyPath)).json();
        this.story = <Story>response;
        console.log("story:", this.story);
        if (this.story.bgm) {
            this.storyBGMs = new Array;
            this.story.bgm.forEach((bgm) => {

                if (this.load.getAudio(bgm.key)) {
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: bgm.key, loop: false, holdReference: true });
                }
                else {
                    this.load.singleAudio(bgm.key, bgm.path, () => {
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: bgm.key, loop: false, holdReference: true });
                    })
                }
                this.storyBGMs.push(bgm.key);
            })
        }
        this.currentSpeaker = this.story.texts[0].speaker;
        this.currentContent = this.story.texts[0].content;
        this.storyLayer.enable();
        this.storytextLabel = <Label>this.add.uiElement(UIElementType.LABEL, "story", { position: new Vec2(50, this.viewport.getHalfSize().y + 80), text: "" });
        this.storytextLabel.size = new Vec2(0, 25);
        this.storytextLabel.textColor = Color.WHITE;
        this.storytextLabel.font = "PixelSimple";
        this.storytextLabel.fontSize = 25;
        this.storytextLabel.setHAlign(HAlign.LEFT);
        this.storyProgress = -1;
        this.storySprites = new Array;
        this.updateStory();
    }

    protected hasNextStory(): boolean {
        return this.gameStateStack.peek() ===  GameState.STORY && this.storyProgress + 1 < this.story.texts.length;
    }

    protected updateStory() {
        if (this.hasNextStory()) {
            this.storyProgress++;
            let tmp = undefined;
            if (this.story.texts[this.storyProgress].actions) {
                this.story.texts[this.storyProgress].actions.forEach(action => {
                    switch (action.type) {
                        case "loadSprite":
                            if (this.load.getImage(action.key)) {
                                tmp = this.add.sprite(action.key, "story");
                                tmp.position.set(action.positon[0], action.positon[1]);
                                tmp.scale.set(action.scale[0], action.scale[1]);
                                this.storySprites.push(tmp);
                            }
                            else {
                                this.load.singleImage(action.key, action.path, () => {
                                    tmp = this.add.sprite(action.key, "story");
                                    tmp.position.set(action.positon[0], action.positon[1]);
                                    tmp.scale.set(action.scale[0], action.scale[1]);
                                    this.storySprites.push(tmp);
                                })
                            }
                            break;
                        case "moveSprite":
                            tmp = this.storySprites.find(function (sprite) {
                                return sprite.imageId === action.key;
                            });
                            tmp.position.set(action.positon[0], action.positon[1]);
                            tmp.scale.set(action.scale[0], action.scale[1]);
                            break;
                        case "showSprite":
                            tmp = this.storySprites.find(function (sprite) {
                                return sprite.imageId === action.key;
                            });
                            tmp.visible = true;
                            break;
                        case "hideSprite":
                            tmp = this.storySprites.find(function (sprite) {
                                return sprite.imageId === action.key;
                            });
                            tmp.visible = false;
                            break;
                        default:
                            break;
                    }
                })
            }
            this.currentSpeaker = this.story.texts[this.storyProgress].speaker;
            this.currentContent = this.story.texts[this.storyProgress].content;
            this.storytextLabel.text = (this.currentSpeaker?(this.currentSpeaker+":"):("")) + '\n' + this.currentContent;
        }
        else {
            this.setGameState();
            this.storyProgress = Infinity;
            this.storytextLabel.destroy();
            if (this.storySprites) {
                this.storySprites.forEach((sprite) => {
                    sprite.visible = false;
                    sprite.destroy();
                });
            }
            if (this.storyBGMs) {
                this.storyBGMs.forEach((bgm) => {
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: bgm });
                    console.log("sound stopped:", bgm);
                });
            }
            this.storyLayer.disable();
            this.storyBGMs = undefined;
            this.storySprites = undefined;
            this.story = undefined;
            this.storytextLabel = undefined;
            // this.storyLayer = undefined;
        }
    }

    // Cheat
    protected enableCheat() {
        if (this.pauseInput.text.toUpperCase() === "UUDDLRLRBABA") {
            (<PlayerController>this.player._ai).godMode = true;
        }
        else {
            let commands = this.pauseInput.text.split(' ');
            console.log(commands);
            if (commands.length === 3) {
                if (commands[0].toUpperCase() === "SET") {
                    switch (commands[1].toUpperCase()) {
                        case "ATK":
                            (<PlayerController>this.player._ai).CURRENT_ATK = parseInt(commands[2]);
                            break;
                        case "HP":
                            (<PlayerController>this.player._ai).CURRENT_HP = parseInt(commands[2]);
                            break;
                        case "EXP":
                            (<PlayerController>this.player._ai).CURRENT_EXP = parseInt(commands[2]);
                            break;
                        case "SLD":
                            (<PlayerController>this.player._ai).CURRENT_SHIELD = parseInt(commands[2]);
                            break;
                        default:
                            break;
                    }
                }
            }
            (<PlayerController>this.player._ai).godMode = false;
        }
        this.pauseInput.text = "";
    }
}
    

