import Map from "../DataTypes/Map";
import Tilemap from "../Nodes/Tilemap";
import Queue from "../DataTypes/Queue";
import { TiledTilemapData } from "../DataTypes/Tilesets/TiledData";
import StringUtils from "../Utils/StringUtils";
import AudioManager from "../Sound/AudioManager";

export default class ResourceManager {
    // Instance for the singleton class
    private static instance: ResourceManager;
    
    // Booleans to keep track of whether or not the ResourceManager is currently loading something
    private loading: boolean;
    private justLoaded: boolean;

    // Functions to do something when loading progresses or is completed such as render a loading screen
    public onLoadProgress: Function;
    public onLoadComplete: Function;


    /**
     * Number to keep track of how many images need to be loaded
     */
    private loadonly_imagesLoaded: number;
    /**
     * Number to keep track of how many images are loaded
     */
    private loadonly_imagesToLoad: number;
    /**
     * The queue of images we must load
     */
    private loadonly_imageLoadingQueue: Queue<{key: string, path: string}>;
    /**
     * A map of the images that are currently loaded and (presumably) being used by the scene
     */
    private images: Map<HTMLImageElement>;

    /**
     * Number to keep track of how many tilemaps need to be loaded
     */
    private loadonly_tilemapsLoaded: number;
    /**
     * Number to keep track of how many tilemaps are loaded
     */
    private loadonly_tilemapsToLoad: number;
    /**
     * The queue of tilemaps we must load
     */
    private loadonly_tilemapLoadingQueue: Queue<{key: string, path: string}>;
    /**
     * A map of the tilemaps that are currently loaded and (presumably) being used by the scene
     */
    private tilemaps: Map<TiledTilemapData>;

    /**
     * Number to keep track of how many sounds need to be loaded
     */
    private loadonly_audioLoaded: number;
    /**
     * Number to keep track of how many sounds are loaded
     */
    private loadonly_audioToLoad: number;
    /**
     * The queue of sounds we must load
     */
    private loadonly_audioLoadingQueue: Queue<{key: string, path: string}>;
        /**
     * A map of the sounds that are currently loaded and (presumably) being used by the scene
     */
    private audioBuffers: Map<AudioBuffer>;

    /**
     * The total number of "types" of things that need to be loaded (i.e. images and tilemaps)
     */
    private loadonly_typesToLoad: number;

    private constructor(){
        this.loading = false;
        this.justLoaded = false;

        this.loadonly_imagesLoaded = 0;
        this.loadonly_imagesToLoad = 0;
        this.loadonly_imageLoadingQueue = new Queue();
        this.images = new Map();

        this.loadonly_tilemapsLoaded = 0;
        this.loadonly_tilemapsToLoad = 0;
        this.loadonly_tilemapLoadingQueue = new Queue();
        this.tilemaps = new Map();

        this.loadonly_audioLoaded = 0;
        this.loadonly_audioToLoad = 0;
        this.loadonly_audioLoadingQueue = new Queue();
        this.audioBuffers = new Map();
    };

    /**
     * Returns the current instance of this class or a new instance if none exist
     */
    static getInstance(): ResourceManager {
        if(!this.instance){
            this.instance = new ResourceManager();
        }

        return this.instance;
    }

    /**
     * Loads an image from file
     * @param key The key to associate the loaded image with
     * @param path The path to the image to load
     */
    public image(key: string, path: string): void {
        this.loadonly_imageLoadingQueue.enqueue({key: key, path: path});
    }

    /**
     * Retrieves a loaded image
     * @param key The key of the loaded image
     */
    public getImage(key: string): HTMLImageElement {
        return this.images.get(key);
    }

    public spritesheet(key: string, path: string, frames: {hFrames: number, vFrames: number}): void {

    }

    /**
     * Load an audio file
     * @param key 
     * @param path 
     */
    public audio(key: string, path: string): void {
        this.loadonly_audioLoadingQueue.enqueue({key: key, path: path});
    }

