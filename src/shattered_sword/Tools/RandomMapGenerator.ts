import { TiledTilemapData } from "../../Wolfie2D/DataTypes/Tilesets/TiledData";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import MapTemplate, { Entrance, RoomTemplate } from "./DataTypes/MapTemplate";

export default class RandomMapGenerator {
    private template: MapTemplate;
    private minX: number;
    private maxX: number;
    private minY: number;
    private maxY: number;
    private map: TiledTilemapData;
    private roomWithLeftEntrance: Array<RoomTemplate>;
    private roomWithLeftEntranceWeight: number;
    private roomWithRightEntrance: Array<RoomTemplate>;
    private roomWithRightEntranceWeight: number;
    private roomWithUpEntrance: Array<RoomTemplate>;
    private roomWithUpEntranceWeight: number;
    private roomWithDownEntrance: Array<RoomTemplate>;
    private roomWithDownEntranceWeight: number;
    private rooms: Array<Room>
    private gen: any;

    constructor(JSONFilePath: string, seed: any) {
        let xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open('GET', JSONFilePath, false);
        xhr.send(null);
        this.template = JSON.parse(xhr.responseText);
        this.roomWithLeftEntrance = new Array();
        this.roomWithRightEntrance = new Array();
        this.roomWithUpEntrance = new Array();
        this.roomWithDownEntrance = new Array();
        this.minX = this.minY = this.maxX = this.maxY =
            this.roomWithLeftEntranceWeight = this.roomWithRightEntranceWeight =
            this.roomWithUpEntranceWeight = this.roomWithDownEntranceWeight = 0;

        this.map = new TiledTilemapData();
        this.rooms = new Array();
        let gen = require('random-seed');
        this.gen = new gen(seed);


        this.template.rooms.forEach((room) => {
            let left = false, right = false, up = false, down = false;
            room.entrances.forEach((entrance) => {
                let facing = this.getEntranceFacing(entrance, room.width);
                switch (facing) {
                    case Facing.LEFT:
                        left = true;
                        break;
                    case Facing.RIGHT:
                        right = true;
                        break;
                    case Facing.UP:
                        up = true;
                        break;
                    case Facing.DOWN:
                        down = true;
                        break;
                    default:
                        break;
                }
            })
            if (left) {
                this.roomWithLeftEntrance.push(room);
                this.roomWithLeftEntranceWeight += room.weight;
            }
            if (right) {
                this.roomWithRightEntrance.push(room);
                this.roomWithRightEntranceWeight += room.weight;
            }
            if (up) {
                this.roomWithUpEntrance.push(room);
                this.roomWithUpEntranceWeight += room.weight;
            }
            if (down) {
                this.roomWithDownEntrance.push(room);
                this.roomWithDownEntranceWeight += room.weight;
            }
        })
    }

    getMap(): TiledTilemapData {
        this.maxX = this.template.entrance.width - 1;
        this.maxY = this.template.entrance.height - 1;

        let room = this.copyRoom(this.template.entrance, 0, 0);
        
        console.log(room);
        return this.map;
    }

    private getEntranceFacing(entrance: Entrance, width: number): Facing {
        if (entrance.x === 0)
            return Facing.LEFT;
        else if (entrance.x === width - 1)
            return Facing.RIGHT
        else if (entrance.y === 0)
            return Facing.UP;
        return Facing.DOWN;
    }

    private copyRoom(old: RoomTemplate, posX: number, posY: number): Room {
        let room = new Room();
        room.topLeft = new Vec2(posX, posY);
        room.bottomRight = new Vec2(posX + old.width - 1, posY + old.height - 1);
        room.topLayer = [...old.topLayer];
        room.bottomLayer = [...old.bottomLayer];
        return room;
    }
}

class Room {
    topLeft: Vec2;
    bottomRight: Vec2;
    topLayer: Array<number>;
    bottomLayer: Array<number>;
}

enum Facing {
    LEFT = "left",
    RIGHT = "right",
    UP = "up",
    DOWN = "down"
}