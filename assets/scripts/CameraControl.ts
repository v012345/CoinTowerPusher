import { _decorator, Component, Node, Vec3, screen, tween, Camera, Quat, Tween } from 'cc';
import { GameGlobal } from './GameGlobal';
const { ccclass, property } = _decorator;

@ccclass('CameraControl')
export class CameraControl extends Component {


    eulerHeng = new Vec3(-60, 0, 0);
    eulerShu = new Vec3(-60, 0, 0);
    offsetPos = new Vec3(0, 0, 0);
    hengPos = new Vec3(0, 24.678, 27.455);
    shuPos = new Vec3(0, 35.678, 44.455);

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

    cameraXieHuo() {
        Tween.stopAllByTarget(this.node);
        let actorPos = GameGlobal.actor.xieHuoCameraAnchor.worldPosition.clone();
        let targetPos = new Vec3();

        let actorRotation = new Vec3();
        GameGlobal.actor.xieHuoCameraAnchor.worldRotation.getEulerAngles(actorRotation);
        actorRotation.y -= 45;

        let offsetPosRotated = new Vec3();

        let offsetPosScale = this.offsetPos.clone();
        if (this.isShu()) {
            offsetPosScale.multiplyScalar(0.75);
        } else {
            offsetPosScale.multiplyScalar(0.75);
        }

        Vec3.rotateY(offsetPosRotated, offsetPosScale, Vec3.ZERO, actorRotation.y * Math.PI / 180);

        Vec3.add(targetPos, actorPos, offsetPosRotated);
        tween(this.node)
            .to(.45, { worldPosition: targetPos }, {
                onUpdate: () => {
                    this.node.lookAt(actorPos);
                }
            })
            .start();
    }


    cameraReturn() {
        Tween.stopAllByTarget(this.node);
        let actorPos = GameGlobal.actor.xieHuoCameraAnchor.worldPosition.clone();

        let actorRotation = new Vec3();
        GameGlobal.actor.xieHuoCameraAnchor.worldRotation.getEulerAngles(actorRotation);

        let offsetPosRotated = new Vec3();
        Vec3.rotateY(offsetPosRotated, this.offsetPos, Vec3.ZERO, actorRotation.y * Math.PI / 180);

        let targetPos = new Vec3();
        Vec3.add(targetPos, actorPos, offsetPosRotated);
        tween(this.node)
            .to(.35, { worldPosition: targetPos, eulerAngles: actorRotation }, {
                onUpdate: () => {
                    this.node.lookAt(actorPos);
                }
            })
            .call(() => {
                GameGlobal.actor.isOver = false;
            })
            .start();
    }


    cameraUp(deltaTime: number) {

        let actorPos = GameGlobal.actor.normalCameraAnchor.worldPosition.clone();

        let actorRotation = new Vec3();
        GameGlobal.actor.normalCameraAnchor.worldRotation.getEulerAngles(actorRotation);

        let offsetPosRotated = new Vec3();

        let offsetPosScale = this.offsetPos.clone();
        if (this.isShu()) {
            offsetPosScale.multiply3f(0.5, 1.5, 0.5);
        } else {
            offsetPosScale.multiply3f(0.5, 1.5, 0.5);
        }

        Vec3.rotateY(offsetPosRotated, offsetPosScale, Vec3.ZERO, actorRotation.y * Math.PI / 180);

        let targetPos = new Vec3();
        Vec3.add(targetPos, actorPos, offsetPosRotated);


        let pos = this.node.position.clone();
        pos = pos.lerp(targetPos, deltaTime * 4);
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