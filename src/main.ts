import Game from "./Wolfie2D/Loop/Game";
import Homework1_Scene from "./hw1/HW1_Scene";
import Registry from "./Wolfie2D/Registry/Registry";
import { Homework1Shaders } from "./hw1/HW1_Enums";
import GradientCircleShaderType from "./hw1/GradientCircleShaderType";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Set up options
    let options = {
        canvasSize: {x: 1200, y: 800},
        clearColor: {r: 0.1, g: 0.1, b: 0.1},
        inputs: [
            { name: "forward", keys: ["w"] },
            { name: "backward", keys: ["s"] },
            { name: "turn_ccw", keys: ["a"] },
            { name: "turn_cw", keys: ["d"] },
        ],
        useWebGL: true,
        showDebug: false
    }

    // We have a custom shader, so lets add it to the registry and preload it
    Registry.shaders.registerAndPreloadItem(
        Homework1Shaders.GRADIENT_CIRCLE,   // The key of the shader program
        GradientCircleShaderType,           // The constructor of the shader program
        "hw1_assets/shaders/gradient_circle.vshader",   // The path to the vertex shader
        "hw1_assets/shaders/gradient_circle.fshader");  // the path to the fragment shader

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start();
    game.getSceneManager().addScene(Homework1_Scene, {});
})();