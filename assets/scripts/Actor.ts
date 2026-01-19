import { _decorator, Component, Label, Node, BoxCollider, ITriggerEvent } from 'cc';
import { GameGlobal } from './GameGlobal';
import { PathLine } from './Utils/PathLine';
import { MoveAlongPath } from './Utils/MoveAlongPath';
import { CoinTower } from './prefabs/CoinTower';
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
    normalCameraAnchor: Node;
    @property(PathLine)
    path: PathLine;
    @property(BoxCollider)
    collider: BoxCollider;
    moveAlongPath: MoveAlongPath;
    isOver: boolean = false;
    speed: number = 0;
    isBackForward: boolean = false;
    speedLevel = 1;
    gearsLevel = 1;
    cargoBedLevel = 1;
    onLoad() {
        GameGlobal.actor = this;
    }

    start() {
        this.moveAlongPath = this.node.getComponent(MoveAlongPath);
        this.scheduleOnce(() => {
            this.moveAlongPath.pathLine = this.path;
            this.moveAlongPath.startMove();
        })

        this.collider.on('onTriggerEnter', (event: ITriggerEvent) => {
            if (event.otherCollider.node.name == "CoinTowerCollider") {
                const coinTower = event.otherCollider.node.getParent().getComponent(CoinTower);
                console.log(coinTower.level)
                if (coinTower.level > this.level) {
                    this.isBackForward = true;
                    this.scheduleOnce(() => {
                        this.isBackForward = false;
                    }, 0.2);
                }

            }
        }, this);
    }

    move() {
        this.speed = 10;
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
    }
    lateUpdate(deltaTime: number): void {
        GameGlobal.CameraControl.cameraFollow(deltaTime);
    }
    levelUp() {
        this.gearsLevel += 1;
    }
}


