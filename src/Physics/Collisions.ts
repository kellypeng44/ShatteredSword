import { Physical } from "../DataTypes/Interfaces/Descriptors";
import AABB from "../DataTypes/Shapes/AABB";
import Vec2 from "../DataTypes/Vec2";

export class Collision {
	firstContact: Vec2;
	lastContact: Vec2;
	collidingX: boolean;
	collidingY: boolean;
	node1: Physical;
	node2: Physical;
}