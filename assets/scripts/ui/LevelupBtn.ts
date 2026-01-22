import { _decorator, Component, Node } from 'cc';
import { AudioManager } from '../PASDK/AudioManager';
import { Player } from '../Player';
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
}


