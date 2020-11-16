import GameLoop from "./Loop/GameLoop";
import {} from "./index";
import Level1 from "./_DemoClasses/Mario/Level1";

function main(){
    // Create the game object
    let options = {
        viewportSize: {x: 800, y: 600},
    }

    let game = new GameLoop(options);
    game.start();

    let sceneOptions = {
        physics: {
            physicsLayerNames: ["ground", "player", "enemy", "coin"],
            numPhyiscsLayers: 4,
            physicsLayerCollisions:
            [
                [0, 1, 1, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 1, 1, 0]
            ]
        }
    }

    let sm = game.getSceneManager();
    sm.addScene(Level1, sceneOptions);
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