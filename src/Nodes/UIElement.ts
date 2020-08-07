import GameNode from "./GameNode";
import Color from "../Utils/Color";
import Vec2 from "../DataTypes/Vec2";
import GameEvent from "../Events/GameEvent";

export default class UIElement extends GameNode{
	parent: GameNode;
	children: Array<GameNode>;
	text: string;
	backgroundColor: Color;
	textColor: Color;
	onPress: Function;
	onPressSignal: string;
	onHover: Function;

	constructor(){
		super();
		
		this.parent = null;
		this.children = [];
		this.text = "";
		this.backgroundColor = new Color(0, 0, 0, 0);
		this.textColor = new Color(0, 0, 0, 1);

		this.onPress = null;
		this.onPressSignal = null;

		this.onHover = null;
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
			let mousePos =  this.input.getMousePressPosition();
			if(mousePos.x >= this.position.x && mousePos.x <= this.position.x + this.size.x){
				// Inside x bounds
				if(mousePos.y >= this.position.y && mousePos.y <= this.position.y + this.size.y){
					// Inside element
					if(this.onHover !== null){
						this.onHover();
					}

					if(this.onPress !== null){
						this.onPress();
					}
					if(this.onPressSignal !== null){
						let event = new GameEvent(this.onPressSignal, {});
						this.eventQueue.addEvent(event);
					}
				}
			}
		}
	}

	render(ctx: CanvasRenderingContext2D, viewportOrigin: Vec2, viewportSize: Vec2){
		ctx.fillStyle = this.backgroundColor.toStringRGBA();
		ctx.fillRect(this.position.x - viewportOrigin.x, this.position.y - viewportOrigin.y, this.size.x, this.size.y);
		ctx.fillStyle = this.textColor.toStringRGBA();
		ctx.font = "30px Arial"
		ctx.fillText(this.text, this.position.x - viewportOrigin.x, this.position.y - viewportOrigin.y + 30);
	}
}