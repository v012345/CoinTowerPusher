import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GuideManager')
export class GuideManager extends Component {

    @property(Node)
    tipNode: Node;
    @property(Node)
    handNode: Node;
    start() {

    }

    update(deltaTime: number) {

    }
}


