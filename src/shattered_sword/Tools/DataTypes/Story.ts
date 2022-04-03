export class Resource {
    type: string;
    key: string;
    path: string;
}

export class Text {
    speaker: string;
    content: string;
    actions?: Array<Action>;
}

export class Action {
    type: "loadSprite" | "loadAnimatedSprite" | "move" | "show" | "hide";
    key: string;
    positon?: [number, number];
    scale?: [number, number];
}

export default class Story {
    resources: Array<Resource>;
    texts: Array<Text>;
}