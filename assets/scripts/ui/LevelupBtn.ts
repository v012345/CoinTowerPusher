import { _decorator, Component, Node } from 'cc';
import { AudioManager } from '../PASDK/AudioManager';
import { Player } from '../Player';
import { GameGlobal } from '../GameGlobal';
import { Tractor } from '../prefabs/Tractor';
import { GameEvent } from '../managers/EventManager';
const { ccclass, property } = _decorator;

@ccclass('LevelupBtn')
export class LevelupBtn extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
    showMaxLevel() {
        this.node.getChildByName("max").active = true;
        this.node.getChildByName("coin").active = false;
        this.node.getChildByName("cost").active = false;
    }
    clicked() {
        console.log(Player.getMoney());
        // // GameGlobal.mainGame.uiLay.getComponentInChildren('LevelupUI').show();
        // if (this.node.getChildByName("max").active) {
        //     AudioManager.audioPlay("Reject", false);
        // } else {
        //     AudioManager.audioPlay("Click", false);
        // }
    }
    cargoBedUpgrade() {
        let nextLv = GameGlobal.actor.cargoBedLevel + 1;
        let TractorScript = GameGlobal.actor.tractorNode.getComponent(Tractor);
        if (nextLv <= TractorScript.cargoBeds.length) {
            if (GameGlobal.actor.CoinNum >= GameGlobal.CargoBedUp[nextLv][0]) {
                GameEvent.emit("CargoBedUpgrade");
                AudioManager.audioPlay("Click", false);
                return
            }
        }
        AudioManager.audioPlay("Reject", false);
    }
    sawBladeUpgrade() {
        let nextLv = GameGlobal.actor.gearsLevel + 1;
        let TractorScript = GameGlobal.actor.tractorNode.getComponent(Tractor);
        if (nextLv <= TractorScript.sawBlades.length) {
            if (GameGlobal.actor.CoinNum >= GameGlobal.GearsUp[nextLv]) {
                GameEvent.emit("SawBladeUpgrade");
                AudioManager.audioPlay("Click", false);
                return
            }
        }
        AudioManager.audioPlay("Reject", false);
    }
    speedUpgrade() {
        let nextLv = GameGlobal.actor.speedLevel + 1;
        if (GameGlobal.SpeedUp[nextLv]) {
            if (GameGlobal.actor.CoinNum >= GameGlobal.SpeedUp[nextLv][0]) {
                GameEvent.emit("SpeedUpgrade");
                AudioManager.audioPlay("Click", false);
                return
            }
        }
        AudioManager.audioPlay("Reject", false);
    }
}


