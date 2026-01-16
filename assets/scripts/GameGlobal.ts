import { _decorator, Camera, Node } from 'cc';
// import { MainGame } from "./MainGame";
import { CameraControl } from './CameraControl';
import { Actor } from './Actor';
// import { CoinNumber } from './Utils/CoinNumber';
// import { Train } from './Train';
// import { Factory } from './Factory';



export class GameGlobal {
    // public static mainGame: MainGame;
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
}