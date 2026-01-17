import { _decorator, Component, Node } from 'cc';
import { Actor } from './Actor';
const { ccclass, property } = _decorator;

@ccclass('TractorGearsCollider')
export class TractorGearsCollider extends Component {
    @property(Node)
    Pusher: Node;
    start() {

    }

    update(deltaTime: number) {

    }
    getPusherScript(): Actor {
        return this.Pusher.getComponent('Actor');
    }
}


