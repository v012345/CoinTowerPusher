import { _decorator, Component, Node, Vec3, screen, tween, Camera, Quat, Tween } from 'cc';
import { GameGlobal } from './GameGlobal';
const { ccclass, property } = _decorator;

@ccclass('CameraControl')
export class CameraControl extends Component {


    _eulerHeng = new Vec3(60, 0, 0);
    @property
    public set eulerHeng(v: Vec3) {
        this._eulerHeng = v;
        this.cameraOnLoad();
    }
    public get eulerHeng(): Vec3 {
        return this._eulerHeng
    }
    _eulerShu = new Vec3(60, 0, 0);
    offsetPos = new Vec3(0, 0, 0);
    _hengPos = new Vec3(0, 24.678, -27.455);
    @property
    public set eulerShu(v: Vec3) {
        this._eulerShu = v;
        this.cameraOnLoad();
    }
    public get eulerShu(): Vec3 {
        return this._eulerShu
    }


    @property
    public set hengPos(v: Vec3) {
        this._hengPos = v;
        this.cameraOnLoad();
    }

    public get hengPos(): Vec3 {
        return this._hengPos
    }
    @property
    public set shuPos(v: Vec3) {
        this._shuPos = v;
        this.cameraOnLoad();
    }

    public get shuPos(): Vec3 {
        return this._shuPos
    }


    _shuPos = new Vec3(0, 35.678, -44.455);

    onLoad() {
        GameGlobal.CameraControl = this;
    }


    start() {


    }

    isShu() {
        if (screen.windowSize.height > screen.windowSize.width && screen.windowSize.width / screen.windowSize.height < 1) {
            //竖屏
            return true;
        } else {
            //横屏
            return false;
        }
    }
    cameraOnLoad() {
        if (this.isShu()) {
            //竖屏
            this.offsetPos.set(this.shuPos);
        } else {
            //横屏
            this.offsetPos.set(this.hengPos);
        }
        let actorPos = GameGlobal.actor.normalCameraAnchor.worldPosition.clone();

        let actorRotation = new Vec3();
        GameGlobal.actor.normalCameraAnchor.worldRotation.getEulerAngles(actorRotation);

        let offsetPosRotated = new Vec3();
        Vec3.rotateY(offsetPosRotated, this.offsetPos, Vec3.ZERO, actorRotation.y * Math.PI / 180);

        let targetPos = new Vec3();
        Vec3.add(targetPos, actorPos, offsetPosRotated);
        this.node.setPosition(targetPos);


        this.node.lookAt(actorPos);
    }


    cameraFollow(deltaTime: number) {
        //摄像头跟随Node位置
        let actorPos = GameGlobal.actor.normalCameraAnchor.worldPosition.clone();

        //摄像头跟随Node旋转角度
        let actorRotation = new Vec3();
        GameGlobal.actor.normalCameraAnchor.worldRotation.getEulerAngles(actorRotation);

        let offsetPosRotated = new Vec3();
        Vec3.rotateY(offsetPosRotated, this.offsetPos, Vec3.ZERO, actorRotation.y * Math.PI / 180);

        let targetPos = new Vec3();
        Vec3.add(targetPos, actorPos, offsetPosRotated);
        let pos = this.node.position.clone();
        Vec3.lerp(pos, pos, targetPos, deltaTime * 4);
        this.node.setPosition(pos);

        this.node.lookAt(actorPos);
    }


    cameraShock() {
        let pos = this.node.position.clone();
        tween(this.node)
            .to(.1, { position: new Vec3(pos.x - 1, pos.y, pos.z) })
            .to(.1, { position: new Vec3(pos.x + 1, pos.y, pos.z) })
            .to(.1, { position: new Vec3(pos.x - .5, pos.y, pos.z) })
            .to(.1, { position: new Vec3(pos.x + .5, pos.y, pos.z) })
            .to(.1, { position: pos })
            .start();
    }

}