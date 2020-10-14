import AABB from "../../DataTypes/AABB";
import Vec2 from "../../DataTypes/Vec2";
import Point from "../../Nodes/Graphics/Point";
import Scene from "../../Scene/Scene";
import Color from "../../Utils/Color";
import Boid from "./Boid";

export default class FlockBehavior {
    scene: Scene;
    actor: Boid;
    flock: Array<Boid>;
    visibleRegion: AABB;
    avoidRadius: number;
    hasNeighbors: boolean;
    flockCenter: Vec2;
    flockHeading: Vec2;
    separationHeading: Vec2;

    constructor(scene: Scene, actor: Boid, flock: Array<Boid>, visionRange: number, avoidRadius: number) {
        this.scene = scene;
        this.actor = actor;
        this.flock = flock;

        this.visibleRegion = new AABB(this.actor.getPosition().clone(), new Vec2(visionRange, visionRange));
        this.avoidRadius = avoidRadius;
    }

    update(): void {
        
        // Update the visible region
        this.visibleRegion.setCenter(this.actor.getPosition().clone());

        let neighbors = this.scene.getSceneGraph().getNodesInRegion(this.visibleRegion);

        neighbors = neighbors.filter(neighbor => {
            return (neighbor instanceof Boid)
                && (neighbor !== this.actor)
                && this.actor.direction.dot(neighbor.position.clone().sub(this.actor.position).normalize()) > -0.866;
            });

        if(neighbors.length <= 0){
            this.hasNeighbors = false;
            return;
        } else {
            this.hasNeighbors = true;
        }

        // Draw a group
        if(this.actor.getId() < 1){
            this.actor.setColor(Color.GREEN);
            for(let neighbor of neighbors){
                if(neighbor === this.actor) continue;
                (<Point>neighbor).setColor(Color.BLUE)
            }
        }

        let flockCenter = Vec2.ZERO;
        let flockHeading = Vec2.ZERO;
        let separationHeading = Vec2.ZERO;

        for(let neighbor of neighbors){
            let neighborPos = neighbor.position;
            flockCenter.add(neighborPos);

            flockHeading.add((<Boid>neighbor).direction);

            let dist = this.actor.position.distanceSqTo(neighborPos);
            if(dist < this.avoidRadius*this.avoidRadius){
                separationHeading.add(this.actor.position.clone().sub(neighborPos).scale(1/dist));
            }
        }

        flockCenter.scale(1/neighbors.length);

        this.flockCenter = flockCenter;
        this.flockHeading = flockHeading;
        this.separationHeading = separationHeading;
    }

}