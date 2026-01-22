import { _decorator, Component, Node, Vec3 } from 'cc';
import { GameGlobal } from '../GameGlobal';
import { Utils } from '../Utils/Utils';
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
    cargoBedX = 5;
    cargoBedZ = 3.5;
    coinSizeX = 2;
    coinSizeY = 2;
    coinSizeZ = 2;
    blades: Node[] = [];
    start() {
        GameGlobal.cargoBed = this.cargoBed;
        GameGlobal.Tractor = this.node;
        GameGlobal.TractorScript = this;
    }

    update(deltaTime: number) {
        this.blades.forEach(blade => {
            blade.eulerAngles = new Vec3(blade.eulerAngles.x, blade.eulerAngles.y + 2, blade.eulerAngles.z);
        });
    }
    arrangeCoin(coin: Node) {
        this.coinsInCargoBed.push(coin);
        this.loadCoin(coin);

        // coin.eulerAngles = new Vec3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        coin.eulerAngles = new Vec3();
        Utils.jellyEffect(coin, 1)
    }
    loadCoin(coin: Node) {
        coin.position = this.whereToPutNextCoin;
        this.whereToPutNextCoin.x += this.coinSizeX;
        if (this.whereToPutNextCoin.x > this.cargoBedX) {
            this.whereToPutNextCoin.x = -this.cargoBedX;
            this.whereToPutNextCoin.z += this.coinSizeZ;
            if (this.whereToPutNextCoin.z > this.cargoBedZ) {
                this.whereToPutNextCoin.z = -this.cargoBedZ;
                this.whereToPutNextCoin.y += this.coinSizeY;
            }
        }
    }
    reArrangeAllCoins() {
        this.coinsInCargoBed.forEach(coin => {
            this.loadCoin(coin);
            // coin.eulerAngles = new Vec3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        });
    }
    levelUpSawBlade(lv: number) {
        lv = lv - 1;
        this.sawBladeLevel = lv;
        this.sawBlades.forEach((blade, index) => {

            blade.active = index == lv;
            if (blade.active) {
                this.blades = blade.children.filter(n => n.name == 'SawBlade');
            }
        });
    }
    LevelUpCargoBed(lv: number) {
        lv = lv - 1;
        this.cargoBedLevel = lv;
        this.cargoBeds.forEach((bed, index) => {
            bed.active = index == lv;
            if (bed.active) {
                this.whereToPutNextCoin = GameGlobal.FirstCoinPosInCargo[lv + 1]
                this.cargoBedX = -this.whereToPutNextCoin.x
                this.cargoBedZ = -this.whereToPutNextCoin.z
                this.coinSizeX = GameGlobal.CoinSize[lv + 1][0];
                this.coinSizeY = GameGlobal.CoinSize[lv + 1][1];
                this.coinSizeZ = GameGlobal.CoinSize[lv + 1][2];
                this.reArrangeAllCoins()
                this.cargoBed.worldPosition = bed.getChildByName("CargoBed").getChildByName("CargoArea").worldPosition;
            }
        });
    }
}


