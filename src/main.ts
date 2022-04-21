
import Game from "./Wolfie2D/Loop/Game";
import MainMenu from "./shattered_sword/Scenes/MainMenu";
import RegistryManager from "./Wolfie2D/Registry/RegistryManager";
import WeaponTemplateRegistry from "./shattered_sword/Registry/WeaponRegistry";
import WeaponTypeRegistry from "./shattered_sword/Registry/WeaponTypeRegistry";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x : 1920, y:1080},
        //canvasSize: {x: window.innerWidth, y: window.innerHeight},          // The size of the game
        clearColor: {r: 0, g: 0, b: 0},   // The color the game clears to
        inputs: [
            {name: "left", keys: ["a", "arrowleft"]},    //TODO - add arrow keys
            {name: "right", keys: ["d", "arrowright"]},
            {name: "up", keys: ["w"]},
            {name: "down", keys: ["s"]},
            {name: "jump", keys: ["x","space"]},
            {name: "attack", keys: ["j","z","enter"]},  
            {name: "dash", keys: ["k","x"]},    //
            {name: "skill", keys: ["l","v"]},
            {name: "inventory", keys: ["i","b"]},
            {name: "pause", keys: ["escape"]},    
            {name: "tab", keys: ["tab"]},
            {name: "spawn", keys: ["q"]}        //debug feature to test enemy spawning, press q to spawn enemy at current location 
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                      // Whether to show debug messages. You can change this to true if you want
    }


    // Set up custom registries
    let weaponTemplateRegistry = new WeaponTemplateRegistry();
    RegistryManager.addCustomRegistry("weaponTemplates", weaponTemplateRegistry);
    
    let weaponTypeRegistry = new WeaponTypeRegistry();
    RegistryManager.addCustomRegistry("weaponTypes", weaponTypeRegistry);

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(MainMenu, {});   
    //TODO - change to splash screen once available
    //game.start(SplashScreen,{});
})();

function runTests(){};