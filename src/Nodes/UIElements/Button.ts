import Label from "./Label";
import Color from "../../Utils/Color";
import Vec2 from "../../DataTypes/Vec2";

export default class Button extends Label {

	constructor(position: Vec2, text: string){
		super(position, text);
		
		this.backgroundColor = new Color(150, 75, 203);
		this.borderColor = new Color(41, 46, 30);
		this.textColor = new Color(255, 255, 255);
	}

	protected calculateBackgroundColor(): string {
		// Change the background color if clicked or hovered
		if(this.isEntered && !this.isClicked){
			return this.backgroundColor.lighten().toStringRGBA();
		} else if(this.isClicked){
			return this.backgroundColor.darken().toStringRGBA();
		} else {
			return this.backgroundColor.toStringRGBA();
		}
	}
}