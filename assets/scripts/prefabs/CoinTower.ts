import { _decorator, Component, instantiate, Node, ITriggerEvent, MeshRenderer, Prefab, Collider, Vec3 } from 'cc';
import { OneLayerOfCoins } from './OneLayerOfCoins';
const { ccclass, property } = _decorator;

@ccclass('CoinTower')
export class CoinTower extends Component {
    @property
    layerNum: number = 15;
    @property
    level: number = 1;
    @property(Prefab)
    oneLayerOfCoins: Prefab;
    start() {
        this.buildTower(this.layerNum);
        const col = this.node.getChildByName("Collider").getComponent(Collider);

        col.on('onTriggerEnter', (event: ITriggerEvent) => {
            console.log('A 与 B 发生触发');
        }, this);
    }

    update(deltaTime: number) {

    }
    buildTower(layerNum: number) {
        // 至少15层
        for (let i = 0; i < layerNum - 15; i++) {
            const coins = instantiate(this.oneLayerOfCoins);
            coins.setParent(this.node);
            coins.setPosition(new Vec3(0, 8.66 + 0.66 * i + 0.66, 0));
            if (i % 2 == 0) {
                coins.setRotationFromEuler(0, 30, 0);
            }
        }

    }


    getRadius(): number {
        // const trigger = this.node.getChildByName("TriggerArea");
        // const mr  = trigger.getComponent(MeshRenderer);
        // const size = mr.mesh.getBoundingBox().getSize();
        // return size.x;
        return 5;
    }
}


