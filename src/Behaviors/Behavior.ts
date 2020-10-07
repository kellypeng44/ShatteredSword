import Emitter from "../Events/Emitter";
import Receiver from "../Events/Receiver";

export default abstract class Behavior {
    protected receiver: Receiver;
    protected emitter: Emitter;

    constructor(){
        this.receiver = new Receiver();
        this.emitter = new Emitter();
    }

    abstract doBehavior(deltaT: number): void;
}