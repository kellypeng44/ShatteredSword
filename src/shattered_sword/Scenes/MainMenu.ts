import Scene from "../../Wolfie2D/Scene/Scene";
import ConfigManager from "../Tools/ConfigManager";
import SaveManager from "../Tools/SaveManager";

export default class MainMenu extends Scene {
    protected config: ConfigManager;
    protected save: SaveManager;
    
    // TODO
    startScene(): void {
        this.config = new ConfigManager();
        this.save = new SaveManager();
    }
    
}