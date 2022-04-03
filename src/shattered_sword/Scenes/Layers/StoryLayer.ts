// import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
// import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
// import Label, { HAlign } from "../../../Wolfie2D/Nodes/UIElements/Label";
// import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
// import Layer from "../../../Wolfie2D/Scene/Layer";
// import Scene from "../../../Wolfie2D/Scene/Scene";
// import Color from "../../../Wolfie2D/Utils/Color";
// import Story from "../../Tools/DataTypes/Story";
// import StorySceneTester from "../StorySceneTester";

// export default class StoryLayer extends Layer {
//     private progress: number;
//     private sprites: Array<Sprite>;
//     private currentSpeaker: string;
//     private currentContent: string;


//     constructor(scene: Scene, name: string, story: Story) {
//         super(scene, name);
//         this.story = story;
//     }

//     static async storyLayerFactory(scene: StorySceneTester, name: string, storyPath: string): Promise<StoryLayer> {
//         const response = await (await fetch(storyPath)).json();
//         let instance = new StoryLayer(scene, name, response);
//         instance.story.resources.forEach((resource) => {
//             switch (resource.type) {
//                 case "image":
//                     instance.scene.load.image(resource.key, resource.path);
//                     break;
//                 case "spritesheet":
//                     instance.scene.load.spritesheet(resource.key, resource.path);
//                     break;
//                 case "audio":
//                     instance.scene.load.audio(resource.key, resource.path);
//                     break;
//                 default:
//                     break;
//             }
//         })

//         instance.currentSpeaker = instance.story.texts[0].speaker;
//         instance.currentContent = instance.story.texts[0].content;

//         instance.textLabel = <Label>instance.scene.add.uiElement(UIElementType.LABEL, "story", { position: new Vec2(100, 300), text: (instance.currentSpeaker + instance.currentContent) });
//         // instance.textLabel.textColor = new Color(0, 0, 0, 1);
//         // instance.textLabel.font = "PixelSimple";
//         // instance.textLabel.fontSize = 40;
//         // instance.textLabel.setHAlign(HAlign.LEFT);
//         scene.isInStoryMode = true;
//         return instance;
//     }

//     hasNext(): boolean {
//         return this.progress + 1 < this.story.texts.length;
//     }

//     update(): void {
//         if (!this.hasNext()) {
//             return;
//         }
//         this.progress++;
//         console.log(this.progress);
//         // this.currentSpeaker = this.story.texts[this.progress].speaker;
//         // this.currentContent = this.story.texts[this.progress].content;
//         // this.textLabel.text = (this.currentSpeaker + this.currentContent);
//         // let tmp = undefined;
//         // if (this.story.texts[this.progress].actions) {
//         //     this.story.texts[this.progress].actions.forEach(action => {
//         //         switch (action.type) {
//         //             case "loadSprite":
//         //                 tmp = this.scene.add.sprite(action.key, "UI");
//         //                 tmp.position.set(action.positon[0], action.positon[1]);
//         //                 tmp.scale.set(action.scale[0], action.scale[1]);
//         //                 this.sprites.push(tmp);
//         //                 break;
//         //             case "loadSprite":
//         //                 tmp = this.scene.add.sprite(action.key, "UI");
//         //                 tmp.position.set(action.positon[0], action.positon[1]);
//         //                 tmp.scale.set(action.scale[0], action.scale[1]);
//         //                 this.sprites.push(tmp);
//         //                 break;
//         //             case "move":
//         //                 tmp = this.sprites.find(function (sprite) {
//         //                     return sprite.imageId === action.key;
//         //                 });
//         //                 tmp.position.set(action.positon[0], action.positon[1]);
//         //                 tmp.scale.set(action.scale[0], action.scale[1]);
//         //                 break;
//         //             case "show":
//         //                 tmp = this.sprites.find(function (sprite) {
//         //                     return sprite.imageId === action.key;
//         //                 });
//         //                 tmp.visible = true;
//         //                 break;
//         //             case "hide":
//         //                 tmp = this.sprites.find(function (sprite) {
//         //                     return sprite.imageId === action.key;
//         //                 });
//         //                 tmp.visible = false;
//         //                 break;
//         //             default:
//         //                 break;
//         //         }
//         //     })
//         // }
//     }

//     unload(): void {
//         this.sprites.forEach(sprite => {
//             sprite.destroy();
//         })
//     }
// }