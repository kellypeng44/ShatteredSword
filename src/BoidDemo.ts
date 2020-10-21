import Vec2 from "./DataTypes/Vec2";
import Scene from "./Scene/Scene";
import SceneGraphQuadTree from "./SceneGraph/SceneGraphQuadTree";
import Color from "./Utils/Color";
import Boid from "./_DemoClasses/Boids/Boid";
import FlockBehavior from "./_DemoClasses/Boids/FlockBehavior";
import Player from "./_DemoClasses/Player/Player";

/**
 * This demo emphasizes an ai system for the game engine with component architecture
 * Boids move around with components
 * Boids have randomized affects (maybe?)
 * Boids respond to player movement
 */
export default class BoidDemo extends Scene {
    boids: Array<Boid>;

    startScene(){
        // Set the world size
        this.worldSize = new Vec2(800, 600);
        this.sceneGraph = new SceneGraphQuadTree(this.viewport, this);
        this.viewport.setBounds(0, 0, 800, 600)
        this.viewport.setCenter(400, 300);

        let layer = this.addLayer();
        this.boids = new Array();

        // Add the player
        let player = this.add.graphic(Player, layer, new Vec2(0, 0));

        this.viewport.follow(player);
        this.viewport.enableZoom();

        // Create a bunch of boids
        for(let i = 0; i < 200; i++){
            let boid = this.add.graphic(Boid, layer, new Vec2(this.worldSize.x*Math.random(), this.worldSize.y*Math.random()));
            boid.fb = new FlockBehavior(this, boid, this.boids, 75, 50);
            boid.setSize(5, 5);
            this.boids.push(boid);
        }
    }

    updateScene(deltaT: number): void {
        for(let boid of this.boids){
            boid.setColor(Color.RED);
        }

        this.updateFlock();
    }

    updateFlock(): void {
        for(let boid of this.boids){
            boid.fb.update();
        }
    }

}