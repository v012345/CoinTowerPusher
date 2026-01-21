import { _decorator, Component, Node, Button, tween, Animation } from 'cc';
import { GameEvent } from './EventManager';
const { ccclass, property } = _decorator;

@ccclass('GuideManager')
export class GuideManager extends Component {

    @property(Node)
    tipNode: Node;
    @property(Node)
    handNode: Node;
    @property(Node)
    speedUpBtn: Node;
    @property(Node)
    sawBladeUpBtn: Node;
    @property(Node)
    cargoBedUpBtn: Node;
    @property(Animation)
    cargoBedIsFull: Animation;
    start() {
        GameEvent.on('TractorMove', this.hasLearnedMove, this);
        GameEvent.on('CargoBedIsFull', this.showCargoBedIsFullTip, this);
        // GameEvent.on('TractorMoveBack', this.toLearnSawBladeUp, this);
    }
    showCargoBedIsFullTip() {
        GameEvent.off("CargoBedIsFull", this.showCargoBedIsFullTip, this);
        this.cargoBedIsFull.play()
        tween(this.node).delay(3).call(() => {
            GameEvent.on('CargoBedIsFull', this.showCargoBedIsFullTip, this);
        }).start();
    }
    toLearnSawBladeUp() {
        let btn = this.cargoBedUpBtn.getComponent(Button);
        btn.interactable = false; // 禁用
        btn = this.speedUpBtn.getComponent(Button);
        btn.interactable = false; // 禁用

    }

    hasLearnedMove() {
        this.tipNode.destroy();
        this.handNode.active = false;
        GameEvent.off('TractorMove', this.hasLearnedMove, this);
    }

    update(deltaTime: number) {

    }
}


