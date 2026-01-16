import { Camera, ImageAsset, Layers, MobilityMode, Node, RenderTexture, Sprite, SpriteFrame, Texture2D, UIOpacity, UITransform, Vec3, gfx, resources, screen, tween, v3 } from "cc";
import { GameGlobal } from "../GameGlobal";

export class Utils {
    public static getUIPos(node3d: Node, nodeUi: Node) {
        return GameGlobal.mainCamera.convertToUINode(node3d.getWorldPosition(), nodeUi);
    }

    public static randomRange(min, max) {
        let d = max - min;
        return min + Math.random() * d;
    }

    public static randomPos(pos, rang) {
        let x = pos.x - rang / 2 + Math.random() * rang;
        let y = pos.y - rang / 2 + Math.random() * rang;
        return new Vec3(x, y, 0);
    }

    public static createSprite(path) {
        let node = new Node();
        node.layer = Layers.Enum.UI_2D;
        node.mobility = MobilityMode.Static;
        let t = node.addComponent(UITransform);
        let sp: Sprite = node.addComponent(Sprite);
        sp.sizeMode = Sprite.SizeMode.TRIMMED;
        sp.type = Sprite.Type.SIMPLE;
        sp.trim = true;
        // Utils.setSpriteFrame(node, path);
        let img = resources.get(path + '/spriteFrame', SpriteFrame);
        if (img) {
            sp.spriteFrame = img;
        }
        return node;
    }
    public static isIpad(vertical: boolean, ratio: number) {
        if (vertical) {
            //ipad特殊处理
            if (ratio >= 3 / 4) {
                return true;
            }
        } else {
            if (ratio <= 4 / 3) {
                return true;
            }
        }
        return false;
    }

    public static setSpriteFrame(node, path, callback?) {
        let sp = node.getComponent(Sprite);
        let img = resources.get(path);
        if (img) {
            if (img instanceof SpriteFrame) {
                sp.spriteFrame = img;
                callback && callback();
            } else if (img instanceof ImageAsset) {
                const tex = new Texture2D();
                tex.image = img;
                const spriteFrame = new SpriteFrame();
                spriteFrame.texture = tex;
                sp.spriteFrame = spriteFrame;
            }
        } else {
            resources.load(path, SpriteFrame, (err, res) => {
                sp.spriteFrame = res;
                callback && callback();
            });
        }
    }


    public static nodeMoving(node, from: Vec3, middlePos: Vec3, to: Vec3, delay, callback?) {
        //node为做抛物线运动的节点
        // let xoff = 50 * (from.x<0?-1:1);
        // let yoff = 80 + 20 * Math.random();
        // let middlePos = new Vec3((from.x + to.x) / 2 - xoff, (from.y + to.y) / 2 + yoff, 0); //中间坐标，即抛物线最高点坐标
        // let destPos = new Vec3(node.position.x + 800, node.position.y, 0); //终点，抛物线落地点
        //计算贝塞尔曲线坐标函数
        let twoBezier = (t: number, p1: Vec3, cp: Vec3, p2: Vec3) => {
            let x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
            let y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
            return new Vec3(x, y, 0);
        };
        let tweenDuration: number = 0.3;
        tween(node.position)
            .delay(delay)
            .to(tweenDuration, to, {
                onUpdate: (target: Vec3, ratio: number) => {
                    node.position = twoBezier(ratio, from, middlePos, to);
                },
                onComplete: (target) => {
                    callback && callback();
                }
            })
            .start();
    }


