import AudioManager from "./AudioManager";

export default class Audio {
    private key: string;
    private sound: AudioBufferSourceNode;

    constructor(key: string){
        this.key = key;
    }

    play(loop?: boolean){
        this.sound = AudioManager.getInstance().createSound(this.key);

        if(loop){
            this.sound.loop = true;
        }
        
        this.sound.start();
    }

    stop(){
        if(this.sound){
            this.sound.stop();
        }
    }
}