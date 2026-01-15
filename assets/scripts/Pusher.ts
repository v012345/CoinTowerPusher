import { _decorator, Component, Node, input, Input, EventTouch, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pusher')
export class Pusher extends Component {
    private isHolding = false;
    start() {

    }
    onEnable() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onDisable() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    onTouchStart(event: EventTouch) {
        this.isHolding = true;
    }

    onTouchEnd(event: EventTouch) {
        this.isHolding = false;
    }
    update(dt: number) {
        if (!this.isHolding) return;

        // 小车向前（假设 Z 轴前进）
        this.node.translate(new Vec3(0, 0, 5 * dt));
        console.log(this.node.position);
    }

    forward() {
        console.log("Pusher forward");
    }


}


