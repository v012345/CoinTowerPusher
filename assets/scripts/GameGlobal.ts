import { _decorator, Camera, Node, Vec3 } from 'cc';
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
    public static ItemPrice: Record<number, number> = {
        1: 5, // id price
        2: 10,
        3: 15,
        4: 20,
        5: 30,
        6: 50,
        7: 80,
        8: 120,
        9: 200,
        10: 300,
    };
    public static CargoBedUp: Record<number, Array<number>> = {
        1: [0, 80], // level: [item_id, capacity]
        2: [1, 160],
        3: [2, 320],
        4: [3, 740],
    };
    public static GearsUp: Record<number, number> = {
        1: 0,
        2: 10,
        3: 20,
        4: 30,
    };
    public static SpeedUp: Record<number, Array<number>> = {
        1: [0, 10],
        2: [1, 15],
        3: [2, 20],
        4: [3, 25],
    };
    public static FirstCoinPosInCargo: Record<number, Vec3> = {
        1: new Vec3(-5, 0.3, -2.5),
        2: new Vec3(-5, 0.3, -3.5),
        3: new Vec3(-3, 0.3, -7),
        4: new Vec3(-4.5, 0.3, -9),
    }
    public static CoinSize: Record<number, Array<number>> = {
        1: [3, 1, 4],
        2: [3, 1, 3],
        3: [3, 1, 3],
        4: [3, 1, 3],
    }
}