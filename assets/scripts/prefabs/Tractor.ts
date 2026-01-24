import { _decorator, Component, Node, Vec3, tween, v3, BoxCollider, ITriggerEvent, math, ParticleSystem, randomRange } from 'cc';
import { GameGlobal } from '../GameGlobal';
import { GameEvent } from '../managers/EventManager';
import { EventEnum } from '../Event/EventEnum';
import { AudioManager } from '../PASDK/AudioManager';
import { Utils } from '../Utils';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { Coin2D } from './Coin2D';
import { Player } from '../Player';
import { MoveAlongPath } from '../Utils/MoveAlongPath';
import { PathLine } from '../Utils/PathLine';
import { CoinTower } from './CoinTower';
const { ccclass, property } = _decorator;

@ccclass('Tractor')
export class Tractor extends Component implements IActor {

    @property(ParticleSystem)
    speedupEffect: ParticleSystem;

    @property(PathLine)
    path: PathLine;
    @property(BoxCollider)
    collider: BoxCollider;
    moveAlongPath: MoveAlongPath;
    isOver: boolean = false;
    speed: number = 0;
    isBackForward: boolean = false;
    speedLevel = 1;
    currentSpeed = 1;
    gearsLevel = 1;
    capacity = 0;

    @property(Node)
    cargoBed: Node = null;
    @property([Node])
    cargoBeds: Node[] = [];
    @property([Node])
    sawBlades: Node[] = [];
    @property(Prefab)
    coin2d: Prefab = null;
    @property(Node)
    oneButton: Node = null;
    sawBladeLevel: number = 1;
    cargoBedLevel: number = 1;
    coinsInCargoBed: Node[] = [];
    whereToPutNextCoin: Vec3 = new Vec3(-5, 0.3, -3.5);
    cargoBedX = 5;
    cargoBedZ = 3.5;
    coinSizeX = 2;
    coinSizeY = 2;
    coinSizeZ = 2;
    isUpgrading: boolean = false;
    blades: Node[] = [];
    isUnloading: boolean = false; // 是否正在卸货中
    start() {
        Player.setLeadAcotor(this);

        GameGlobal.Tractor = this;

        this.init();

        GameEvent.on(EventEnum.CollideCoinTower, this.showSparkEffect, this);

        GameEvent.on(EventEnum.CargoBedUpgrade, this.upgradeCargoBed, this);
        GameEvent.on(EventEnum.SawBladeUpgrade, this.upgradeSawBlade, this);
        GameEvent.on(EventEnum.SpeedUpgrade, this.upgradeSpeed, this);

        this.moveAlongPath = this.node.getComponent(MoveAlongPath);
        this.scheduleOnce(() => {
            this.moveAlongPath.pathLine = this.path;
            this.moveAlongPath.startMove();
        })

        this.collider.on('onTriggerEnter', this.collideCoinTower, this);
    }
    collideCoinTower(event: ITriggerEvent) {
        if (event.otherCollider.node.name == "CoinTowerCollider") {
            const coinTower = event.otherCollider.node.getParent().getComponent(CoinTower);
            GameEvent.emit(EventEnum.CollideCoinTower);
            if (coinTower.level > this.gearsLevel) {
                GameEvent.emit(EventEnum.TractorMoveBack);
                GameEvent.emit(EventEnum.SawBladeNeedUpgrade);
                this.isBackForward = true;
                this.scheduleOnce(() => {
                    this.isBackForward = false;
                }, 0.2);
            }

        }
    }
    upgradeCargoBed() { }
    upgradeSawBlade() { }
    upgradeSpeed() { }
    showSparkEffect() {
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
    }
    init() {

        this.sawBlades.forEach((blade, index) => {
            blade.active = (index + 1) == this.sawBladeLevel;
            if (blade.active) {
                this.blades = blade.children.filter(n => n.name == 'SawBlade');
            }
        });

        this.cargoBeds.forEach((cargoBed, index) => {
            cargoBed.active = (index + 1) == this.cargoBedLevel;
            if (cargoBed.active) {
                this.cargoBed.worldPosition = cargoBed.getChildByName("CargoBed").getChildByName("CargoArea").worldPosition;
            }
        });
        this.speed = 0;
    }


