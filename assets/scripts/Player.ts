import { GameGlobal } from "./GameGlobal";

export class Player {
    private static _instance: Player;

    private money = 0;

    static getMoney() {
        // return this.I.money;
        return GameGlobal.actor.CoinNum;
    }

    static setMoney(v: number) {
        return this.I.money = v;
    }

    private static get I(): Player {
        if (!this._instance) {
            this._instance = new Player();
        }
        return this._instance;
    }
}