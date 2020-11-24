import Vec2 from "../../DataTypes/Vec2";
import Color from "../../Utils/Color";
import UIElement from "../UIElement";

export default class Label extends UIElement{
	textColor: Color;
	text: string;
	protected font: string;
	protected fontSize: number;
	protected hAlign: string;
	protected vAlign: string;

	/** A flag for if the width of the text has been measured on the canvas for auto width assignment */
	protected sizeAssigned: boolean;

	constructor(position: Vec2, text: string){
		super(position);
		this.text = text;
		this.textColor = new Color(0, 0, 0, 1);
		this.font = "Arial";
		this.fontSize = 30;
		this.hAlign = "center";
		this.vAlign = "center";

		this.sizeAssigned = false;
	}

	setText(text: string): void {
		this.text = text;
	}

	setTextColor(color: Color): void {
		this.textColor = color;
	}

	getFontString(): string {
		return this.fontSize + "px " + this.font;
	}

	/**
	 * Overridable method for calculating text color - useful for elements that want to be colored on different after certain events
	 */
	calculateTextColor(): string {
		return this.textColor.toStringRGBA();
	}

	protected calculateTextWidth(ctx: CanvasRenderingContext2D): number {
		ctx.font = this.fontSize + "px " + this.font;
		return ctx.measureText(this.text).width;
	}

	/**
	 * Calculate the offset of the text - this is useful for rendering text with different alignments
	 */
	calculateTextOffset(ctx: CanvasRenderingContext2D): Vec2 {
		let textWidth = this.calculateTextWidth(ctx);

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

	protected sizeChanged(): void {
		super.sizeChanged();
		this.sizeAssigned = true;
	}

	protected autoSize(ctx: CanvasRenderingContext2D): void {
		let width = this.calculateTextWidth(ctx);
		let height = this.fontSize;
		this.size.set(width + this.padding.x*2, height + this.padding.y*2);
		this.sizeAssigned = true;
	}

	handleInitialSizing(ctx: CanvasRenderingContext2D): void {
		if(!this.sizeAssigned){
			this.autoSize(ctx);
		}
	}

	/** On the next render, size this element to it's current text using its current font size */
	sizeToText(): void {
		this.sizeAssigned = false;
	}

	debug_render = (ctx: CanvasRenderingContext2D): void => {
		let origin = this.scene.getViewTranslation(this);
		
		ctx.lineWidth = 4;
        ctx.strokeStyle = "#00FF00"
        let b = this.boundary;
        ctx.strokeRect(b.x - b.hw - origin.x, b.y - b.hh - origin.y, b.hw*2, b.hh*2);
	};
}