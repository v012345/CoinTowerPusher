import { Node } from 'cc';
import { GameGlobal } from "./GameGlobal";

export class LeadActor {
    private static _instance: LeadActor;
    static ActorNode: Node;


    private static get I(): LeadActor {
        if (!this._instance) {
            this._instance = new LeadActor();
        }
        return this._instance;
    }
}