    /**
     * Retrieves a loaded audio file
     * @param key 
     */
    public getAudio(key: string): AudioBuffer {
        return this.audioBuffers.get(key);
    }

    /**
     * Load a tilemap from a json file. Automatically loads related images
     * @param key 
     * @param path 
     */
    public tilemap(key: string, path: string): void {
        this.loadonly_tilemapLoadingQueue.enqueue({key: key, path: path});
    }

    /**
     * Retreives a loaded tilemap
     * @param key 
     */
    public getTilemap(key: string): TiledTilemapData {
        return this.tilemaps.get(key);
    }

    // TODO - Should everything be loaded in order, one file at a time?
    /**
     * Loads all resources currently in the queue
     * @param callback 
     */
    loadResourcesFromQueue(callback: Function): void {
        this.loadonly_typesToLoad = 3;

        this.loading = true;

        // Load everything in the queues. Tilemaps have to come before images because they will add new images to the queue
        this.loadTilemapsFromQueue(() => {
            console.log("Loaded Tilemaps");
            this.loadImagesFromQueue(() => {
                console.log("Loaded Images");
                this.loadAudioFromQueue(() => {
                    console.log("Loaded Audio");
                    // Done loading
                    this.loading = false;
                    this.justLoaded = true;
                    callback();
                });
            });
        });

    }

    /**
     * Deletes references to all resources in the resource manager
     */
    unloadAllResources(): void {
        this.loading = false;
        this.justLoaded = false;

        this.loadonly_imagesLoaded = 0;
        this.loadonly_imagesToLoad = 0;
        this.images.clear();

        this.loadonly_tilemapsLoaded = 0;
        this.loadonly_tilemapsToLoad = 0;
        this.tilemaps.clear();

        this.loadonly_audioLoaded = 0;
        this.loadonly_audioToLoad = 0;
        this.audioBuffers.clear();
    }

    /**
     * Loads all tilemaps currently in the tilemap loading queue
     * @param onFinishLoading 
     */
    private loadTilemapsFromQueue(onFinishLoading: Function): void {
        this.loadonly_tilemapsToLoad = this.loadonly_tilemapLoadingQueue.getSize();
        this.loadonly_tilemapsLoaded = 0;

        while(this.loadonly_tilemapLoadingQueue.hasItems()){
            let tilemap = this.loadonly_tilemapLoadingQueue.dequeue();
            this.loadTilemap(tilemap.key, tilemap.path, onFinishLoading);
        }
    }

    /**
     * Loads a singular tilemap 
     * @param key 
     * @param pathToTilemapJSON 
     * @param callbackIfLast 
     */
    private loadTilemap(key: string, pathToTilemapJSON: string, callbackIfLast: Function): void {
        this.loadTextFile(pathToTilemapJSON, (fileText: string) => {
            let tilemapObject = <TiledTilemapData>JSON.parse(fileText);
            
            // We can parse the object later - it's much faster than loading
            this.tilemaps.add(key, tilemapObject);

            // Grab the tileset images we need to load and add them to the imageloading queue
            for(let tileset of tilemapObject.tilesets){
                if(tileset.image){
                    let key = tileset.image;
                    let path = StringUtils.getPathFromFilePath(pathToTilemapJSON) + key;
                    this.loadonly_imageLoadingQueue.enqueue({key: key, path: path});
                } else if(tileset.tiles){
                    for(let tile of tileset.tiles){
                        let key = tile.image;
                        let path = StringUtils.getPathFromFilePath(pathToTilemapJSON) + key;
                        this.loadonly_imageLoadingQueue.enqueue({key: key, path: path});
                    }
                }

            }

            // Finish loading
            this.finishLoadingTilemap(callbackIfLast);
        });
    }

