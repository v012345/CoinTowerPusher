import { _decorator, Component, Node, BoxCollider, ITriggerEvent } from 'cc';
import { GameGlobal } from './GameGlobal';
import { PathLine } from './Utils/PathLine';
import { MoveAlongPath } from './Utils/MoveAlongPath';
const { ccclass, property } = _decorator;

@ccclass('Actor')
export class Actor extends Component {
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
            // console.log('A 与 B 发生触发');
            this.isBackForward = true;
            this.scheduleOnce(() => {
                this.isBackForward = false;
            }, 0.2);

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
}


