import Map from "../DataTypes/Map";
import Tilemap from "../Nodes/Tilemap";
import Queue from "../DataTypes/Queue";
import { TiledTilemapData } from "../DataTypes/Tilesets/TiledData";
import StringUtils from "../Utils/StringUtils";
import AudioManager from "../Sound/AudioManager";

export default class ResourceManager {
    private static instance: ResourceManager;
    
    private loading: boolean;
    private justLoaded: boolean;

    public onLoadProgress: Function;
    public onLoadComplete: Function;

    private imagesLoaded: number;
    private imagesToLoad: number;
    private imageLoadingQueue: Queue<{key: string, path: string}>;
    private images: Map<HTMLImageElement>;

    private tilemapsLoaded: number;
    private tilemapsToLoad: number;
    private tilemapLoadingQueue: Queue<{key: string, path: string}>;
    private tilemaps: Map<TiledTilemapData>;

    private audioLoaded: number;
    private audioToLoad: number;
    private audioLoadingQueue: Queue<{key: string, path: string}>;
    private audioBuffers: Map<AudioBuffer>;

    // The number of different types of things to load
    private typesToLoad: number;

    private constructor(){
        this.loading = false;
        this.justLoaded = false;

        this.imagesLoaded = 0;
        this.imagesToLoad = 0;
        this.imageLoadingQueue = new Queue();
        this.images = new Map();

        this.tilemapsLoaded = 0;
        this.tilemapsToLoad = 0;
        this.tilemapLoadingQueue = new Queue();
        this.tilemaps = new Map();

        this.audioLoaded = 0;
        this.audioToLoad = 0;
        this.audioLoadingQueue = new Queue();
        this.audioBuffers = new Map();
    };

    static getInstance(): ResourceManager {
        if(!this.instance){
            this.instance = new ResourceManager();
        }

        return this.instance;
    }

    public image(key: string, path: string): void {
        this.imageLoadingQueue.enqueue({key: key, path: path});
    }

    public getImage(key: string): HTMLImageElement{
        return this.images.get(key);
    }

    public spritesheet(key: string, path: string, frames: {hFrames: number, vFrames: number}): void {

    }

    public audio(key: string, path: string): void {
        this.audioLoadingQueue.enqueue({key: key, path: path});
    }

    public getAudio(key: string): AudioBuffer {
        return this.audioBuffers.get(key);
    }

    public tilemap(key: string, path: string): void {
        this.tilemapLoadingQueue.enqueue({key: key, path: path});
    }

    public getTilemap(key: string): TiledTilemapData {
        return this.tilemaps.get(key);
    }

    // TODO - Should everything be loaded in order, one file at a time?
    loadResourcesFromQueue(callback: Function): void {
        this.typesToLoad = 3;

        this.loading = true;

        // Load everything in the queues. Tilemaps have to come before images because they will add new images to the queue
        this.loadTilemapsFromQueue(() => {
            this.loadImagesFromQueue(() => {
                this.loadAudioFromQueue(() => {
                    // Done loading
                    this.loading = false;
                    this.justLoaded = true;
                    callback();
                });
            });
        });

    }

    unloadAllResources(): void {
        this.loading = false;
        this.justLoaded = false;

        this.imagesLoaded = 0;
        this.imagesToLoad = 0;
        this.images.clear();

        this.tilemapsLoaded = 0;
        this.tilemapsToLoad = 0;
        this.tilemaps.clear();

        this.audioLoaded = 0;
        this.audioToLoad = 0;
        this.audioBuffers.clear();
    }

    private loadTilemapsFromQueue(onFinishLoading: Function){
        this.tilemapsToLoad = this.tilemapLoadingQueue.getSize();
        this.tilemapsLoaded = 0;

        while(this.tilemapLoadingQueue.hasItems()){
            let tilemap = this.tilemapLoadingQueue.dequeue();
            this.loadTilemap(tilemap.key, tilemap.path, onFinishLoading);
        }
    }

    private loadTilemap(key: string, pathToTilemapJSON: string, callbackIfLast: Function): void {
        this.loadTextFile(pathToTilemapJSON, (fileText: string) => {
            let tilemapObject = <TiledTilemapData>JSON.parse(fileText);
            
            // We can parse the object later - it's much faster than loading
            this.tilemaps.add(key, tilemapObject);

            // Grab the tileset images we need to load and add them to the imageloading queue
            for(let tileset of tilemapObject.tilesets){
                let key = tileset.image;
                let path = StringUtils.getPathFromFilePath(pathToTilemapJSON) + key;
                this.imageLoadingQueue.enqueue({key: key, path: path});
            }

            // Finish loading
            this.finishLoadingTilemap(callbackIfLast);
        });
    }

    private finishLoadingTilemap(callback: Function){
        this.tilemapsLoaded += 1;

        if(this.tilemapsLoaded === this.tilemapsToLoad){
            // We're done loading tilemaps
            callback();
        }
    }

    private loadImagesFromQueue(onFinishLoading: Function): void {
        this.imagesToLoad = this.imageLoadingQueue.getSize();
        this.imagesLoaded = 0;

        while(this.imageLoadingQueue.hasItems()){
            let image = this.imageLoadingQueue.dequeue();
            this.loadImage(image.key, image.path, onFinishLoading);
        }
    }

    // TODO: When you switch to WebGL, make sure to make this private and make a "loadTexture" function
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

    private finishLoadingImage(callback: Function): void {
        this.imagesLoaded += 1;

        if(this.imagesLoaded === this.imagesToLoad ){
            // We're done loading images
            callback();
        }
    }

    private loadAudioFromQueue(onFinishLoading: Function){
        this.audioToLoad = this.audioLoadingQueue.getSize();
        this.audioLoaded = 0;

        while(this.audioLoadingQueue.hasItems()){
            let audio = this.audioLoadingQueue.dequeue();
            this.loadAudio(audio.key, audio.path, onFinishLoading);
        }
    }

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

    private finishLoadingAudio(callback: Function): void {
        this.audioLoaded += 1;

        if(this.audioLoaded === this.audioToLoad){
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
        return (this.tilemapsLoaded/this.tilemapsToLoad
            + this.imagesLoaded/this.imagesToLoad
            + this.audioLoaded/this.audioToLoad)
            / this.typesToLoad;
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