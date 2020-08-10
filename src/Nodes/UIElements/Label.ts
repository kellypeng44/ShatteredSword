import UIElement from "../UIElement";

export default class Label extends UIElement{
	constructor(text: string){
		super();
		this.text = text;
	}
}