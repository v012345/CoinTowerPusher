import { _decorator, Camera, Node } from 'cc';
import { MainGame } from "./MainGame";
import { CameraControl } from './CameraControl';
import { Actor } from './Actor';
import { Tractor } from './prefabs/Tractor';
// import { CoinNumber } from './Utils/CoinNumber';
// import { Train } from './Train';
// import { Factory } from './Factory';



export class GameGlobal {
    static realWidth = 720;
    static realHeight = 720;
    static viewScale: number = 1;
    public static mainGame: MainGame;
    public static mainCamera: Camera;
    public static CameraControl: CameraControl;
    public static cameraMoving: boolean = false;
    public static effectLay: Node;
    public static uiLay: Node;
    // public static coinNumber: CoinNumber;
    // public static coin: number = 0;
    public static actor: Actor;
    // public static train: Train;
    // public static factory: Factory;
    // public static failNum: number = 0;
    public static cargoBed: Node;
    public static Tractor: Node;
    public static TractorScript: Tractor;
    public static levelMap: Record<number, number> = {
        1: 1,
        2: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 2,
        9: 2,
        10: 2,
        11: 2,
        12: 2,
        13: 2,
        14: 2,
        15: 2,
        16: 2,
        17: 3,
    };
}