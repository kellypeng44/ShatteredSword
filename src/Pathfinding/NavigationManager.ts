import { Navigable } from "../DataTypes/Interfaces/Descriptors"
import Map from "../DataTypes/Map";
import Vec2 from "../DataTypes/Vec2";
import NavigationPath from "./NavigationPath";

export default class NavigationManager {

	protected navigableEntities: Map<Navigable>;

	constructor(){
		this.navigableEntities = new Map();
	}

	addNavigableEntity(navName: string, nav: Navigable){
		this.navigableEntities.add(navName, nav);
	}

	getPath(navName: string, fromPosition: Vec2, toPosition: Vec2): NavigationPath {
		let nav = this.navigableEntities.get(navName);
		return nav.getNavigationPath(fromPosition.clone(), toPosition.clone());
	}
}