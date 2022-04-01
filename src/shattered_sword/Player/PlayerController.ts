import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

export enum BuffType {
    ATK = "attack",
    DEF = "defence"
}

type Buff = {
    "type": BuffType,
    "value": number,
    "bonus": boolean,
}

type Buffs = [
    Buff, Buff, Buff
]


export default class PlayerController extends StateMachineAI {
    protected owner: GameNode;
    MAX_SPEED: number = 300;
    BASE_HP: number = 100;
    MAX_HP: number = 100;
    CURRENT_HP: number = 100;
    BASE_ATK: number = 100;
    MAX_ATK: number = 100;
    CURRENT_ATK: number = 100;
    BASE_DEF: number = 100;
    MAX_DEF: number = 100;
    CURRENT_DEF: number = 100;

    CURRENT_BUFFS: {
        atk: 0;
        hp: 0;
        def: 0;
        speed: 0;
    }
    velocity: Vec2 = Vec2.ZERO;
    tilemap: OrthogonalTilemap;

	/**
	 * Returns three legal random generate buffs based on current state
	 * @returns Three buffs
	 */
    static getBuffs(): Buffs {
        // TODO
        return undefined;
    }

    /**
	 * Add given buff to the player
	 * @param buff Given buff
	 */
    setBuff(buff: Buff): void {
        // TODO
    }
}