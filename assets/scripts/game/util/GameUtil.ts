import { TileType, SlideDirection } from "../type/Enum";
import GameConfig from "../../data/GameConfig";
import { Coordinate, Coord, Combination } from "../type/DataStructure";

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
    public static getSlidDirection(startPos: cc.Vec2, endPos: cc.Vec2): SlideDirection {
        let offsetX = endPos.x - startPos.x; // x 偏移
        let offsetY = endPos.y - startPos.y; // y 偏移

        if (Math.abs(offsetX) < Math.abs(offsetY)) {
            return offsetY > 0 ? SlideDirection.Up : SlideDirection.Down
        } else {
            return offsetX > 0 ? SlideDirection.Right : SlideDirection.Left;
        }
    }

    /**
     * 获取指定方向的坐标
     * @param coord 坐标
     * @param direction 方向
     */
    public static getCoordByDirection(coord: Coordinate, direction: SlideDirection) {
        switch (direction) {
            case SlideDirection.Up:
                return coord.y === GameConfig.row - 1 ? null : Coord(coord.x, coord.y + 1);
            case SlideDirection.Down:
                return coord.y === 0 ? null : Coord(coord.x, coord.y - 1);
            case SlideDirection.Left:
                return coord.x === 0 ? null : Coord(coord.x - 1, coord.y);
            case SlideDirection.Right:
                return coord.x === GameConfig.col - 1 ? null : Coord(coord.x + 1, coord.y);
        }
    }

    /**
     * 获取可消除的组合
     */
    public static getCombinations(typeMap: TileType[][]) {
        let combinations: Combination[] = [];
        // 逐行检测
        for (let r = 0; r < GameConfig.row; r++) {
            let count: number = 0;
            let type: TileType = null;
            for (let c = 0; c < GameConfig.col; c++) {
                if (c === 0) {
                    count = 1; // 连续计数
                    type = typeMap[c][r]; // 保存类型
                } else {
                    if (typeMap[c][r] && typeMap[c][r] === type) {
                        // 类型相同
                        count++;
                        // 到最后一个了，是不是有 3 个以上连续
                        if (c === GameConfig.col - 1 && count >= 3) {
                            let coords = [];
                            for (let i = 0; i < count; i++) {
                                coords.push(Coord(c - i, r));
                            }
                            combinations.push(new Combination(coords));
                        }
                    } else {
                        // 类型不同
                        if (count >= 3) {
                            // 已累积 3 个
                            let coords = [];
                            for (let i = 0; i < count; i++) {
                                coords.push(Coord(c - 1 - i, r));
                            }
                            combinations.push(new Combination(coords));
                        }
                        // 重置
                        count = 1;
                        type = typeMap[c][r];
                    }
                }
            }
        }
        // 逐列检测
        for (let c = 0; c < GameConfig.col; c++) {
            let count: number = 0;
            let type: TileType = null;
            for (let r = 0; r < GameConfig.row; r++) {
                if (r === 0) {
                    count = 1;
                    type = typeMap[c][r];
                } else {
                    if (typeMap[c][r] && typeMap[c][r] === type) {
                        count++;
                        if (r === GameConfig.row - 1 && count >= 3) {
                            let coords = [];
                            for (let i = 0; i < count; i++) {
                                coords.push(Coord(c, r - i));
                            }
                            // 是否可以和已有组合合并
                            let hasMerge = false;
                            for (let i = 0; i < combinations.length; i++) {
                                let common = combinations[i].include(coords);
                                if (common) {
                                    combinations[i].merge(coords, common);
                                    hasMerge = true;
                                    break;
                                }
                            }
                            if (!hasMerge) combinations.push(new Combination(coords));
                        }
                    } else {
                        if (count >= 3) {
                            let coords = [];
                            for (let i = 0; i < count; i++) {
                                coords.push(Coord(c, r - 1 - i));
                            }
                            // 是否可以和已有组合合并
                            let hasMerge = false;
                            for (let i = 0; i < combinations.length; i++) {
                                let common = combinations[i].include(coords);
                                if (common) {
                                    combinations[i].merge(coords, common);
                                    hasMerge = true;
                                    break;
                                }
                            }
                            if (!hasMerge) combinations.push(new Combination(coords));
                        }
                        count = 1;
                        type = typeMap[c][r];
                    }
                }
            }
        }
        return combinations;
    }

    /**
     * 获取初始类型表
     */
    public static getInitTypeMap(): TileType[][] {
        let typeMap: TileType[][] = [];
        for (let c = 0; c < GameConfig.col; c++) {
            let colSet: TileType[] = [];
            for (let r = 0; r < GameConfig.row; r++) {
                let excludeTypes = [];
                // 水平检测前面 2 个相同类型
                let rowType: TileType = null;
                if (c > 1 && typeMap[c - 1][r] === typeMap[c - 2][r]) rowType = typeMap[c - 1][r];
                if (rowType) excludeTypes.push(rowType);
                // 垂直检测下面 2 个相同类型
                let colType: TileType = null;
                if (r > 1 && colSet[r - 1] === colSet[r - 2]) colType = colSet[r - 1];
                if (colType) excludeTypes.push(colType);
                // 添加可用的随机类型
                colSet.push(GameUtil.getRandomType(excludeTypes));
            }
            typeMap.push(colSet);
        }
        return typeMap;
    }

    /**
     * 是否有可一步消除的组合
     */
    public static hasValidCombo(map: TileType[][]) {
        for (let r = 0; r < GameConfig.row; r++) {
            for (let c = 0; c < GameConfig.col; c++) {
                if (c + 3 < GameConfig.col) {
                    if (map[c][r] === map[c + 1][r] && map[c][r] === map[c + 3][r]) { // 1 1 X 1
                        return true;
                    }
                    if (map[c][r] === map[c + 2][r] && map[c][r] === map[c + 3][r]) { // 1 X 1 1
                        return true;
                    }
                }
                if (c + 2 < GameConfig.col) {
                    if (map[c][r] === map[c + 1][r]) {
                        if (r - 1 >= 0 && map[c][r] === map[c + 2][r - 1]) { // 1 1 X
                            return true;                                     // X X 1
                        }
                        if (r + 1 < GameConfig.row && map[c][r] === map[c + 2][r + 1]) { // X X 1
                            return true;                                                 // 1 1 X
                        }
                    }
                    if (map[c][r] === map[c + 2][r]) {
                        if (r - 1 >= 0 && map[c][r] === map[c + 1][r - 1]) { // 1 X 1
                            return true;                                     // X 1 X
                        }
                        if (r + 1 < GameConfig.row && map[c][r] === map[c + 1][r + 1]) { // X 1 X
                            return true;                                                 // 1 X 1
                        }
                    }
                    if (r - 1 >= 0 &&
                        map[c][r] === map[c + 1][r - 1] && map[c + 1][r - 1] === map[c + 2][r - 1]) { // 1 X X
                        return true;                                                                  // X 1 1
                    }
                    if (r + 1 < GameConfig.row &&
                        map[c][r] === map[c + 1][r + 1] && map[c + 1][r + 1] === map[c + 2][r + 1]) { // X 1 1
                        return true;                                                                  // 1 X X
                    }
                }

                if (r + 3 < GameConfig.row) {
                    if (map[c][r] === map[c][r + 1] && map[c][r] === map[c][r + 3]) {
                        return true;
                    }
                    if (map[c][r] === map[c][r + 2] && map[c][r] === map[c][r + 3]) {
                        return true;
                    }
                }
                if (r + 2 < GameConfig.row) {
                    if (map[c][r] === map[c][r + 1]) {
                        if (c - 1 >= 0 && map[c][r] === map[c - 1][r + 2]) {
                            return true;
                        }
                        if (c + 1 < GameConfig.col && map[c][r] === map[c + 1][r + 2]) {
                            return true;
                        }
                    }
                    if (map[c][r] === map[c][r + 2]) {
                        if (c - 1 >= 0 && map[c][r] === map[c - 1][r + 1]) {
                            return true;
                        }
                        if (c + 1 < GameConfig.col && map[c][r] === map[c + 1][r + 1]) {
                            return true;
                        }
                    }
                    if (c - 1 >= 0 &&
                        map[c][r] === map[c - 1][r + 1] && map[c - 1][r + 1] === map[c - 1][r + 2]) {
                        return true;
                    }
                    if (c + 1 < GameConfig.col &&
                        map[c][r] === map[c + 1][r + 1] && map[c + 1][r + 1] === map[c + 1][r + 2]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

}
