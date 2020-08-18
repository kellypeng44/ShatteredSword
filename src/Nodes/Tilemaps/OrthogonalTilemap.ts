import Tilemap from "../Tilemap";
import Vec2 from "../../DataTypes/Vec2";
import { TiledTilemapData, TiledLayerData } from "../../DataTypes/Tilesets/TiledData";
import Tileset from "../../DataTypes/Tilesets/Tileset";


export default class OrthogonalTilemap extends Tilemap {
    parseTilemapData(tilemapData: TiledTilemapData, layer: TiledLayerData): void {
        this.worldSize.set(tilemapData.width, tilemapData.height);
        this.tileSize.set(tilemapData.tilewidth, tilemapData.tileheight);
        this.data = layer.data;
        tilemapData.tilesets.forEach(tilesetData => this.tilesets.push(new Tileset(tilesetData)));
    }

    forEachTile(func: Function){
        for(let i = 0; i < this.data.length; i++){
            func(this.data[i], i);
        }
    }

    update(deltaT: number): void {}

    render(ctx: CanvasRenderingContext2D, origin: Vec2, viewportSize: Vec2) {
        for(let i = 0; i < this.data.length; i++){
            let tileIndex = this.data[i];

            for(let tileset of this.tilesets){
                if(tileset.hasTile(tileIndex)){
                    tileset.renderTile(ctx, tileIndex, i, this.worldSize, origin);
                }
            }
        }
    }
}