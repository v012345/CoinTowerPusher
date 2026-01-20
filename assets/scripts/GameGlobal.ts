import { _decorator, Camera, Node } from 'cc';
import { MainGame } from "./MainGame";
import { CameraControl } from './CameraControl';
import { Actor } from './Actor';
import { Tractor } from './prefabs/Tractor';
import { Coin } from './prefabs/Coin';
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
    public static CoinsPool: Array<Coin> = [];
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
        13: 3,
        14: 3,
        15: 3,
        16: 3,
        17: 3,
    };
    public static CargoBedUp: Record<number, Array<number>> = {
        1: [0, 500], // level: [cost, capacity]
        2: [200, 1000],
        3: [300, 3000],
        4: [400, 5000],
    };
    public static GearsUp: Record<number, number> = {
        1: 0,
        2: 100,
        3: 200,
        4: 300,
    };
    public static SpeedUp: Record<number, number> = {
        1: 0,
        2: 100,
        3: 100,
        4: 100,
    };
}