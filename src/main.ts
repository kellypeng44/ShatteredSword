
import Game from "./Wolfie2D/Loop/Game";
import MainMenu from "./shattered_sword/Scenes/MainMenu";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 800},          // The size of the game
        clearColor: {r: 0, g: 0, b: 0},   // The color the game clears to
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: true                       // Whether to show debug messages. You can change this to true if you want
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(MainMenu, {});
})();

function runTests(){};