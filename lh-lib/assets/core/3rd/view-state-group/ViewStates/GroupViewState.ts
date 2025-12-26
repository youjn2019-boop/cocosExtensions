import { _decorator, ToggleContainer } from 'cc';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';
const { ccclass, property } = _decorator;

/**
 * 图片切换器
 * 
 */
@ccclass('GroupViewState')
export class GroupViewState extends BaseViewState<ViewStateGroup | ToggleContainer> {
    public changeValue(index: number): void {
        let values = this.data.numbers;
        if (!this.target || isNaN(values[index])) return;
        if (this.target instanceof ViewStateGroup) {
            this.target.index = values[index];
        } else if (this.target instanceof ToggleContainer) {
            this.target.selectedIndex = values[index];
        }
    }
    public changeValueOnEditor(index: number): void {
        this.changeValue(index);
    }
}
ViewStateGroup.setViewStateClass(ViewStateType.Group, GroupViewState);