import { _decorator, EditBox, Label, RichText } from 'cc';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';
const { ccclass, property } = _decorator;

/**
 * 文本切换器
 * 
 */
@ccclass('TextViewState')
export class TextViewState extends BaseViewState<Label | RichText | EditBox> {
    public changeValue(index: number): void {
        let values = this.data.strings;
        if (!this.target || values[index] == null) return;
        this.target.string = values[index];
    }
    public changeValueOnEditor(index: number): void {
        this.changeValue(index);
    }
}
ViewStateGroup.setViewStateClass(ViewStateType.Text, TextViewState);