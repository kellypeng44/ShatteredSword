import Scene from "./Scene/Scene";
import { GameEventType } from "./Events/GameEventType"
import Point from "./Nodes/Graphics/Point";
import Rect from "./Nodes/Graphics/Rect";
import Layer from "./Scene/Layer";
import SceneGraphQuadTree from "./SceneGraph/SceneGraphQuadTree"
import Vec2 from "./DataTypes/Vec2";
import InputReceiver from "./Input/InputReceiver";
import Color from "./Utils/Color";
import CanvasNode from "./Nodes/CanvasNode";
import Graphic from "./Nodes/Graphic";
import RandUtils from "./Utils/RandUtils";

export default class QuadTreeScene extends Scene {

    mainLayer: Layer;
    view: Rect;
    points: Array<Point>;

    loadScene(){}

    startScene(){
        // Make the scene graph a quadtree scenegraph
        this.sceneGraph = new SceneGraphQuadTree(this.viewport, this);

        // Make a main layer
        this.mainLayer = this.sceneGraph.addLayer();

        // Generate a bunch of random points
        this.points = [];
        for(let i = 0; i < 1000; i++){
            let pos = new Vec2(500/3*(Math.random() + Math.random() + Math.random()), 500/3*(Math.random() + Math.random() + Math.random()));
            let point = this.add.graphic(Point, this.mainLayer, pos);
            point.setColor(Color.RED);
            this.points.push(point);
        }

        this.view = this.add.graphic(Rect, this.mainLayer, Vec2.ZERO, new Vec2(150, 100));
        this.view.setColor(Color.TRANSPARENT);
        this.view.setBorderColor(Color.ORANGE);
    }

    updateScene(deltaT: number): void {
        this.view.setPosition(InputReceiver.getInstance().getGlobalMousePosition());
        for(let point of this.points){
            point.setColor(Color.RED);
            
            point.position.add(Vec2.UP.rotateCCW(Math.random()*2*Math.PI).add(point.position.vecTo(this.view.position).normalize().scale(0.1)));
        }

        let results = this.sceneGraph.getNodesInRegion(this.view.getBoundary());

        for(let result of results){
            if(result instanceof Point){
                result.setColor(Color.GREEN);
            }
        }

        results = this.sceneGraph.getNodesAt(this.view.position);

        for(let result of results){
            if(result instanceof Point){
                result.setColor(Color.YELLOW);
            }
        }
    }
}