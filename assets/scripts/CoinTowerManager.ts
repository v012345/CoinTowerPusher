import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { CoinTower } from './CoinTower';
@ccclass('CoinTowerManager')
export class CoinTowerManager extends Component {
    // @property(CoinTower)
    // CoinTowerLeft: CoinTower;
    // @property(CoinTower)
    // CoinTowerRight: CoinTower;
    // @property(Prefab)
    // CoinTowerPrefab: Prefab;
    // @property(Node)
    // Actors: Node;
    // @property
    // CoinTowerNumOfOneSide: number = 20;
    // start() {
    //     this.spawnCoinTowers();
    // }

    // update(deltaTime: number) {

    // }
    // spawnCoinTowers() {
    //     const node = instantiate(this.CoinTowerPrefab);
    //     const coinTower = node.getComponent(CoinTower);
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
    // }
}



