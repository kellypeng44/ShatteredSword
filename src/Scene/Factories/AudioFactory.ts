import ResourceManager from "../../ResourceManager/ResourceManager";
import AudioManager from "../../Sound/AudioManager";
import Scene from "../Scene";
import Audio from "../../Sound/Audio";

export default class AudioFactory {
    private scene: Scene;
    private resourceManager: ResourceManager;
    private audioManager: AudioManager;

    init(scene: Scene){
        this.scene = scene;
        this.resourceManager = ResourceManager.getInstance();
        this.audioManager = AudioManager.getInstance();
    }

    addAudio = (key: string, ...args: any): Audio => {
        let audio = new Audio(key);
        return audio;
    }
}