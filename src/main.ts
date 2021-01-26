import Game from "./Loop/Game";
import {} from "./index";
import MainMenu from "./_DemoClasses/Mario/MainMenu";
import Level1 from "./_DemoClasses/Mario/Level1";
import TestScene from "./_DemoClasses/PhysicsTesting/TestScene";

function main(){
    // Create the game object
    let options = {
        viewportSize: {x: 800, y: 600},
        clearColor: {r: 34, g: 32, b: 52}
    }

    let game = new Game(options);
    game.start();

    let sm = game.getSceneManager();
    sm.addScene(TestScene, {});
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