export default class ResourceManager {
    private static instance: ResourceManager;

    private constructor(){};

    static getInstance(): ResourceManager {
        if(!this.instance){
            this.instance = new ResourceManager();
        }

        return this.instance;
    }

    public loadTilemap(pathToTilemapJSON: string, callback: Function): void {
        this.loadTextFile(pathToTilemapJSON, (fileText: string) => {
            let tilemapObject = JSON.parse(fileText);
            callback(tilemapObject);
        });
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

    // TODO: When you switch to WebGL, make sure to make this private and make a "loadTexture" function
    public loadImage(path: string, callback: Function): void {
        var image = new Image();

        image.onload = function () {
            callback(path, image);
        }

        image.src = path;
    }
}