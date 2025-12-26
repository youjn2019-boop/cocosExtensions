import { _decorator, Node } from 'cc';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';
const { ccclass, property } = _decorator;

/**
 * 显示/隐藏切换器
 * 
 */
@ccclass('VisibleViewState')
export class VisibleViewState extends BaseViewState<Node> {
    public changeValue(index: number): void {
        if (!this.target) return;
        let values = this.data.booleans;
        this.target.active = values[index] ?? true;
    }
    public changeValueOnEditor(index: number): void {
        if (!this.target) return;
        let values = this.data.booleans;
        // 在编辑器模式下，直接设置active属性会有问题
        Editor.Message.request('scene', 'set-property', {
            uuid: this.target.uuid, path: 'active', dump: {
                value: values[index] ?? true,
                type: 'Boolean',
            }
        });
    }
}
ViewStateGroup.setViewStateClass(ViewStateType.Visible, VisibleViewState);