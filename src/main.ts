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

    let mainScene = new Scene();
    let pauseMenu = new Scene();

    // Initialize GameObjects
    let player = new Player();

    let recordButton = new Button();
    recordButton.setSize(100, 50);
    recordButton.setText("Record");
    recordButton.setPosition(400, 30);
    recordButton.onClickEventId = "record_button_press";

    let stopButton = new Button();
    stopButton.setSize(100, 50);
    stopButton.setText("Stop");
    stopButton.setPosition(550, 30);
    stopButton.onClickEventId = "stop_button_press";

    let playButton = new Button();
    playButton.setSize(100, 50);
    playButton.setText("Play");
    playButton.setPosition(700, 30);
    playButton.onClickEventId = "play_button_press";

    let cycleFramerateButton = new Button();
    cycleFramerateButton.setSize(150, 50);
    cycleFramerateButton.setText("Cycle FPS");
    cycleFramerateButton.setPosition(5, 400);
    let i = 0;
    let fps = [15, 30, 60];
    cycleFramerateButton.onClick = () => {
        game.setMaxFPS(fps[i]);
        i = (i + 1) % 3;
    }

    let pauseButton = new Button();
    pauseButton.setSize(100, 50);
    pauseButton.setText("Pause");
    pauseButton.setPosition(700, 400);
    pauseButton.onClick = () => {
        game.getGameState().addScene(pauseMenu);
    }

    let modalBackground = new UIElement();
    modalBackground.setSize(400, 200);
    modalBackground.setBackgroundColor(new Color(0, 0, 0, 0.4));
    modalBackground.setPosition(200, 100);

    let resumeButton = new Button();
    resumeButton.setSize(100, 50);
    resumeButton.setText("Resume");
    resumeButton.setPosition(400, 200);
    resumeButton.onClick = () => {
        game.getGameState().removeScene();
    }

    let lotsOfCircs = [];
    for(let i = 0; i < 10; i++){
        lotsOfCircs.push(new ColoredCircle());
    }


    mainScene.add([...lotsOfCircs, player, recordButton, stopButton, playButton, cycleFramerateButton, pauseButton]);
    mainScene.getViewport().follow(player);
    pauseMenu.add([modalBackground, resumeButton]);

    game.getGameState().changeScene(mainScene);

    game.start();
}

main();