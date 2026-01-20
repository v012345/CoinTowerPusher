import { _decorator, Component, Label, Node, BoxCollider, ITriggerEvent } from 'cc';
import { GameGlobal } from './GameGlobal';
import { PathLine } from './Utils/PathLine';
import { MoveAlongPath } from './Utils/MoveAlongPath';
import { CoinTower } from './prefabs/CoinTower';
import { Tractor } from './prefabs/Tractor';
import { LevelupBtn } from './ui/LevelupBtn';
const { ccclass, property } = _decorator;

@ccclass('Actor')
export class Actor extends Component {
    @property(Label)
    coinNumLabel: Label;
    _coinNum: number = 0;
    public set CoinNum(v: number) {
        this._coinNum = v;
        this.coinNumLabel.string = v.toString();
    }

    public get CoinNum(): number {
        return this._coinNum;
    }

    @property(Label)
    cargoBedUpCostLabel: Label;
    @property(Label)
    gearsUpCostLabel: Label;
    @property(Label)
    speedUpCostLabel: Label;
    @property(Node)
    cargoBedUpButton: Node;
    @property(Node)
    sawBaladeUpButton: Node;
    @property(Node)
    speedUpButton: Node;
    @property(Node)
    tractorNode: Node;


    @property(Node)
    normalCameraAnchor: Node;
    @property(PathLine)
    path: PathLine;
    @property(BoxCollider)
    collider: BoxCollider;
    moveAlongPath: MoveAlongPath;
    isOver: boolean = false;
    speed: number = 0;
    isBackForward: boolean = false;
    speedLevel = 0;
    currentSpeed = 0;
    gearsLevel = 0;
    cargoBedLevel = 0;
    capacity = 0

    onLoad() {
        GameGlobal.actor = this;
    }

    start() {
        this.LevelUpCargoBed();
        this.LevelUpGears();
        this.levelUpSpeed();
        this.moveAlongPath = this.node.getComponent(MoveAlongPath);
        this.scheduleOnce(() => {
            this.moveAlongPath.pathLine = this.path;
            this.moveAlongPath.startMove();
        })

        this.collider.on('onTriggerEnter', (event: ITriggerEvent) => {
            if (event.otherCollider.node.name == "CoinTowerCollider") {
                const coinTower = event.otherCollider.node.getParent().getComponent(CoinTower);
                if (coinTower.level > this.gearsLevel) {
                    this.isBackForward = true;
                    this.scheduleOnce(() => {
                        this.isBackForward = false;
                    }, 0.2);
                }

            }
        }, this);
    }

    move() {
        this.speed = this.currentSpeed;
    }
    stop() {
        this.speed = 0;
    }


    update(deltaTime: number) {
        if (!this.isBackForward) {
            this.moveAlongPath.setSpeed(this.speed);
        } else {
            this.moveAlongPath.setSpeed(-20);
        }
        if (this.CoinNum < this.capacity) {
            let recieveNum = Math.min(this.capacity - this.CoinNum, 20);
            for (let i = 0; i < recieveNum; i++) {
                let coin = GameGlobal.CoinsPool.pop();
                if (coin) {
                    this.CoinNum++;
                    coin.flyToCargoBed();
                }
            }
        }
    }
    lateUpdate(deltaTime: number): void {
        GameGlobal.CameraControl.cameraFollow(deltaTime);
    }
    levelUpSpeed() {
        let nextLv = this.speedLevel + 1;
        if (GameGlobal.SpeedUp[nextLv]) {
            if (this.CoinNum >= GameGlobal.SpeedUp[nextLv][0]) {
                this.CoinNum -= GameGlobal.SpeedUp[nextLv][0];
                this.speedLevel += 1;
                this.currentSpeed = GameGlobal.SpeedUp[this.speedLevel][1];
                if (GameGlobal.SpeedUp[this.speedLevel + 1]) {

                    this.speedUpCostLabel.string = GameGlobal.SpeedUp[this.speedLevel + 1][0].toString();
                } else {
                    this.speedUpButton.getComponent(LevelupBtn).showMaxLevel();
                }
            }
        }
    }

    LevelUpGears() {

        let nextLv = this.gearsLevel + 1;
        let TractorScript = this.tractorNode.getComponent(Tractor);
        if (nextLv <= TractorScript.sawBlades.length) {
            if (this.CoinNum >= GameGlobal.GearsUp[nextLv]) {
                this.CoinNum -= GameGlobal.GearsUp[nextLv];
                this.gearsLevel += 1;
                TractorScript.levelUpSawBlade(this.gearsLevel);
                if (GameGlobal.GearsUp[this.gearsLevel + 1]) {
                    this.gearsUpCostLabel.string = GameGlobal.GearsUp[this.gearsLevel + 1].toString();
                } else {
                    this.sawBaladeUpButton.getComponent(LevelupBtn).showMaxLevel();
                }
            }
        }
    }
    LevelUpCargoBed() {
        let nextLv = this.cargoBedLevel + 1;
        let TractorScript = this.tractorNode.getComponent(Tractor);
        if (nextLv <= TractorScript.cargoBeds.length) {
            if (this.CoinNum >= GameGlobal.CargoBedUp[nextLv][0]) {
                this.CoinNum -= GameGlobal.CargoBedUp[nextLv][0];
                this.capacity = GameGlobal.CargoBedUp[nextLv][1];
                this.cargoBedLevel += 1;
                this.tractorNode.getComponent(Tractor).LevelUpCargoBed(this.cargoBedLevel);
                if (GameGlobal.CargoBedUp[this.cargoBedLevel + 1]) {
                    this.cargoBedUpCostLabel.string = GameGlobal.CargoBedUp[this.cargoBedLevel + 1][0].toString();
                } else {
                    this.cargoBedUpButton.getComponent(LevelupBtn).showMaxLevel();
                }
            }
        }
    }
}


