import { _decorator, Component, Node, Vec3 } from 'cc';
import { GameGlobal } from '../GameGlobal';
const { ccclass, property } = _decorator;

@ccclass('Tractor')
export class Tractor extends Component {
    @property(Node)
    cargoBed: Node = null;
    @property([Node])
    cargoBeds: Node[] = [];
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
    LevelUpCargoBed(lv: number) {
        lv = lv - 1;
        this.cargoBeds.forEach((bed, index) => {
            bed.active = index == lv;
            if (bed.active) {
                this.cargoBed.worldPosition = bed.getChildByName("CargoBed").getChildByName("CargoArea").worldPosition;
            }
        });
    }
}


