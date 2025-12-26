import { Asset, assetManager, Component, game, Node, UITransform } from "cc";

type ResInfo = {
    count?: number,
    map?: Record<string, Asset>
}

export class LhResManager extends Component {
    private static _instance: LhResManager;
    public static get instance(): LhResManager {
        if (this._instance == null) {
            var node: Node = new Node("LhResManager");
            game.addPersistRootNode(node);
            node.addComponent(UITransform);
            this._instance = node.addComponent(LhResManager);
            this._instance.init();
        }
        return this._instance;
    }

    private _intervalDt: number;
    private _interval: number;

    private init() {
        this._curResData = {};
        this._releaseAssets = new Map();
        this._intervalDt = 0;
        this._interval = 10;
    }

    startup() {
        console.log("LhResManager startup");

        // let self = assetManager.assets;
        // assetManager.assets.remove = (key: string) => {
        //     if (key == "0661632e-fe4c-4f1d-9e71-18c206fca916@f9941") {
        //         console.log(`com_box_a2 的资源被释放了`)
        //     }
        //     const out = self._map![key];
        //     if (key in self._map!) {
        //         delete self._map![key];
        //         self._count--;
        //     }
        //     return out;
        // }
    }

    /**记录当前的资源信息 */
    private _curResData: ResInfo;
    private recordResData() {
        let assets: any = assetManager.assets;
        this._curResData.count = assets._count;
        // 记录资源路径
        this._curResData.map = {};
        for (let key in assets._map) {
            this._curResData.map[key] = assets._map[key];
        }
    }

    private compareResData() {
        let assets: any = assetManager.assets;
        let changeCount: number = assets._count - this._curResData.count;
        console.log("===============资源数量变化===============");
        console.log(changeCount);

        let removeMap: Record<string, Asset> = {};
        for (let key in this._curResData.map) {
            if (!assets._map[key]) {
                removeMap[key] = this._curResData.map[key];
            }
        }
        console.log("===============减少的资源===============");
        this.logRes(removeMap);

        let addMap: Record<string, Asset> = {};
        for (let key in assets._map) {
            if (!this._curResData.map[key]) {
                addMap[key] = assets._map[key];
            }
        }
        console.log("===============增加的资源===============");
        this.logRes(addMap);

        this.recordResData();
    }

    /**打印资源 */
    private logRes(map?: Record<string, Asset>) {
        console.log("===============打印的资源===============");
        if (!map) {
            map = this._curResData.map;
        }
        console.log(map);
    }

    // 动态资源
    private _dynamicAssets: Record<string, Asset> = {};
    private _releaseAssets: Map<string, Asset>;
    getDynamicAsset(uuid: string) {
        return this._dynamicAssets[uuid];
    }

    addDynamicRef(asset: Asset) {
        if (!this._dynamicAssets[asset.uuid]) {
            this._dynamicAssets[asset.uuid] = asset;
            asset.addRef();
        }
        asset.addRef();
    }
    decDynamicRef(uuid: string);
    decDynamicRef(asset: Asset);
    decDynamicRef(uuid: Asset | string) {
        if (!uuid) {
            return;
        }
        if (uuid instanceof Asset) {
            uuid = uuid.uuid;
        }
        let asset: Asset = this._dynamicAssets[uuid];
        if (asset) {
            asset.decRef();
        }
    }
    onAddRef(uuid: string) {
        if (this._releaseAssets.has(uuid)) {
            // 放回动态资源
            this._dynamicAssets[uuid] = this._releaseAssets.get(uuid);

            // if (uuid == "0661632e-fe4c-4f1d-9e71-18c206fca916@f9941") {
            //     console.log(`com_box_a2 从待释放列表中移除`)
            // }
            this._releaseAssets.delete(uuid);
        }
    }
    onDecRef(uuid: string) {
        if (this._dynamicAssets[uuid]) {
            let asset: Asset = this._dynamicAssets[uuid];
            if (asset.refCount == 1) {
                // if (uuid == "0661632e-fe4c-4f1d-9e71-18c206fca916@f9941") {
                //     console.log(`com_box_a2 添加到了待释放`)
                // }
                // 引用次数为1，加入到释放列表
                this._releaseAssets.set(uuid, asset);
                // 从动态资源中移除
                delete this._dynamicAssets[uuid];
            }
        }
    }

    update(dt: number) {
        this._intervalDt += dt;
        if (this._intervalDt < this._interval) {
            return;
        }
        this._intervalDt = 0;
        for (const element of this._releaseAssets) {
            let asset = element[1];
            this._releaseAssets.delete(asset.uuid);
            asset.decRef(false);
            assetManager.releaseAsset(asset);
        }
    }
}

