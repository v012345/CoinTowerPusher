import { _decorator, Component, Node } from 'cc';
import { GameGlobal } from './GameGlobal';
const { ccclass, property } = _decorator;

@ccclass('Actor')
export class Actor extends Component {
    onLoad() {
        GameGlobal.actor = this;
    }
    
    start() {

    }

    update(deltaTime: number) {

    }
    lateUpdate(deltaTime: number): void {
        GameGlobal.CameraControl.cameraFollow(deltaTime);
    }
}


