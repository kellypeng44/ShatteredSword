import Input from "../../Wolfie2D/Input/Input";

export default class InputWrapper {
    private static isInStoryMode: boolean;

    constructor() {
        InputWrapper.isInStoryMode = false;
    }

    /**
	 * Returns whether or not the attack key is currently pressed
	 * @returns True if the attack key is pressed, false otherwise
	 */
    static isAttackJustPressed(): boolean {
        if (InputWrapper.isInStoryMode) {
            return false;
        }
        // TODO
        return undefined;
    }

    static setStoryMode(storyMode: boolean): void {
        InputWrapper.isInStoryMode = storyMode;
    }

}