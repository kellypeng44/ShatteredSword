import Map from "../../DataTypes/Map";
import GameNode from "../../Nodes/GameNode";
import { AnimationState, TweenData } from "./AnimationTypes";
import EaseFunctions from "../../Utils/EaseFunctions";
import MathUtils from "../../Utils/MathUtils";

export default class TweenManager {
    protected owner: GameNode;

    protected tweens: Map<TweenData>;

    constructor(owner: GameNode){
        this.owner = owner;
        this.tweens = new Map();
    }

    /**
     * Add a tween to this game node
     * @param key The name of the tween
     * @param tween The data of the tween
     */
    add(key: string, tween: Record<string, any> | TweenData): void {
        let typedTween = <TweenData>tween;

        // Initialize members that we need (and the user didn't provide)
        typedTween.progress = 0;
        typedTween.elapsedTime = 0;
        typedTween.animationState = AnimationState.STOPPED;

        this.tweens.add(key, typedTween);
    }

    /**
     * Play a tween with a certain name
     * @param key The name of the tween to play
     * @param loop Whether or not the tween should loop
     */
    play(key: string, loop?: boolean): void {
        if(this.tweens.has(key)){
            let tween = this.tweens.get(key);

            // Set loop if needed
            if(loop !== undefined){
                tween.loop = loop;
            }

            // Start the tween running
            tween.animationState = AnimationState.PLAYING;
            tween.elapsedTime = 0;
            tween.progress = 0;
            tween.reversing = false;
        }
    }

    /**
     * Pauses a playing tween. Does not affect tweens that are stopped.
     * @param key The name of the tween to pause.
     */
    pause(key: string): void {
        if(this.tweens.has(key)){
            this.tweens.get(key).animationState = AnimationState.PAUSED;
        }
    }

    /**
     * Resumes a paused tween.
     * @param key The name of the tween to resume
     */
    resume(key: string): void {
        if(this.tweens.has(key)){
            let tween = this.tweens.get(key);
            if(tween.animationState === AnimationState.PAUSED)
                tween.animationState = AnimationState.PLAYING;
        }
    }

    /**
     * Stops a currently playing tween
     * @param key 
     */
    stop(key: string): void {
        if(this.tweens.has(key)){
            this.tweens.get(key).animationState = AnimationState.STOPPED;
        }
    }

    update(deltaT: number): void {
        this.tweens.forEach(key => {
            let tween = this.tweens.get(key);
            if(tween.animationState === AnimationState.PLAYING){
                // Update the progress of the tween
                tween.elapsedTime += deltaT*1000;

                // If we're past the startDelay, do the tween
                if(tween.elapsedTime >= tween.startDelay){
                    if(!tween.reversing && tween.elapsedTime >= tween.startDelay + tween.duration){
                        // If we're over time, stop the tween, loop, or reverse
                        if(tween.reverseOnComplete){
                            // If we're over time and can reverse, do so
                            tween.reversing = true;
                        } else if(tween.loop){
                            // If we can't reverse and can loop, do so
                            tween.elapsedTime -= tween.duration;
                        } else {
                            // We aren't looping and can't reverse, so stop
                            tween.animationState = AnimationState.STOPPED;
                        }
                    }

                    // Check for the end of reversing
                    if(tween.reversing && tween.elapsedTime >= tween.startDelay + 2*tween.duration){
                        if(tween.loop){
                            tween.reversing = false;
                            tween.elapsedTime -= 2*tween.duration;
                        } else {
                            tween.animationState = AnimationState.STOPPED;
                        }
                    }

                    // Update the progress, make sure it is between 0 and 1. Errors from this should never be large
                    if(tween.reversing){
                        tween.progress = MathUtils.clamp01((2*tween.duration - (tween.elapsedTime- tween.startDelay))/tween.duration);
                    } else {
                        tween.progress = MathUtils.clamp01((tween.elapsedTime - tween.startDelay)/tween.duration);
                    }

                    for(let effect of tween.effects){
                        // Get the value from the ease function that corresponds to our progress
                        let ease = EaseFunctions[effect.ease](tween.progress);

                        // Use the value to lerp the property
                        let value = MathUtils.lerp(effect.start, effect.end, ease);

                        // Assign the value of the property
                        this.owner[effect.property] = value;
                    }
                }
            }
        });
    }
}