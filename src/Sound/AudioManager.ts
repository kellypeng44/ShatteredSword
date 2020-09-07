import ResourceManager from "../ResourceManager/ResourceManager";

export default class AudioManager {
    private static instance: AudioManager;

    private audioCtx: AudioContext;

    private constructor(){
        this.initAudio();
    }

    public static getInstance(): AudioManager {
        if(!this.instance){
            this.instance = new AudioManager();
        }
        return this.instance;
    }

    private initAudio(): void { 
        try {
            window.AudioContext = window.AudioContext;// || window.webkitAudioContext; 
            this.audioCtx = new AudioContext(); 
            console.log('Web Audio API successfully loaded');
        } catch(e) {
            console.log('Web Audio API is not supported in this browser'); 
        }
    } 

    public getAudioContext(): AudioContext {
        return this.audioCtx;
    }

    createSound(key: string): AudioBufferSourceNode {
        // Get audio buffer
        let buffer = ResourceManager.getInstance().getAudio(key);

        // creates a sound source
        var source = this.audioCtx.createBufferSource(); 
      
        // tell the source which sound to play
        source.buffer = buffer;               
      
        // connect the source to the context's destination
        // i.e. the speakers     
        source.connect(this.audioCtx.destination);         
        
        return source;
      }
      
}