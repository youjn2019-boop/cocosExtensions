/*
 * @file            assets/script/game/common/base/spine/LhSkeleton.ts
 * @description     Spine 骨骼动画 控制播放相关
 * @author          yjn
 * @createTime      2025-08-08 10:27:31
 * @lastModified    2025-08-08 10:32:30
 * Copyright ©dianhun All rights reserved
*/

import { Enum, _decorator, sp } from 'cc';
import { EDITOR } from 'cc/env';
import { LhHandler } from '../base/LhHandler';
const { ccclass, property, menu, executeInEditMode } = _decorator;

/**自动播放生命周期枚举 */
enum Time { none = 0, onLoad = 1, start = 2, onEnable = 3 }
/**自动播放生命周期声明 */
const timeEnum = Enum(Time);

@ccclass('LhSkeleton')
@menu('LhSpine/LhSkeleton')
@executeInEditMode
//@ts-ignore
export class LhSkeleton extends sp.Skeleton {
    /**自动播放选项 */
    @property({ type: timeEnum, tooltip: '自动播放时机 none为不播放 animation和loop遵循选项' })
    private autoPlay: Time = Time.none;
    // /**隐藏loop选项并私有化 */
    // @property({ visible(this: LhSkeleton) { return this.autoPlay !== Time.none; }, override: true })
    // private loop: boolean = false;
    /**预乘开关改为默认为关闭 */
    @property({ serializable: true, override: true })
    protected _premultipliedAlpha = false;

    /**每次播放完成回调 */
    private _completeCb: LhHandler = null;
    /**完成回调 */
    private _playOptCb: LhHandler = null;
    /**循环次数 */
    private _times: number = 0;
    /**已经完成的次数 */
    private _completeTimes: number = 0;
    /**是否正在播放 */
    private _playing: boolean = false;
    lhHandle: boolean = false;

    private gotoCache = {
        time: 0,
        animation: '',
    };

    // 记录播放参数
    private _playParam: { animation: string, times: number, playCb: LhHandler };

    constructor() {
        super();
        this._playParam = {
            animation: '',
            times: 0,
            playCb: null,
        };
    }

    onLoad() {
        super.onLoad();
        // 设置默认参数
        this.paused = true;
        this.loop = this.autoPlay !== Time.none ? this.loop : false;
        this.timeScale = this.autoPlay !== Time.none ? this.timeScale : 1;
        // 完成一次播放
        this.setCompleteListener(() => {
            this._completeTimes++;

            if (this._completeTimes > this._times) {
                return;
            }

            let isTimeComplete: boolean = this._times > 0 && this._completeTimes >= this._times;
            // // 循环时每次完成都进行回调
            this._completeCb && this._completeCb?.runWith({ animation: this.animation, isTimeComplete });

            if (isTimeComplete) {
                this.stop();
                // this.gotoEnd(this.animation);
                if (this._playOptCb) {
                    let handler = this._playOptCb;
                    this._playOptCb = null;
                    if (handler) {
                        handler.run();
                        handler.recover();
                    }
                }
            } else {
                if (!this.loop) {
                    this.animation = this.animation;
                }
            }
        });
        // 自动播放处理
        if (this.autoPlay === Time.onLoad && !EDITOR) this.play(this.animation, this.loop ? -1 : 1);
    }

    protected start() {
        if (this.autoPlay === Time.start && !EDITOR) this.play(this.animation, this.loop ? -1 : 1);
    }

    onEnable() {
        if (!this.lhHandle) {
            super.onEnable();
        }
        if (this.autoPlay === Time.onEnable && !EDITOR) this.play(this.animation, this.loop ? -1 : 1);
    }

    onDisable(): void {
        if (!this.lhHandle) {
            super.onDisable();
        }
    }

    private _lhEnabled: boolean = false;
    lhEnable() {
        if (!this._lhEnabled) {
            super.onEnable();
            this._lhEnabled = true;
        }
    }

    lhDisable() {
        if (this._lhEnabled) {
            super.onDisable();
            this._lhEnabled = false;
        }
    }

    protected update(dt: number): void {
        // 需要播放时在这里播放，防止同一帧设置多次animation
        this.doPlay();
    }

    /**重置playparam */
    private resetPlayParam() {
        this._playParam.animation = '';
        this._playParam.times = 0;
        // this._playParam.playCb && this._playParam.playCb.recover();
        this._playParam.playCb = null;
    }

