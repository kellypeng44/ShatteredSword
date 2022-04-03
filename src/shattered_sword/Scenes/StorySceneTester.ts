import Input from "../../Wolfie2D/Input/Input";
import Scene from "../../Wolfie2D/Scene/Scene";
import Label, { HAlign } from "../../Wolfie2D/Nodes/UIElements/Label";
import Story from "../Tools/DataTypes/Story";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Color from "../../Wolfie2D/Utils/Color";
import Layer from "../../Wolfie2D/Scene/Layer";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

export default class StorySceneTester extends Scene {
    private isInStoryMode: boolean = false;
    private storytextLabel: Label;
    private storyLayer: Layer;
    private primary: Layer;
    private story: Story;
    private storyProgress: number;
    private storySprites: Array<Sprite>;
    private currentSpeaker: string;
    private currentContent: string;

    startScene(): void {
        this.primary = this.addUILayer("primary");
        this.storyLayer = this.addUILayer("story");

        const center = this.viewport.getCenter();
        const loadStory = this.add.uiElement(UIElementType.BUTTON, "primary", { position: new Vec2(center.x, center.y), text: "LoadStory" });
        loadStory.size.set(200, 50);
        loadStory.borderWidth = 2;
        loadStory.borderColor = Color.WHITE;
        loadStory.backgroundColor = Color.TRANSPARENT;
        loadStory.onClickEventId = "loadStory";


        this.receiver.subscribe("loadStory");


    }

    async storyLoader(storyPath: string) {
        const response = await (await fetch(storyPath)).json();
        this.story = <Story>response;
        this.story.resources.forEach((resource) => {
            switch (resource.type) {
                case "image":
                    this.load.image(resource.key, resource.path);
                    break;
                case "spritesheet":
                    this.load.spritesheet(resource.key, resource.path);
                    break;
                case "audio":
                    this.load.audio(resource.key, resource.path);
                    break;
                default:
                    break;
            }
        });
        this.currentSpeaker = this.story.texts[0].speaker;
        this.currentContent = this.story.texts[0].content;

        this.storytextLabel = <Label>this.add.uiElement(UIElementType.LABEL, "story", { position: new Vec2(this.viewport.getHalfSize().x, this.viewport.getHalfSize().y + 240), text: (this.currentSpeaker + ': \n\n' + this.currentContent) });
        this.storytextLabel.textColor = Color.WHITE;
        this.storytextLabel.font = "PixelSimple";
        this.storytextLabel.fontSize = 20;
        this.storytextLabel.setHAlign(HAlign.LEFT);
        this.storyProgress = 0;
        this.isInStoryMode = true;
    }

    hasNextStory(): boolean {
        return this.isInStoryMode && this.storyProgress + 1 < this.story.texts.length;
    }

    updateStory() {
        if (this.isInStoryMode && this.hasNextStory()) {
            this.storyProgress ++;
            this.currentSpeaker = this.story.texts[this.storyProgress].speaker;
            this.currentContent = this.story.texts[this.storyProgress].content;
            this.storytextLabel.text = this.currentSpeaker+':\n\n'+this.currentContent;
        }
        else {
            this.isInStoryMode = false;
            this.storyProgress = Infinity;
            this.storytextLabel.destroy();
            this.story = undefined;
        }
    }

    updateScene(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            if (event.type === "loadStory" && !this.isInStoryMode) {
                this.storyLoader("shattered_sword_assets/jsons/samplestory.json");
                console.log("loading story");
            }
        }
        if (Input.isMouseJustPressed() && this.isInStoryMode) {
            this.updateStory();
        }
    }
}