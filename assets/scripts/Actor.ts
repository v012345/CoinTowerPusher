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

    update(deltaTime: number) {
        this.moveAlongPath.setSpeed(10);
    }
    lateUpdate(deltaTime: number): void {
        GameGlobal.CameraControl.cameraFollow(deltaTime);
    }
}


