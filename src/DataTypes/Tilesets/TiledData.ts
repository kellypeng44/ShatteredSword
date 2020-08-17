export class TiledTilemapData {
    height: number;
    width: number;
    orientation: string;
    layers: TiledLayerData[];
    tilesets: TiledTilesetData[];
}

export class TiledTilesetData {
    columns: number;
    tilewidth: number;
    tileheight: number;
    tilecount: number;
    firstgid: number;
    imageheight: number;
    imagewidth: number;
    margin: number;
    spacing: number;
    name: string;
    image: string;
}

export class TiledLayerData {
    data: number[];
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    opacity: number;
    visible: boolean;
}

