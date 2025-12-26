import { _decorator, EditBox, Label, RichText, sp, Sprite } from 'cc';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';
const { ccclass, property } = _decorator;

/**
 * 颜色切换器
 * 
 */
@ccclass('ColorViewState')
export class ColorViewState extends BaseViewState<Label | RichText | EditBox | Sprite | sp.Skeleton> {
    public changeValue(index: number): void {
        let values = this.data.colors;
        if (!this.target || !values[index]) return;
        if (this.target instanceof Label) {
            this.target.color = values[index];
        } else if (this.target instanceof Sprite) {
            this.target.color = values[index];
        } else if (this.target instanceof RichText) {
            this.target.fontColor = values[index];
        } else if (this.target instanceof sp.Skeleton) {
            this.target.color = values[index];
        } else if (this.target instanceof EditBox) {
            this.target.textLabel.color = values[index];
        }
    }
    public changeValueOnEditor(index: number): void {
        this.changeValue(index);
    }
}
ViewStateGroup.setViewStateClass(ViewStateType.Color, ColorViewState);