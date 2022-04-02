export default class MapTemplate {
    tilewidth: number;
    tileheight: number;
    entrance: RoomTemplate;
    exit: RoomTemplate;
    rooms: Array<RoomTemplate>;
}

export class RoomTemplate {
    width: number;
    height: number;
    bottomLayer: Array<number>;
    topLayer: Array<number>;
    entrances: Array<[x: number, y: number, width: number]>
}