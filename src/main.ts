import GameLoop from "./Loop/GameLoop";
import Scene from "./GameState/Scene";
import Player from "./Nodes/Player";
import UIElement from "./Nodes/UIElement";
import ColoredCircle from "./Nodes/ColoredCircle";
import Color from "./Utils/Color";

function main(){
    // Create the game object
    let game = new GameLoop();

    let mainScene = new Scene();
    let pauseMenu = new Scene();

    // Initialize GameObjects
    let player = new Player();

    let recordButton = new UIElement();
    recordButton.setSize(100, 50);
    recordButton.setText("Record");
    recordButton.setBackgroundColor(new Color(200, 100, 0, 0.3));
    recordButton.setPosition(400, 30);
    recordButton.onPressSignal = "record_button_press";

    let stopButton = new UIElement();
    stopButton.setSize(100, 50);
    stopButton.setText("Stop");
    stopButton.setBackgroundColor(new Color(200, 0, 0, 0.3));
    stopButton.setPosition(550, 30);
    stopButton.onPressSignal = "stop_button_press";

    let playButton = new UIElement();
    playButton.setSize(100, 50);
    playButton.setText("Play");
    playButton.setBackgroundColor(new Color(0, 200, 0, 0.3));
    playButton.setPosition(700, 30);
    playButton.onPressSignal = "play_button_press";

    let cycleFramerateButton = new UIElement();
    cycleFramerateButton.setSize(150, 50);
    cycleFramerateButton.setText("Cycle FPS");
    cycleFramerateButton.setBackgroundColor(new Color(200, 0, 200, 0.3));
    cycleFramerateButton.setPosition(5, 400);
    let i = 0;
    let fps = [15, 30, 60];
    cycleFramerateButton.onPress = () => {
        game.setMaxFPS(fps[i]);
        i = (i + 1) % 3;
    }

    let pauseButton = new UIElement();
    pauseButton.setSize(100, 50);
    pauseButton.setText("Pause");
    pauseButton.setBackgroundColor(new Color(200, 0, 200, 1));
    pauseButton.setPosition(700, 400);
    pauseButton.onPress = () => {
        game.getGameState().addScene(pauseMenu);
    }

    let modalBackground = new UIElement();
    modalBackground.setSize(400, 200);
    modalBackground.setBackgroundColor(new Color(0, 0, 0, 0.4));
    modalBackground.setPosition(200, 100);

    let resumeButton = new UIElement();
    resumeButton.setSize(100, 50);
    resumeButton.setText("Resume");
    resumeButton.setBackgroundColor(new Color(200, 0, 200, 1));
    resumeButton.setPosition(400, 200);
    resumeButton.onPress = () => {
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