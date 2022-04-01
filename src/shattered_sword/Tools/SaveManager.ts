import Save from "./DataTypes/Save";
import LocalStorageDB from "./LocalStorageDB";

export default class SaveManager {
    private static save: Save;
    private db: LocalStorageDB;

    constructor() {
        this.db = new LocalStorageDB("save");
        this.loadSave();

        if (!SaveManager.save)
            this.initSave();
    }

    getLevel(): number {
        return SaveManager.save.level;
    }

    setLevel(level: number): void {
        SaveManager.save.level = level;
        this.saveSave();
    }

    getName(): string {
        return SaveManager.save.name;
    }

    setName(name: string): void {
        SaveManager.save.name = name;
        this.saveSave();
    }

    // TODOs
    // add more functions if needed


    resetSave(callback?: Function): void {
        this.initSave();
        callback(SaveManager.save);
    }

    private loadSave(): void {
        SaveManager.save = <Save>this.db.loadJSON();
    }

    private saveSave(): void {
        this.db.saveJSON(SaveManager.save);
    }

    private initSave(): void {
        this.db.readJSON("shattered_sword_assets/jsons/samplesave.json", (save: object) => {
            if (!save)
                throw new Error("Fail to load save file");
            SaveManager.save = <Save>save;
            console.log("Initializing Local Storage(save): ", SaveManager.save);
            this.saveSave();
        });
    }
}