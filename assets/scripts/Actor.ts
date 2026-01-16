import { _decorator, Component, Node } from 'cc';
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
    moveAlongPath: MoveAlongPath;
    isOver: boolean = false;
    speed: number = 0;
    onLoad() {
        GameGlobal.actor = this;
    }

    start() {
        this.moveAlongPath = this.node.getComponent(MoveAlongPath);
        this.scheduleOnce(() => {
            this.moveAlongPath.pathLine = this.path;
            this.moveAlongPath.startMove();
        })
    }

    move() {
        this.speed = 10;
    }
    stop() {
        this.speed = 0;
    }


    update(deltaTime: number) {
        this.moveAlongPath.setSpeed(this.speed);
    }
    lateUpdate(deltaTime: number): void {
        GameGlobal.CameraControl.cameraFollow(deltaTime);
    }
}


