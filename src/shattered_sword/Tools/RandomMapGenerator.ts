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
    private hasExit: boolean;
    private minRoom: number;

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
        this.hasExit = false;
        this.minRoom = this.template.minroom;


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
        let room = this.copyRoom(this.template.entrance, 0, 0);
        this.rooms.push(room);


        if (!this.hasExit) 
            throw new Error("Fail to generate a room with exit!");

        return this.map;
    }

    private putNextRoom(): boolean {

        return true;
    }

    private isValidRoom(topLeft: Vec2, bottomRight: Vec2): boolean {
        this.rooms.forEach((room) => {
            if (room.topLeft.x < bottomRight.x &&
                room.bottomRight.x > topLeft.x &&
                room.topLeft.y < bottomRight.y &&
                room.bottomRight.y > topLeft.y)
                return true;
        })
        return false;
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

    private getRandomRoom(value: number, facing: Facing): RoomTemplate {
        let array = this.getRoomArray(facing), weight = this.getRoomWeight(facing);

        if (value >= weight)
            throw new Error("Random number " + value + " is larger than total weight " + weight);

        array.forEach((room) => {
            if (value < room.weight)
                return room;
            value -= room.weight;
        })
        throw new Error("Cannot find Room! \nRooms: " + JSON.stringify(array) + "\nValue: " + value);
    }

    private getRoomArray(facing: Facing): Array<RoomTemplate> {
        switch (facing) {
            case Facing.LEFT:
                return this.roomWithLeftEntrance;
            case Facing.RIGHT:
                return this.roomWithRightEntrance;
            case Facing.UP:
                return this.roomWithUpEntrance;
            case Facing.DOWN:
                return this.roomWithDownEntrance;
        }
    }

    private getRoomWeight(facing: Facing): number {
        switch (facing) {
            case Facing.LEFT:
                return this.roomWithLeftEntranceWeight;
            case Facing.RIGHT:
                return this.roomWithRightEntranceWeight;
            case Facing.UP:
                return this.roomWithUpEntranceWeight;
            case Facing.DOWN:
                return this.roomWithDownEntranceWeight;
        }
    }

    private copyRoom(old: RoomTemplate, posX: number, posY: number): Room {
        let room = new Room();
        room.topLeft = new Vec2(posX, posY);
        room.bottomRight = new Vec2(posX + old.width - 1, posY + old.height - 1);
        room.topLayer = [...old.topLayer];
        room.bottomLayer = [...old.bottomLayer];
        if (posX < this.minX)
            this.minX = posX;
        if (posY < this.minY)
            this.minY = posY;
        if (posX + old.width - 1 > this.maxX)
            this.maxX = posX + old.width - 1;
        if (posY + old.height - 1 > this.maxY)
            this.maxY = posY + old.height - 1;
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