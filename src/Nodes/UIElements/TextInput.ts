import Vec2 from "../../DataTypes/Vec2";
import Color from "../../Utils/Color";
import Label from "./Label";

export default class TextInput extends Label {
    focused: boolean;
    cursorCounter: number;

    constructor(position: Vec2){
        super(position, "");

        this.focused = false;
        this.cursorCounter = 0;

        // Give a default size to the x only
        this.size.set(200, this.fontSize);
        this.hAlign = "left";

        this.borderColor = Color.BLACK;
        this.backgroundColor = Color.WHITE;
    }

    update(deltaT: number): void {
        super.update(deltaT);

        if(this.input.isMouseJustPressed()){
			let clickPos = this.input.getMousePressPosition();
			if(this.contains(clickPos.x, clickPos.y)){
                this.focused = true;
                this.cursorCounter = 30;
            } else {
                this.focused = false;
            }
        }

        if(this.focused){
            let keys = this.input.getKeysJustPressed();
            let nums = "1234567890";
            let specialChars = "`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?";
            let letters = "qwertyuiopasdfghjklzxcvbnm";
            let mask = nums + specialChars + letters;
            // THIS ISN'T ACTUALLY AN ERROR, DISREGARD
            keys = keys.filter(key => mask.includes(key));
            let shiftPressed = this.input.isPressed("shift");
            let backspacePressed = this.input.isJustPressed("backspace");
            let spacePressed = this.input.isJustPressed("space");
            
            if(backspacePressed){
                this.text = this.text.substring(0, this.text.length - 1);
            } else if(spacePressed){
                this.text += " ";
            } else if(keys.length > 0) {
                if(shiftPressed){
                    this.text += keys[0].toUpperCase();
                } else {
                    this.text += keys[0];
                }
            }
        }
    }
}