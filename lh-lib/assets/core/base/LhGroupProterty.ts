/*
 * @file            assets/core/base/LhGroupProterty.ts
 * @description     给基础属性分组，方便统一管理
 * @author          yjn
 * @createTime      2025-12-23 17:29:27
 * @lastModified    2025-12-23 17:29:35
 * Copyright ©dianhun All rights reserved
*/

/**
 * 属性装饰器：标记需要自动生成getter和setter的属性
 * @param storageKey 可选，指定属性存储的对象名称，默认为'baseProp'
 */
export function groupProp(storageKey: string): PropertyDecorator;
export function groupProp(target: any, propertyKey: string): void;
export function groupProp(storageKeyOrTarget: string | any, propertyKey?: string): PropertyDecorator | void {
    // 如果是装饰器工厂模式（带参数调用）
    if (typeof storageKeyOrTarget === 'string') {
        const storageKey = storageKeyOrTarget;
        return (target: any, propertyKey: string) => {
            // 在原型上保存需要处理的属性列表和对应的存储对象名称
            if (!target.__groupProperties__) {
                target.__groupProperties__ = [];
            }
            target.__groupProperties__.push({ propertyKey, storageKey });
        };
    }
    // 如果是直接调用装饰器（不带参数）
    else if (propertyKey) {
        const target = storageKeyOrTarget;
        // 默认使用'baseProp'作为存储对象
        if (!target.__groupProperties__) {
            target.__groupProperties__ = [];
        }
        target.__groupProperties__.push({ propertyKey, storageKey: '_baseProp' });
    }
}

/**
 * 在实例上初始化所有被装饰的属性
 */
function initGroupPropertiesOnInstance(instance: any) {
    let proto = Object.getPrototypeOf(instance);
    const allProperties: Array<{ propertyKey: string, storageKey: string }> = [];
    
    // 遍历原型链，收集所有标记的属性和对应的存储对象名称
    while (proto && proto !== Object.prototype) {
        if (proto.__groupProperties__) {
            proto.__groupProperties__.forEach((propInfo: { propertyKey: string, storageKey: string }) => {
                allProperties.push(propInfo);
            });
        }
        proto = Object.getPrototypeOf(proto);
    }

    // 在实例上定义 getter/setter，保存现有值
    allProperties.forEach(({ propertyKey, storageKey }) => {
        // 确保存储对象存在
        if (!instance[storageKey]) {
            instance[storageKey] = {};
        }
        
        // 保存当前值（如果有的话）
        const currentValue = instance[propertyKey];
        
        Object.defineProperty(instance, propertyKey, {
            configurable: true,
            enumerable: false,
            get: function() {
                return this[storageKey][propertyKey];
            },
            set: function(value: any) {
                this[storageKey][propertyKey] = value;
            }
        });
        
        // 如果之前有值，存入指定的存储对象
        if (currentValue !== undefined) {
            instance[storageKey][propertyKey] = currentValue;
        }
    });
}

export class LhGroupProterty {
    protected _baseProp: any;

    constructor() {
        this._baseProp = {};

        // 使用queueMicrotask异步执行初始化，确保子类属性已经完全初始化
        queueMicrotask(() => {
            initGroupPropertiesOnInstance(this);
        });
    }
}