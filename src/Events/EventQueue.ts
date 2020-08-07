import Queue from "../DataTypes/Queue";
import Map from "../DataTypes/Map";
import GameEvent from "./GameEvent";
import Receiver from "./Receiver";

export default class EventQueue {
	private static instance: EventQueue = null;
	private readonly MAX_SIZE: number;
	private q: Queue<GameEvent>;
	private receivers: Map<Array<Receiver>>

    private constructor(){
        this.MAX_SIZE = 100;
        this.q = new Queue<GameEvent>(this.MAX_SIZE);
        this.receivers = new Map<Array<Receiver>>();
	}
	
	static getInstance(): EventQueue {
		if(this.instance === null){
			this.instance = new EventQueue();
		}
		
		return this.instance;
	}

    addEvent(event: GameEvent): void {
        this.q.enqueue(event);
    }

    subscribe(receiver: Receiver, type: string | Array<string>): void {
        if(type instanceof Array){
            // If it is an array, subscribe to all event types
            for(let t of type){
                this.addListener(receiver, t);
            }
        } else {
            this.addListener(receiver, type);
        }
	}

	private addListener(receiver: Receiver, type: string): void {
		if(this.receivers.has(type)){
			this.receivers.get(type).push(receiver);
		} else {
			this.receivers.add(type, [receiver]);
		}
	}
	
    update(deltaT: number): void{
        while(this.q.hasItems()){
			let event = this.q.dequeue();
			
            if(this.receivers.has(event.type)){
                for(let receiver of this.receivers.get(event.type)){
                    receiver.receive(event);
                }
			}
			
            if(this.receivers.has("all")){
                for(let receiver of this.receivers.get("all")){
                    receiver.receive(event);
                }
            }
        }
    }
}