import AABB from "./AABB";
import Vec2 from "./Vec2";

export default abstract class Shape {
    abstract setCenter(center: Vec2): void;
    abstract getCenter(): Vec2;
    abstract getBoundingRect(): AABB;
}