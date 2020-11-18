import Vec2 from "../../DataTypes/Vec2";
import Color from "../../Utils/Color";
import MathUtils from "../../Utils/MathUtils";
import UIElement from "../UIElement";

export default class Slider extends UIElement {
    /** The value of the slider from [0, 1] */
    protected value: number;
    protected nibColor: Color;
    protected sliderColor: Color;
    public onValueChange: (value: number) => void;
    public onValueChangeEventId: string;

    constructor(position: Vec2){
        super(position);

        this.value = 0;
        this.nibColor = Color.RED;
        this.sliderColor = Color.BLACK;
        this.backgroundColor = Color.TRANSPARENT;
        this.borderColor = Color.TRANSPARENT;

        // Set a default size
        this.size.set(200, 20);
    }

    protected valueChanged(): void {
        if(this.onValueChange){
            this.onValueChange(this.value);
        }

        if(this.onValueChangeEventId){
            this.emitter.fireEvent(this.onValueChangeEventId, {target: this, value: this.value});
        }
    }

    update(deltaT: number): void {
        super.update(deltaT);

        if(this.isClicked){
            let val = MathUtils.invLerp(this.position.x - this.size.x/2, this.position.x + this.size.x/2, this.input.getMousePosition().x);
            this.value = MathUtils.clamp01(val);
            this.valueChanged();
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
		// Grab the global alpha so we can adjust it for this render
		let previousAlpha = ctx.globalAlpha;
		ctx.globalAlpha = this.getLayer().getAlpha();

        let origin = this.scene.getViewTranslation(this);

        // Calcualate the slider size
        let sliderSize = new Vec2(this.size.x, 2);

        // Draw the slider
		ctx.fillStyle = this.sliderColor.toString();
		ctx.fillRoundedRect(this.position.x - origin.x - sliderSize.x/2, this.position.y - origin.y - sliderSize.y/2,
            sliderSize.x, sliderSize.y, this.borderRadius);

        // Calculate the nib size and position
        let nibSize = new Vec2(10, this.size.y);
        let x = MathUtils.lerp(this.position.x - this.size.x/2, this.position.x + this.size.x/2, this.value);
        let nibPosition = new Vec2(x, this.position.y);

        // Draw the nib
		ctx.fillStyle = this.nibColor.toString();
		ctx.fillRoundedRect(nibPosition.x - origin.x - nibSize.x/2, nibPosition.y - origin.y - nibSize.y/2,
            nibSize.x, nibSize.y, this.borderRadius);

            
        // Reset the alpha
        ctx.globalAlpha = previousAlpha;
    }
}