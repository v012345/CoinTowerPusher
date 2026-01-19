import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { CoinTower } from './prefabs/CoinTower';
@ccclass('CoinTowerManager')
export class CoinTowerManager extends Component {
    @property(Node)
    coinTowersNode: Node;
    @property(Node)
    coinDomeNode: Node;
    // @property(CoinTower)
    // CoinTowerRight: CoinTower;
    @property(Prefab)
    coinTowerPrefab: Prefab;
    // @property(Node)
    // Actors: Node;
    // @property
    // CoinTowerNumOfOneSide: number = 20;
    start() {
        this.spawnCoinTowers();
    }

    // update(deltaTime: number) {

    // }
    spawnCoinTowers() {
        // 左右两边 x 的坐标
        [12.5, -12.5].forEach(x => {
            for (let i = 0; i < 17; i++) {
                const coinTowernode = instantiate(this.coinTowerPrefab);
                const coinTower = coinTowernode.getComponent(CoinTower);
                coinTower.layerNum = 15 + i
                coinTowernode.setParent(this.coinTowersNode);
                coinTowernode.setPosition(new Vec3(
                    x,
                    0,
                    12.14 * i
                ));
            }
        });


        //     const radius = coinTower.getRadius()
        //     const CTS = [this.CoinTowerLeft, this.CoinTowerRight];
        //     for (let ct of CTS) {
        //         const pos = ct.node.getPosition();
        //         for (let i = 1; i < this.CoinTowerNumOfOneSide; i++) {
        //             const node = instantiate(this.CoinTowerPrefab);
        //             node.setParent(this.Actors);     // 或 scene / Canvas  
        //             node.setPosition(new Vec3(
        //                 pos.x + radius * 2 * i,
        //                 pos.y,
        //                 pos.z
        //             ));
        //         }
        //     }
    }
}



