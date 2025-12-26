import { _decorator, Graphics, Label, ParticleSystem2D, sp, Sprite } from 'cc';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';
const { ccclass, property } = _decorator;

/**
 * 材质切换器
 */
@ccclass('MaterialViewState')
export class MaterialViewState extends BaseViewState<Sprite | sp.Skeleton | Label | Graphics | ParticleSystem2D> {
    public changeValue(index: number): void {
        let values: any[] = this.data.assets;
        if (!this.target || !values[index]) return;
        this.target.customMaterial = values[index];
    }
    public changeValueOnEditor(index: number): void {
        this.changeValue(index);
    }
}
ViewStateGroup.setViewStateClass(ViewStateType.Material, MaterialViewState);