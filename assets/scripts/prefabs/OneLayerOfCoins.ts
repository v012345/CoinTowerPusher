import { _decorator, Component, CylinderCollider, Node, PhysicsGroup, RigidBody, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OneLayerOfCoins')
export class OneLayerOfCoins extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
    scatter() {
        this.node.children.forEach(coin => {

            const rb = coin.addComponent(RigidBody);
            rb.group = PhysicsGroup.Coin;
            rb.useGravity = true;
            rb.applyForce(new Vec3(0, 500, 0), coin.getWorldPosition());

            const collider = coin.addComponent(CylinderCollider);
            collider.radius = 1.311;
            collider.height = 0.7;
        });
    }
}


