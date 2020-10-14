import StateMachine from "../../DataTypes/State/StateMachine";
import { CustomGameEventType } from "../CustomGameEventType";
import Boid from "./Boid";
import BoidBehavior from "./BoidStates/BoidBehavior";
import RunAwayFromPlayer from "./BoidStates/RunAwayFromPlayer";

export default class BoidController extends StateMachine {
    constructor(boid: Boid){
        super();

        // Normal Boid Behavior
        let normalBehavior = new BoidBehavior(this, boid, 3, 1, 3);
        this.addState("normal", normalBehavior);

        // Run away from player behavior
        let runAway = new RunAwayFromPlayer(this, boid);
        this.addState("runAway", runAway);

        // Sign up to be warned of player movement
        this.receiver.subscribe(CustomGameEventType.PLAYER_MOVE);

        this.initialize("normal");
    }

    changeState(stateName: string): void {
        if(stateName === "runAway"){
            this.stack.push(this.stateMap.get(stateName));
        }

        super.changeState(stateName);
    }
}