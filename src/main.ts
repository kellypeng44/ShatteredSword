import Game from "./Wolfie2D/Loop/Game";
import default_scene from "./default_scene";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // These are options for initializing the game
    // Here, we'll simply set the size of the viewport, and make the background of the game black
    let options = {
        viewportSize: {x: 800, y: 600},
        clearColor: {r: 0, g: 0, b: 0},
    }

    // Create our game. This will create all of the systems.
    const demoGame = new Game(options);

    // Run our game. This will start the game loop and get the updates and renders running.
    demoGame.start();

    // For now, we won't specify any scene options.
    let sceneOptions = {};

    // Add our first scene. This will load this scene into the game world.
    demoGame.getSceneManager().addScene(default_scene, sceneOptions);
})();