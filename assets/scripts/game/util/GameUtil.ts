import { TileType, SlidDirection } from "../type/Enum";
import GameConfig from "../../data/GameConfig";
import { Coordinate, Coord } from "../type/DataStructure";

export default class GameUtil {

    /**
     * 获取随机类型
     * @param exclude 需排除的类型
     */
    public static getRandomType(exclude: TileType[] = []): TileType {
        let types = GameConfig.types.concat();
        for (let i = 0; i < exclude.length; i++) {
            types.splice(types.indexOf(exclude[i]), 1);
        }
        return types[Math.floor(types.length * Math.random())];
    }

    /**
     * 获取滑动的方向
     * @param startPos 开始位置
     * @param endPos 结束位置
     */
    public static getSlidDirection(startPos: cc.Vec2, endPos: cc.Vec2): SlidDirection {
        let offsetX = endPos.x - startPos.x; // x 偏移
        let offsetY = endPos.y - startPos.y; // y 偏移

        if (Math.abs(offsetX) < Math.abs(offsetY)) {
            return offsetY > 0 ? SlidDirection.Up : SlidDirection.Down
        } else {
            return offsetX > 0 ? SlidDirection.Right : SlidDirection.Left;
        }
    }

    /**
     * 获取指定方向的坐标
     * @param coord 坐标
     * @param direction 方向
     */
    public static getCoordByDirection(coord: Coordinate, direction: SlidDirection) {
        switch (direction) {
            case SlidDirection.Up:
                return coord.y === GameConfig.row - 1 ? null : Coord(coord.x, coord.y + 1);
            case SlidDirection.Down:
                return coord.y === 0 ? null : Coord(coord.x, coord.y - 1);
            case SlidDirection.Left:
                return coord.x === 0 ? null : Coord(coord.x - 1, coord.y);
            case SlidDirection.Right:
                return coord.x === GameConfig.col - 1 ? null : Coord(coord.x + 1, coord.y);
        }
    }

}
