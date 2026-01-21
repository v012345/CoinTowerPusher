import { _decorator, Component, Node, Camera, screen, view, ResolutionPolicy, Widget, v3, input, Input } from 'cc';
import { GameGlobal } from './GameGlobal';
// import { AudioManager } from './Utils/AudioManager';
import { Language } from './Utils/Language';
import { PlayableSDK } from './Utils/PlayableSDK';
import { WaterPlane } from './Utils/WaterPlane';
import { Utils } from './Utils/Utils';
import { UIAdjust, UIAdjustType } from './Utils/UIAdjust';
const { ccclass, property } = _decorator;

declare var window: any;
@ccclass('MainGame')
export class MainGame extends Component {
    @property(Node)
    effectLay: Node;
    @property(Camera)
    camera: Camera;
    private _isPortrait: boolean = false;
    private _isIpad: boolean = false;
    titleNode: Node;
    water: WaterPlane;
    @property(Node)
    logo: Node;
    onLoad() {
        GameGlobal.mainGame = this;
        GameGlobal.mainCamera = this.camera;
        GameGlobal.effectLay = this.effectLay;
        GameGlobal.uiLay = this.node;
        // this.water = this.waterLay.getComponent(WaterPlane);
    }


    start() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        view.on("canvas-resize", this.resize, this);
        this.scheduleOnce(this.resize, 0.3);


        PlayableSDK.onInteracted();
        this.scheduleOnce(() => {

            //@ts-ignore
            if (window.setLoadingProgress) {
                //@ts-ignore
                window.setLoadingProgress(100);
            }
        })

    }


    onTouchStart() {
        // if (this.isGameOver || !GameGlobal.actor.isControl) return;
        // if (this.isFirst1) {
        //     this.isFirst1 = false;
        //     this.setGuide1Visible(false);
        // }
        // if (this.isFirst2) {
        //     this.isFirst2 = false;
        //     this.titleNode.children[2].active = false;
        //     GameGlobal.CameraControl.cameraReturn();
        // }
        GameGlobal.actor.move();
        // this.joyStickDown();
    }


    onTouchMove() {
        GameGlobal.actor.move();
    }


    onTouchEnd() {
        GameGlobal.actor.stop();
    }


    onTouchCancel() {
        GameGlobal.actor.stop();
    }





    update(deltaTime: number) {

    }




    resize() {
        if (screen.windowSize.height > screen.windowSize.width) {
            let ratio = screen.windowSize.height / screen.windowSize.width;
            let isRect = ratio >= 1 && ratio <= 1.77;
            view.setResolutionPolicy(ResolutionPolicy.FIXED_WIDTH);

            GameGlobal.viewScale = screen.windowSize.width / view.getDesignResolutionSize().width;
            GameGlobal.realHeight = screen.windowSize.height / GameGlobal.viewScale;
            GameGlobal.realWidth = view.getDesignResolutionSize().width;
            console.log('resize 竖屏', GameGlobal.viewScale, GameGlobal.realWidth, GameGlobal.realHeight, screen.windowSize.width, screen.windowSize.height, ratio);

            // GameGlobal.isShu = true;

            this.node.getComponentsInChildren(UIAdjust).forEach(v => {
                if (isRect) {
                    v.type = UIAdjustType.竖屏;
                } else {
                    v.type = UIAdjustType.竖屏;
                }
                v.updateImpl();
            })

        } else {
            let ratio = screen.windowSize.width / screen.windowSize.height;
            let isRect = ratio >= 1 && ratio <= 1.77;
            view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT);

            GameGlobal.viewScale = screen.windowSize.height / view.getDesignResolutionSize().height;
            GameGlobal.realHeight = view.getDesignResolutionSize().height;
            GameGlobal.realWidth = screen.windowSize.width / GameGlobal.viewScale;
            console.log('resize 横屏', GameGlobal.viewScale, GameGlobal.realWidth, GameGlobal.realHeight, screen.windowSize.width, screen.windowSize.height, ratio);
            // GameGlobal.isShu = false;

            this.node.getComponentsInChildren(UIAdjust).forEach(v => {
                if (isRect) {
                    v.type = UIAdjustType.横屏;
                } else {
                    v.type = UIAdjustType.横屏;
                }
                // v.updateImpl();
            })
        }
        // GameGlobal.CameraControl.cameraOnLoad();
    }
    private resizeTitle() {
        // let widget = this.titleNode.getComponent(Widget);
        // console.log(this.titleNode.getComponent(Widget).top)
        // if (this._isPortrait) {
        //     widget.top = 0.265;
        // } else {
        //     widget.top = 0.16;
        // }
        // for (let el of this.titleNode.children) {
        //     if (this._isIpad) {
        //         el.scale = v3(0.75, 0.75, 1);
        //     } else {
        //         this.titleNode.scale = v3(1, 1, 1);
        //     }
        // }
    }
    private resizeLogo() {
        // if (this._isIpad) {
        //     this.logo.scale = v3(0.65, 0.65, 1);
        // } else {
        //     this.logo.scale = v3(0.8, 0.8, 1);
        // }
        // if (this._isPortrait) {
        //     this.logo.getComponent(Widget).left = 10;
        // } else {
        //     if (this._isIpad) {
        //         this.logo.getComponent(Widget).left = 45;
        //     } else {
        //         this.logo.getComponent(Widget).left = 60;
        //     }
        // }
    }
}


