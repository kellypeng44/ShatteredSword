import PhysicsNode from "./Physics/PhysicsNode";
import Vec2 from "./DataTypes/Vec2";
import Debug from "./Debug/Debug";
import CanvasNode from "./Nodes/CanvasNode";
import { GameEventType } from "./Events/GameEventType";
import AABB from "./DataTypes/AABB";
import Collider from "./Physics/Colliders/Collider";

export default class Player extends PhysicsNode {
	velocity: Vec2;
	speed: number;
    debug: Debug;
    size: Vec2;
    gravity: number = 7000;
    type: string;

    constructor(type: string){
        super();
        this.type = type;
        this.velocity = new Vec2(0, 0);
        this.speed = 600;
        this.size = new Vec2(50, 50);
        this.position = new Vec2(0, 0);
        if(this.type === "topdown"){
            this.position = new Vec2(100, 100);
        }

        this.collider = new Collider(new AABB(this.position.clone(), this.size.scaled(1/2)));
    }

    create(): void {};

    sprite: CanvasNode;
    setSprite(sprite: CanvasNode): void {
        this.sprite = sprite;
        sprite.position = this.position.clone();
        sprite.setSize(this.size);
        this.children.push(sprite);
    }

    update(deltaT: number): void {
        if(this.type === "topdown"){
            let dir = this.topdown_computeDirection();
            this.velocity = this.topdown_computeVelocity(dir, deltaT);
        } else {
            let dir = this.platformer_computeDirection();
            this.velocity = this.platformer_computeVelocity(dir, deltaT);
        }

		this.move(new Vec2(this.velocity.x * deltaT, this.velocity.y * deltaT));

        Debug.log("player", "Pos: " + this.sprite.getPosition() + ", Size: " + this.sprite.getSize());
        Debug.log("playerbound", "Pos: " + this.sprite.getBoundary().getCenter() + ", Size: " + this.sprite.getBoundary().getHalfSize());
    }

    topdown_computeDirection(): Vec2 {
        let dir = new Vec2(0, 0);
		dir.x += this.input.isPressed('a') ? -1 : 0;
        dir.x += this.input.isPressed('d') ? 1 : 0;
        dir.y += this.input.isPressed('w') ? -1 : 0;
        dir.y += this.input.isPressed('s') ? 1 : 0;

        dir.normalize();        

        return dir;
    }

    topdown_computeVelocity(dir: Vec2, deltaT: number): Vec2 {
        let vel = new Vec2(dir.x * this.speed, dir.y * this.speed);
        return vel
    }

    platformer_computeDirection(): Vec2 {
        let dir = new Vec2(0, 0);
		dir.x += this.input.isPressed('a') ? -1 : 0;
        dir.x += this.input.isPressed('d') ? 1 : 0;
        
        if(this.grounded){
            dir.y += this.input.isJustPressed('w') ? -1 : 0;
        }

        return dir;
    }

    platformer_computeVelocity(dir: Vec2, deltaT: number): Vec2 {
        let vel = new Vec2(0, this.velocity.y);

        if(this.grounded){
            if(dir.y === -1){
                // Jumping
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_jump"});
            }
            vel.y = dir.y*1800;
        }

        vel.y += this.gravity * deltaT;

        vel.x = dir.x * this.speed;

        return vel
    }

}