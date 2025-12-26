import { _decorator, tween, UITransform, v2 } from 'cc';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';
const { ccclass, property } = _decorator;

/**
 * 锚点切换器
 * 
 */
@ccclass('AnchorViewState')
export class AnchorViewState extends BaseViewState<UITransform> {
    public changeValue(index: number): void {
        let values = this.data.vectors;
        if (!this.target || !values[index]) return;
        let point = v2(values[index].x, values[index].y);
        if (this.data.isTween && this.data.tweenDuration > 0) {
            tween(this.target).to(this.data.tweenDuration, { anchorPoint: point }).start();
        } else this.target.anchorPoint = point;
    }
    public changeValueOnEditor(index: number): void {
        let values = this.data.vectors;
        if (!this.target || !values[index]) return;
        this.target.anchorPoint = v2(values[index].x, values[index].y);
    }
}
ViewStateGroup.setViewStateClass(ViewStateType.AnchorPoint, AnchorViewState);