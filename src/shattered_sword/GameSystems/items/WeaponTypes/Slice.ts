import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import WeaponType from "./WeaponType";

export default class Slice extends WeaponType {

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
    }

    doAnimation(attacker: GameNode, direction: Vec2, sliceSprite: AnimatedSprite): void {
        // Rotate this with the game node
        // TODO - need to rotate the anim properly
        sliceSprite.rotation = attacker.rotation;
        sliceSprite.rotation = (<Sprite>attacker).invertX? .5* Math.PI : 1.5 * Math.PI;
        // Move the slice out from the player
        //scale = num of pixels between center of sprite and atk anim
        sliceSprite.position = attacker.position.clone().add(direction.scaled(65)); 
        
        sliceSprite.scaleX = 4;
        sliceSprite.scaleY = 4;
        // Play the slice animation w/o loop, but queue the normal animation
        sliceSprite.animation.play("SLICE");
        sliceSprite.animation.queue("NORMAL", true);
    }

    createRequiredAssets(scene: Scene): [AnimatedSprite] {
        let slice = scene.add.animatedSprite("slice", "primary");
        slice.animation.play("NORMAL", true);

        return [slice];
    }

    hits(node: GameNode, sliceSprite: AnimatedSprite): boolean {
        return sliceSprite.boundary.overlaps(node.collisionShape);
    }

    clone(): WeaponType {
        let newType = new Slice();
        newType.initialize({damage: this.damage, cooldown: this.cooldown, displayName: this.displayName, spriteKey: this.spriteKey, useVolume: this.useVolume});
        return newType;
    }
}