import { GameGlobal } from "./GameGlobal";
import { Player } from "./Player";

export class Vendor {
    private static _instance: Vendor;

    getPrice(itemId: number): number {
        return 0;
    }

    private static get I(): Vendor {
        if (!this._instance) {
            this._instance = new Vendor();
        }
        return this._instance;
    }
}