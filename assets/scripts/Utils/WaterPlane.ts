
import { _decorator, Component, Node, Camera, director, PipelineEventType, MeshRenderer, RenderTexture, gfx, color, v2, Vec2 } from 'cc';
import { GlobalUniformMgr } from './GlobalUniformMgr';
const { ClearFlagBit } = gfx;
const { ccclass, property } = _decorator;

import { Utils } from './Utils';


@ccclass('WaterPlane')
export class WaterPlane extends Component {

    @property({ type: Camera })
    mainCamera: Camera = null;

    @property
    useReflection = true;

    @property
    useRefraction = true;

    @property
    useDepth = true;


    // private _refelctionCamera: Camera = null;
    private _refractionCamera: Camera = null;

    private _refractionGenCamera: Camera = null;

    private _mesh: MeshRenderer = null;

    public setUseReflection(enable: boolean) {
        this.useReflection = enable;
    }

    public setUseRefraction(enable: boolean) {
        this.useRefraction = enable;
    }

    public setUseDepth(enable: boolean) {
        this.useDepth = enable;
    }

    private getProperty(propName: string, out: any = null) {
        let handle = this._mesh.material.passes[0].getHandle(propName);
        return this._mesh.material.passes[0].getUniform(handle, out);
    }

    public get reflectionNoiseScale(): number {
        return this.getProperty('reflectionNoiseScale') as number;
    }

    public set reflectionNoiseScale(value: number) {
        this._mesh.material.setProperty('reflectionNoiseScale', value);
    }

    public get reflectionNoiseMove(): Vec2 {
        let out = v2();
        this.getProperty('reflectionNoiseMove', out)
        return out;
    }

    public set reflectionNoiseMove(value: Vec2) {
        this._mesh.material.setProperty('reflectionNoiseMove', value);
    }

    public get reflectionNoiseStrengthen(): number {
        return this.getProperty('reflectionNoiseStrengthen') as number;
    }

    public set reflectionNoiseStrengthen(value: number) {
        this._mesh.material.setProperty('reflectionNoiseStrengthen', value);
    }


    public get fresnelMin(): number {
        return this.getProperty('fresnelMin') as number;
    }

    public set fresnelMin(value: number) {
        this._mesh.material.setProperty('fresnelMin', value);
    }

    public get fresnelMax(): number {
        return this.getProperty('fresnelMax') as number;
    }

    public set fresnelMax(value: number) {
        this._mesh.material.setProperty('fresnelMax', value);
    }

    public get fresnelPower(): number {
        return this.getProperty('fresnelPower') as number;
    }

    public set fresnelPower(value: number) {
        this._mesh.material.setProperty('fresnelPower', value);
    }

    public get softEdgeDepth(): number {
        return this.getProperty('softEdgeDepth') as number;
    }

    public set softEdgeDepth(value: number) {
        this._mesh.material.setProperty('softEdgeDepth', value);
    }

    public get refractionNoiseScale(): number {
        return this.getProperty('refractionNoiseScale') as number;
    }

    public set refractionNoiseScale(value: number) {
        this._mesh.material.setProperty('refractionNoiseScale', value);
    }

    public get refractionNoiseMove(): Vec2 {
        let out = v2();
        this.getProperty('refractionNoiseMove', out)
        return out;
    }

    public set refractionNoiseMove(value: Vec2) {
        this._mesh.material.setProperty('refractionNoiseMove', value);
    }

    public get refractionNoiseStrengthen(): number {
        return this.getProperty('refractionNoiseStrengthen') as number;
    }
    public set refractionNoiseStrengthen(value: number) {
        this._mesh.material.setProperty('refractionNoiseStrengthen', value);
    }

    private _depthScale: number = 1.0 / 10.0;
    public get refractionDepthScale(): number { return this._depthScale; }
    public set refractionDepthScale(value: number) { this._depthScale = value; }

    public get refractionDepthPower(): number {
        return this.getProperty('depthPower') as number;
    }
    public set refractionDepthPower(value: number) {
        this._mesh.material.setProperty('depthPower', value);
    }

    // initReflection(): RenderTexture {
    //     let texture = Utils.createRenderTexture(1.0);

    //     let node = new Node();
    //     director.getScene().addChild(node);
    //     this._refelctionCamera = node.addComponent(Camera);
    //     // this._refelctionCamera.clearFlags = (ClearFlagBit.STENCIL << 1) | ClearFlagBit.DEPTH_STENCIL;//this.mainCamera.clearFlags;
    //     // let c = new Color();
    //     // Color.fromHEX(c, '#334C78');
    //     // this._refelctionCamera.clearColor = c //this.mainCamera.clearColor;
    //     this._refelctionCamera.clearFlags = this.mainCamera.clearFlags;
    //     this._refelctionCamera.clearColor = this.mainCamera.clearColor;
    //     this._refelctionCamera.priority = this.mainCamera.priority - 1;
    //     this._refelctionCamera.visibility = this.mainCamera.visibility;

    //     this._refelctionCamera.targetTexture = texture;
    //     this._refelctionCamera.name = 'Refelction Camera';
    //     return texture;
    // }

    initRefraction(): RenderTexture {
        if (this.useRefraction) {
            let texture = Utils.createRenderTexture(1.0);

            let node = new Node();
            director.getScene().addChild(node);
            this._refractionCamera = node.addComponent(Camera);
            this._refractionCamera.clearFlags = this.mainCamera.clearFlags;
            this._refractionCamera.clearFlags = Camera.ClearFlag.SOLID_COLOR;
            this._refractionCamera.clearColor = color(255, 255, 255, 255);
            this._refractionCamera.priority = this.mainCamera.priority - 2;
            this._refractionCamera.visibility = 1;//this.mainCamera.visibility;

            this._refractionCamera.targetTexture = texture;
            this._refractionCamera.name = 'Refraction Camera';
            return texture;
        }
    }


