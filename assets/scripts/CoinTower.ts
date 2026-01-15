import { _decorator, Component, Node, MeshRenderer } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CoinTower')
export class CoinTower extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
    getRadius(): number {
        // const trigger = this.node.getChildByName("TriggerArea");
        // const mr  = trigger.getComponent(MeshRenderer);
        // const size = mr.mesh.getBoundingBox().getSize();
        // return size.x;
        return 5;
    }
}


