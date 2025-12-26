import { _decorator, tween, UITransform } from 'cc';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';
const { ccclass, property } = _decorator;

/**
 * 尺寸切换器
 * 
 */
@ccclass('SizeViewState')
export class SizeViewState extends BaseViewState<UITransform> {
    public changeValue(index: number): void {
        let values = this.data.sizes;
        if (!this.target || !values[index]) return;
        if (this.data.isTween && this.data.tweenDuration > 0) {
            tween(this.target).to(this.data.tweenDuration, { contentSize: values[index] }).start();
        } else this.target.setContentSize(values[index]);
    }
    public changeValueOnEditor(index: number): void {
        let values = this.data.sizes;
        if (!this.target || !values[index]) return;
        this.target.setContentSize(values[index]);
    }
}
ViewStateGroup.setViewStateClass(ViewStateType.Size, SizeViewState);