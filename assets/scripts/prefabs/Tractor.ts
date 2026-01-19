import { _decorator, Component, Node } from 'cc';
import { GameGlobal } from '../GameGlobal';
const { ccclass, property } = _decorator;

@ccclass('Tractor')
export class Tractor extends Component {
    @property(Node)
    cargoBed: Node = null!;
    start() {
        GameGlobal.cargoBed = this.cargoBed;
    }

    update(deltaTime: number) {

    }
}


