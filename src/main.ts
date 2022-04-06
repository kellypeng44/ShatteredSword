
import Game from "./Wolfie2D/Loop/Game";
import MainMenu from "./shattered_sword/Scenes/MainMenu";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: window.innerWidth, y: window.innerHeight},          // The size of the game
        clearColor: {r: 0, g: 0, b: 0},   // The color the game clears to
        inputs: [
            {name: "left", keys: ["a", "arrowleft"]},    //TODO - add arrow keys
            {name: "right", keys: ["d", "arrowright"]},
            {name: "up", keys: ["w"]},
            {name: "down", keys: ["s"]},
            {name: "jump", keys: ["x","space"]},
            {name: "attack", keys: ["j","z","enter"]},  
            {name: "dash", keys: ["k","z"]},
            {name: "skill", keys: ["l","v"]},
            {name: "inventory", keys: ["i","b"]},
            {name: "pause", keys: ["escape"]},    
            {name: "tab", keys: ["tab"]}   
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: true                       // Whether to show debug messages. You can change this to true if you want
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(MainMenu, {});   
    //TODO - change to splash screen once available
    //game.start(SplashScreen,{});
})();

function runTests(){};