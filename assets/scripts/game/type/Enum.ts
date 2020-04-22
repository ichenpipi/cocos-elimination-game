
/**
 * 方块类型
 */
export enum TileType {
    A = 1,
    B,
    C,
    D,
    E,
}

/**
 * 方块点击事件
 */
export enum TileEvent {
    TouchStart = 'tile_touchstart',
    TouchEnd = 'tile_touchend',
    TouchCancel = 'tile_touchcancel',
}

/**
 * 滑动方向
 */
export enum SlideDirection {
    Up = 1, // 上
    Down, // 下
    Left, // 左
    Right, // 右
}

/**
 * 组合类型
 */
export enum CombinationType {
    Horizontal = 1, // 横型
    Vertical, // 竖型
    Cross, // 十字型
    TShape, // T 型
    LShape, // L 型
}