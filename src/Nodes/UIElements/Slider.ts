import Vec2 from "../../DataTypes/Vec2";
import Color from "../../Utils/Color";
import MathUtils from "../../Utils/MathUtils";
import UIElement from "../UIElement";

export default class Slider extends UIElement {
    /** The value of the slider from [0, 1] */
    protected value: number;
    public nibColor: Color;
    public sliderColor: Color;
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

    getValue(): number {
        return this.value;
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
}