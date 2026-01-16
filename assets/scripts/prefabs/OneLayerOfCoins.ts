import { _decorator, Component, CylinderCollider, Node, RigidBody, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OneLayerOfCoins')
export class OneLayerOfCoins extends Component {
    start() {
        this.node.children.forEach(coin => {

            const rb = coin.addComponent(RigidBody);
            rb.useGravity = true;
            rb.applyForce(new Vec3(0, 500, 0), coin.getWorldPosition());

            const collider = coin.addComponent(CylinderCollider);
            collider.radius = 1.311;
            collider.height = 0.7;
        });
    }

    update(deltaTime: number) {

    }
}


