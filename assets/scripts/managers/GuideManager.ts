import { _decorator, Component, Node } from 'cc';
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
    }

    hasLearnedMove() {
        this.tipNode.destroy();
        this.handNode.active = false;
        GameEvent.off('TractorMove', this.hasLearnedMove, this);
    }

    update(deltaTime: number) {

    }
}


