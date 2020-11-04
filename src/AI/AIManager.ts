import { Actor, AI, Updateable } from "../DataTypes/Interfaces/Descriptors";
import Map from "../DataTypes/Map";

export default class AIManager implements Updateable {
	actors: Array<Actor>;

	registeredAI: Map<new <T extends AI>() => T>;

	constructor(){
		this.actors = new Array();
		this.registeredAI = new Map();
	}

	/**
	 * Registers an actor with the AIManager
	 * @param actor The actor to register
	 */
	registerActor(actor: Actor): void {
		actor.actorId = this.actors.length;
		this.actors.push(actor);
	}

	registerAI(name: string, constr: new <T extends AI>() => T ): void {
		this.registeredAI.add(name, constr);
	}

	generateAI(name: string): AI {
		if(this.registeredAI.has(name)){
			return new (this.registeredAI.get(name))();
		} else {
			throw `Cannot create AI with name ${name}, no AI with that name is registered`;
		}
	}

	update(deltaT: number): void {
		// Run the ai for every active actor
		this.actors.forEach(actor => { if(actor.aiActive) actor.ai.update(deltaT) });
	}
}