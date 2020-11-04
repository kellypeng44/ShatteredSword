import State from "../../../DataTypes/State/State";
import GameEvent from "../../../Events/GameEvent";

export default class PathfinderIdle extends State {
	onEnter(): void {}

	handleInput(event: GameEvent): void {
		if(event.type === "navigate"){
			this.finished("nav");
		}
	}

	update(deltaT: number): void {}

	onExit(): void {}

}