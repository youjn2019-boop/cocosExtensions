import { _decorator, Component, Node, tween, v2, Vec2 } from 'cc';
import { EDITOR } from 'cc/env';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';
const { ccclass, property } = _decorator;

/**
 * 自定义切换器
 * 
 */
@ccclass('CustomViewState')
export class CustomViewState extends BaseViewState<Node | Component> {
    public changeValue(index: number): void {
        if (!this.target || !this.data.customData) return;
        let customData = this.data.customData;
        let valueName = customData.valueName;
        let propName = customData.propName;
        let isArray = customData.isArray;
        let isTween = this.data.isTween;
        let duration = this.data.tweenDuration;
        if (!valueName || !propName || !this.data[valueName]) return;
        let values = this.data[valueName];
        let attrs = propName.split(".");
        let attrName: any = attrs.pop();
        let value = values[index];
        let comp: any = this.target;
        while (attrs.length > 0) {
            let attr = attrs.shift();
            comp = comp[attr];
            if (!comp) {
                console.log(`[CustomViewState]${this.target.name} 不存在 ${propName} 属性!`);
                return;
            }
        }
        let tempValue = comp[attrName];
        if (isArray) {
            if (!Array.isArray(tempValue)) console.log(`[CustomViewState]类型错误:${attrName} 不是数组,请检查!`);
            else {
                let cIndex = customData.index;
                if (cIndex < 0) value = values.concat();
                else {
                    comp = tempValue;
                    attrName = cIndex;
                    if (cIndex >= tempValue.length)
                        tempValue.length = cIndex + 1;
                }
            }
        }
        if (valueName == "vectors" && tempValue instanceof Vec2) {
            value = v2(value.x, value.y);
        }
        if (!isTween || duration <= 0) comp[attrName] = value;
        else {
            if (EDITOR) comp[attrName] = value;
            else tween(comp).to(duration, { [attrName]: value }).start();
        }
    }
    public changeValueOnEditor(index: number): void {
        this.changeValue(index);
    }
}
ViewStateGroup.setViewStateClass(ViewStateType.Custom, CustomViewState);