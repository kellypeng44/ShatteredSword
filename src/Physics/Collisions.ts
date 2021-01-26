import Physical from "../DataTypes/Interfaces/Physical";
import Vec2 from "../DataTypes/Vec2";

// @ignorePage

export class Collision {
	firstContact: Vec2;
	lastContact: Vec2;
	collidingX: boolean;
	collidingY: boolean;
	node1: Physical;
	node2: Physical;
}