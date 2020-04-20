import MapManager from "./manager/MapManager";
import TileManager from "./manager/TileManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    protected start() {
        MapManager.init();
        TileManager.init();
    }

}
