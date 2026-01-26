import { _decorator, Component, Node, Animation, tween, Tween, v3 } from 'cc';
import { AudioManager } from '../PASDK/AudioManager';
import { Player } from '../Player';
import { GameGlobal } from '../GameGlobal';
import { Tractor } from '../prefabs/Tractor';
import { GameEvent } from '../managers/EventManager';
import { Utils } from '../Utils';
import { EventEnum } from '../Event/EventEnum';
const { ccclass, property } = _decorator;

@ccclass('SpeedBtn')
export class SpeedBtn extends Component {
    isShowMax: boolean = false;
    price: number = 0;
    isBreathing: boolean = false;
    isTouching: boolean = false;
    @property(Animation)
    levelup: Animation;
    @property(Node)
    outline: Node;
    start() {
        this.setDisplayPrice(GameGlobal.GearsUp[GameGlobal.Tractor.speedLevel + 1]);
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
            Utils.breathEffect(this.node.getParent());
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


    speedUpgrade() {
        GameEvent.emit(EventEnum.BtnClicked);
        let nextLv = GameGlobal.Tractor.speedLevel + 1;
        if (GameGlobal.SpeedUp[nextLv]) {
            if (Player.getMoney() >= GameGlobal.SpeedUp[nextLv][0]) {
                GameGlobal.Tractor.isUpgrading = true;
                AudioManager.audioPlay("Click", false);
                Player.addMoney(-GameGlobal.SpeedUp[nextLv][0]);
                GameGlobal.Tractor.unloadCoins(GameGlobal.SpeedUp[nextLv][0], this.node, () => {
                    this.scheduleOnce(() => {
                        GameGlobal.Tractor.isUpgrading = false;
                        GameEvent.emit("SpeedUpgrade");
                        this.levelup.play();
                        if (GameGlobal.SpeedUp[nextLv + 1]) {
                            this.setDisplayPrice(GameGlobal.SpeedUp[nextLv + 1][0]);
                        } else { this.showMaxLevel(); }
                    }, 1)
                });


                return
            }
        } else {
            this.showMaxLevel();
        }
        AudioManager.audioPlay("Reject", false);
    }
}




