import Tile from "../component/Tile";
import { CombinationType } from "./Enum";

/**
 * 坐标
 */
export class Coordinate {

    public x: number; // 横坐标

    public y: number; // 纵坐标

    /**
     * 构造函数
     * @param x 横坐标
     * @param y 纵坐标
     */
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * 更新赋值
     * @param x 横坐标
     * @param y 纵坐标
     */
    public set(x: number | Coordinate, y?: number) {
        if (typeof x === 'number') {
            this.x = x;
            this.y = y;
        } else {
            this.x = x.x;
            this.y = x.y;
        }
    }

    /**
     * 复制
     */
    public copy(): Coordinate {
        return new Coordinate(this.x, this.y);
    }

    /**
     * 对比
     * @param x 比较对象
     */
    public compare(x: number | Coordinate, y?: number): boolean {
        if (typeof x === 'number') return this.x === x && this.y === y;
        else return this.x === x.x && this.y === x.y;
    }

    /**
     * 是否相邻
     * @param coord 比较对象
     */
    public isAdjacent(coord: Coordinate): boolean {
        if (this.x === coord.x && (this.y === coord.y + 1 || this.y === coord.y - 1)) return true;
        else if (this.y === coord.y && (this.x === coord.x + 1 || this.x === coord.x - 1)) return true;
        else return false;
    }

    /**
     * 转换为方便阅读的字符串
     */
    public toString(): string {
        return '(x:' + this.x + ', ' + 'y:' + this.y + ')';
    }
}

/**
 * 创建坐标对象
 * @param x 横坐标
 * @param y 纵坐标
 */
export function Coord(x: number = 0, y: number = 0) {
    return new Coordinate(x, y);
}

/**
 * 组合
 */
export class Combination {

    public coords: Coordinate[]; // 坐标集

    public commonCoord: Coordinate; // 共同坐标

    public type: CombinationType; // 组合类型

    constructor(coords: Coordinate[]) {
        this.coords = coords;
        this.updateType();
    }

    /**
     * 更新类型
     */
    private updateType() {
        let up = 0;
        let down = 0;
        let left = 0;
        let right = 0;
        let keyCoord = this.commonCoord ? this.commonCoord : this.coords[0]; // 关键坐标
        // 收集数量
        for (let i = 0; i < this.coords.length; i++) {
            if (this.coords[i].compare(keyCoord)) continue; // 同一个坐标时跳过
            // 判断位置
            if (this.coords[i].x === keyCoord.x) {
                if (this.coords[i].y > keyCoord.y) up++;
                else down++;
            } else {
                if (this.coords[i].x < keyCoord.x) left++;
                else right++;
            }
        }
        // 判断类型
        if (up === 0 && down === 0) this.type = CombinationType.Horizontal;
        else if (left === 0 && right === 0) this.type = CombinationType.Vertical;
        else if (up > 0 && down > 0 && left > 0 && right > 0) this.type = CombinationType.Cross;
        else if ((up > 0 && down === 0 && left === 0 && right > 0) ||
            (up > 0 && down === 0 && left > 0 && right === 0) ||
            (up === 0 && down > 0 && left === 0 && right > 0) ||
            (up === 0 && down > 0 && left > 0 && right === 0)) {
            this.type = CombinationType.LShape;
        } else if ((up === 0 && down > 0 && left > 0 && right > 0) ||
            (up > 0 && down === 0 && left > 0 && right > 0) ||
            (up > 0 && down > 0 && left === 0 && right > 0) ||
            (up > 0 && down > 0 && left > 0 && right === 0)) {
            this.type = CombinationType.TShape;
        }
    }

    /**
     * 组合是否包含坐标集中的任意一个，有得返回对应坐标
     * @param coords 查询坐标集
     */
    public include(coords: Coordinate[]): Coordinate {
        for (let i = 0; i < this.coords.length; i++) {
            for (let j = 0; j < coords.length; j++) {
                if (this.coords[i].compare(coords[j])) return coords[j];
            }
        }
        return null;
    }

    /**
     * 合并组合
     * @param coords 坐标集
     * @param commonCoord 共同坐标
     */
    public merge(coords: Coordinate[], commonCoord: Coordinate) {
        for (let i = 0; i < coords.length; i++) {
            if (!coords[i].compare(commonCoord))
                this.coords.push(coords[i]);
        }
        this.commonCoord = commonCoord;
        this.updateType();
    }
}