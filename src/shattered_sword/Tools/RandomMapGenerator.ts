import { TiledLayerData, TiledTilemapData } from "../../Wolfie2D/DataTypes/Tilesets/TiledData";
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
    private roomPlaced: number;
    private exitFacing: Facing;
    private enemies: Array<Enemy>;
    private player: Vec2;

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
        this.enemies = new Array();
        this.player = new Vec2();
        let gen = require('random-seed');
        this.gen = new gen(seed);
        this.hasExit = false;
        this.minRoom = this.template.minroom;
        this.roomPlaced = 0;
        this.exitFacing = this.getEntranceFacing(this.template.exit.entrances[0], this.template.exit.width);


        for (let room of this.template.rooms) {
            let left = false, right = false, up = false, down = false;
            for (let entrance of room.entrances) {
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
            }
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
        }
    }

    getMap(): TiledTilemapData {
        let room = this.copyRoom(this.template.entrance, 0, 0);
        let facing = this.getEntranceFacing(this.template.entrance.entrances[0], this.template.entrance.width);
        let position = new Vec2(this.template.entrance.entrances[0].x, this.template.entrance.entrances[0].y);
        // this.removeEntrance(room, this.template.entrance.entrances[0], facing);
        this.rooms.push(room);

        

        this.putNextRoom(position, this.getOppositeFacing(facing));

        if (!this.hasExit)
            throw new Error("Fail to generate a map with exit!");

        this.fillData();
        console.log("Generated map:", this.map);
        return this.map;
    }

    getPlayer(): Vec2 {
        return new Vec2(this.player.x - this.minX, this.player.y - this.minY);
    }

    getEnemies(): Array<Enemy> {
        return this.enemies;
    }

    private putNextRoom(position: Vec2, facing: Facing): boolean {
        switch (facing) {
            case Facing.LEFT:
                position.x += 1;
                break;
            case Facing.RIGHT:
                position.x -= 1;
                break;
            case Facing.UP:
                position.y += 1;
                break;
            case Facing.DOWN:
                position.y -= 1;
                break;
            default:
                break;
        }
        if (this.roomPlaced >= this.minRoom && facing == this.exitFacing && !this.hasExit) {
            this.putExitRoom(position);
            return true;
        }

        let nextRoom = this.getRandomRoom(facing);
        let nextPosition: Vec2 = undefined;
        let thisEntrance: Entrance = undefined;
        for (let entrance of nextRoom.entrances) {
            if (this.getEntranceFacing(entrance, nextRoom.width) == facing) {
                let tmpPosition = new Vec2(position.x - entrance.x, position.y - entrance.y);
                if (this.isValidRoom(tmpPosition, new Vec2(tmpPosition.x + nextRoom.width - 1, tmpPosition.y + nextRoom.height - 1))) {
                    thisEntrance = entrance;
                    nextPosition = tmpPosition;
                }
            }
        }
        if (!thisEntrance) {
            return false;
        }
        let room = this.copyRoom(nextRoom, nextPosition.x, nextPosition.y);
        this.removeEntrance(room, thisEntrance, facing);
        this.rooms.push(room);
        this.roomPlaced += 1;
        if (this.hasExit && this.gen.random() <= 0.3) {
            return false;
        }
        for (let entrance of nextRoom.entrances) {
            if (entrance != thisEntrance) {
                let facing = this.getEntranceFacing(entrance, nextRoom.width);
                let position = new Vec2(nextPosition.x + entrance.x, nextPosition.y + entrance.y);

                if (this.putNextRoom(position, this.getOppositeFacing(facing))) {
                    this.removeEntrance(room, entrance, facing);
                }
            }
        }
        return true;
    }

    private putExitRoom(position: Vec2): void {
        position = new Vec2(position.x - this.template.exit.entrances[0].x, position.y - this.template.exit.entrances[0].y);
        if (!this.isValidRoom(position, new Vec2(position.x + this.template.exit.width - 1, position.y + this.template.exit.height - 1))) {
            throw new Error("Cannot put exit room!!! Position is invalid!!! Please check order of entrances in map template.");
        }
        let room = this.copyRoom(this.template.exit, position.x, position.y);
        this.rooms.push(room);
        this.hasExit = true;
    }

    private removeEntrance(room: Room, entrance: Entrance, facing: Facing): void {
        let width = room.bottomRight.x - room.topLeft.x + 1;
        if (facing == Facing.LEFT || facing == Facing.RIGHT) {
            for (let index = 0; index < entrance.width; index++)
                room.topLayer[(entrance.y + index) * width + entrance.x] = 0;
            if (entrance.y > 0)
                room.topLayer[(entrance.y - 1) * width + entrance.x] = entrance.alt_tile[0];
            if (entrance.y + entrance.width <= (room.bottomRight.y - room.topLeft.y))
                room.topLayer[(entrance.y + entrance.width) * width + entrance.x] = entrance.alt_tile[1];
        }
        else {
            for (let index = 0; index < entrance.width; index++)
                room.topLayer[(entrance.y) * width + entrance.x + index] = 0;
            if (entrance.x > 0)
                room.topLayer[(entrance.y) * width + entrance.x - 1] = entrance.alt_tile[0];
            if (entrance.x + entrance.width <= (room.bottomRight.x - room.topLeft.x))
                room.topLayer[(entrance.y) * width + entrance.x + entrance.width] = entrance.alt_tile[1];
        }
    }

    private fillData() {
        let width = this.maxX - this.minX + 1;
        let height = this.maxY - this.minY + 1;
        this.map.layers = new Array(2);
        this.map.layers[0] = new TiledLayerData;
        this.map.layers[1] = new TiledLayerData;
        this.map.width = this.map.layers[0].width = this.map.layers[1].width = width;
        this.map.height = this.map.layers[0].height = this.map.layers[1].height = height;
        this.map.tileheight = this.template.tileheight;
        this.map.tilewidth = this.template.tilewidth;
        this.map.orientation = "orthogonal";
        this.map.layers[0].x = this.map.layers[0].y = this.map.layers[1].x = this.map.layers[1].y = 0;
        this.map.layers[0].opacity = this.map.layers[1].opacity = 1;
        this.map.layers[0].visible = this.map.layers[1].visible = true;
        this.map.layers[0].type = this.map.layers[1].type = "tilelayer";
        this.map.layers[0].name = "Floor";
        this.map.layers[1].name = "Wall";
        this.map.layers[0].properties = [{
            name: "Collidable",
            type: "bool",
            value: false
        }]
        this.map.layers[1].properties = [{
            name: "Collidable",
            type: "bool",
            value: true
        }]
        this.map.tilesets = [{
            columns: this.template.columns,
            tilewidth: this.template.tilewidth,
            tileheight: this.template.tileheight,
            tilecount: this.template.tilecount,
            firstgid: this.template.firstgid,
            imageheight: this.template.imageheight,
            imagewidth: this.template.imagewidth,
            margin: this.template.margin,
            spacing: this.template.spacing,
            name: this.template.name,
            image: this.template.image
        }]

        this.map.layers[0].data = new Array(width * height).fill(this.template.background);
        this.map.layers[1].data = new Array(width * height);

        for (let room of this.rooms) {
            let roomWidth = room.bottomRight.x - room.topLeft.x + 1;
            let roomHeight = room.bottomRight.y - room.topLeft.y + 1;
            room.topLeft.x -= this.minX;
            room.topLeft.y -= this.minY;
            for (let i = 0; i < roomHeight; i++)
                for (let j = 0; j < roomWidth; j++) {
                    this.map.layers[0].data[(room.topLeft.y + i) * width + room.topLeft.x + j] = room.bottomLayer[i * roomWidth + j];
                    this.map.layers[1].data[(room.topLeft.y + i) * width + room.topLeft.x + j] = room.topLayer[i * roomWidth + j];
                }
            if (room.enemies)
                for (let enemy of room.enemies) {
                    enemy.position.x += room.topLeft.x;
                    enemy.position.y += room.topLeft.y;
                    this.enemies.push(enemy);
                }
        }
    }

    private isValidRoom(topLeft: Vec2, bottomRight: Vec2): boolean {
        for (let room of this.rooms) {
            if (room.topLeft.x <= bottomRight.x &&
                room.bottomRight.x >= topLeft.x &&
                room.topLeft.y <= bottomRight.y &&
                room.bottomRight.y >= topLeft.y) {
                console.warn("Found an invalid room! TopLeft:", topLeft.toString(), "BottomRight:", bottomRight.toString());
                return false;
            }
        }
        return true;
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

    private getOppositeFacing(facing: Facing): Facing {
        switch (facing) {
            case Facing.LEFT:
                return Facing.RIGHT;
            case Facing.RIGHT:
                return Facing.LEFT;
            case Facing.UP:
                return Facing.DOWN;
            case Facing.DOWN:
                return Facing.UP;
        }
    }

    private getRandomRoom(facing: Facing): RoomTemplate {
        let array = this.getRoomArray(facing), weight = this.getRoomWeight(facing);
        let value = this.gen(weight);

        if (value >= weight)
            throw new Error("Random number " + value + " is larger than total weight " + weight);

        for (let room of array) {
            if (value < room.weight)
                return room;
            value -= room.weight;
        }
        throw new Error("Cannot find Room! \nValue: " + value + "\nRooms: " + JSON.stringify(array));
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
        room.enemies = new Array();
        if (old.sprites) {
            for (let sprite of old.sprites) {
                if (sprite.type === 'player') {
                    this.player.x = sprite.x + posX;
                    this.player.y = sprite.y + posY;
                }
                else {
                    if (this.gen.random() <= sprite.possibility) {
                        let tmp = new Enemy();
                        tmp.type = sprite.type;
                        tmp.position = new Vec2(sprite.x, sprite.y);
                        room.enemies.push(tmp);
                    }
                }
            }
        }
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
    enemies: Array<Enemy>
}

export class Enemy {
    type: String;
    position: Vec2;
}

enum Facing {
    LEFT = "left",
    RIGHT = "right",
    UP = "up",
    DOWN = "down"
}