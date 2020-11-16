import Vec2 from "../../DataTypes/Vec2";
import GameNode from "../../Nodes/GameNode";
import { GraphicType } from "../../Nodes/Graphics/GraphicTypes";
import Label from "../../Nodes/UIElements/Label";
import { UIElementType } from "../../Nodes/UIElements/UIElementTypes";
import ParallaxLayer from "../../Scene/Layers/ParallaxLayer";
import Scene from "../../Scene/Scene";
import PlayerController from "../Player/PlayerController";
import GoombaController from "../Enemies/GoombaController";
import OrthogonalTilemap from "../../Nodes/Tilemaps/OrthogonalTilemap";

export enum MarioEvents {
    PLAYER_HIT_COIN = "PlayerHitCoin",
    PLAYER_HIT_COIN_BLOCK = "PlayerHitCoinBlock"
}

export default class Level1 extends Scene {
    player: GameNode;
    coinCount: number = 0;
    coinCountLabel: Label;
    livesCount: number = 3;
    livesCountLabel: Label;

    loadScene(): void {
        this.load.tilemap("level1", "/assets/tilemaps/level1.json");
        this.load.image("goomba", "assets/sprites/Goomba.png");
        this.load.image("koopa", "assets/sprites/Koopa.png");
    }

    startScene(): void {
        let tilemap = this.add.tilemap("level1", new Vec2(2, 2))[0].getItems()[0];
        console.log(tilemap);
        console.log((tilemap as OrthogonalTilemap).getTileAtRowCol(new Vec2(8, 17)));
        (tilemap as OrthogonalTilemap).setTileAtRowCol(new Vec2(8, 17), 1);
        console.log((tilemap as OrthogonalTilemap).getTileAtRowCol(new Vec2(8, 17)));
        this.viewport.setBounds(0, 0, 150*64, 20*64);

        // Give parallax to the parallax layers
        (this.getLayer("Clouds") as ParallaxLayer).parallax.set(0.5, 1);
        (this.getLayer("Hills") as ParallaxLayer).parallax.set(0.8, 1);

        // Add the player (a rect for now)
        this.player = this.add.graphic(GraphicType.RECT, "Main", {position: new Vec2(192, 1152), size: new Vec2(64, 64)});
        this.player.addPhysics();
        this.player.addAI(PlayerController, {playerType: "platformer", tilemap: "Main"});

        // Add triggers on colliding with coins or coinBlocks
        this.player.addTrigger("coin", MarioEvents.PLAYER_HIT_COIN);
        this.player.addTrigger("coinBlock", MarioEvents.PLAYER_HIT_COIN_BLOCK);
        this.player.setPhysicsLayer("player");

        this.receiver.subscribe([MarioEvents.PLAYER_HIT_COIN, MarioEvents.PLAYER_HIT_COIN_BLOCK]);

        this.viewport.follow(this.player);

        // Add enemies
        for(let pos of [{x: 21, y: 18}, {x: 30, y: 18}, {x: 37, y: 18}, {x: 41, y: 18}, {x: 105, y: 8}, {x: 107, y: 8}, {x: 125, y: 18}]){
            let goomba = this.add.sprite("goomba", "Main");
            goomba.position.set(pos.x*64, pos.y*64);
            goomba.scale.set(2, 2);
            goomba.addPhysics();
            goomba.addAI(GoombaController, {jumpy: false});
            goomba.setPhysicsLayer("enemy");
        }

        for(let pos of [{x: 67, y: 18}, {x: 86, y: 21}, {x: 128, y: 18}]){
            let koopa = this.add.sprite("koopa", "Main");
            koopa.position.set(pos.x*64, pos.y*64);
            koopa.scale.set(2, 2);
            koopa.addPhysics();
            koopa.addAI(GoombaController, {jumpy: true});
            koopa.setPhysicsLayer("enemy");
        }

        // Add UI
        this.addUILayer("UI");

        this.coinCountLabel = this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(80, 30), text: "Coins: 0"});
        this.livesCountLabel = this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(600, 30), text: "Lives: 3"});
    }

    updateScene(deltaT: number): void {
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            
            if(event.type === MarioEvents.PLAYER_HIT_COIN){
                let coin;
                if(event.data.get("node") === this.player){
                    // Other is coin, disable
                    coin = event.data.get("other");  
                } else {
                    // Node is coin, disable
                    coin = event.data.get("node");
                }

                // Remove from physics and scene
                coin.active = false;
                coin.visible = false;
                this.coinCount += 1;

                this.coinCountLabel.setText("Coins: " + this.coinCount);

            } else if(event.type === MarioEvents.PLAYER_HIT_COIN_BLOCK){
                console.log("Hit Coin Block")
                console.log(event.data.get("node") === this.player);
            }
        }

        // If player falls into a pit, kill them off and reset their position
        if(this.player.position.y > 21*64){
            this.player.position.set(192, 1152);
            this.livesCount -= 1
            this.livesCountLabel.setText("Lives: " + this.livesCount);
        }
    }
}