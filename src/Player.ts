import PhysicsNode from "./Physics/PhysicsNode";
import Vec2 from "./DataTypes/Vec2";
import Debug from "./Debug/Debug";
import AABB from "./Physics/Colliders/AABB";
import PlayerSprite from "./Nodes/PlayerSprite";

export default class Player extends PhysicsNode {
	velocity: Vec2;
	speed: number;
    debug: Debug;
    size: Vec2;

    constructor(){
        super();
        this.velocity = new Vec2(0, 0);
        this.speed = 300;
        this.size = new Vec2(50, 50);
        this.collider = new AABB();
        this.collider.setSize(this.size);
        this.position = new Vec2(0, 0);
		this.debug = Debug.getInstance();
    }

    create(): void {
        let sprite = this.scene.canvasNode.add(PlayerSprite);
        sprite.setPosition(this.position);
        sprite.setSize(this.size);
        this.children.push(sprite);
    }

    update(deltaT: number): void {
        let dir = new Vec2(0, 0);
		dir.x += this.input.isPressed('a') ? -1 : 0;
		dir.x += this.input.isPressed('d') ? 1 : 0;
		dir.y += this.input.isPressed('s') ? 1 : 0;
		dir.y += this.input.isPressed('w') ? -1 : 0;

		dir.normalize();

        this.velocity = dir.scale(this.speed);
		this.move(this.velocity.scale(deltaT));

		this.debug.log("player", "Player Pos: " + this.position.toFixed() + " " + this.velocity.toFixed());
    }

}