import { _decorator, tween, UIOpacity } from 'cc';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';
const { ccclass, property } = _decorator;

/**
 * 透明度切换器
 * 
 */
@ccclass('AlphaViewState')
export class AlphaViewState extends BaseViewState<UIOpacity> {
    public changeValue(index: number): void {
        let values = this.data.numbers;
        if (!this.target || isNaN(values[index])) return;
        let value = Number(values[index]);
        if (this.data.isTween && this.data.tweenDuration > 0) {
            tween(this.target).to(this.data.tweenDuration, { opacity: value }).start();
        } else this.target.opacity = value;
    }
    public changeValueOnEditor(index: number): void {
        let values = this.data.numbers;
        if (!this.target || isNaN(values[index])) return;
        this.target.opacity = Number(values[index]);
    }
}
ViewStateGroup.setViewStateClass(ViewStateType.Alpha, AlphaViewState);