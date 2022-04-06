import { TiledTilemapData } from "../../Wolfie2D/DataTypes/Tilesets/TiledData";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import MapTemplate, { Entrance } from "./DataTypes/MapTemplate";

export default class RandomMapGenerator {
    private template: MapTemplate;
    private minX: number;
    private maxX: number;
    private minY: number;
    private maxY: number;
    private map: TiledTilemapData;

    constructor(JSONFilePath: string) {
        let xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open('GET', JSONFilePath, false);        
        xhr.send(null);
        this.template = JSON.parse(xhr.responseText);
    }

    printRoom() {
        console.log(this.template);
    }
}

class Room {
    topLeft: Vec2;
    bottomRight: Vec2;
    topLayer: Array<number>;
    bottomLayer: Array<number>;
}