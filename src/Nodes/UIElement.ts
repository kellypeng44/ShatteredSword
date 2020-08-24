import CanvasNode from "./CanvasNode";
import Color from "../Utils/Color";
import Vec2 from "../DataTypes/Vec2";

export default class UIElement extends CanvasNode{
	// Style attributes
	protected textColor: Color;
	protected backgroundColor: Color;
	protected borderColor: Color;
	protected text: string;
	protected font: string;
	protected fontSize: number;
	protected hAlign: string;
	protected vAlign: string;
	protected borderRadius: number;
	protected borderWidth: number;

	// EventAttributes
	onClick: Function;
	onClickEventId: string;
	onRelease: Function;
	onReleaseEventId: string;
	onEnter: Function;
	onEnterEventId: string;
	onLeave: Function;
	onLeaveEventId: string;

	protected isClicked: boolean;
	protected isEntered: boolean;

	constructor(){
		super();
		this.textColor = new Color(0, 0, 0, 1);
		this.backgroundColor = new Color(0, 0, 0, 0);
		this.borderColor = new Color(0, 0, 0, 0);
		this.text = "";
		this.font = "Arial";
		this.fontSize = 30;
		this.hAlign = "center";
		this.vAlign = "center";
		this.borderRadius = 5;
		this.borderWidth = 1;

		this.onClick = null;
		this.onClickEventId = null;
		this.onRelease = null;
		this.onReleaseEventId = null;

		this.onEnter = null;
		this.onEnterEventId = null;
		this.onLeave = null;
		this.onLeaveEventId = null;

		this.isClicked = false;
		this.isEntered = false;
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
			let clickPos = this.input.getMousePressPosition();
			if(this.contains(clickPos.x, clickPos.y)){
				this.isClicked = true;

				if(this.onClick !== null){
					this.onClick();
				}
				if(this.onClickEventId !== null){
					let data = {};
					this.emit(this.onClickEventId, data);
				}
			}
		}

		if(!this.input.isMousePressed()){
			if(this.isClicked){
				this.isClicked = false;
			}
		}

		let mousePos = this.input.getMousePosition();
		if(mousePos && this.contains(mousePos.x, mousePos.y)){
			this.isEntered = true;

			if(this.onEnter !== null){
				this.onEnter();
			}
			if(this.onEnterEventId !== null){
				let data = {};
				this.emit(this.onEnterEventId, data);
			}

		} else if(this.isEntered) {
			this.isEntered = false;

			if(this.onLeave !== null){
				this.onLeave();
			}
			if(this.onLeaveEventId !== null){
				let data = {};
				this.emit(this.onLeaveEventId, data);
			}
		} else if(this.isClicked) {
			// If mouse is dragged off of element while down, it is not clicked anymore
			this.isClicked = false;
		}
	}

	protected calculateOffset(ctx: CanvasRenderingContext2D): Vec2 {
		let textWidth = ctx.measureText(this.text).width;

		let offset = new Vec2(0, 0);

		let hDiff = this.size.x - textWidth;
		if(this.hAlign === "center"){
			offset.x = hDiff/2;
		} else if (this.hAlign === "right"){
			offset.x = hDiff;
		}

		if(this.vAlign === "top"){
			ctx.textBaseline = "top";
			offset.y = 0;
		} else if (this.vAlign === "bottom"){
			ctx.textBaseline = "bottom";
			offset.y = this.size.y;
		} else {
			ctx.textBaseline = "middle";
			offset.y = this.size.y/2;
		}

		return offset;
	}

	protected calculateBackgroundColor(): string {
		return this.backgroundColor.toStringRGBA();
	}

	protected calculateBorderColor(): string {
		return this.borderColor.toStringRGBA();
	}

	protected calculateTextColor(): string {
		return this.textColor.toStringRGBA();
	}

	render(ctx: CanvasRenderingContext2D, origin: Vec2): void {
		ctx.font = this.fontSize + "px " + this.font;
		let offset = this.calculateOffset(ctx);

		ctx.fillStyle = this.calculateBackgroundColor();
		ctx.fillRoundedRect(this.position.x - origin.x, this.position.y - origin.y, this.size.x, this.size.y, this.borderRadius);
		
		ctx.strokeStyle = this.calculateBorderColor();
		ctx.lineWidth = this.borderWidth;
		ctx.strokeRoundedRect(this.position.x - origin.x, this.position.y - origin.y, this.size.x, this.size.y, this.borderRadius);

		ctx.fillStyle = this.calculateTextColor();
		ctx.fillText(this.text, this.position.x + offset.x - origin.x, this.position.y + offset.y - origin.y);
	}
}