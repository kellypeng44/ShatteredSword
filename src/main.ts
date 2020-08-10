import GameLoop from "./Loop/GameLoop";
import Scene from "./GameState/Scene";
import Player from "./Nodes/Player";
import UIElement from "./Nodes/UIElement";
import ColoredCircle from "./Nodes/ColoredCircle";
import Color from "./Utils/Color";
import Button from "./Nodes/UIElements/Button";

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
    let player = mainScene.canvas.add(Player);
    mainScene.getViewport().follow(player);

    let recordButton = uiLayer.canvas.add(Button);
    recordButton.setSize(100, 50);
    recordButton.setText("Record");
    recordButton.setPosition(400, 30);
    recordButton.onClickEventId = "record_button_press";

    let stopButton = uiLayer.canvas.add(Button);
    stopButton.setSize(100, 50);
    stopButton.setText("Stop");
    stopButton.setPosition(550, 30);
    stopButton.onClickEventId = "stop_button_press";

    let playButton = uiLayer.canvas.add(Button);
    playButton.setSize(100, 50);
    playButton.setText("Play");
    playButton.setPosition(700, 30);
    playButton.onClickEventId = "play_button_press";

    let cycleFramerateButton = uiLayer.canvas.add(Button);
    cycleFramerateButton.setSize(150, 50);
    cycleFramerateButton.setText("Cycle FPS");
    cycleFramerateButton.setPosition(5, 400);
    let i = 0;
    let fps = [15, 30, 60];
    cycleFramerateButton.onClick = () => {
        game.setMaxFPS(fps[i]);
        i = (i + 1) % 3;
    }

    let pauseButton = uiLayer.canvas.add(Button);
    pauseButton.setSize(100, 50);
    pauseButton.setText("Pause");
    pauseButton.setPosition(700, 400);
    pauseButton.onClick = () => {
        mainScene.setPaused(true);
        pauseMenu.enable();
    }

    let modalBackground = pauseMenu.canvas.add(UIElement);
    modalBackground.setSize(400, 200);
    modalBackground.setBackgroundColor(new Color(0, 0, 0, 0.4));
    modalBackground.setPosition(200, 100);

    let resumeButton = pauseMenu.canvas.add(Button);
    resumeButton.setSize(100, 50);
    resumeButton.setText("Resume");
    resumeButton.setPosition(400, 200);
    resumeButton.onClick = () => {
        mainScene.setPaused(false);
        pauseMenu.disable();
    }

    for(let i = 0; i < 10; i++){
        mainScene.canvas.add(ColoredCircle);
    }

    for(let i = 0; i < 20; i++){
        let cc = backgroundScene.canvas.add(ColoredCircle);
        cc.setSize(30, 30);
        cc.setColor(cc.getColor().darken().darken())
        cc.getColor().a = 0.8;
    }

    for(let i = 0; i < 30; i++){
        let cc = foregroundLayer.canvas.add(ColoredCircle);
        cc.setSize(80, 80);
        cc.setColor(cc.getColor().lighten().lighten())
        cc.getColor().a = 0.5;
    }

    pauseMenu.disable();

    game.start();
}

main();