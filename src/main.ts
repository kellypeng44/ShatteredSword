import GameLoop from "./Loop/GameLoop";
import Scene from "./GameState/Scene";
import Player from "./Nodes/Player";
import UIElement from "./Nodes/UIElement";
import ColoredCircle from "./Nodes/ColoredCircle";
import Color from "./Utils/Color";
import Button from "./Nodes/UIElements/Button";
import {} from "./index";
import OrthogonalTilemap from "./Nodes/Tilemaps/OrthogonalTilemap";

function main(){
    // Create the game object
    let game = new GameLoop();
    let gameState = game.getGameState();

    let backgroundScene = gameState.createScene();
    backgroundScene.setParallax(0.5, 0.5);
    let mainScene = gameState.createScene();
    let foregroundLayer = gameState.createScene();
    foregroundLayer.setParallax(1.5, 1.5);
    let uiLayer = gameState.createScene();
    uiLayer.setParallax(0, 0);
    let pauseMenu = gameState.createScene();
    pauseMenu.setParallax(0, 0);

    // Initialize GameObjects
    let player = mainScene.canvasNode.add(Player);
    mainScene.getViewport().follow(player);

    let recordButton = uiLayer.canvasNode.add(Button);
    recordButton.setSize(100, 50);
    recordButton.setText("Record");
    recordButton.setPosition(400, 30);
    recordButton.onClickEventId = "record_button_press";

    let stopButton = uiLayer.canvasNode.add(Button);
    stopButton.setSize(100, 50);
    stopButton.setText("Stop");
    stopButton.setPosition(550, 30);
    stopButton.onClickEventId = "stop_button_press";

    let playButton = uiLayer.canvasNode.add(Button);
    playButton.setSize(100, 50);
    playButton.setText("Play");
    playButton.setPosition(700, 30);
    playButton.onClickEventId = "play_button_press";

    let cycleFramerateButton = uiLayer.canvasNode.add(Button);
    cycleFramerateButton.setSize(150, 50);
    cycleFramerateButton.setText("Cycle FPS");
    cycleFramerateButton.setPosition(5, 400);
    let i = 0;
    let fps = [15, 30, 60];
    cycleFramerateButton.onClick = () => {
        game.setMaxFPS(fps[i]);
        i = (i + 1) % 3;
    }

    let pauseButton = uiLayer.canvasNode.add(Button);
    pauseButton.setSize(100, 50);
    pauseButton.setText("Pause");
    pauseButton.setPosition(700, 400);
    pauseButton.onClick = () => {
        mainScene.setPaused(true);
        pauseMenu.enable();
    }

    let modalBackground = pauseMenu.canvasNode.add(UIElement);
    modalBackground.setSize(400, 200);
    modalBackground.setBackgroundColor(new Color(0, 0, 0, 0.4));
    modalBackground.setPosition(200, 100);

    let resumeButton = pauseMenu.canvasNode.add(Button);
    resumeButton.setSize(100, 50);
    resumeButton.setText("Resume");
    resumeButton.setPosition(400, 200);
    resumeButton.onClick = () => {
        mainScene.setPaused(false);
        pauseMenu.disable();
    }

    for(let i = 0; i < 10; i++){
        mainScene.canvasNode.add(ColoredCircle);
    }

    backgroundScene.tilemap.add(OrthogonalTilemap, "assets/tilemaps/MultiLayer.json");

    for(let i = 0; i < 30; i++){
        let cc = foregroundLayer.canvasNode.add(ColoredCircle);
        cc.setSize(80, 80);
        cc.setColor(cc.getColor().lighten().lighten())
        cc.getColor().a = 0.5;
    }

    pauseMenu.disable();

    game.start();
}

CanvasRenderingContext2D.prototype.roundedRect = function(x: number, y: number, w: number, h: number, r: number): void {
    // Clamp the radius between 0 and the min of the width or height
    if(r < 0) r = 0;
    if(r > Math.min(w, h)) r = Math.min(w, h);

    // Draw the rounded rect
    this.beginPath();

    // Top
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.arcTo(x + w, y, x + w, y + r, r);

    // Right
    this.lineTo(x + w, y + h - r);
    this.arcTo(x + w, y + h, x + w - r, y + h, r);

    // Bottom
    this.lineTo(x + r, y + h);
    this.arcTo(x, y + h, x, y + h - r, r);

    // Left
    this.lineTo(x, y + r);
    this.arcTo(x, y, x + r, y, r)

    this.closePath();
}

CanvasRenderingContext2D.prototype.strokeRoundedRect = function(x, y, w, h, r){
    this.roundedRect(x, y, w, h, r);
    this.stroke();
}

CanvasRenderingContext2D.prototype.fillRoundedRect = function(x, y, w, h, r){
    this.roundedRect(x, y, w, h, r);
    this.fill();
}  

main();