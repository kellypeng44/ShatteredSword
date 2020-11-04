import { AI } from "../DataTypes/Interfaces/Descriptors";
import StateMachine from "../DataTypes/State/StateMachine";
import GameNode from "../Nodes/GameNode";

export default class StateMachineAI extends StateMachine implements AI {
	protected owner: GameNode;

	initializeAI(owner: GameNode, config: Record<string, any>): void {}
}