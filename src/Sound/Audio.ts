import AudioManager from "./AudioManager";

export default class Audio {
    private key: string;
    private sound: AudioBufferSourceNode;

    constructor(key: string){
        this.key = key;
    }

    /**
     * Play the sound this audio represents
     * @param loop A boolean for whether or not to loop the sound
     */
    play(loop?: boolean): void {
        this.sound = AudioManager.getInstance().createSound(this.key);

        if(loop){
            this.sound.loop = true;
        }
        
        this.sound.start();
    }

    /**
     * Stop the sound this audio represents
     */
    stop(): void {
        if(this.sound){
            this.sound.stop();
        }
    }
}