import Vec2 from "../../DataTypes/Vec2";
import Button from "../../Nodes/UIElements/Button";
import Label from "../../Nodes/UIElements/Label";
import Slider from "../../Nodes/UIElements/Slider";
import TextInput from "../../Nodes/UIElements/TextInput";
import ResourceManager from "../../ResourceManager/ResourceManager";
import Scene from "../../Scene/Scene";
import MathUtils from "../../Utils/MathUtils";

export default class UIElementRenderer {
    protected resourceManager: ResourceManager;
    protected scene: Scene;
    protected ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D){
        this.resourceManager = ResourceManager.getInstance();
        this.ctx = ctx;
    }

    setScene(scene: Scene): void {
        this.scene = scene;
    }

    renderLabel(label: Label): void {
        // If the size is unassigned (by the user or automatically) assign it
        label.handleInitialSizing(this.ctx);
		
		// Grab the global alpha so we can adjust it for this render
		let previousAlpha = this.ctx.globalAlpha;

        // Get the origin of the viewport according to this label
		let origin = this.scene.getViewTranslation(label);

        // Get the font and text position in label
		this.ctx.font = label.getFontString();
		let offset = label.calculateTextOffset(this.ctx);

		// Stroke and fill a rounded rect and give it text
		this.ctx.globalAlpha = label.backgroundColor.a;
		this.ctx.fillStyle = label.calculateBackgroundColor();
		this.ctx.fillRoundedRect(label.position.x - origin.x - label.size.x/2, label.position.y - origin.y - label.size.y/2,
			label.size.x, label.size.y, label.borderRadius);
		
		this.ctx.strokeStyle = label.calculateBorderColor();
		this.ctx.globalAlpha = label.borderColor.a;
		this.ctx.lineWidth = label.borderWidth;
		this.ctx.strokeRoundedRect(label.position.x - origin.x - label.size.x/2, label.position.y - origin.y - label.size.y/2,
			label.size.x, label.size.y, label.borderRadius);

		this.ctx.fillStyle = label.calculateTextColor();
		this.ctx.globalAlpha = label.textColor.a;
		this.ctx.fillText(label.text, label.position.x + offset.x - origin.x - label.size.x/2, label.position.y + offset.y - origin.y - label.size.y/2);
	
		this.ctx.globalAlpha = previousAlpha;
    }

    renderButton(button: Button): void {
        this.renderLabel(button);
    }

    renderSlider(slider: Slider): void {
		// Grab the global alpha so we can adjust it for this render
		let previousAlpha = this.ctx.globalAlpha;
		this.ctx.globalAlpha = slider.getLayer().getAlpha();

        let origin = this.scene.getViewTranslation(slider);

        // Calcualate the slider size
        let sliderSize = new Vec2(slider.size.x, 2);

        // Draw the slider
		this.ctx.fillStyle = slider.sliderColor.toString();
		this.ctx.fillRoundedRect(slider.position.x - origin.x - sliderSize.x/2, slider.position.y - origin.y - sliderSize.y/2,
            sliderSize.x, sliderSize.y, slider.borderRadius);

        // Calculate the nib size and position
        let nibSize = new Vec2(10, slider.size.y);
        let x = MathUtils.lerp(slider.position.x - slider.size.x/2, slider.position.x + slider.size.x/2, slider.getValue());
        let nibPosition = new Vec2(x, slider.position.y);

        // Draw the nib
		this.ctx.fillStyle = slider.nibColor.toString();
		this.ctx.fillRoundedRect(nibPosition.x - origin.x - nibSize.x/2, nibPosition.y - origin.y - nibSize.y/2,
            nibSize.x, nibSize.y, slider.borderRadius);

        // Reset the alpha
        this.ctx.globalAlpha = previousAlpha;
    }

    renderTextInput(textInput: TextInput): void {
        // Show a cursor sometimes
        if(textInput.focused && textInput.cursorCounter % 60 > 30){
            textInput.text += "|";
        }

        this.renderLabel(textInput);

        if(textInput.focused){
            if(textInput.cursorCounter % 60 > 30){
                textInput.text = textInput.text.substring(0, textInput.text.length - 1);
            }

            textInput.cursorCounter += 1;
            if(textInput.cursorCounter >= 60){
                textInput.cursorCounter = 0;
            }
        }
    }

}