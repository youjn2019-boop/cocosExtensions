import { _decorator, Node, Quat, tween } from 'cc';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';
const { ccclass, property } = _decorator;

/**
 * 旋转切换器
 */
@ccclass('RotationViewState')
export class RotationViewState extends BaseViewState<Node> {
    private mQuat: Quat = new Quat();
    public changeValue(index: number): void {
        let values = this.data.vectors;
        if (!this.target || !values[index]) return;
        let angle = values[index];
        Quat.fromEuler(this.mQuat, angle.x, angle.y, angle.z);
        //  不要使用eulerAngles赋值，如果同时有scale缓动会导致Node不见的情况
        if (this.data.isTween && this.data.tweenDuration > 0) {
            tween(this.target).to(this.data.tweenDuration, { rotation: this.mQuat }).start();
        } else this.target.setRotation(this.mQuat);
    }
    public changeValueOnEditor(index: number): void {
        let values = this.data.vectors;
        if (!this.target || !values[index]) return;
        // 在编辑器模式下，直接设置active属性会有问题
        Editor.Message.request('scene', 'set-property', {
            uuid: this.target.uuid, path: 'rotation', dump: {
                value: values[index],
                type: 'cc.Vec3',
            }
        });
    }
}
ViewStateGroup.setViewStateClass(ViewStateType.Rotation, RotationViewState);