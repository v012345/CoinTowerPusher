import { Node } from 'cc';
import { GameGlobal } from "./GameGlobal";

export class LeadActor {
    private static _instance: LeadActor;
    static Actor: IActor;


    private static get I(): LeadActor {
        if (!this._instance) {
            this._instance = new LeadActor();
        }
        return this._instance;
    }
    static move(): void {
        LeadActor.Actor.move();
    }
    static stop(): void {
        LeadActor.Actor.stop();
    }
}