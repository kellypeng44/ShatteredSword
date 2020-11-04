import Vec2 from "../../DataTypes/Vec2";
import UIElement from "../UIElement";

export default class Label extends UIElement{
	constructor(position: Vec2, text: string){
		super(position);
		this.text = text;
	}
}