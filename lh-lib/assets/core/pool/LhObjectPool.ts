/*
 * @file            assets/script/game/common/base/pool/LhObjectPool.ts
 * @description     对象池
 * @author          yjn
 * @createTime      2025-08-08 14:28:23
 * @lastModified    2025-08-11 14:02:38
 * Copyright ©dianhun All rights reserved
*/

import { LhAsyncStatus } from "../base/LhAsyncStatus";

/** 配置 */
export class LhObjectPoolConfig<T> {
    constructor(initCfg?: LhObjectPoolConfig<T>) {
        Object.assign(this, initCfg);
    }

    /** 返回新对象 */
    createFunc!: () => T | Promise<T>;
    /** 回收回调 */
    freeFunc?: (object: T) => boolean | Promise<boolean>;
    /** 分配回调 */
    alloccFunc?: (object: T) => void | Promise<void>;
    /** 释放回调 */
    clearFunc?: (objectList: T[]) => void | Promise<void>;
    /** 销毁回调 */
    destroyFunc?: () => void | Promise<void>;
    /**
     * 最小保留数量
     * @remarks
     * 池内对象小于此数量时扩充
     */
    minHoldNum? = 1;
    /**
     * 最大保留数量
     * @remarks
     * 可节省内存占用，-1为不启用
     * @defaultValue
     * -1
     */
    maxHoldNum? = -1;
    /**
     * 初始化扩充数量
     * @defaultValue
     * 0
     */
    initFillNum? = 0;
    
    // 动态调整相关配置
    /** 是否允许动态调整最大容量 */
    enableDynamicMaxHoldNum?: boolean;
    /** 动态调整的幅度比例 (0-1) */
    dynamicAdjustRatio?: number;
    /** 动态调整的最小阈值 (连续分配失败次数) */
    dynamicAdjustThreshold?: number;
    /** 动态调整的最小调整值 */
    dynamicAdjustMinStep?: number;
    /** 动态调整的最大容量上限 */
    dynamicMaxHoldNumLimit?: number;
}

/** 同步对象池 */
export class LhObjectPool<T> {
    private _status: LhAsyncStatus;
    constructor() {
        this._status = LhAsyncStatus.None;
    }

    init(initCfg?: LhObjectPoolConfig<T>) {
        if (!initCfg) {
            this._status = LhAsyncStatus.Fail;
            return;
        }
        this.config = new LhObjectPoolConfig(initCfg);

        if (this.config.initFillNum! > 0) {
            this.add(this.config.initFillNum);
        }

        this._status = LhAsyncStatus.Success;
    }

    /* --------------- public --------------- */
    /** 初始化数据 */
    config!: LhObjectPoolConfig<T>;
    /** 有效状态 */
    get isValid(): boolean {
        return this._status == LhAsyncStatus.Success;
    }
    get isClose(): boolean {
        return this._status == LhAsyncStatus.Fail;
    }
    /** 当前正在使用中的对象数量 */
    get inUseCount(): number {
        return this._allocatedCount - this._recycledCount;
    }

    /* --------------- private --------------- */
    /** 对象存储列表 */
    private _objectList: T[] = [];
    /** 分配的对象数量 */
    private _allocatedCount: number = 0;
    /** 回收的对象数量 */
    private _recycledCount: number = 0;
    /** 连续分配失败次数 */
    private _consecutiveAllocFailures: number = 0;
    /** 历史最大使用数量 */
    private _historicalMaxInUse: number = 0;
    /* ------------------------------- 功能 ------------------------------- */
    /**
     * 导入对象
     * @param object 添加对象
     * @returns
     */
    free(object: T): void {
        if (!this.isValid) {
            this.config.clearFunc?.([object]);
            return;
        }

        if (!object) {
            return;
        }

        if (this.config.freeFunc) {
            if (!this.config.freeFunc(object)) {
                return;
            }
        }
        this._recycledCount++;
        this._objectList.push(object);
        
        // 检查是否需要动态调整
        this._checkDynamicAdjust();
        
        // 检查保留数量
        if (this.config.maxHoldNum !== -1 && this._objectList.length > this.config.maxHoldNum!) {
            this.del(0, this._objectList.length - this.config.maxHoldNum!);
        }

        // 失效直接销毁
        if (this.isClose) {
            this.clear();
        }
    }

