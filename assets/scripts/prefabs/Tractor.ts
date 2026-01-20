import { _decorator, Component, Node, Vec3 } from 'cc';
import { GameGlobal } from '../GameGlobal';
const { ccclass, property } = _decorator;

@ccclass('Tractor')
export class Tractor extends Component {
    @property(Node)
    cargoBed: Node = null;
    @property([Node])
    cargoBeds: Node[] = [];
    @property([Node])
    sawBlades: Node[] = [];
    sawBladeLevel: number = 1;
    cargoBedLevel: number = 1;
    coinsInCargoBed: Node[] = [];
    whereToPutNextCoin: Vec3 = new Vec3(-5, 0.3, -3.5);
    start() {
        GameGlobal.cargoBed = this.cargoBed;
        GameGlobal.Tractor = this.node;
        GameGlobal.TractorScript = this;
    }

    update(deltaTime: number) {

    }
    arrangeCoin(coin: Node) {
        this.coinsInCargoBed.push(coin);

        coin.position = this.whereToPutNextCoin;
        this.whereToPutNextCoin.x += 0.5;
        if (this.whereToPutNextCoin.x > 5) {
            this.whereToPutNextCoin.x = -5;
            this.whereToPutNextCoin.z += 0.5;
            if (this.whereToPutNextCoin.z > 3.5) {
                this.whereToPutNextCoin.z = -3.5;
                this.whereToPutNextCoin.y += 1;
            }
        }
        coin.eulerAngles = new Vec3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
    }
    levelUpSawBlade(lv: number) {
        lv = lv - 1;
        this.sawBladeLevel = lv;
        this.sawBlades.forEach((blade, index) => {
            blade.active = index == lv;
        });
    }
    LevelUpCargoBed(lv: number) {
        lv = lv - 1;
        this.cargoBedLevel = lv;
        this.cargoBeds.forEach((bed, index) => {
            bed.active = index == lv;
            if (bed.active) {
                this.cargoBed.worldPosition = bed.getChildByName("CargoBed").getChildByName("CargoArea").worldPosition;
            }
        });
    }
}


