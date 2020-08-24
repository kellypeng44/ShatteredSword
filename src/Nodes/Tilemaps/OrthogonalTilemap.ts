import Tilemap from "../Tilemap";
import Vec2 from "../../DataTypes/Vec2";
import { TiledTilemapData, TiledLayerData } from "../../DataTypes/Tilesets/TiledData";
import Tileset from "../../DataTypes/Tilesets/Tileset";


export default class OrthogonalTilemap extends Tilemap {

    protected parseTilemapData(tilemapData: TiledTilemapData, layer: TiledLayerData): void {
        this.worldSize.set(tilemapData.width, tilemapData.height);
        this.tileSize.set(tilemapData.tilewidth, tilemapData.tileheight);
        this.data = layer.data;
        this.collisionData = this.data.map(tile => tile !== 0 ? 1 : 0);
        this.visible = layer.visible;
        this.collidable = false;
        if(layer.properties){
            for(let item of layer.properties){
                if(item.name === "Collidable"){
                    this.collidable = item.value;
                }
            }
        }
        tilemapData.tilesets.forEach(tilesetData => this.tilesets.push(new Tileset(tilesetData)));
    }

    getTileAt(worldCoords: Vec2): number {
        let localCoords = this.getColRowAt(worldCoords);
        if(localCoords.x < 0 || localCoords.x >= this.worldSize.x || localCoords.y < 0 || localCoords.y >= this.worldSize.y){
            // There are no tiles in negative positions or out of bounds positions
            return 0;
        }

        return this.data[localCoords.y * this.worldSize.x + localCoords.x];
    }

    isTileCollidable(indexOrCol: number, row?: number): boolean {
        if(row){
            if(indexOrCol < 0 || indexOrCol >= this.worldSize.x || row < 0 || row >= this.worldSize.y){
                // There are no tiles in negative positions or out of bounds positions
                return false;
            }
            return this.collisionData[row * this.worldSize.x + indexOrCol] === 1 && this.collidable;
        } else {
            if(indexOrCol < 0 || indexOrCol >= this.collisionData.length){
                // Tiles that don't exist aren't collidable
                return false;
            }
            return this.collisionData[indexOrCol] === 1 && this.collidable;
        }
    }

    // TODO: Should this throw an error if someone tries to access an out of bounds value?
    getColRowAt(worldCoords: Vec2): Vec2 {
        let col = Math.floor(worldCoords.x / this.tileSize.x / this.scale.x);
        let row = Math.floor(worldCoords.y / this.tileSize.y / this.scale.y);
        return new Vec2(col, row);
    }

    forEachTile(func: Function): void {
        for(let i = 0; i < this.data.length; i++){
            func(this.data[i], i);
        }
    }

    update(deltaT: number): void {}

    // TODO: Don't render tiles that aren't on screen
    render(ctx: CanvasRenderingContext2D, origin: Vec2, viewportSize: Vec2) {
        for(let i = 0; i < this.data.length; i++){
            let tileIndex = this.data[i];

            for(let tileset of this.tilesets){
                if(tileset.hasTile(tileIndex)){
                    tileset.renderTile(ctx, tileIndex, i, this.worldSize, origin, this.scale);
                }
            }
        }
    }
}