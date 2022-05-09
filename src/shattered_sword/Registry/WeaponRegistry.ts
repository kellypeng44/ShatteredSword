import Registry from "../../Wolfie2D/Registry/Registries/Registry";
import ResourceManager from "../../Wolfie2D/ResourceManager/ResourceManager";

import WeaponType from "../GameSystems/items/WeaponTypes/WeaponType";
import Slice from "../GameSystems/items/WeaponTypes/Slice";
import SemiAutoGun from "../GameSystems/items/WeaponTypes/SemiAutoGun";
import laserGun from "../GameSystems/items/WeaponTypes/LaserGun";
export default class WeaponTemplateRegistry extends Registry<WeaponConstructor> {
    
    public preload(): void {
        const rm = ResourceManager.getInstance();

        //TODO - 
        // Load sprites for each weapon 
        //rm.image("something", "shattered_sword_assets/sprites/something.png");
        rm.image("knife", "shattered_sword_assets/sprites/knife.png");
        rm.image("pistol", "shattered_sword_assets/sprites/pistol.png");
        rm.image("laserGun", "shattered_sword_assets/sprites/laserGun.png");

        // Load spritesheets
        //rm.spritesheet("weapon anim", "shattered_sword_assets/spritesheets/weapon anim.json");
        rm.spritesheet("slice", "shattered_sword_assets/spritesheets/slice.json");

        // Register default types
        //this.registerItem("itemtype", itemTypefile);
        this.registerItem("slice", Slice);
        this.registerItem("semiAutoGun", SemiAutoGun);
        this.registerItem("laserGun",laserGun);
        
    }

    
    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, constr: WeaponConstructor): void {
        this.add(key, constr);
    }
}

type WeaponConstructor = new (...args: any) => WeaponType;