    /** 同步获取对象 */
    allocc(): T | null {
        if (!this.isValid) {
            return null!;
        }

        // 扩充
        if (this._objectList.length - 1 < this.config.minHoldNum!) {
            this.add(this.config.minHoldNum! - this._objectList.length + 1);
        }

        // 检查容量
        if (!this._objectList.length) {
            this._consecutiveAllocFailures++;
            // 检查是否需要动态扩容
            if (this.config.enableDynamicMaxHoldNum && this._consecutiveAllocFailures >= this.config.dynamicAdjustThreshold!) {
                const expandAmount = this._handleDynamicExpandSync();
                if (expandAmount > 0) {
                    // 立即扩充一些对象到新的容量
                    this.add(expandAmount);
                }
                // 重新检查容量
                if (!this._objectList.length) {
                    return null!;
                }
            } else {
                return null!;
            }
        }

        // 重置连续失败次数
        this._consecutiveAllocFailures = 0;

        let object: T = this._objectList.pop()!;
        if (this.config.alloccFunc) {
            this.config.alloccFunc(object);
        }
        this._allocatedCount++;
        
        // 更新历史最大使用数量
        const currentInUse = this.inUseCount;
        if (currentInUse > this._historicalMaxInUse) {
            this._historicalMaxInUse = currentInUse;
        }
        
        return object;
    }

    /** 清空数据 */
    clear(): void {
        const objectList = this._objectList.splice(0, this._objectList.length);

        if (objectList.length) {
            this.config.clearFunc?.(objectList);
        }
    }

    /**
     * 销毁对象池
     * @remarks
     * 销毁后将无法 get/put
     */
    destroy(): void {
        this._status = LhAsyncStatus.Fail;
        this.clear();
        this.config.destroyFunc?.();
    }
    
    /** 处理动态扩容 */
    private _handleDynamicExpand(): void {
        const expandAmount = this._handleDynamicExpandSync();
        if (expandAmount > 0) {
            // 立即扩充一些对象到新的容量
            this.add(expandAmount);
        }
    }
    
    /** 检查并处理动态调整 */
    private _checkDynamicAdjust(): void {
        // 实现动态调整逻辑，包括缩容功能
        const currentInUse = this.inUseCount;
        const currentPoolSize = this._objectList.length;
        const currentMax = this.config.maxHoldNum;
        const currentMin = this.config.minHoldNum;
        
        // 只有在启用动态调整且最大容量不是-1（无限制）时才执行
        if (!this.config.enableDynamicMaxHoldNum || currentMax === -1) {
            return;
        }
        
        // 缩容逻辑：当使用率低于20%且当前容量大于最小容量时，考虑缩容
        const usageRatio = currentInUse / currentMax;
        if (usageRatio < 0.2 && currentMax > currentMin) {
            // 计算新的最大容量，不小于最小容量
            const newMax = Math.max(currentMin, Math.floor(currentMax * 0.8));
            
            // 只在容量变化较大时才执行缩容
            if (newMax < currentMax) {
                this.config.maxHoldNum = newMax;
                
                // 清理超过新最大容量的对象
                if (this._objectList.length > newMax) {
                    this.del(0, this._objectList.length - newMax);
                }
            }
        }
    }

    /** 添加对象 */
    private add(fillNum = this.config.minHoldNum! - this._objectList.length): void {
        for (let kNum = 0; kNum < fillNum; ++kNum) {
            this._objectList.push(this.config.createFunc() as T);
        }
    }

    /** 删除对象 */
    private del(startNum_: number, endNum_: number): void {
        const objectList = this._objectList.splice(startNum_, endNum_ - startNum_);

        if (objectList.length) {
            this.config.clearFunc?.(objectList);
        }
    }
    
    /** 处理动态扩容（同步版本） */
    private _handleDynamicExpandSync(): number {
        if (!this.config.enableDynamicMaxHoldNum || this.config.maxHoldNum === -1) {
            return 0;
        }
        
        // 计算新的最大容量
        const currentMax = this.config.maxHoldNum!;
        const expandAmount = Math.max(
            Math.floor(currentMax * (this.config.dynamicAdjustRatio || 0.5)),
            this.config.dynamicAdjustMinStep || 10
        );
        const newMax = Math.min(currentMax + expandAmount, this.config.dynamicMaxHoldNumLimit || 1000);
        
        if (newMax > currentMax) {
            this.config.maxHoldNum = newMax;
            return expandAmount;
        }
        return 0;
    }
}

