import { GameGlobal } from "./GameGlobal";

export class Vendor {
    private static _instance: Vendor;

    private money = 0;

    static getMoney() {
        // return this.I.money;
        return GameGlobal.actor.CoinNum;
    }

    static setMoney(v: number) {
        return this.I.money = v;
    }
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