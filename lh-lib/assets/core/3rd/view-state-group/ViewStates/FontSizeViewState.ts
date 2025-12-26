import { _decorator, EditBox, Label, RichText } from 'cc';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';
const { ccclass, property } = _decorator;

/**
 * 透明度切换器
 * 
 */
@ccclass('FontSizeViewState')
export class FontSizeViewState extends BaseViewState<Label | RichText | EditBox> {
    public changeValue(index: number): void {
        let values = this.data.numbers;
        if (!this.target || isNaN(values[index])) return;
        let value = Number(values[index]);
        if (this.target instanceof EditBox) {
            this.target.textLabel.fontSize = value;
        } else {
            this.target.fontSize = value;
        }
    }
    public changeValueOnEditor(index: number): void {
        this.changeValue(index);
    }
}
ViewStateGroup.setViewStateClass(ViewStateType.FontSize, FontSizeViewState);