import GameNode from "../../Nodes/GameNode";
import Updateable from "./Updateable";

/**
 * Defines a controller for a bot or a human. Must be able to update
 */
export default interface AI extends Updateable {
    /** Initializes the AI with the actor and any additional config */
    initializeAI(owner: GameNode, options: Record<string, any>): void;
}