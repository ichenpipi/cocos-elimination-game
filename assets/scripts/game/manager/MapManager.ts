import GameConfig from "../../data/GameConfig";
import { Coordinate } from "../type/DataStructure";

export default class MapManager {

    private static _posMap: cc.Vec2[][] = null;
    public static getPos(x: number | Coordinate, y?: number): cc.Vec2 {
        if (typeof x === 'number') return this._posMap[x][y];
        else return this._posMap[x.x][x.y];
    }

    private static width: number = null;

    private static height: number = null;

    private static beginX: number = null;

    private static beginY: number = null;

    /**
     * 初始化
     */
    public static init() {
        this.generatePosMap();
    }

    /**
     * 生成位置表
     */
    private static generatePosMap() {
        this._posMap = [];
        // 计算宽高
        this.width = (GameConfig.padding * 2) + (GameConfig.size * GameConfig.col) + (GameConfig.spacing * (GameConfig.col - 1));
        this.height = (GameConfig.padding * 2) + (GameConfig.size * GameConfig.row) + (GameConfig.spacing * (GameConfig.row - 1));
        // 以左下角为原点，计算第一个方块的位置
        this.beginX = -(this.width / 2) + GameConfig.padding + (GameConfig.size / 2);
        this.beginY = -(this.height / 2) + GameConfig.padding + (GameConfig.size / 2);
        // 计算所有方块的位置
        // 从左到右计算每一列方块的位置
        for (let c = 0; c < GameConfig.col; c++) {
            let colSet = [];
            let x = this.beginX + c * (GameConfig.size + GameConfig.spacing);
            // 从下到上计算该列的每一个方块的位置
            for (let r = 0; r < GameConfig.row; r++) {
                let y = this.beginY + r * (GameConfig.size + GameConfig.spacing);
                colSet.push(cc.v2(x, y));
            }
            this._posMap.push(colSet);
        }
    }
}
