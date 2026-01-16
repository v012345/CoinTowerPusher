import { director,pipeline } from "cc";

export class GlobalUniformMgr {
    private static _inst: GlobalUniformMgr = null;
    public static get inst(): GlobalUniformMgr {
        if (this._inst == null) {
            this._inst = new GlobalUniformMgr();
        }
        return this._inst;
    }

    private _globalUniformMap = {};
    constructor() {
        let pipelineUBO = director.root.pipeline.pipelineUBO as any;
        let globalUBO = pipelineUBO._globalUBO;
        let cameraUBO = pipelineUBO._cameraUBO;

        //yz改写， w 空闲 highp
        let GLOBAL_UBO_TIME_OFFSET = 0;
        this._globalUniformMap['cc_time.y'] = { ubo: globalUBO, offset: GLOBAL_UBO_TIME_OFFSET + 1 };
        this._globalUniformMap['cc_time.z'] = { ubo: globalUBO, offset: GLOBAL_UBO_TIME_OFFSET + 2 };
        this._globalUniformMap['cc_time.w'] = { ubo: globalUBO, offset: GLOBAL_UBO_TIME_OFFSET + 3 };

        //w 空闲 mediump
        let CAMERA_UBO_GLOBAL_FOG_BASE_OFFSET = 132; // 3.6 之前，用 128
        this._globalUniformMap['cc_fogBase.w'] = { ubo: cameraUBO, offset: CAMERA_UBO_GLOBAL_FOG_BASE_OFFSET + 3 };

        //w 空闲 mediump
        let CAMERA_UBO_GLOBAL_FOG_ADD_OFFSET = 136; // v3.6 之前  用132
        this._globalUniformMap['cc_fogAdd.w'] = { ubo: cameraUBO, offset: CAMERA_UBO_GLOBAL_FOG_ADD_OFFSET + 3 };

        //zw 空闲 mediump
        let CAMERA_UBO_NEAR_FAR_OFFSET = 140; // v3.6之前  用 136
        this._globalUniformMap['cc_nearFar.z'] = { ubo: cameraUBO, offset: CAMERA_UBO_NEAR_FAR_OFFSET + 2 };
        this._globalUniformMap['cc_nearFar.w'] = { ubo: cameraUBO, offset: CAMERA_UBO_NEAR_FAR_OFFSET + 3 };


        let pl = director.root.pipeline;
        pipelineUBO.updateGlobalUBO = (window: any) => {

            const globalDSManager = pl.globalDSManager;
            const ds = pl.descriptorSet;
            const cmdBuffer = pl.commandBuffers;

            const root = director.root;
            const fv = pipelineUBO._globalUBO;
            const UBOGlobal = pipeline.UBOGlobal;
    
            const shadingWidth = Math.floor(window.width);
            const shadingHeight = Math.floor(window.height);
    
            // update UBOGlobal
            fv[UBOGlobal.TIME_OFFSET] = root.cumulativeTime;
            fv[UBOGlobal.TIME_OFFSET + 1] = root.frameTime;
            fv[UBOGlobal.TIME_OFFSET + 2] = director.getTotalFrames();
    
            fv[UBOGlobal.SCREEN_SIZE_OFFSET] = shadingWidth;
            fv[UBOGlobal.SCREEN_SIZE_OFFSET + 1] = shadingHeight;
            fv[UBOGlobal.SCREEN_SIZE_OFFSET + 2] = 1.0 / shadingWidth;
            fv[UBOGlobal.SCREEN_SIZE_OFFSET + 3] = 1.0 / shadingHeight;
    
            fv[UBOGlobal.NATIVE_SIZE_OFFSET] = shadingWidth;
            fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1] = shadingHeight;
            fv[UBOGlobal.NATIVE_SIZE_OFFSET + 2] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET];
            fv[UBOGlobal.NATIVE_SIZE_OFFSET + 3] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1];

            let uniformInfo: { ubo: any, offset: number, value: number } = this._globalUniformMap['cc_time.y'];
            if (uniformInfo) {
                uniformInfo.ubo[uniformInfo.offset] = uniformInfo.value;
            }

            uniformInfo = this._globalUniformMap['cc_time.z'];
            if (uniformInfo) {
                uniformInfo.ubo[uniformInfo.offset] = uniformInfo.value;
            }

            cmdBuffer[0].updateBuffer(ds.getBuffer(pipeline.UBOGlobal.BINDING), pipelineUBO._globalUBO);
            globalDSManager.bindBuffer(pipeline.UBOGlobal.BINDING, ds.getBuffer(pipeline.UBOGlobal.BINDING));
            globalDSManager.update();
        }
    }

    resetAll() {
        let keys = Object.keys(this._globalUniformMap);
        for (let i = 0; i < keys.length; ++i) {
            let key = keys[i];
            let uniformInfo: { ubo: any, offset: number, value: number } = this._globalUniformMap[key];
            uniformInfo.value = 0;
            uniformInfo.ubo[uniformInfo.offset] = 0;
        }
    }

    setGlobalUniform(name: string, value: number) {
        let uniformInfo: { ubo: any, offset: number, value: number } = this._globalUniformMap[name];
        if (uniformInfo == null) {
            console.log('can not find the global uniform info by given name:' + name);
            console.log('please use one of ' + Object.keys(this._globalUniformMap).join(','));
        }
        uniformInfo.ubo[uniformInfo.offset] = uniformInfo.value = value;
    }

    getGlobalUniform(name: string): number {
        let uniformInfo: { ubo: any, offset: number, value: number } = this._globalUniformMap[name];
        if (uniformInfo == null) {
            console.log('can not find the global uniform info by given name:' + name);
            console.log('please use one of ' + Object.keys(this._globalUniformMap).join(','));
            return 0;
        }
        return uniformInfo.value || 0;
    }
}