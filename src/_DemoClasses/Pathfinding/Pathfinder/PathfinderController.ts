import StateMachineAI from "../../../AI/StateMachineAI";
import GameNode from "../../../Nodes/GameNode";
import PathfinderIdle from "./PathfinderIdle";
import PathfinderNav from "./PathfinderNav";

export default class PathfinderController extends StateMachineAI {
	protected owner: GameNode;

	initializeAI(owner: GameNode, config: Record<string, any>): void {
		this.owner = owner;

		let idle = new PathfinderIdle(this);
		this.addState("idle", idle);

		let nav = new PathfinderNav(this, owner, config.player);
		this.addState("nav", nav);

		this.receiver.subscribe("navigate");

		this.initialize("idle");
	}
}