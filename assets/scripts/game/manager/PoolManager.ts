import Tile from "../component/Tile";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PoolManager extends cc.Component {

    @property(cc.Prefab)
    private tilePrefab: cc.Prefab = null;

    private tilePool: cc.NodePool = new cc.NodePool(Tile);

    private static instance: PoolManager = null;

    protected onLoad() {
        PoolManager.instance = this;
    }

    /**
     * 获取节点
     */
    public static get() {
        if (this.instance.tilePool.size() > 0) return this.instance.tilePool.get();
        else return cc.instantiate(this.instance.tilePrefab);
    }

    /**
     * 存入节点
     * @param node 
     */
    public static put(node: cc.Node) {
        cc.Tween.stopAllByTarget(node);
        if (this.instance.tilePool.size() < 30) this.instance.tilePool.put(node);
        else node.destroy();
    }
}
