import GameNode from "../Nodes/GameNode";
import Vec2 from "../DataTypes/Vec2";
import { Debug_Renderable, Updateable } from "../DataTypes/Interfaces/Descriptors";
import Tilemap from "../Nodes/Tilemap";
import Receiver from "../Events/Receiver";
import Emitter from "../Events/Emitter";

export default abstract class PhysicsManager implements Updateable, Debug_Renderable {
	protected receiver: Receiver;
	protected emitter: Emitter;

	constructor(){
		this.receiver = new Receiver();
		this.emitter = new Emitter();
	}

	abstract registerObject(object: GameNode): void;

	abstract registerTilemap(tilemap: Tilemap): void;

	abstract update(deltaT: number): void;

	abstract debug_render(ctx: CanvasRenderingContext2D): void;
}