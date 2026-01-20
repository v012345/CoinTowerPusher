import { _decorator, Component, Node, tween, RigidBody, Vec3, PhysicsGroup, CylinderCollider, ICollisionEvent } from 'cc';
import { GameGlobal } from '../GameGlobal';
const { ccclass, property } = _decorator;

@ccclass('Coin')
export class Coin extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
    drop(RigidBodyGroup: number) {
        const rb = this.node.addComponent(RigidBody);
        rb.group = RigidBodyGroup;
        rb.useGravity = true;
        rb.applyForce(new Vec3(0, Math.random() * 5 + 20, 0), this.node.getWorldPosition());

        const collider = this.node.addComponent(CylinderCollider);
        collider.radius = 1.311;
        collider.height = 0.7;
        collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }
    onCollisionEnter(event: ICollisionEvent) {
        const other = event.otherCollider;
        // console.log(other)
        if (other.node.name == "Ground") {
            // console.log('Coin landed on the ground');
            const collider = this.node.getComponent(CylinderCollider);
            collider.on('onCollisionEnter', this.onCollisionEnter, this);
            const rb = this.node.getComponent(RigidBody);
            rb.group = PhysicsGroup.DroppedCoin;
            this.scheduleOnce(() => {
                this.node.getComponent(CylinderCollider)?.destroy();
                this.node.getComponent(RigidBody)?.destroy();
                // this.flyToCargoBed();
                GameGlobal.CoinsPool.push(this);
            }, 0.5);
        }
    }
    flyToCargoBed() {
        let originalPos = this.node.worldPosition.clone();
        this.node.setParent(GameGlobal.cargoBed);
        this.node.worldPosition = originalPos;
        const start = this.node.position.clone();
        const end = new Vec3(0, 0, 0);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        mid.y += 25; // 控制高度
        this.node.eulerAngles = new Vec3(Math.random() * 360, Math.random() * 360, Math.random() * 360);

        tween(this.node)
            .to(1, { position: mid }, { easing: 'quadOut' })
            .to(1, { position: end }, { easing: 'quadIn' })
            .call(() => {
                // this.onFlyEnd();   // 你自己的函数
                GameGlobal.TractorScript.arrangeCoin(this.node);
            })
            .start();
    }
}


