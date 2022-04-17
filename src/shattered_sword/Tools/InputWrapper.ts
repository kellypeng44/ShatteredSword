import Input from "../../Wolfie2D/Input/Input";
import {GameState} from "../sword_enums";

export default class InputWrapper {
    private static gameState: GameState = GameState.GAMING;

    static isUpPressed(): boolean {
        if (InputWrapper.gameState != GameState.GAMING) {
            return false;
        }
        
        if (Input.isPressed("up")) {
            return true;
        }
        return false;
    }
    static isDownPressed(): boolean {
        if (InputWrapper.gameState != GameState.GAMING) {
            return false;
        }
        
        if (Input.isPressed("down")) {
            return true;
        }
        return false;
    }
    static isLeftPressed(): boolean {
        if (InputWrapper.gameState != GameState.GAMING) {
            return false;
        }
        
        if (Input.isPressed("left")) {
            return true;
        }
        return false;
    }
    static isRightPressed(): boolean {
        if (InputWrapper.gameState != GameState.GAMING) {
            return false;
        }
        
        if (Input.isPressed("right")) {
            return true;
        }
        return false;
    }
    static isJumpJustPressed(): boolean {
        if (InputWrapper.gameState != GameState.GAMING) {
            return false;
        }
        
        if (Input.isJustPressed("jump")) {
            return true;
        }
        return false;
    }

    /**
	 * Returns whether or not the attack key is currently pressed
	 * @returns True if the attack key is pressed, false otherwise
	 */
    static isAttackJustPressed(): boolean {
        if (InputWrapper.gameState != GameState.GAMING) {
            return false;
        }
        
        if (Input.isJustPressed("attack")) {
            return true;
        }
        return false;
    }

    static isDashJustPressed(): boolean {
        if (InputWrapper.gameState != GameState.GAMING) {
            return false;
        }
        
        if (Input.isJustPressed("dash")) {
            return true;
        }
        return false;
    }

    static isSkillJustPressed(): boolean {
        if (InputWrapper.gameState != GameState.GAMING) {
            return false;
        }
        
        if (Input.isJustPressed("skill")) {
            return true;
        }
        return false;
    }

    static isInventoryJustPressed(): boolean {
        if (InputWrapper.gameState != GameState.GAMING) {
            return false;
        }
        
        if (Input.isJustPressed("attack")) {
            return true;
        }
        return false;
    }

    static isSpawnJustPressed(): boolean {
        if (InputWrapper.gameState != GameState.GAMING) {
            return false;
        }
        
        if (Input.isJustPressed("spawn")) {
            return true;
        }
        return false;
    }

    static isPauseJustPressed(): boolean {
        if (InputWrapper.gameState != GameState.GAMING && InputWrapper.gameState != GameState.PAUSE) {
            return false;
        }
        
        if (Input.isJustPressed("pause")) {
            return true;
        }
        return false;
    }

    static isNextJustPressed(): boolean {
        if (InputWrapper.gameState != GameState.STORY) {
            return false;
        }
        
        if (Input.isJustPressed("attack") || Input.isMouseJustPressed()) {
            return true;
        }
        return false;
    }

    static isMouseJustPressed(mouseButton?: number): boolean{
        return Input.isMouseJustPressed(mouseButton);
    }

    static disableInput() {
        Input.disableInput();
    }

    static enableInput() {
        Input.enableInput();
    }

    static setState(gameState: GameState): void {
        InputWrapper.gameState = gameState;
    }

}