    /**
     * Finish loading a tilemap. Calls the callback function if this is the last tilemap being loaded
     * @param callback 
     */
    private finishLoadingTilemap(callback: Function): void {
        this.loadonly_tilemapsLoaded += 1;

        if(this.loadonly_tilemapsLoaded === this.loadonly_tilemapsToLoad){
            // We're done loading tilemaps
            callback();
        }
    }

    /**
     * Loads all images currently in the tilemap loading queue
     * @param onFinishLoading 
     */
    private loadImagesFromQueue(onFinishLoading: Function): void {
        this.loadonly_imagesToLoad = this.loadonly_imageLoadingQueue.getSize();
        this.loadonly_imagesLoaded = 0;

        while(this.loadonly_imageLoadingQueue.hasItems()){
            let image = this.loadonly_imageLoadingQueue.dequeue();
            this.loadImage(image.key, image.path, onFinishLoading);
        }
    }

    /**
     * Loads a singular image
     * @param key 
     * @param path 
     * @param callbackIfLast 
     */
    public loadImage(key: string, path: string, callbackIfLast: Function): void {
        var image = new Image();

        image.onload = () => {
            // Add to loaded images
            this.images.add(key, image);

            // Finish image load
            this.finishLoadingImage(callbackIfLast);
        }

        image.src = path;
    }

    /**
     * Finish loading an image. If this is the last image, it calls the callback function
     * @param callback 
     */
    private finishLoadingImage(callback: Function): void {
        this.loadonly_imagesLoaded += 1;

        if(this.loadonly_imagesLoaded === this.loadonly_imagesToLoad ){
            // We're done loading images
            callback();
        }
    }

    /**
     * Loads all audio currently in the tilemap loading queue
     * @param onFinishLoading 
     */
    private loadAudioFromQueue(onFinishLoading: Function){
        this.loadonly_audioToLoad = this.loadonly_audioLoadingQueue.getSize();
        this.loadonly_audioLoaded = 0;

        while(this.loadonly_audioLoadingQueue.hasItems()){
            let audio = this.loadonly_audioLoadingQueue.dequeue();
            this.loadAudio(audio.key, audio.path, onFinishLoading);
        }
    }

    /**
     * Load a singular audio file
     * @param key 
     * @param path 
     * @param callbackIfLast 
     */
    private loadAudio(key: string, path: string, callbackIfLast: Function): void {
        let audioCtx = AudioManager.getInstance().getAudioContext();

        let request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';

        request.onload = () => {
            audioCtx.decodeAudioData(request.response, (buffer) => {
                // Add to list of audio buffers
                this.audioBuffers.add(key, buffer);

                // Finish loading sound
                this.finishLoadingAudio(callbackIfLast);
            }, (error) =>{
                throw "Error loading sound";
            });
        }
        request.send();
    }

    /**
     * Finish loading an audio file. Calls the callback functon if this is the last audio sample being loaded.
     * @param callback 
     */
    private finishLoadingAudio(callback: Function): void {
        this.loadonly_audioLoaded += 1;

        if(this.loadonly_audioLoaded === this.loadonly_audioToLoad){
            // We're done loading audio
            callback();
        }
    }

    private loadTextFile(textFilePath: string, callback: Function): void {
        let xobj: XMLHttpRequest = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', textFilePath, true);
        xobj.onreadystatechange = function () {
            if ((xobj.readyState == 4) && (xobj.status == 200)) {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }

    private getLoadPercent(): number {
        return (this.loadonly_tilemapsLoaded/this.loadonly_tilemapsToLoad
            + this.loadonly_imagesLoaded/this.loadonly_imagesToLoad
            + this.loadonly_audioLoaded/this.loadonly_audioToLoad)
            / this.loadonly_typesToLoad;
    }

    public update(deltaT: number): void {
        if(this.loading){
            this.onLoadProgress(this.getLoadPercent());
        } else if(this.justLoaded){
            this.justLoaded = false;
            this.onLoadComplete();
        }
    }
}