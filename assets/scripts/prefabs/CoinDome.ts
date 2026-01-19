import { _decorator, Component, Node, Collider, ITriggerEvent } from 'cc';
import { Coin } from './Coin';
const { ccclass, property } = _decorator;

@ccclass('CoinDome')
export class CoinDome extends Component {
    @property(Collider)
    collider: Collider;
    @property(Node)
    coins: Node;
    onload() {

    }
    start() {
        this.coins.children.forEach(coin => {
            coin.addComponent(Coin)
        })
        this.collider.on('onTriggerEnter', (event: ITriggerEvent) => {

            if (event.otherCollider.node.name == "TractorGearsCollider") {
                //     const actor = event.otherCollider.getComponent('TractorGearsCollider').getPusherScript();
                //     if (!this.hasBePushed && actor.level >= this.level) {
                //         this.hasBePushed = true;
                //         this.coinsNodes.forEach(coins => {
                //             coins.getComponent(OneLayerOfCoins).scatter();
                //         });
                //     }
                let i = 0;
                this.coins.children.forEach(coin => {
                    if (i < 120) {
                        i++;
                        coin.getComponent(Coin).drop();
                    }


                })
                // this.node.destroy();
            }
        }, this);
    }

    update(deltaTime: number) {

    }
}