    public static coinFlyTo(node: Node, from: Vec3, middlePos: Vec3, to: Vec3, delay, startCall, centerCall, endCall?) {
        let twoBezier = (t: number, p1: Vec3, cp: Vec3, p2: Vec3) => {
            let x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
            let y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
            return new Vec3(x, y, 0);
        };

        tween(node)
            .delay(delay)
            .call(() => {
                startCall && startCall();
            })
            .parallel(
                tween(node)
                    .to(0.5, { position: to }, {
                        onUpdate: (target: Vec3, ratio: number) => {
                            node.position = twoBezier(ratio, from, middlePos, to);
                        }
                    }),
                tween(node)
                    .by(0.3, { scale: v3(.1, .1, 1) })
                    .call(() => {
                        centerCall && centerCall();
                    })
                    .by(0.2, { scale: v3(-.1, -.1, 1) })
                    .call(() => {
                        node.setScale(v3(0.1, 0.1, 0))
                    })
                    .call(() => {
                        endCall && endCall();
                    })
                    .by(0.2, { scale: v3(0.6, 0.6, 1) }, { easing: 'quadOut' })

            ).start();
    }

    public static coinFlyFrom(node: Node, from: Vec3, middlePos: Vec3, to: Vec3, delay, callback?) {
        let twoBezier = (t: number, p1: Vec3, cp: Vec3, p2: Vec3) => {
            let x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
            let y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
            return new Vec3(x, y, 0);
        };

        tween(node)
            .delay(delay)
            .parallel(
                tween(node)
                    .to(0.6, { position: to }, {
                        onUpdate: (target: Vec3, ratio: number) => {
                            node.position = twoBezier(ratio, from, middlePos, to);
                        },
                        onComplete: (target) => {
                            callback && callback();
                            // node.parent = null;
                        }
                    }),
                tween(node)
                    .by(0.3, { scale: v3(.1, .1, 1), angle: 50 })
                    .by(0.3, { scale: v3(-.1, -.1, 1), angle: -50 })
            ).start();
    }


    // 果冻
    public static jellyEffect(node: Node, t, callback?) {
        // let uiOpacity = node.getComponent(UIOpacity);
        // if (!uiOpacity) uiOpacity = node.addComponent(UIOpacity);
        // uiOpacity.opacity = 0;
        node.setScale(Vec3.ZERO);

        tween(node)
            .to(0.15, { scale: v3(1 * t, 1 * t, 1 * t) })
            .to(.06, { scale: v3(1.4 * t, 0.53 * t, 1 * t) })
            .to(.12, { scale: v3(0.8 * t, 1.2 * t, 1 * t) })
            .to(.07, { scale: v3(1.2 * t, 0.7 * t, 1 * t) })
            .to(.07, { scale: v3(.85 * t, 1.1 * t, 1 * t) })
            .to(.07, { scale: v3(1 * t, 1 * t, 1 * t) })
            .call(() => {
                callback && callback();
            })
            .start();

        // tween(uiOpacity)
        //     .to(.06, { opacity: 255 })
        //     .start();
    }

    // 呼吸
    public static breathEffect(node: Node) {
        tween(node).repeatForever(
            tween(node)
                .by(0.8, { scale: v3(0.05, 0.05, 0) }, { easing: 'quadInOut' })
                .by(0.8, { scale: v3(-0.05, -0.05, 0) }, { easing: 'quadInOut' })
        ).start();
    }

    public static breathLight(node: Node) {
        let op = node.getComponent(UIOpacity);
        op.opacity = 0;
        node.active = true;
        tween(op).repeatForever(
            tween(op)
                .to(0.25, { opacity: 255 }, { easing: 'quadInOut' })
                .to(0.25, { opacity: 0 }, { easing: 'quadInOut' })
                .to(0.35, { opacity: 255 }, { easing: 'quadInOut' })
                .to(0.35, { opacity: 0 }, { easing: 'quadInOut' })
            // .delay(0.5)
        ).start();
    }

    // 脉动
    public static pulsationEffect(node: Node) {
        tween(node).repeatForever(
            tween(node)
                .by(0.25, { scale: v3(0.05, 0.05, 0) }, { easing: 'sineOut' })
                .by(0.25, { scale: v3(-0.05, -0.05, 0) }, { easing: 'sineOut' })
                .by(0.35, { scale: v3(0.14, 0.14, 0) }, { easing: 'sineOut' })
                .by(0.35, { scale: v3(-0.14, -0.14, 0) }, { easing: 'sineIn' })
                .delay(0.5)
        ).start();
    }

