import { _decorator, Component, Node } from 'cc';
import { AudioManager } from '../PASDK/AudioManager';
import { Player } from '../Player';
import { GameGlobal } from '../GameGlobal';
import { Tractor } from '../prefabs/Tractor';
import { GameEvent } from '../managers/EventManager';
const { ccclass, property } = _decorator;

@ccclass('LevelupBtn')
export class LevelupBtn extends Component {
    @property(String)
    ReceiveEvent: string = "";
    isShowMax: boolean = false;
    price: number = 0;
    start() {
        GameEvent.on(this.ReceiveEvent, (cost: number) => {
            this.setDisplayPrice(cost);
        })
    }

    setDisplayPrice(cost: number) {
        this.price = cost;
        this.node.getChildByName("cost").getComponent('cc.Label').string = cost.toString();
    }

    update(deltaTime: number) {
        if (this.isShowMax) return;
        let playerMoney = Player.getMoney();
        this.node.getComponent('cc.Sprite').grayscale = playerMoney < this.price;

    }
    showMaxLevel() {
        this.isShowMax = true;
        this.node.getChildByName("max").active = true;
        this.node.getChildByName("coin").active = false;
        this.node.getChildByName("cost").active = false;
    }

    cargoBedUpgrade() {
        let nextLv = GameGlobal.actor.cargoBedLevel + 1;
        let TractorScript = GameGlobal.actor.tractorNode.getComponent(Tractor);
        if (nextLv <= TractorScript.cargoBeds.length) {
            if (Player.getMoney() >= GameGlobal.CargoBedUp[nextLv][0]) {
                GameEvent.emit("CargoBedUpgrade");
                AudioManager.audioPlay("Click", false);
                Player.addMoney(-GameGlobal.CargoBedUp[nextLv][0]);
                if (GameGlobal.CargoBedUp[GameGlobal.actor.cargoBedLevel + 1]) {
                    this.setDisplayPrice(GameGlobal.CargoBedUp[GameGlobal.actor.cargoBedLevel + 1][0]);
                } else { this.showMaxLevel(); }
                return
            }
        } else {
            this.showMaxLevel();
        }
        AudioManager.audioPlay("Reject", false);
    }
    sawBladeUpgrade() {
        let nextLv = GameGlobal.actor.gearsLevel + 1;
        let TractorScript = GameGlobal.actor.tractorNode.getComponent(Tractor);
        if (nextLv <= TractorScript.sawBlades.length) {
            if (Player.getMoney() >= GameGlobal.GearsUp[nextLv]) {
                GameEvent.emit("SawBladeUpgrade");
                AudioManager.audioPlay("Click", false);
                Player.addMoney(-GameGlobal.GearsUp[nextLv]);
                if (GameGlobal.GearsUp[GameGlobal.actor.gearsLevel + 1]) {
                    this.setDisplayPrice(GameGlobal.GearsUp[GameGlobal.actor.gearsLevel + 1]);
                } else { this.showMaxLevel(); }
                return
            }
        } else {
            this.showMaxLevel();
        }
        AudioManager.audioPlay("Reject", false);
    }
    speedUpgrade() {
        let nextLv = GameGlobal.actor.speedLevel + 1;
        if (GameGlobal.SpeedUp[nextLv]) {
            if (Player.getMoney() >= GameGlobal.SpeedUp[nextLv][0]) {
                GameEvent.emit("SpeedUpgrade");
                AudioManager.audioPlay("Click", false);
                Player.addMoney(-GameGlobal.SpeedUp[nextLv][0]);
                if (GameGlobal.SpeedUp[GameGlobal.actor.speedLevel + 1]) {
                    this.setDisplayPrice(GameGlobal.SpeedUp[GameGlobal.actor.speedLevel + 1][0]);
                } else { this.showMaxLevel(); }
                return
            }
        } else {
            this.showMaxLevel();
        }
        AudioManager.audioPlay("Reject", false);
    }
}


