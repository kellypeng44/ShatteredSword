import AABB from "../AABB";
import Vec2 from "../Vec2";

export interface Unique {
    getId: () => number;
}

export interface Positioned {
    /**
     * Returns the center of this object
     */
    getPosition: () => Vec2;
}

export interface Region {
    /**
     * Returns the size of this object
     */
    getSize: () => Vec2;

    /**
     * Returns the scale of this object
     */
    getScale: () => Vec2;

    /**
     * Returns the bounding box of this object
     */
    getBoundary: () => AABB;
}

export interface Updateable {
    /**
     * Updates this object
     */
    update: (deltaT: number) => void;
}

export interface Renderable {
    /**
     * Renders this object
     */
    render: (ctx: CanvasRenderingContext2D) => void;
}
