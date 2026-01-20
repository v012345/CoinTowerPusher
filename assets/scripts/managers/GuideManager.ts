import { _decorator, Component, Node } from 'cc';
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

    }

    update(deltaTime: number) {

    }
}


