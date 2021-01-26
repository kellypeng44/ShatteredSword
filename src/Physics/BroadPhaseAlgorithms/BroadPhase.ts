import Physical from "../../DataTypes/Interfaces/Physical";
import GameNode from "../../Nodes/GameNode";

// @ignorePage

export default abstract class BroadPhase {
	/**
	 * Runs the algorithm and returns an array of possible collision pairs.
	 */
	abstract runAlgorithm(): Array<Physical[]>;

	abstract addNode(node: GameNode): void;
}