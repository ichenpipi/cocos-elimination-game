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