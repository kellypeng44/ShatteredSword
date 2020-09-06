import Map from "../DataTypes/Map";
import Tilemap from "../Nodes/Tilemap";
import Queue from "../DataTypes/Queue";
import { TiledTilemapData } from "../DataTypes/Tilesets/TiledData";
import StringUtils from "../Utils/StringUtils";

export default class ResourceManager {
    private static instance: ResourceManager;
    
    private loading: boolean;

    private imagesLoaded: number;
    private imagesToLoad: number;
    private imageLoadingQueue: Queue<{key: string, path: string}>;
    private images: Map<HTMLImageElement>;

    private tilemapsLoaded: number;
    private tilemapsToLoad: number;
    private tilemapLoadingQueue: Queue<{key: string, path: string}>;
    private tilemaps: Map<TiledTilemapData>;

    private constructor(){
        this.loading = false;

        this.imagesLoaded = 0;
        this.imagesToLoad = 0;
        this.imageLoadingQueue = new Queue();
        this.images = new Map();

        this.tilemapsLoaded = 0;
        this.tilemapsToLoad = 0;
        this.tilemapLoadingQueue = new Queue();
        this.tilemaps = new Map();
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

    public getImage(key: string){
        return this.images.get(key);
    }

    public spritesheet(key: string, path: string, frames: {hFrames: number, vFrames: number}): void {

    }

    public audio(key: string, path: string): void {

    }

    // This one is trickier than the others because we first have to load the json file, then we have to load the images
    public tilemap(key: string, path: string): void {
        // Add a function that loads the tilemap to the queue
        this.tilemapLoadingQueue.enqueue({key: key, path: path});
    }

    public getTilemap(key: string): TiledTilemapData{
        return this.tilemaps.get(key);
    }

    loadResourcesFromQueue(callback: Function): void {
        this.loading = true;

        // Load everything in the queues. Tilemaps have to come before images because they will add new images to the queue
        this.loadTilemapsFromQueue(() => {
            this.loadImagesFromQueue(() => {
                // Done loading
                this.loading = false;
                callback();
            });
        });

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
        this.tilemapsLoaded = 0;

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
            // We're done loading tilemaps
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
}