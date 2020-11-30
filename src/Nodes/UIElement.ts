import CanvasNode from "./CanvasNode";
import Color from "../Utils/Color";
import Vec2 from "../DataTypes/Vec2";

/**
 * The representation of a UIElement - the parent class of things like buttons
 */
export default abstract class UIElement extends CanvasNode {
	// Style attributes
	backgroundColor: Color;
	borderColor: Color;
	borderRadius: number;
	borderWidth: number;
	padding: Vec2;

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

	constructor(position: Vec2){
		super();
		this.position = position;
		
		this.backgroundColor = new Color(0, 0, 0, 0);
		this.borderColor = new Color(0, 0, 0, 0);
		this.borderRadius = 5;
		this.borderWidth = 1;
		this.padding = Vec2.ZERO;

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

	setBackgroundColor(color: Color): void {
		this.backgroundColor = color;
	}

	setPadding(padding: Vec2): void {
		this.padding.copy(padding);
	}

	update(deltaT: number): void {
		super.update(deltaT);

		// See of this object was just clicked
		if(this.input.isMouseJustPressed()){
			let clickPos = this.input.getMousePressPosition();
			if(this.contains(clickPos.x, clickPos.y)){
				this.isClicked = true;

				if(this.onClick !== null){
					this.onClick();
				}
				if(this.onClickEventId !== null){
					let data = {};
					console.log("Click event: " + this.onClickEventId)
					this.emitter.fireEvent(this.onClickEventId, data);
				}
			}
		}

		// If the mouse wasn't just pressed, then we definitely weren't clicked
		if(!this.input.isMousePressed()){
			if(this.isClicked){
				this.isClicked = false;
			}
		}

		// Check if the mouse is hovering over this element
		let mousePos = this.input.getMousePosition();
		if(mousePos && this.contains(mousePos.x, mousePos.y)){
			this.isEntered = true;

			if(this.onEnter !== null){
				this.onEnter();
			}
			if(this.onEnterEventId !== null){
				let data = {};
				this.emitter.fireEvent(this.onEnterEventId, data);
			}

		} else if(this.isEntered) {
			this.isEntered = false;

			if(this.onLeave !== null){
				this.onLeave();
			}
			if(this.onLeaveEventId !== null){
				let data = {};
				this.emitter.fireEvent(this.onLeaveEventId, data);
			}
		} else if(this.isClicked) {
			// If mouse is dragged off of element while down, it is not clicked anymore
			this.isClicked = false;
		}
	}

	/**
	 * Overridable method for calculating background color - useful for elements that want to be colored on different after certain events
	 */
	calculateBackgroundColor(): string {
		return this.backgroundColor.toStringRGBA();
	}

	/**
	 * Overridable method for calculating border color - useful for elements that want to be colored on different after certain events
	 */
	calculateBorderColor(): string {
		return this.borderColor.toStringRGBA();
	}
}