import { _decorator, Component, Node, tween, Tween, v3 } from 'cc';
import { AudioManager } from '../PASDK/AudioManager';
import { Player } from '../Player';
import { GameGlobal } from '../GameGlobal';
import { Tractor } from '../prefabs/Tractor';
import { GameEvent } from '../managers/EventManager';
const { ccclass, property } = _decorator;

@ccclass('LevelupBtn')
export class LevelupBtn extends Component {
    @property(String)
    ReceiveEvent: string = "";
    isShowMax: boolean = false;
    price: number = 0;
    isBreathing: boolean = false;
    isTouching: boolean = false;
    start() {
        GameEvent.on(this.ReceiveEvent, (cost: number) => {
            this.setDisplayPrice(cost);
        })
    }
    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        // this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    onTouchStart() {
        Tween.stopAllByTarget(this.node.getParent());
        this.node.getParent().setScale(v3(1, 1, 1));
        this.isBreathing = false;
        this.isTouching = true;

    }

    onTouchMove() {
        // console.log("点住并移动");
    }

    onTouchEnd() {
        this.isBreathing = false;
        this.isTouching = false;

    }

    onTouchCancel() {
        this.isBreathing = false;
        this.isTouching = false;

    }

    setDisplayPrice(cost: number) {
        this.price = cost;
        this.node.getChildByName("cost").getComponent('cc.Label').string = cost.toString();
    }

    update(deltaTime: number) {
        if (this.isShowMax) return;
        let playerMoney = Player.getMoney();
        if (playerMoney < this.price) {
            this.node.getComponent('cc.Sprite').grayscale = true;
            Tween.stopAllByTarget(this.node.getParent());
            this.node.getParent().setScale(v3(1, 1, 1));
            this.isBreathing = false;
        } else {
            this.node.getComponent('cc.Sprite').grayscale = false;
            if (this.isBreathing) return;
            this.isBreathing = true;
            if (this.isTouching) return;
            this.breathEffect(this.node.getParent());
        }



    }
    showMaxLevel() {
        this.isShowMax = true;
        Tween.stopAllByTarget(this.node.getParent());
        this.node.getParent().setScale(v3(1, 1, 1));
        this.node.getChildByName("max").active = true;
        this.node.getChildByName("coin").active = false;
        this.node.getChildByName("cost").active = false;
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        // this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    breathEffect(node: Node) {
        tween(node).repeatForever(
            tween(node)
                .by(0.8, { scale: v3(0.05, 0.05, 0) }, { easing: 'quadInOut' })
                .by(0.8, { scale: v3(-0.05, -0.05, 0) }, { easing: 'quadInOut' })
        ).start();
    }


    cargoBedUpgrade() {
        let nextLv = GameGlobal.actor.cargoBedLevel + 1;
        let Tractor = GameGlobal.actor.tractorNode.getComponent(Tractor);
        if (nextLv <= Tractor.cargoBeds.length) {
            if (Player.getMoney() >= GameGlobal.CargoBedUp[nextLv][0]) {
                GameEvent.emit("CargoBedUpgrade");
                AudioManager.audioPlay("Click", false);
                Player.addMoney(-GameGlobal.CargoBedUp[nextLv][0]);
                if (GameGlobal.CargoBedUp[GameGlobal.actor.cargoBedLevel + 1]) {
                    this.setDisplayPrice(GameGlobal.CargoBedUp[GameGlobal.actor.cargoBedLevel + 1][0]);
                } else { this.showMaxLevel(); }
                return
            }
        } else {
            this.showMaxLevel();
        }
        AudioManager.audioPlay("Reject", false);
    }
    sawBladeUpgrade() {
        let nextLv = GameGlobal.actor.gearsLevel + 1;
        let Tractor = GameGlobal.actor.tractorNode.getComponent(Tractor);
        if (nextLv <= Tractor.sawBlades.length) {
            if (Player.getMoney() >= GameGlobal.GearsUp[nextLv]) {
                GameEvent.emit("SawBladeUpgrade");
                AudioManager.audioPlay("Click", false);
                Player.addMoney(-GameGlobal.GearsUp[nextLv]);
                if (GameGlobal.GearsUp[GameGlobal.actor.gearsLevel + 1]) {
                    this.setDisplayPrice(GameGlobal.GearsUp[GameGlobal.actor.gearsLevel + 1]);
                } else { this.showMaxLevel(); }
                return
            }
        } else {
            this.showMaxLevel();
        }
        AudioManager.audioPlay("Reject", false);
    }
    speedUpgrade() {
        let nextLv = GameGlobal.actor.speedLevel + 1;
        if (GameGlobal.SpeedUp[nextLv]) {
            if (Player.getMoney() >= GameGlobal.SpeedUp[nextLv][0]) {
                GameEvent.emit("SpeedUpgrade");
                AudioManager.audioPlay("Click", false);
                Player.addMoney(-GameGlobal.SpeedUp[nextLv][0]);
                if (GameGlobal.SpeedUp[GameGlobal.actor.speedLevel + 1]) {
                    this.setDisplayPrice(GameGlobal.SpeedUp[GameGlobal.actor.speedLevel + 1][0]);
                } else { this.showMaxLevel(); }
                return
            }
        } else {
            this.showMaxLevel();
        }
        AudioManager.audioPlay("Reject", false);
    }
}


