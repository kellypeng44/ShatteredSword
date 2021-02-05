import Game from "./Wolfie2D/Loop/Game";
import Platformer from "./Platformer";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // These are options for initializing the game
    // Here, we'll set the size of the viewport, color the background, and set up key bindings.
    let options = {
        canvasSize: {x: 800, y: 600},
        zoomLevel: 4,
        clearColor: {r: 34, g: 32, b: 52},
        inputs: [
            { name: "left", keys: ["a"] },
            { name: "right", keys: ["d"] },
            { name: "jump", keys: ["space", "w"]}
        ]
    }

    // Create our game. This will create all of the systems.
    const demoGame = new Game(options);

    // Run our game. This will start the game loop and get the updates and renders running.
    demoGame.start();

    // For now, we won't specify any scene options.
    let sceneOptions = {};

    // Add our first scene. This will load this scene into the game world.
    demoGame.getSceneManager().addScene(Platformer, sceneOptions);
})();