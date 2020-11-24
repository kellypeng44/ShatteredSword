export enum AnimationState {
    STOPPED = 0,
    PAUSED = 1,
    PLAYING = 2,
}

export class AnimationData {
    name: string;
    frames: Array<{index: number, duration: number}>;
}

export class TweenData {

}