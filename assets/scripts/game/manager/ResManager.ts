import { TileType } from "../type/Enum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResManager extends cc.Component {

    @property(cc.SpriteFrame)
    private a: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private b: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private c: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private d: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private e: cc.SpriteFrame = null;

    private static instance: ResManager = null;

    protected onLoad() {
        ResManager.instance = this;
    }

    /**
     * 获取方块图片资源
     * @param tileType 方块类型
     */
    public static getTileSpriteFrame(tileType: TileType): cc.SpriteFrame {
        switch (tileType) {
            case TileType.A:
                return this.instance.a;
            case TileType.B:
                return this.instance.b;
            case TileType.C:
                return this.instance.c;
            case TileType.D:
                return this.instance.d;
            case TileType.E:
                return this.instance.e;
        }
    }
}
