import { _decorator, Node } from 'cc';
import { IViewState } from '../IViewState';
import { ViewStateData } from '../ViewStateData';
const { ccclass, property } = _decorator;

@ccclass('BaseViewState')
export abstract class BaseViewState<TTarget = Node> implements IViewState {
    private mNode: Node;
    private mData: ViewStateData;
    /** 当前切换器的目标 */
    protected target: TTarget;
    /** 当前切换器的缓动 */
    public get data(): ViewStateData { return this.mData; }
    /** 切换状态值 */
    public abstract changeValue(index: number): void;
    /** 在编辑器模式下切换 */
    public abstract changeValueOnEditor(index: number): void;
    /** 初始化 */
    public initialize(node: Node, data: ViewStateData) {
        this.mData = data;
        this.mNode = node;
        this.findViewStateTarget();
    }
    /** 获取当前切换器的目标 */
    protected findViewStateTarget() {
        if (!this.mData || !this.mNode) return;
        let targetComp: any = null;
        if (this.mData.compName == "cc.Node") targetComp = this.mNode;
        else targetComp = this.mNode.getComponent(this.mData.compName);
        this.target = targetComp;
    }

    public dispose(): void {
        this.mData = null;
        this.target = null;
    }
}