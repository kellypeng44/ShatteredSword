import Scene from "../../Wolfie2D/Scene/Scene";
import Label, { HAlign } from "../../Wolfie2D/Nodes/UIElements/Label";
import Story from "../Tools/DataTypes/Story";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Color from "../../Wolfie2D/Utils/Color";
import Layer from "../../Wolfie2D/Scene/Layer";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import InputWrapper from "../Tools/InputWrapper";


enum Mode {
    GAME_MODE = "GameMode",
    STORY_MODE = "StoryMode",
    PAUSE_MODE = "PauseMode",
}

export default class SceneWithStory extends Scene {
    private currentMode: Mode = Mode.GAME_MODE;
    private storytextLabel: Label;
    private storyLayer: Layer;
    private story: Story;
    private storyProgress: number;
    private storySprites: Array<Sprite>;
    private storyBGMs: Array<string>;
    private currentSpeaker: string;
    private currentContent: string;

    startScene(): void {
        // The code below are for testing only. Please comment them when submit

        const center = this.viewport.getCenter();
        const loadStory = this.add.uiElement(UIElementType.BUTTON, "primary", { position: new Vec2(center.x, center.y), text: "LoadStory" });
        loadStory.size.set(200, 50);
        loadStory.borderWidth = 2;
        loadStory.borderColor = Color.WHITE;
        loadStory.backgroundColor = Color.TRANSPARENT;
        loadStory.onClickEventId = "loadStory";
        this.storyLayer = this.addUILayer("story");
        this.storyLayer.disable();


        this.receiver.subscribe("loadStory");


    }

    /**
     * This function load a story JSON from storyPath and auto display it to storyLayer
     * @param storyPath The path to the story JSON
     */
    async storyLoader(storyPath: string) {
        const response = await (await fetch(storyPath)).json();
        this.story = <Story>response;
        console.log("story:", this.story);
        if (this.story.bgm) {
            this.storyBGMs = new Array;
            this.story.bgm.forEach((bgm) => {

                if (this.load.getAudio(bgm.key)) {
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: bgm.key, loop: false, holdReference: true });
                }
                else {
                    this.load.singleAudio(bgm.key, bgm.path, () => {
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: bgm.key, loop: false, holdReference: true });
                    })
                }
                this.storyBGMs.push(bgm.key);
            })
        }
        this.currentSpeaker = this.story.texts[0].speaker;
        this.currentContent = this.story.texts[0].content;
        this.storyLayer.enable();
        this.storytextLabel = <Label>this.add.uiElement(UIElementType.LABEL, "story", { position: new Vec2(this.viewport.getHalfSize().x, this.viewport.getHalfSize().y + 240), text: "" });
        this.storytextLabel.textColor = Color.WHITE;
        this.storytextLabel.font = "PixelSimple";
        this.storytextLabel.fontSize = 20;
        this.storytextLabel.setHAlign(HAlign.LEFT);
        this.storyProgress = -1;
        this.storySprites = new Array;
        this.currentMode = Mode.STORY_MODE;
        this.updateStory();
    }

    /**
     * @returns True if the story has next sentence False otherwise
     */
    hasNextStory(): boolean {
        return this.currentMode === Mode.STORY_MODE && this.storyProgress + 1 < this.story.texts.length;
    }

    /**
     * Go to the next sentence of current story if there is one or clear the storyLayer and exit storyMode
     */
    updateStory() {
        if (this.currentMode === Mode.STORY_MODE && this.hasNextStory()) {
            this.storyProgress++;
            let tmp = undefined;
            if (this.story.texts[this.storyProgress].actions) {
                this.story.texts[this.storyProgress].actions.forEach(action => {
                    switch (action.type) {
                        case "loadSprite":
                            if (this.load.getImage(action.key)) {
                                tmp = this.add.sprite(action.key, "story");
                                tmp.position.set(action.positon[0], action.positon[1]);
                                tmp.scale.set(action.scale[0], action.scale[1]);
                                this.storySprites.push(tmp);
                            }
                            else {
                                this.load.singleImage(action.key, action.path, () => {
                                    tmp = this.add.sprite(action.key, "story");
                                    tmp.position.set(action.positon[0], action.positon[1]);
                                    tmp.scale.set(action.scale[0], action.scale[1]);
                                    this.storySprites.push(tmp);
                                })
                            }
                            break;
                        case "moveSprite":
                            tmp = this.storySprites.find(function (sprite) {
                                return sprite.imageId === action.key;
                            });
                            tmp.position.set(action.positon[0], action.positon[1]);
                            tmp.scale.set(action.scale[0], action.scale[1]);
                            break;
                        case "showSprite":
                            tmp = this.storySprites.find(function (sprite) {
                                return sprite.imageId === action.key;
                            });
                            tmp.visible = true;
                            break;
                        case "hideSprite":
                            tmp = this.storySprites.find(function (sprite) {
                                return sprite.imageId === action.key;
                            });
                            tmp.visible = false;
                            break;
                        default:
                            break;
                    }
                })
            }
            this.currentSpeaker = this.story.texts[this.storyProgress].speaker;
            this.currentContent = this.story.texts[this.storyProgress].content;
            this.storytextLabel.text = (this.currentSpeaker?(this.currentSpeaker+":"):("")) + '\n' + this.currentContent;
        }
        else {
            this.currentMode = Mode.GAME_MODE;
            this.storyProgress = Infinity;
            this.storytextLabel.destroy();
            if (this.storySprites) {
                this.storySprites.forEach((sprite) => {
                    sprite.visible = false;
                    sprite.destroy();
                });
            }
            if (this.storyBGMs) {
                this.storyBGMs.forEach((bgm) => {
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: bgm });
                    console.log("sound stopped:", bgm);
                });
            }
            this.storyLayer.disable();
            this.storyBGMs = undefined;
            this.storySprites = undefined;
            this.story = undefined;
            this.storytextLabel = undefined;
            // this.storyLayer = undefined;
        }
    }

    updateScene(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            // Testing code            
            if (event.type === "loadStory" && this.currentMode === Mode.GAME_MODE) {
                this.storyLoader("shattered_sword_assets/jsons/story.json");
            }
        }
        // Testing code
        if (InputWrapper.isNextJustPressed() && this.currentMode === Mode.STORY_MODE) {
            this.updateStory();
        }
    }
}