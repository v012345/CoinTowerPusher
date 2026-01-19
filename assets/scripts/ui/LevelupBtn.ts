import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelupBtn')
export class LevelupBtn extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
    showMaxLevel() {
        this.node.getChildByName("max").active = true;
        this.node.getChildByName("coin").active = false;
        this.node.getChildByName("cost").active = false;
    }
}


