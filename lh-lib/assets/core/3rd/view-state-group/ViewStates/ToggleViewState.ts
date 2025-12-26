import { _decorator, Toggle } from 'cc';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';
const { ccclass, property } = _decorator;

/**
 * 选中状态切换器
 * 
 */
@ccclass('ToggleViewState')
export class ToggleViewState extends BaseViewState<Toggle> {
    public changeValue(index: number): void {
        let values = this.data.booleans;
        if (!this.target || values[index] == null) return;
        this.target.isChecked = values[index];
    }
    public changeValueOnEditor(index: number): void {
        this.changeValue(index);
    }
}
ViewStateGroup.setViewStateClass(ViewStateType.Toggle, ToggleViewState);