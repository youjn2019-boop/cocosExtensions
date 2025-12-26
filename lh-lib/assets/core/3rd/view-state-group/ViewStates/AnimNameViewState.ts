import { _decorator, Animation, SkeletalAnimation, sp } from 'cc';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';
const { ccclass, property } = _decorator;

/**
 * 透明度切换器
 * 
 */
@ccclass('AnimNameViewState')
export class AnimNameViewState extends BaseViewState<Animation | SkeletalAnimation | sp.Skeleton> {
    public changeValue(index: number): void {
        let values = this.data.strings;
        if (!this.target || !values[index]) return;
        if (this.target instanceof sp.Skeleton) {
            this.target.animation = values[index];
        } else if (this.target instanceof SkeletalAnimation) {
            this.target.play(values[index]);
        } else if (this.target instanceof Animation) {
            this.target.play(values[index]);
        }
    }
    public changeValueOnEditor(index: number): void {
        this.changeValue(index);
    }
}
ViewStateGroup.setViewStateClass(ViewStateType.AnimName, AnimNameViewState);