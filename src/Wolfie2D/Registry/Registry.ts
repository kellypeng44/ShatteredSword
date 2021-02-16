import ShaderRegistry from "./Registries/ShaderRegistry";

/**
 * The Registry is the system's way of converting classes and types into string
 * representations for use elsewhere in the application.
 * It allows classes to be accessed without explicitly using constructors in code,
 * and for resources to be loaded at Game creation time.
 */
export default class Registry {

	public static shaders = new ShaderRegistry();

	static preload(){
		this.shaders.preload();
	}
}