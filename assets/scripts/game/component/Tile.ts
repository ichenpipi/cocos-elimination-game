import { TileType, TileEvent } from "../type/Enum";
import { Coordinate, Coord } from "../type/DataStructure";
import ResManager from "../manager/ResManager";
import PoolManager from "../manager/PoolManager";
import { GameEvent } from "../../../eazax-ccc/core/GameEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Tile extends cc.Component {

    @property(cc.Sprite)
    private sprite: cc.Sprite = null; // 显示图片的组件

    private _type: TileType = null; // 类型
    /**
     * 获取该方块的类型
     */
    public get type() { return this._type; }

    private _coord: Coordinate = null; // 坐标
    /**
     * 获取该方块的坐标
     */
    public get coord() { return this._coord; }

    protected onLoad() {
        this.bindTouchEvents();
    }

    protected onDestroy() {
        this.unbindTouchEvents();
    }

    /**
     * 节点池复用回调
     */
    public reuse() {
        this.bindTouchEvents();
    }
    /**
     * 节点池回收回调
     */
    public unuse() {
        this.unbindTouchEvents();
    }

    /**
     * touchstart 回调
     * @param e 参数
     */
    private onTouchStart(e: cc.Event.EventTouch) {
        GameEvent.emit(TileEvent.TouchStart, this._coord.copy(), e.getLocation());
    }

    /**
     * touchend 回调
     */
    private onTouchEnd() {
        GameEvent.emit(TileEvent.TouchEnd);
    }

    /**
     * touchcancel 回调
     * @param e 参数
     */
    private onTouchCancel(e: cc.Event.EventTouch) {
        GameEvent.emit(TileEvent.TouchCancel, this._coord.copy(), e.getLocation());
    }

    /**
     * 绑定点击事件
     */
    private bindTouchEvents() {
        this.node.on('touchstart', this.onTouchStart, this);
        this.node.on('touchcancel', this.onTouchCancel, this);
        this.node.on('touchend', this.onTouchEnd, this);
    }

    /**
     * 解绑点击事件
     */
    private unbindTouchEvents() {
        this.node.off('touchstart', this.onTouchStart, this);
        this.node.off('touchcancel', this.onTouchCancel, this);
        this.node.off('touchend', this.onTouchEnd, this);
    }

    /**
     * 初始化
     */
    public init() {
        this._type = null;
        this.sprite.spriteFrame = null;
        if (!this._coord) this._coord = Coord();
        this.node.setScale(0);
    }

    /**
     * 设置类型
     * @param type 类型
     */
    public setType(type: TileType) {
        this._type = type;
        this.updateDisplay();
    }

    /**
     * 更新方块图片
     */
    private updateDisplay() {
        this.sprite.spriteFrame = ResManager.getTileSpriteFrame(this._type);
    }

    /**
     * 设置坐标
     * @param x 横坐标
     * @param y 纵坐标
     */
    public setCoord(x: number | Coordinate, y?: number) {
        if (!this._coord) this._coord = Coord();
        this._coord.set(x, y);
    }

    /**
     * 显示方块
     */
    public appear() {
        cc.tween(this.node)
            .to(0.075, { scale: 1.1 })
            .to(0.025, { scale: 1 })
            .start();
    }

    /**
     * 消失并回收
     */
    public disappear() {
        cc.tween(this.node)
            .to(0.1, { scale: 0 })
            .call(() => PoolManager.put(this.node))
            .start();
    }

}
