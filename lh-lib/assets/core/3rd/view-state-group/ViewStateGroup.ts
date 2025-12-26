import { _decorator, Asset, AssetManager, assetManager, CCInteger, CCString, Color, Component, Event, js, Node, Size, Vec3 } from 'cc';
import { EDITOR } from 'cc/env';
import { IViewState } from './IViewState';
import { ViewStateData } from './ViewStateData';
import { ViewStateType } from './ViewStateType';

const { ccclass, property } = _decorator;

@ccclass('ViewTargetData')
class ViewTargetData {
    @property public enabled: boolean = true;
    @property({ type: Node }) public target: Node;
    @property({ type: [ViewStateData] }) public viewStates: ViewStateData[] = [];
}
enum EventType {
    /** 切换状态，1个参数(view:ViewStateGroup) */
    STATE_CHANGED = "OnViewStateChanged",
}
/**
 * 视图控制器，通过切换控制器的名称可以显示不同的视图样式
 */
@ccclass('ViewStateGroup')
export class ViewStateGroup extends Component {
    /** 控制器相关事件 */
    public static EventType = EventType;
    private static ViewStateClzs: Record<number, { new(): IViewState }> = {};
    public static setViewStateClass(type: ViewStateType, clz: { new(): IViewState }) { this.ViewStateClzs[type] = clz; }
    private mTimeOutId: any;
    private _stateName: string = "";
    private mViewStates = new Map<ViewStateData, IViewState>();
    @property({ serializable: true }) private _index: number = 0;
    @property({ type: [ViewTargetData] }) private _targets: ViewTargetData[] = [];
    @property({ type: [CCString] }) public stateNames: string[] = [];
    @property({ type: CCInteger }) public get index(): number { return this._index; }
    @property({ type: [ViewTargetData] }) public get targets(): ViewTargetData[] { return this._targets; }

    public get count(): number { return this.stateNames.length; }
    public get stateName(): string { return this._stateName; }
    public set stateName(value: string) {
        if (value == this._stateName) return;
        this.index = this.stateNames.indexOf(value);
    }
    public set index(value: number) {
        if (value < 0 || value >= this.stateNames.length) return;
        if (value == this._index) return;
        this._index = value;
        this._stateName = this.stateNames[value];
        this.node.emit(EventType.STATE_CHANGED, this);
        this.invalidate();
    }
    protected onLoad(): void {
        if (this.stateNames.length <= 0) return;
        this._index = Math.min(Math.max(0, this._index), this.stateNames.length - 1);
        this._stateName = this.stateNames[this.index];
        this.invalidate();
    }

    protected onRender(): void {
        if (!this.node?.isValid || !this.node?.active) return;
        if (this.stateNames.length == 0) return;
        for (let i = 0; i < this.targets.length; i++) {
            let targetData = this.targets[i];
            if (!targetData.target) continue;
            if (!targetData.enabled) continue;
            let viewStates = targetData.viewStates;
            if (viewStates.length == 0) continue;
            for (let j = 0; j < viewStates.length; j++) {
                let data = viewStates[j];
                if (!data.enabled) continue;
                if (data.type == ViewStateType.None) continue;
                this.createViewState(targetData.target, data);
                if (!this.mViewStates.has(data)) continue;
                let viewState = this.mViewStates.get(data);
                if (!viewState || !viewState.data) continue;
                if (!EDITOR) viewState.changeValue(this.index);
                else viewState.changeValueOnEditor(this.index);
            }
        }
    }
    private createViewState(target: Node, data: ViewStateData) {
        if (this.mViewStates.has(data)) return;
        if (!ViewStateGroup.ViewStateClzs[data.type]) return;
        let viewState = new ViewStateGroup.ViewStateClzs[data.type]();
        this.mViewStates.set(data, viewState);
        viewState.initialize(target, data);
    }
    /** 切换到第一个状态 */
    public fristState() { this.index = 0; }
    /** 切换到最后一个状态 */
    public lastState() { this.index = this.count - 1; }
    /** 切换到下一个状态 */
    public nextState() { this.index = (this.index + 1) % this.count; }
    /** 切换到上一个状态 */
    public previousState() { this.index = (this.index + this.count - 1) % this.count; }

    public changeState(index: number);
    public changeState(stateName: string);
    public changeState(evt: Event, index: number);
    public changeState(evt: Event, stateName: string);
    /** 切换到指定状态,传入参数为Number类型时表示切换index，String类型时表示切换stateName */
    public changeState(arg1: any, arg2?: any) {
        let state = arg2 != null ? arg2 : arg1;
        if (typeof state === "number") this.index = state;
        else if (typeof state === "string") this.stateName = state;
    }

    public invalidate() {
        if (!this.node?.isValid || this.mTimeOutId) return;
        this.mTimeOutId = setTimeout(() => this.onInvalidate(), 0);
    }
    public onInvalidate(): void {
        this.clearFramer();
        this.onRender();
    }