    /**
     * @description: 播放完成回调
     * @param {ICallBack} cb 回调
     */
    public onAnimationComplete(cb: LhHandler) {
        if (this._completeCb) {
            this._completeCb.recover();
        }
        this._completeCb = cb;
    }

    /**
     * @description: 播放Spine
     * @param {string} animation 动画名称
     * @param {number} times 播放次数
     * @param {LhHandler} playCb 可选项
     */
    play(animation: string, playCb?: LhHandler): void;
    play(animation: string, times: number, playCb?: LhHandler): void;
    play(animation: string, times?: number | LhHandler, playCb?: LhHandler) {
        if (!animation) {
            return;
        }

        // 处理参数
        if (times) {
            // 如果是对象
            if (typeof times == "object") {
                playCb = times;
                times = 1;
            }
        } else {
            // times不为0
            if (times !== 0) {
                times = 1;
            }
        }
        // 记录播放参数
        this._playParam.animation = animation;
        this._playParam.times = times;
        if (this._playParam.playCb) this._playParam.playCb.recover();
        this._playParam.playCb = playCb;

        if (!this.animation) {
            this.doPlay();
        }
    }

    /**获取准备播放的动画名称 */
    getReadyAnimation(): string {
        return this._playParam.animation;
    }

    /**播放处理 */
    private doPlay() {
        // 无效名称返回
        if (!this._playParam.animation || typeof this._playParam.animation !== 'string' || this._playParam.animation === '<None>') {
            return;
        }
        this.gotoCache.time = 0;
        this.gotoCache.animation = '';
        // 先停止
        this.stop(true);

        let { animation, times, playCb } = this._playParam;
        this.resetPlayParam();

        // 设置回调
        this._playOptCb = playCb || null;
        // 设置循环次数
        this._times = Math.floor(times);
        // 初始化数据
        this._completeTimes = 0;
        // 设置loop paused，必须在设置animation前
        this.loop = this._times <= 0;
        this.paused = false;
        this._playing = true;
        // 设置动画名称
        this.animation = animation;
    }

    /**
     * @description: 循环播放spine
     * @param {string} animation 动画名称
     * @param {LhHandler} playCb 可选项
     */
    public playLoop(animation: string, playCb?: LhHandler) {
        this.play(animation, -1, playCb);
    }

    /**
     * 根据时间跳转到那一刻
     * @param animation 动画名称
     * @param time 时间
     */
    public goto(animation: string, time: number) {
        if (animation === '<None>' || !animation) {
            this.gotoCache.time = 0;
            this.gotoCache.animation = '';
            return this.stop();
        }
        if (this.gotoCache.animation !== animation) {
            this.gotoCache.time = 0;
            this.gotoCache.animation = animation;
            this.stop();
            this.animation = animation;
            this.loop = false;
        }
        this.paused = false;

        const anim = this.findAnimation(animation);
        if (anim) {
            if (anim.duration > 0.001) {
                if (time < 0) {
                    time = anim.duration + time;
                }
                time = Math.max(0, time);
                time = Math.min(time, anim.duration);
                let updateTime: number = time - this.gotoCache.time;
                updateTime = updateTime / this.timeScale;
                this.gotoCache.time = time;
                this.updateAnimation(updateTime);
            }
        }
        this.paused = true;
    }


    /**
     * 根据时间跳转到那一刻
     * @param animation 动画名称
     * @param time 时间
     */
    public gotoEnd(animation: string) {
        this.goto(animation, -0.001);
    }

    /**
     * @description: 停止播放
     */
    public stop(setupPos?: boolean) {
        if (this._playing) {
            this._playing = false;
            this.paused = true;
            setupPos && this.setToSetupPose();
            // 完成一次播放的中途被停止了执行失败回调
            if ((this._times < 0 || this._times > this._completeTimes) && this._playOptCb) {
                // this._playOptCb?.fail();
                this._playOptCb = null;
            }
            return true;
        }
        return false;
    }

    /**
     * @description: 暂停
     * @returns {boolean}
     */
    public pause(): boolean {
        if (this._playing) {
            this.paused = true;
            return true;
        }
        return false;
    }

    /**
     * @description: 恢复暂停
     * @returns {boolean}
     */
    public resume(): boolean {
        if (this._playing) {
            this.paused = false;
            return true;
        }
        return false;
    }

    /**
     * 设置皮肤
     */
    public setSkin(name?: string) {
        if (!name) name = this.defaultSkin;
        if (name) super.setSkin(name);
    }
}
