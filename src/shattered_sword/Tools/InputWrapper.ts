import Input from "../../Wolfie2D/Input/Input";
import {GameState} from "../sword_enums";

export default class InputWrapper {
    private static gameState: GameState = GameState.GAMING;
    static randomSeed: string;

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

    static isJumpPressed(): boolean {
        if (InputWrapper.gameState != GameState.GAMING) {
            return false;
        }
        
        if (Input.isPressed("jump")) {
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
        
        if (Input.isJustPressed("inventory")) {
            return true;
        }
        return false;
    }

    static isBuff1JustPresed(): boolean{
        if (InputWrapper.gameState != GameState.BUFF) {
            return false;
        }
        return Input.isJustPressed("buff1");
    }

    static isBuff2JustPresed(): boolean{
        if (InputWrapper.gameState != GameState.BUFF) {
            return false;
        }
        return Input.isJustPressed("buff2");
    }

    static isBuff3JustPresed(): boolean{
        if (InputWrapper.gameState != GameState.BUFF) {
            return false;
        }
        return Input.isJustPressed("buff3");
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

    static isLeftMouseJustPressed(): boolean{
        return Input.isMouseJustPressed(0);
    }

    static disableInput() {
        Input.disableInput();
    }

    static enableInput() {
        Input.enableInput();
    }

    // DO NOT call this function directly
    static setState(gameState: GameState): void {
        InputWrapper.gameState = gameState;
    }

    static getState(): GameState {
        return InputWrapper.gameState;
    }
}