    public static floatEffect(node: Node, delay, delayCall) {
        tween(node)
            .delay(delay)
            .call(() => { delayCall && delayCall() })
            .by(0.2, { position: v3(0, 10, 0) }, { easing: 'quadOut' })
            .by(0.2, { position: v3(0, -10, 0) }, { easing: 'quadIn' })
            .start();
    }

    public static buildingAppear(node: Node, delay, callBack?) {
        let sc = node.getScale().clone();
        node.setScale(0, 0);
        tween(node)
            .delay(delay)
            .to(0.15, { scale: v3(1.3 * sc.x, 1.3 * sc.y, 1) }, { easing: 'sineInOut' })
            .to(0.1, { scale: v3(1 * sc.x, 1 * sc.y, 1) }, { easing: 'sineOutIn' })
            .call(() => { callBack && callBack() })
            .start();
    }

    public static delayCall(node, delay, callBack) {
        tween(node)
            .delay(delay)
            .call(() => { callBack && callBack() })
            .start();
    }

    public static getRandomInt(min, max) {
        max = min - .5 + Math.random() * (max - min + 1);
        return Math.round(max)
    }




    public static createRenderTexture(resolutionScale: number, numOfColors: number = 1): RenderTexture {
        let texture = new RenderTexture();
        let size = screen.windowSize;
        let dpr = Math.min(1.5, screen.devicePixelRatio);
        let width = size.width * dpr * resolutionScale;
        let height = size.height * dpr * resolutionScale;
        let ratio = width / height;
        if (width > 2048) {
            width = 2048;
            height = width / ratio;
        }
        if (height > 2048) {
            height = 2048;
            width = height * ratio;
        }

        let colors = [];
        for (let i = 0; i < numOfColors; ++i) {
            colors.push(new gfx.ColorAttachment(gfx.Format.RGBA8));
        }

        texture.reset({
            width: width, height: height,
            passInfo: new gfx.RenderPassInfo(
                colors, new gfx.DepthStencilAttachment(gfx.Format.DEPTH_STENCIL),
            )
        });

        texture.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);
        texture.setWrapMode(Texture2D.WrapMode.CLAMP_TO_BORDER, Texture2D.WrapMode.CLAMP_TO_BORDER);

        return texture;
    }


    public static syncCameraParameters(current: Camera, target: Camera) {
        current.fov = target.fov;
        current.near = target.near;
        current.far = target.far;
        current.orthoHeight = target.orthoHeight;
    }

    public static syncCameraTransform(current: Camera, target: Camera) {
        current.node.worldPosition = target.node.worldPosition;
        current.node.worldScale = target.node.worldScale;
        current.node.worldRotation = target.node.worldRotation;
    }


    // 二阶贝塞尔曲线
    public static bezierCurve(t: number, p1: Vec3, cp: Vec3, p2: Vec3, out: Vec3) {
        out.x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
        out.y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
        out.z = (1 - t) * (1 - t) * p1.z + 2 * t * (1 - t) * cp.z + t * t * p2.z;
    }


    public static collectGoods(startNode: Node, targetNode: Node, moveNode: Node, callback?) {
        let tran = GameGlobal.effectLay.getComponent(UITransform);
        let startPos = startNode.worldPosition.clone();
        let fromPos = GameGlobal.mainCamera.convertToUINode(startPos, GameGlobal.effectLay);

        let targetPos = targetNode.worldPosition.clone();
        let toPos = tran.convertToNodeSpaceAR(targetPos);

        moveNode.setParent(GameGlobal.effectLay);
        moveNode.setPosition(fromPos);
        tween(moveNode)
            .delay(.5)
            .to(.5, { position: toPos })
            .call(() => {
                callback && callback();
                moveNode.destroy();
            })
            .start();
    }
}