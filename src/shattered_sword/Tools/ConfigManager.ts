import Config from "./DataTypes/Config";
import LocalStorageDB from "./LocalStorageDB";

export default class ConfigManager {
    private static config: Config;
    private db: LocalStorageDB;

    constructor() {
        this.db = new LocalStorageDB("config");
        this.loadConfig();

        if (!ConfigManager.config)
            this.initConfig();
    }

    getVolume(): number {
        return ConfigManager.config.volume;
    }

    setVolume(volume: number): void {
        ConfigManager.config.volume = volume;
        this.saveConfig();
    }

    // TODOs
    // add more functions if needed

    resetConfig(callback?: Function): void {
        this.initConfig();
        callback(ConfigManager.config);
    }

    private loadConfig(): void {
        ConfigManager.config = <Config>this.db.loadJSON();
    }

    private saveConfig(): void {
        this.db.saveJSON(ConfigManager.config);
    }

    private initConfig(): void {
        this.db.readJSON("shattered_sword_assets/jsons/sampleconfig.json", (config: object) => {
            if (!config)
                throw new Error("Fail to load config file");
            ConfigManager.config = <Config>config;
            console.log("Initializing Local Storage(config): ", ConfigManager.config);
            this.saveConfig();
        });
    }
}