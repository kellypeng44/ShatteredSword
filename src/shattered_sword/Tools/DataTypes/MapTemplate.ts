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
    
    entrance: RoomTemplate;
    exit: RoomTemplate;
    rooms: Array<RoomTemplate>;
}

export class Entrance {
    // Position of the top-left entrance and its width/height
    x: number;
    y: number;
    width: number;
    // If the entrance exit, the top/left bottom/right will be replaced by alt_tile[0] and alt_tile[1]
    alt_tile: [number, number];
}

export class Enemy {
    // Position of the enemy and chance to spawn (0, 1]
    x: number;
    y: number;
    type: string;
    possibility: number;
}

export class RoomTemplate {
    width: number;
    height: number;
    bottomLayer: Array<number>;
    topLayer: Array<number>;
    entrances: Array<Entrance>;
    enemies?: Array<Enemy>;
}