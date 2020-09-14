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

    /**
     * Returns an audio element created using the previously loaded audio file specified by the key.
     * @param key The key of the loaded audio file
     */
    addAudio = (key: string): Audio => {
        let audio = new Audio(key);
        return audio;
    }
}