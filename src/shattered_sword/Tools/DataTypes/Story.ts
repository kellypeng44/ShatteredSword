export class BGM {
    key: string;
    path: string;
}

export class Text {
    speaker: string;
    content: string;
    actions?: Array<Action>;
}

export class Action {
    type: "loadSprite" /*| "loadAnimatedSprite"*/ | "moveSprite" | "showSprite" | "hideSprite";
    key: string;
    path?: string;
    positon?: [number, number];
    scale?: [number, number];
}

export default class Story {
    bgm?: Array<BGM>;
    texts: Array<Text>;
}