/** 异步对象池 */
export class LhAsyncObjectPool<T> {
    private _status: LhAsyncStatus;
    constructor() {
        this._status = LhAsyncStatus.None;
    }

    async init(initCfg?: LhObjectPoolConfig<T>) {
        if (!initCfg) {
            this._status = LhAsyncStatus.Fail;
            return;
        }
        this.config = new LhObjectPoolConfig(initCfg);

        if (this.config.initFillNum! > 0) {
            await this.add(this.config.initFillNum);
        }

        this._status = LhAsyncStatus.Success;
    }

    /* --------------- public --------------- */
    /** 初始化数据 */
    config!: LhObjectPoolConfig<T>;
    /** 有效状态 */
    get isValid(): boolean {
        return this._status == LhAsyncStatus.Success;
    }
    get isClose(): boolean {
        return this._status == LhAsyncStatus.Fail;
    }
    /**
     * 当前对象池中存储的对象数量
     */
    get currentCount(): number {
        return this._objectList.length;
    }
    /** 当前正在使用中的对象数量 */
    get inUseCount(): number {
        return this._allocatedCount - this._recycledCount;
    }

    /* --------------- private --------------- */
    /** 对象存储列表 */
    private _objectList: T[] = [];
    /** 已分配对象数量 */
    private _allocatedCount: number = 0;
    /** 已回收对象数量 */
    private _recycledCount: number = 0;
    /** 连续分配失败次数 */
    private _consecutiveAllocFailures: number = 0;
    /** 历史最大使用数量 */
    private _historicalMaxInUse: number = 0;
    /* ------------------------------- 功能 ------------------------------- */
    /**
     * 导入对象
     * @param object 添加对象
     * @returns
     */
    async free(object: T): Promise<void> {
        if (!this.isValid) {
            this.config.clearFunc?.([object]);
            return;
        }

        if (!object) {
            return;
        }

        if (this.config.freeFunc) {
            await this.config.freeFunc(object);
        }
        this._recycledCount++;
        this._objectList.push(object);
        
        // 检查是否需要动态调整
        this._checkDynamicAdjust();
        
        // 检查保留数量
        if (this.config.maxHoldNum !== -1 && this._objectList.length > this.config.maxHoldNum!) {
            this.del(0, this._objectList.length - this.config.maxHoldNum!);
        }

        // 失效直接销毁
        if (this.isClose) {
            await this.clear();
        }
    }

    /** 同步获取对象 */
    allocc(): T | null {
        if (!this.isValid) {
            return null!;
        }

        // 扩充
        if (this._objectList.length - 1 < this.config.minHoldNum!) {
            this.add(this.config.minHoldNum! - this._objectList.length + 1);
        }

        // 检查容量
        if (!this._objectList.length) {
            this._consecutiveAllocFailures++;
            // 检查是否需要动态扩容
            if (this.config.enableDynamicMaxHoldNum && this._consecutiveAllocFailures >= this.config.dynamicAdjustThreshold!) {
                const expandAmount = this._handleDynamicExpandSync();
                if (expandAmount > 0) {
                    // 立即扩充一些对象到新的容量
                    this.add(expandAmount);
                }
                // 重新检查容量
                if (!this._objectList.length) {
                    return null!;
                }
            } else {
                return null!;
            }
        }

        // 重置连续失败次数
        this._consecutiveAllocFailures = 0;

        let object: T = this._objectList.pop()!;
        if (this.config.alloccFunc) {
            this.config.alloccFunc(object);
        }
        this._allocatedCount++;
        
        // 更新历史最大使用数量
        const currentInUse = this.inUseCount;
        if (currentInUse > this._historicalMaxInUse) {
            this._historicalMaxInUse = currentInUse;
        }
        
        return object;
    }

