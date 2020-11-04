import State from "../../../DataTypes/State/State";
import GameEvent from "../../../Events/GameEvent";
import GameNode from "../../../Nodes/GameNode";
import NavigationPath from "../../../Pathfinding/NavigationPath";
import PathfinderController from "./PathfinderController";

export default class PathfinderNav extends State {
	parent: PathfinderController;
	owner: GameNode;
	player: GameNode;

	constructor(parent: PathfinderController, owner: GameNode, player: GameNode){
		super(parent);
		this.owner = owner;
		this.player = player;
	}

	onEnter(): void {
		// Request a path
		this.owner.path = this.owner.getScene().getNavigationManager().getPath("main", this.owner.position, this.player.position);
		this.owner.pathfinding = true;
	}

	handleInput(event: GameEvent): void {}

	update(deltaT: number): void {
		if(this.owner.path.isDone()){
			this.finished("idle");
			return;
		}

		let dir = this.owner.path.getMoveDirection(this.owner);

		this.owner.move(dir.scale(200 * deltaT));
	}

	onExit(): void {
		this.owner.pathfinding = false;
	}

}