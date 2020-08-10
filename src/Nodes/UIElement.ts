import CanvasNode from "./CanvasNode";
import Color from "../Utils/Color";
import Vec2 from "../DataTypes/Vec2";

export default class UIElement extends CanvasNode{
	// Style attributes
	textColor: Color;
	backgroundColor: Color;
	borderColor: Color;
	text: string;
	font: string;

	// EventAttributes
	onClick: Function;
	onClickEventId: string;
	onHover: Function;
	onHoverEventId: string;

	constructor(){
		super();
		this.textColor = new Color(0, 0, 0, 1);
		this.backgroundColor = new Color(0, 0, 0, 0);
		this.borderColor = new Color(0, 0, 0, 0);
		this.text = "";
		this.font = "30px Arial";

		this.onClick = null;
		this.onClickEventId = null;

		this.onHover = null;
		this.onHoverEventId = null;
	}

	setPosition(vecOrX: Vec2 | number, y: number = null): void {
		if(vecOrX instanceof Vec2){
			this.position.set(vecOrX.x, vecOrX.y);
		} else {
			this.position.set(vecOrX, y);
		}
	}

	setSize(vecOrX: Vec2 | number, y: number = null): void {
		if(vecOrX instanceof Vec2){
			this.size.set(vecOrX.x, vecOrX.y);
		} else {
			this.size.set(vecOrX, y);
		}
	}

	setText(text: string): void {
		this.text = text;
	}

	setBackgroundColor(color: Color): void {
		this.backgroundColor = color;
	}

	setTextColor(color: Color): void {
		this.textColor = color;
	}

	update(deltaT: number): void {
		if(this.input.isMouseJustPressed()){
			let mousePos = this.input.getMousePressPosition();
			if(mousePos.x >= this.position.x && mousePos.x <= this.position.x + this.size.x){
				// Inside x bounds
				if(mousePos.y >= this.position.y && mousePos.y <= this.position.y + this.size.y){
					// Inside element
					if(this.onHover !== null){
						this.onHover();
					}

					if(this.onClick !== null){
						this.onClick();
					}
					if(this.onClickEventId !== null){
						let data = {};
						this.emit(this.onClickEventId, data);
					}
				}
			}
		}
	}

	render(ctx: CanvasRenderingContext2D, viewportOrigin: Vec2, viewportSize: Vec2){
		ctx.fillStyle = this.backgroundColor.toStringRGBA();
		ctx.fillRect(this.position.x - viewportOrigin.x, this.position.y - viewportOrigin.y, this.size.x, this.size.y);
		ctx.fillStyle = this.textColor.toStringRGBA();
		ctx.font = this.font;
		ctx.fillText(this.text, this.position.x - viewportOrigin.x, this.position.y - viewportOrigin.y + 30);
	}
}