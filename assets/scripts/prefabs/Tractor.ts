import { _decorator, Component, Node, Vec3 } from 'cc';
import { GameGlobal } from '../GameGlobal';
const { ccclass, property } = _decorator;

@ccclass('Tractor')
export class Tractor extends Component {
    @property(Node)
    cargoBed: Node = null!;
    start() {
        GameGlobal.cargoBed = this.cargoBed;
        GameGlobal.Tractor = this.node;
        GameGlobal.TractorScript = this;
    }

    update(deltaTime: number) {

    }
    arrangeCoin(coin: Node) {
        coin.position = new Vec3(1, 1, 1);
        coin.eulerAngles = Vec3.ZERO;
    }
}


