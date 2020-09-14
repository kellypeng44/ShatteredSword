import ResourceManager from "../ResourceManager/ResourceManager";

export default class AudioManager {
    private static instance: AudioManager;

    private audioCtx: AudioContext;

    private constructor(){
        this.initAudio();
    }

    /**
     * Get the instance of the AudioManager class or create a new one if none exists
     */
    public static getInstance(): AudioManager {
        if(!this.instance){
            this.instance = new AudioManager();
        }
        return this.instance;
    }

    /**
     * Initializes the webAudio context
     */
    private initAudio(): void {
        try {
            window.AudioContext = window.AudioContext;// || window.webkitAudioContext; 
            this.audioCtx = new AudioContext(); 
            console.log('Web Audio API successfully loaded');
        } catch(e) {
            console.log('Web Audio API is not supported in this browser'); 
        }
    }

    /**
     * Returns the current audio context
     */
    public getAudioContext(): AudioContext {
        return this.audioCtx;
    }

    /**
     * Creates a new sound from the key of a loaded audio file
     * @param key The key of the loaded audio file to create a new sound for
     */
    createSound(key: string): AudioBufferSourceNode {
        // Get audio buffer
        let buffer = ResourceManager.getInstance().getAudio(key);

        // Create a sound source
        var source = this.audioCtx.createBufferSource(); 
      
        // Tell the source which sound to play
        source.buffer = buffer;               
      
        // Connect the source to the context's destination
        source.connect(this.audioCtx.destination);         
        
        return source;
      }
      
}