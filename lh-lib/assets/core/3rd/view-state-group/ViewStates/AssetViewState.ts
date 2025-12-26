import { _decorator, Animation, AnimationClip, AudioClip, AudioSource, Font, Label, ParticleAsset, ParticleSystem2D, SkeletalAnimation, sp, Sprite, SpriteFrame, SpriteRenderer, TiledMap, TiledMapAsset } from 'cc';
import { ViewStateGroup } from '../ViewStateGroup';
import { ViewStateType } from '../ViewStateType';
import { BaseViewState } from './BaseViewState';

const { ccclass, property } = _decorator;

/**
 * 资源切换器
 * 
 */
@ccclass('AssetViewState')
export class AssetViewState extends BaseViewState<Sprite | SpriteRenderer | sp.Skeleton | Label | Animation | AudioSource | SkeletalAnimation | TiledMap | ParticleSystem2D> {
    public changeValue(index: number): void {
        if (!this.target) return;
        let values = this.data.assets;
        if (this.target instanceof Sprite) {
            if (!values[index]) this.target.spriteFrame = null;
            else if (values[index] instanceof SpriteFrame) {
                this.target.spriteFrame = values[index];
            }
        } else if (this.target instanceof Label) {
            if (!values[index]) this.target.font = null;
            else if (values[index] instanceof Font) {
                this.target.font = values[index];
            }
        } else if (this.target instanceof sp.Skeleton) {
            if (!values[index]) this.target.skeletonData = null;
            else if (values[index] instanceof sp.SkeletonData) {
                this.target.skeletonData = values[index];
            }
        } else if (this.target instanceof AudioSource) {
            this.target.stop();
            this.target.clip = null;
            if (values[index] instanceof AudioClip) {
                this.target.clip = values[index];
                this.target.play();
            }
        } else if (this.target instanceof Animation) {
            if (!values[index]) this.target.defaultClip = null;
            else if (values[index] instanceof AnimationClip) {
                this.target.defaultClip = values[index];
            }
        } else if (this.target instanceof TiledMap) {
            if (!values[index]) this.target.tmxAsset = null;
            else if (values[index] instanceof TiledMapAsset) {
                this.target.tmxAsset = values[index];
            }
        } else if (this.target instanceof SpriteRenderer) {
            if (!values[index]) this.target.spriteFrame = null;
            else if (values[index] instanceof SpriteFrame) {
                this.target.spriteFrame = values[index];
            }
        } else if (this.target instanceof SkeletalAnimation) {
            if (!values[index]) this.target.defaultClip = null;
            else if (values[index] instanceof AnimationClip) {
                this.target.defaultClip = values[index];
            }
        } else if (this.target instanceof ParticleSystem2D) {
            if (!values[index]) this.target.file = null;
            else if (values[index] instanceof ParticleAsset) {
                this.target.file = values[index];
            }
        }
    }
    public changeValueOnEditor(index: number): void {
        this.changeValue(index);
    }
}

ViewStateGroup.setViewStateClass(ViewStateType.Asset, AssetViewState);