    update(deltaTime: number) {
        this.blades.forEach(blade => {
            blade.eulerAngles = new Vec3(blade.eulerAngles.x, blade.eulerAngles.y + 2, blade.eulerAngles.z);
        });
        if (this.coinsInCargoBed.length < GameGlobal.CargoBedUp[this.cargoBedLevel][1]) {
            if (!this.isUpgrading && !this.isUnloading) {
                let coin = GameGlobal.CoinsPool.pop();
                if (coin) {
                    Player.addMoney(1);
                    coin.flyTo(this.cargoBed);
                }
            }
        } else {
            GameEvent.emit("CargoBedIsFull");
        }
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
        AudioManager.audioPlay("loadCoin", false);
        coin.position = this.whereToPutNextCoin;
        coin.position.x += this.coinSizeX / 2;
        coin.position.z += this.coinSizeZ / 2;
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
        this.isUpgrading = true;
        this.scheduleOnce(() => {
            this.isUpgrading = false;
        }, 2);
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

    unloadCoins(n: number) {
        this.isUnloading = true;
        // if (!this.coin) return;
        // if (GameGlobal.isRun) {
        //     AudioManager.audioPlay("coin")
        // }
        // const centerPos = this.captureEffectOnGround.position;
        for (let i = 0; i < Math.min(this.coinsInCargoBed.length, n); i++) {
            this.scheduleOnce(() => {
                const coin = this.coinsInCargoBed[i];
                // if (!coin) return;
                // coin.active = true;
                // let tempPos = coin.position.clone();
                // tempPos.add(new Vec3(math.randomRange(-1, 1), math.randomRange(-1, 1), math.randomRange(-1, 1)).multiplyScalar(0.1));
                // coin.position = tempPos;
                const angle = Math.random() * Math.PI * 2;
                const force = (20 + Math.random() * 5) * 0.2;
                const x = Math.cos(angle) * force;
                const z = Math.sin(angle) * force;
                // 使用贝塞尔曲线进行丢出
                const targetPos = coin.position.clone().add(new Vec3(x * 0.5 + 10, 0, z * 0.5));
                this.bezierTweenAnimLocal(coin, targetPos, 2.5, () => {
                    // 物理运动完成后回调
                }, randomRange(2, 4));
                // this.scheduleOnce(() => {
                //     this.goldFly(i, coin, this.oneButton);
                // }, 1.3);
            }, Math.floor(i / 20) * 0.05)
        }
        this.isUnloading = false;
    }
    goldFly(index: number, from: Node, toWhere: Node) {
        let coin = instantiate(this.coin2d);
        coin.getComponent(Coin2D).flyToCoinNode(index, from, toWhere);
    }
    // 贝塞尔曲线动画
    bezierTweenAnimLocal(otherNode: Node, localPosition: Vec3, time = 0.3, callback = () => { }, y: number): Tween {
        // 起始位置
        const startPos = otherNode.position.clone();

        // 创建抛物线的控制点（中间点高一些形成抛物线效果）
        const controlPoint = new Vec3(
            (startPos.x + localPosition.x) * 0.5,  // x轴中点
            Math.max(startPos.y, localPosition.y) + y,  // y轴抬高一些创建抛物线
            (startPos.z + localPosition.z) * 0.5   // z轴中点
        );

        // 创建简单的抛物线动画
        const tTween = tween(otherNode)
            .to(time, { worldPosition: localPosition }, {
                onUpdate: (target, ratio) => {
                    // 使用贝塞尔曲线计算当前位置
                    otherNode.setPosition(Utils.bezierCurve(ratio, startPos, controlPoint, localPosition));
                },
                easing: 'quadOut'  // 使用四次方缓动，模拟重力
            })
            .call(() => {
                // otherNode.eulerAngles = new Vec3(0, 0, 0);
                callback && callback();
            })
            .start();
        return tTween
    }

    move() {
        GameEvent.emit("TractorMove");
        this.speed = GameGlobal.SpeedUp[this.speedLevel][1];
    }
    stop() {
        GameEvent.emit("TractorStop");
        this.speed = 0;
    }
    lateUpdate(deltaTime: number): void {
        if (this.speed != 0) {
            GameEvent.emit("TractorMove");
        }
        if (!this.isBackForward) {
            this.moveAlongPath.setSpeed(this.speed);
        } else {
            this.moveAlongPath.setSpeed(-20);
        }
    }
}


