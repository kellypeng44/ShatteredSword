export default class MapTemplate {
    // Should be copied directly from Tiled
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
    // Replace with the relative path to the dist/
    image: string;
    
    // The start room
    entrance: RoomTemplate;
    // The final room 
    exit: RoomTemplate;
    rooms: Array<RoomTemplate>;
    // Tiles that will be used to fill four layers
    corners?: [Corner, Corner, Corner, Corner];
    // Tile to fill all empty spaces between rooms
    background: number;
    minroom: number;
}

export class Entrance {
    // Position of the top-left entrance and its width/height
    x: number;
    y: number;
    width: number;
    // If the entrance exit, the top/left bottom/right will be replaced by alt_tile[0] and alt_tile[1]
    alt_tile: [number, number];
}

export class Sprite {
    // Position of the enemy and chance to spawn (0, 1]
    x: number;
    y: number;
    type: string;
    possibility: number;
}

export class RoomTemplate {
    width: number;
    height: number;
    weight: number;
    bottomLayer: Array<number>;
    topLayer: Array<number>;
    entrances: Array<Entrance>;
    sprites?: Array<Sprite>;
}

export class Corner {
    height: number;
    width: number;
    bottomLayer: Array<number>;
    topLayer: Array<number>;
    filler: Array<number>; 
}