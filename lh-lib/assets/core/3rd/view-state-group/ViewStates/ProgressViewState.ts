import { _decorator, ProgressBar, Slider, tween } from 'cc';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';
const { ccclass, property } = _decorator;

/**
 * 进度切换器
 * 
 */
@ccclass('ProgressViewState')
export class ProgressViewState extends BaseViewState<Slider | ProgressBar> {
    public changeValue(index: number): void {
        let values = this.data.numbers;
        if (!this.target || isNaN(values[index])) return;
        if (this.data.isTween && this.data.tweenDuration > 0) {
            tween(this.target).to(this.data.tweenDuration, { progress: values[index] }).start();
        } else this.target.progress = values[index];
    }
    public changeValueOnEditor(index: number): void {
        let values = this.data.numbers;
        if (!this.target || isNaN(values[index])) return;
        this.target.progress = values[index];
    }
}
ViewStateGroup.setViewStateClass(ViewStateType.Progress, ProgressViewState);