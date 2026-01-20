import { _decorator, Component, Node, Button } from 'cc';
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
    start() {
        GameEvent.on('TractorMove', this.hasLearnedMove, this);
        // GameEvent.on('TractorMoveBack', this.toLearnSawBladeUp, this);
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