    /** 获取对象 */
    async alloccAsync(): Promise<T> {
        if (!this.isValid) {
            return null!;
        }

        // 扩充
        if (this._objectList.length - 1 < this.config.minHoldNum!) {
            await this.add(this.config.minHoldNum! - this._objectList.length + 1);
        }

        if (this.isClose) {
            this.clear();
            return null!;
        }
        
        // 检查容量
        if (!this._objectList.length) {
            this._consecutiveAllocFailures++;
            // 检查是否需要动态扩容
            if (this.config.enableDynamicMaxHoldNum && this._consecutiveAllocFailures >= this.config.dynamicAdjustThreshold!) {
                await this._handleDynamicExpand();
                // 重新检查容量
                if (!this._objectList.length) {
                    return null!;
                }
            } else {
                return null!;
            }
        }
        
        // 重置连续失败次数
        this._consecutiveAllocFailures = 0;

        let object: T = this._objectList.pop()!;
        if (this.config.alloccFunc) {
            await this.config.alloccFunc(object);
        }
        this._allocatedCount++;
        
        // 更新历史最大使用数量
        const currentInUse = this.inUseCount;
        if (currentInUse > this._historicalMaxInUse) {
            this._historicalMaxInUse = currentInUse;
        }
        return object;
    }

    /** 清空数据 */
    async clear(): Promise<void> {
        const objectList = this._objectList.splice(0, this._objectList.length);

        if (objectList.length) {
            await this.config.clearFunc?.(objectList);
        }
    }

    /**
     * 销毁对象池
     * @remarks
     * 销毁后将无法 get/put
     */
    async destroy(): Promise<void> {
        this._status = LhAsyncStatus.Fail;
        await this.clear();
        await this.config.destroyFunc?.();
    }
    
    /** 处理动态扩容 */
    private async _handleDynamicExpand(): Promise<void> {
        const expandAmount = this._handleDynamicExpandSync();
        if (expandAmount > 0) {
            // 立即扩充一些对象到新的容量
            await this.add(expandAmount);
        }
    }

    /** 处理动态扩容同步逻辑 */
    private _handleDynamicExpandSync(): number {
        if (!this.config.enableDynamicMaxHoldNum || this.config.maxHoldNum === -1) {
            return 0;
        }
        
        // 计算新的最大容量
        const currentMax = this.config.maxHoldNum!;
        const expandAmount = Math.max(
            Math.floor(currentMax * (this.config.dynamicAdjustRatio || 0.5)),
            this.config.dynamicAdjustMinStep || 10
        );
        const newMax = Math.min(currentMax + expandAmount, this.config.dynamicMaxHoldNumLimit || 1000);
        
        if (newMax > currentMax) {
            this.config.maxHoldNum = newMax;
            return expandAmount;
        }
        return 0;
    }
    
    /** 检查并处理动态调整 */
    private _checkDynamicAdjust(): void {
        // 实现动态调整逻辑，包括缩容功能
        const currentInUse = this.inUseCount;
        const currentPoolSize = this._objectList.length;
        const currentMax = this.config.maxHoldNum;
        const currentMin = this.config.minHoldNum;
        
        // 只有在启用动态调整且最大容量不是-1（无限制）时才执行
        if (!this.config.enableDynamicMaxHoldNum || currentMax === -1) {
            return;
        }
        
        // 缩容逻辑：当使用率低于20%且当前容量大于最小容量时，考虑缩容
        const usageRatio = currentInUse / currentMax;
        if (usageRatio < 0.2 && currentMax > currentMin) {
            // 计算新的最大容量，不小于最小容量
            const newMax = Math.max(currentMin, Math.floor(currentMax * 0.8));
            
            // 只在容量变化较大时才执行缩容
            if (newMax < currentMax) {
                this.config.maxHoldNum = newMax;
                
                // 清理超过新最大容量的对象
                if (this._objectList.length > newMax) {
                    this.del(0, this._objectList.length - newMax);
                }
            }
        }
    }
    
    /** 添加对象 */
    private async add(fillNum = this.config.minHoldNum! - this._objectList.length): Promise<void> {
        for (let kNum = 0; kNum < fillNum; ++kNum) {
            this._objectList.push(await this.config.createFunc());
        }
    }

    /** 删除对象 */
    private del(startNum_: number, endNum_: number): void {
        const objectList = this._objectList.splice(startNum_, endNum_ - startNum_);

        if (objectList.length) {
            this.config.clearFunc?.(objectList);
        }
    }
}