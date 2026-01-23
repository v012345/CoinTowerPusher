import { _decorator, Component, Node, Vec3, tween, v3, ParticleSystem } from 'cc';
import { GameGlobal } from '../GameGlobal';
import { GameEvent } from '../managers/EventManager';
import { EventEnum } from '../Event/EventEnum';
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

        GameEvent.on(EventEnum.CollideCoinTower, () => {
            this.sawBlades.forEach((blade, index) => {
                if (blade.active) {
                    let effectNodes = blade.children.filter(n => n.name == 'collideEffect');
                    effectNodes.forEach(effectNode => {
                        effectNode.children.forEach(effect => {
                            effect.getComponent(ParticleSystem).play();
                        });
                    });
                }
            });
        }, this);
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
        this.jellyEffect(coin, 1);
    }
    jellyEffect(node: Node, t: number) {
        // let uiOpacity = node.getComponent(UIOpacity);
        // if (!uiOpacity) uiOpacity = node.addComponent(UIOpacity);
        // uiOpacity.opacity = 0;
        node.setScale(Vec3.ZERO);

        tween(node)
            .to(0.15, { scale: v3(1 * t, 1 * t, 1 * t) })
            .to(.06, { scale: v3(1.4 * t, 0.53 * t, 1 * t) })
            .to(.12, { scale: v3(0.8 * t, 1.2 * t, 1 * t) })
            .to(.07, { scale: v3(1.2 * t, 0.7 * t, 1 * t) })
            .to(.07, { scale: v3(.85 * t, 1.1 * t, 1 * t) })
            .to(.07, { scale: v3(1 * t, 1 * t, 1 * t) })
            .start();

        // tween(uiOpacity)
        //     .to(.06, { opacity: 255 })
        //     .start();
    }
    loadCoin(coin: Node) {
        coin.position = this.whereToPutNextCoin;
        console.log(coin.position);
        coin.position.x += this.coinSizeX / 2;
        coin.position.z += this.coinSizeZ / 2;
        console.log(coin.position);
        this.whereToPutNextCoin.x += this.coinSizeX;
        if (this.whereToPutNextCoin.x + this.coinSizeX > this.cargoBedX) {
            this.whereToPutNextCoin.x = -this.cargoBedX;
            this.whereToPutNextCoin.z += this.coinSizeZ;
            if (this.whereToPutNextCoin.z + this.coinSizeZ > this.cargoBedZ) {
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


