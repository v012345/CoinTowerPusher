import { _decorator, Component, Node, RigidBody, Vec3, PhysicsGroup, CylinderCollider, ICollisionEvent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Coin')
export class Coin extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
    drop() {
        const rb = this.node.addComponent(RigidBody);
        rb.group = PhysicsGroup.Coin;
        rb.useGravity = true;
        rb.applyForce(new Vec3(0, 20, 0), this.node.getWorldPosition());

        const collider = this.node.addComponent(CylinderCollider);
        collider.radius = 1.311;
        collider.height = 0.7;
        collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }
    onCollisionEnter(event: ICollisionEvent) {
        const other = event.otherCollider;
        console.log(other)
        if (other.node.name == "Ground") {
            console.log('Coin landed on the ground');
            const collider = this.node.getComponent(CylinderCollider);
            collider.on('onCollisionEnter', this.onCollisionEnter, this);
            const rb = this.node.getComponent(RigidBody);
            rb.group = PhysicsGroup.DroppedCoin;
            this.scheduleOnce(() => {
                this.node.getComponent(CylinderCollider)?.destroy();
                this.node.getComponent(RigidBody)?.destroy();
                this.flyToCargoBed();
            }, 0.5);
        }
    }
    flyToCargoBed() {

    }
}