    reinit() {
        this._mesh = this.node.getComponent(MeshRenderer);

        // let reflectionRT = this.initReflection();
        let refractionRT = this.initRefraction();

        // this._mesh.material.setProperty('reflectionMap', reflectionRT);
        this._mesh.material.setProperty('refractionMap', refractionRT);
        //this._mesh.material.setProperty('depthMap', this.depthTex.depthTex);
    }

    start() {
        this.reinit();

        let globalUniformMgr = GlobalUniformMgr.inst;

        /*
        cc_time.w water level
        cc_fogBase.w   0.0: normal pass,  1.0 reflection pass, 2.0 refraction pass
        cc_fogAdd.w   maxVisibleDepth;
        */

        director.root.pipeline.on(PipelineEventType.RENDER_CAMERA_BEGIN, (camera: Camera) => {
            // if (camera.node['_id'] == this._refelctionCamera.node['_id']) {

            //     globalUniformMgr.setGlobalUniform('cc_time.w', this._mesh.node.worldPosition.y);
            //     globalUniformMgr.setGlobalUniform('cc_fogBase.w', 1.0);

            //     this._mesh.enabled = false;

            //     director.getScene().emit('reflection_mode');
            // }
            // else 
            if (this._refractionCamera && (camera.node['_id'] == this._refractionCamera.node['_id'])) {

                globalUniformMgr.setGlobalUniform('cc_time.w', this._mesh.node.worldPosition.y);
                globalUniformMgr.setGlobalUniform('cc_fogBase.w', 2.0);
                globalUniformMgr.setGlobalUniform('cc_fogAdd.w', this._depthScale);

                this._mesh.enabled = false;

                director.getScene().emit('refraction_mode');
            }
            else if (this.mainCamera && camera.node['_id'] == this.mainCamera.node['_id']) {
                globalUniformMgr.resetAll();
                director.getScene().emit('scene_mode');
            }
        });

        director.root.pipeline.on(PipelineEventType.RENDER_CAMERA_END, (camera: Camera) => {
            // if (camera.node['_id'] == this._refelctionCamera.node['_id']) {
            //     this._mesh.enabled = true;
            // }
            if (this.mainCamera && camera.node['_id'] == this._refractionCamera.node['_id']) {
                this._mesh.enabled = true;
            }
        });
    }

    // private _tmpV3_0: Vec3 = v3();
    // private _tmpV3_1: Vec3 = v3();
    // private _tmpV3_N: Vec3 = v3();
    // private _tmpQuat: Quat = quat();

    // private getMirrorPoint(out: Vec3, p: Vec3, n: Vec3, d: number): Vec3 {
    //     if (out == null) {
    //         out = new Vec3();
    //     }
    //     let dist = Vec3.dot(p, n) - d;
    //     //tmp = N
    //     let tmp = v3(n);
    //     //tmp = 2.0 * dist * N
    //     tmp.multiplyScalar(2.0 * dist);
    //     // out = p - 2.0 * dist * N
    //     Vec3.subtract(out, p, tmp);
    //     return out;
    // }

    lateUpdate() {
        if (!this.mainCamera) {
            return;
        }
        // if (this._mesh && this._refelctionCamera && this._refelctionCamera.node.active) {

        //     let target = this.mainCamera.node;
        //     let source = this._refelctionCamera.node;

        //     let planeWorldPos = this._mesh.node.worldPosition;
        //     Vec3.transformQuat(this._tmpV3_N, Vec3.FORWARD, this._mesh.node.worldRotation);
        //     let n = this._tmpV3_N;
        //     n.negative();
        //     n.normalize();


        //     let d = Vec3.dot(planeWorldPos, n);

        //     //position.
        //     this.getMirrorPoint(this._tmpV3_0, target.worldPosition, n, d);
        //     source.worldPosition = this._tmpV3_0;

        //     //forward
        //     Vec3.transformQuat(this._tmpV3_0, Vec3.FORWARD, target.worldRotation);
        //     this._tmpV3_0.set(target.forward);
        //     this._tmpV3_0.normalize();
        //     this.getMirrorPoint(this._tmpV3_0, this._tmpV3_0, n, 0);
        //     this._tmpV3_0.normalize();
        //     this._tmpV3_0.negative();

        //     //up
        //     Vec3.transformQuat(this._tmpV3_1, Vec3.UP, target.worldRotation);
        //     this._tmpV3_1.normalize();
        //     this.getMirrorPoint(this._tmpV3_1, this._tmpV3_1, n, 0);
        //     this._tmpV3_1.normalize();

        //     //calculate rotation with view(forward) and up directions
        //     Quat.fromViewUp(this._tmpQuat, this._tmpV3_0, this._tmpV3_1);
        //     source.worldRotation = this._tmpQuat;

        //     // sync worldScale
        //     this._refelctionCamera.node.setWorldScale(target.worldScale);

        //     Utils.syncCameraParameters(this._refelctionCamera, this.mainCamera);
        // }

        if (this._mesh && this._refractionCamera && this._refractionCamera.node.active) {
            Utils.syncCameraParameters(this._refractionCamera, this.mainCamera);
            Utils.syncCameraTransform(this._refractionCamera, this.mainCamera);
        }

        if (this._mesh && this._refractionGenCamera && this._refractionGenCamera.node.active) {
            Utils.syncCameraParameters(this._refractionGenCamera, this.mainCamera);
            Utils.syncCameraTransform(this._refractionGenCamera, this.mainCamera);
        }
    }
}