    private clearFramer() {
        if (!this.mTimeOutId) return;
        clearTimeout(this.mTimeOutId);
        this.mTimeOutId = null;
    }
    public onDisable() { this.clearFramer(); }
    protected onDestroy(): void { this.dispose(); }
    public dispose(): void {
        this.clearFramer();
        this.mViewStates.clear();
        this.stateNames.length = 0;
        while (this.targets.length > 0) {
            let t = this.targets.shift();
            let v = t.viewStates;
            t.target = null;
            while (v.length > 0)
                v.shift().dispose();
        }
    }
    /** 
     * 解析ViewStateGroup数据,仅在编辑器中使用
     * @example 如需在运行时解析数据，需自行重写 loadAssetAsync 和 loadBundleAsync 方法
     * @example ViewStateGroup.prototype.loadAssetAsync = function (bundle: string, path: string, type: any) {}
     * 
     */
    public async parseData(data: any) {
        this.targets.length = 0;
        if (!data || !data.stateNames || !data.targets) return;
        this._index = data.index;
        this.stateNames = data.stateNames;
        let rootNode = this.node.getRootNode();
        for (let i = 0; i < data.targets.length; i++) {
            let targetJson = data.targets[i];
            let targetData = new ViewTargetData();
            let targetPath = targetJson.path;
            this.targets.push(targetData);
            targetData.enabled = targetJson.enabled;
            if (targetPath) {
                if (rootNode.name && targetPath.startsWith(rootNode.name)) {// 从根节点开始
                    targetPath = targetPath.substring(rootNode.name.length + 1);
                }
                targetData.target = rootNode.getChildByPath(targetPath);
            }
            for (let j = 0; j < targetJson.viewStates.length; j++) {
                let viewData = new ViewStateData();
                let viewJson = targetJson.viewStates[j];
                let customData = viewJson.customData;
                targetData.viewStates.push(viewData);
                viewData.type = viewJson.type;
                if (viewJson.type == ViewStateType.None) continue;
                viewData.tweenDuration = viewJson.tweenDuration ?? 0.2;
                viewData.isTween = viewJson.isTween ?? true;
                viewData.compName = viewJson.compName;
                viewData.enabled = viewJson.enabled;
                let valueName = viewJson.valueName;
                if (customData) {
                    valueName = customData.valueName;
                    for (const key in customData)
                        viewData.customData[key] = customData[key];
                }
                let values = viewData[valueName];
                if (!valueName || !values) continue;
                for (let m = 0; m < viewJson.values.length; m++) {
                    let valueJson = viewJson.values[m];
                    if (valueJson != null && typeof valueJson === "object") {
                        let valueData;
                        if (valueName == "vectors") valueData = new Vec3();
                        else if (valueName == "sizes") valueData = new Size();
                        else if (valueName == "colors") valueData = new Color();
                        else {
                            let assetType = js.getClassByName(valueJson.type);
                            if (!valueJson.bundle) valueData = await this.loadUUIDAsync(valueJson.uuid, assetType);
                            else {
                                if (EDITOR) valueData = await this.loadUUIDAsync(valueJson.uuid, assetType);
                                else valueData = await this.loadAssetAsync(valueJson.bundle, valueJson.path, assetType);
                            }
                            valueJson = null;
                        }
                        if (valueJson) {
                            for (const key in valueJson)
                                valueData[key] = valueJson[key];
                        }
                        values[m] = valueData;
                    } else values[m] = valueJson;
                }
            }
        }
        this.invalidate();
    }

    public async loadAssetAsync(bundleName: string, path: string, type: any) {
        let bundle = await this.loadBundleAsync(bundleName);
        return new Promise<Asset | null>((resolve, reject) => {
            bundle.load(path, type, (err, asset) => {
                if (err != null) console.log(err);
                resolve(asset);
            });
        });
    }

    public async loadBundleAsync(bundleName: string) {
        let bundle = assetManager.getBundle(bundleName);
        if (bundle) return bundle;
        return new Promise<AssetManager.Bundle | null>((resolve, reject) => {
            assetManager.loadBundle(bundleName, (err, asset) => {
                if (err != null) console.log(err);
                resolve(asset);
            });
        });
    }
    public async loadUUIDAsync(uuid: string, type: any) {
        return new Promise<Asset | null>((resolve, reject) => {
            assetManager.loadAny({ uuid }, (err, asset) => {
                if (err != null) console.log(err);
                resolve(asset);
            });
        });
    }
    /** 此方法仅供编辑器调用的方法 */
    public reloadOnEditor(isValueChanged: boolean = false) {
        this.mViewStates.clear();
        if (!isValueChanged) return;
        this.invalidate();
    }
}