import { _decorator, Node, tween } from 'cc';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';
const { ccclass, property } = _decorator;

/**
 * 缩放切换器
 */
@ccclass('ScaleViewState')
export class ScaleViewState extends BaseViewState<Node> {
    public changeValue(index: number): void {
        let values = this.data.vectors;
        if (!this.target || !values[index]) return;
        if (this.data.isTween && this.data.tweenDuration > 0) {
            tween(this.target).to(this.data.tweenDuration, { scale: values[index] }).start();
        } else this.target.setScale(values[index]);
    }
    public changeValueOnEditor(index: number): void {
        let values = this.data.vectors;
        if (!this.target || !values[index]) return;
        // 在编辑器模式下，直接设置active属性会有问题
        Editor.Message.request('scene', 'set-property', {
            uuid: this.target.uuid, path: 'scale', dump: {
                value: values[index],
                type: 'cc.Vec3',
            }
        });
    }
}
ViewStateGroup.setViewStateClass(ViewStateType.Scale, ScaleViewState);