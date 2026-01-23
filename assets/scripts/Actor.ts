import { _decorator, Component, Label, Node, BoxCollider, ITriggerEvent, ParticleSystem } from 'cc';
import { GameGlobal } from './GameGlobal';
import { PathLine } from './Utils/PathLine';
import { MoveAlongPath } from './Utils/MoveAlongPath';
import { CoinTower } from './prefabs/CoinTower';
import { Tractor } from './prefabs/Tractor';
import { LevelupBtn } from './ui/LevelupBtn';
import { GameEvent } from './managers/EventManager';
import { Player } from './Player';
import { EventEnum } from './Event/EventEnum';
const { ccclass, property } = _decorator;


@ccclass('Actor')
export class Actor extends Component implements IActor {
    @property(ParticleSystem)
    speedupEffect: ParticleSystem;
    @property(Node)
    tractorNode: Node;
    @property(PathLine)
    path: PathLine;
    @property(BoxCollider)
    collider: BoxCollider;
    moveAlongPath: MoveAlongPath;
    isOver: boolean = false;
    speed: number = 0;
    isBackForward: boolean = false;
    speedLevel = 1;
    currentSpeed = 0;
    gearsLevel = 1;
    cargoBedLevel = 1;
    capacity = 0;

    onLoad() {
        GameGlobal.actor = this;
        Player.setLeadAcotor(this);
    }

    start() {
        let TractorScript = this.tractorNode.getComponent(Tractor);
        this.currentSpeed = GameGlobal.SpeedUp[this.speedLevel][1];
        TractorScript.levelUpSawBlade(this.gearsLevel);
        this.capacity = GameGlobal.CargoBedUp[this.cargoBedLevel][1];
        this.tractorNode.getComponent(Tractor).LevelUpCargoBed(this.cargoBedLevel);

        GameEvent.on("CargoBedUpgrade", this.LevelUpCargoBed, this);
        GameEvent.on("SawBladeUpgrade", this.LevelUpGears, this);
        GameEvent.on("SpeedUpgrade", this.levelUpSpeed, this);
        this.moveAlongPath = this.node.getComponent(MoveAlongPath);
        this.scheduleOnce(() => {
            this.moveAlongPath.pathLine = this.path;
            this.moveAlongPath.startMove();
        })

        this.collider.on('onTriggerEnter', (event: ITriggerEvent) => {
            if (event.otherCollider.node.name == "CoinTowerCollider") {
                const coinTower = event.otherCollider.node.getParent().getComponent(CoinTower);
                GameEvent.emit(EventEnum.CollideCoinTower);
                if (coinTower.level > this.gearsLevel) {
                    GameEvent.emit(EventEnum.TractorMoveBack);
                    this.isBackForward = true;
                    this.scheduleOnce(() => {
                        this.isBackForward = false;
                    }, 0.2);
                }

            }
        }, this);
    }

    move() {
        GameEvent.emit("TractorMove");
        this.speed = this.currentSpeed;
    }
    stop() {
        GameEvent.emit("TractorStop");
        this.speed = 0;
    }


    update(deltaTime: number) {
        if (!this.isBackForward) {
            this.moveAlongPath.setSpeed(this.speed);
        } else {
            this.moveAlongPath.setSpeed(-20);
        }
        if (Player.getMoney() < this.capacity) {
            let recieveNum = Math.min(this.capacity - Player.getMoney(), 20);
            for (let i = 0; i < recieveNum; i++) {
                let coin = GameGlobal.CoinsPool.pop();
                if (coin) {
                    Player.addMoney(1);
                    coin.flyToCargoBed();
                }
            }
        } else {
            GameEvent.emit("CargoBedIsFull");
        }
    }
    lateUpdate(deltaTime: number): void {

    }
    levelUpSpeed() {
        this.speedLevel++;
        this.currentSpeed = GameGlobal.SpeedUp[this.speedLevel][1];
        this.speedupEffect.play();
    }

    LevelUpGears() {
        this.gearsLevel++;
        let TractorScript = this.tractorNode.getComponent(Tractor);
        TractorScript.levelUpSawBlade(this.gearsLevel);
    }
    LevelUpCargoBed() {
        this.cargoBedLevel++;
        this.capacity = GameGlobal.CargoBedUp[this.cargoBedLevel][1];
        this.tractorNode.getComponent(Tractor).LevelUpCargoBed(this.cargoBedLevel);

    }
}


