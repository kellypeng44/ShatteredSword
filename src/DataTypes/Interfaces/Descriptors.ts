import GameEvent from "../../Events/GameEvent";
import Map from "../Map";
import AABB from "../Shapes/AABB";
import Shape from "../Shapes/Shape";
import Vec2 from "../Vec2";
import NavigationPath from "../../Pathfinding/NavigationPath";
import GameNode from "../../Nodes/GameNode";

export interface Unique {
    /** The unique id of this object. */
    id: number;
}

export interface Positioned {
    /** The center of this object. */
    position: Vec2;
}

export interface Region {
    /** The size of this object. */
    size: Vec2;

    /** The scale of this object. */
    scale: Vec2;

    /** The bounding box of this object. */
    boundary: AABB;
}

export function isRegion(arg: any): boolean {
    return arg && arg.size && arg.scale && arg.boundary;
}

/**
 * Describes an object that can opt into physics.
 */
export interface Physical {
    /** A flag for whether or not this object has initialized game physics. */
    hasPhysics: boolean;

    /** Represents whether the object is moving or not. */
    moving: boolean;

    /** Represents whether the object is on the ground or not. */
    onGround: boolean;

    /** Reprsents whether the object is on the wall or not. */
    onWall: boolean;

    /** Reprsents whether the object is on the ceiling or not. */
    onCeiling: boolean;

    /** Represnts whether this object has active physics or not. */
    active: boolean;

    /** The shape of the collider for this physics object. */
    collisionShape: Shape;

    /** Represents whether this object can move or not. */
    isStatic: boolean;

    /** Represents whether this object is collidable (solid) or not. */
    isCollidable: boolean;

    /** Represnts whether this object is a trigger or not. */
    isTrigger: boolean;

    /** The physics group of this object. Used for triggers and for selective collisions. */
    group: string;

    /** Associates different groups with trigger events. */
    triggers: Map<string>;

    /** A vector that allows velocity to be passed to the physics engine */
    _velocity: Vec2;

    /** The rectangle swept by the movement of this object, if dynamic */
    sweptRect: AABB;

    isPlayer: boolean;

    /*---------- FUNCTIONS ----------*/

    /**
     * Tells the physics engine to handle a move by this object.
     * @param velocity The velocity with which to move the object.
     */
    move: (velocity: Vec2) => void;

    /**
     * The move actually done by the physics engine after collision checks are done.
     * @param velocity The velocity with which the object will move.
     */
    finishMove: () => void;
    
    /**
     * Adds physics to this object
     * @param collisionShape The shape of this collider for this object
     * @param isCollidable Whether this object will be able to collide with other objects
     * @param isStatic Whether this object will be static or not
     */
    addPhysics: (collisionShape?: Shape, isCollidable?: boolean, isStatic?: boolean) => void;

    /**
     * Adds a trigger to this object for a specific group
     * @param group The name of the group that activates the trigger
     * @param eventType The name of the event to send when this trigger is activated
     */
    addTrigger: (group: string, eventType: string) => void;
}

/**
 * Defines a controller for a bot or a human. Must be able to update
 */
export interface AI extends Updateable {
    /** Initializes the AI with the actor and any additional config */
    initializeAI: (owner: GameNode, options: Record<string, any>) => void;
}

export interface Actor {
    /** The AI of the actor */
    ai: AI;

    /** The activity status of the actor */
    aiActive: boolean;

    /** The id of the actor according to the AIManager */
    actorId: number;

    path: NavigationPath;

    pathfinding: boolean;

    addAI: <T extends AI>(ai: string | (new () => T), options: Record<string, any>) => void;

    setAIActive: (active: boolean) => void;
}

export interface Navigable {
    getNavigationPath: (fromPosition: Vec2, toPosition: Vec2) => NavigationPath;
}

export interface Updateable {
    /** Updates this object. */
    update: (deltaT: number) => void;
}

export interface Renderable {
    /** Renders this object. */
    render: (ctx: CanvasRenderingContext2D) => void;
}

export interface Debug_Renderable {
    /** Renders the debugging infor for this object. */
    debug_render: (ctx: CanvasRenderingContext2D, origin: Vec2, zoom: number) => void;
}
