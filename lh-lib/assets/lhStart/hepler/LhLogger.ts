import { DEV } from "cc/env";

/**
 * 对象池配置接口
 */
export interface LhLoggerPoolConfig {
    /** 最大实例数量 */
    maxInstances?: number;
    /** 是否启用对象池 */
    enabled?: boolean;
}

/**
 * 日志头部背景颜色枚举
 */
export enum LhLoggerHeadColor {
    Log = '#6495ed',
    Info = '#90ee90',
    Warn = '#ffd700',
    Error = '#ff4500',
    Net = "#FDFFCE",
    View = "#8FF6FF",
    Model = "#C8A3F0",
    Custom1 = "#7cff00",
}

/**
 * 日志模式枚举
 */
export enum LhLogMsgMode {
    /** 普通模式：显示时间+tag+栈信息+msg，带样式 */
    NORMAL = 0,
    /** 简易模式：显示时间+tag+msg，无样式 */
    SIMPLE = 1
}

/**
 * Tag 控制模式枚举
 */
export enum LhLoggerTagMode {
    /** 都打印 */
    ALL = 0,
    /** 被禁止的 tag 不打印 */
    DENY = 1,
    /** 只打印允许的 tag */
    ALLOW = 2
}

/**
 * 日志配置接口
 */
export interface LhLoggerConfig {
    /** 日志打印的 key，用于区分不同的日志打印 */
    logKey?: string;
    /** 日志模式 */
    logMode?: LhLogMsgMode;
    /** Tag 控制模式 */
    tagMode?: LhLoggerTagMode;
    /** 自定义 tag 列表 */
    logTags?: string[];
    /** 允许的 tag 列表（仅在 ALLOW 模式下生效） */
    allowTags?: string[];
    /** 禁止的 tag 列表（仅在 DENY 模式下生效） */
    denyTags?: string[];
}

/**
 * 日志库类
 */
export class LhLogger {
    // #region 静态 ------------------
    /** 原始 console 方法备份 */
    private static _originalConsole: {
        log: (...args: any[]) => void,
        warn: (...args: any[]) => void,
        error: (...args: any[]) => void,
        info: (...args: any[]) => void,
    } = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info
        };

    /** Logger实例对象池 */
    private static _loggerPool: LhLogger[] = [];
    private static _loggerKeyMap: Map<string, LhLogger> = new Map();

    /** 对象池配置 */
    private static _poolConfig: Required<LhLoggerPoolConfig> = {
        maxInstances: 100,
        enabled: true
    };

    /**
     * 设置对象池配置
     * @param config 对象池配置
     */
    public static setPoolConfig(config: LhLoggerPoolConfig): void {
        LhLogger._poolConfig = {
            ...LhLogger._poolConfig,
            ...config
        };
    }

    /**
     * 从对象池获取Logger实例
     * @param config Logger配置
     * @param parent 父级Logger实例
     * @returns Logger实例
     */
    private static _getFromPool(config: LhLoggerConfig, parent: LhLogger | null = null): LhLogger | null {
        if (config?.logKey) {
            if (LhLogger._loggerKeyMap.has(config.logKey)) {
                return LhLogger._loggerKeyMap.get(config.logKey)!;
            }
        }

        if (!LhLogger._poolConfig.enabled || LhLogger._loggerPool.length === 0) {
            return null;
        }

        // 从对象池中获取第一个可用实例
        const logger = LhLogger._loggerPool.pop()!;
        // 重置实例状态
        logger.setConfig(config);
        // 设置父级Logger
        logger._parentLogger = parent;
        return logger;
    }

    /**
     * 将Logger实例放入对象池
     * @param logger Logger实例
     */
    private static _addToPool(logger: LhLogger): void {
        if (!logger) {
            return;
        }
        if (logger._config?.logKey) {
            if (LhLogger._loggerKeyMap.has(logger._config.logKey)) {
                LhLogger._loggerKeyMap.delete(logger._config.logKey)!;
            }
        }
        if (!LhLogger._poolConfig.enabled) {
            return;
        }

        // 检查对象池是否已满
        if (LhLogger._loggerPool.length >= LhLogger._poolConfig.maxInstances) {
            // 如果已满，直接丢弃当前实例
            return;
        }

        // 将实例添加到对象池
        LhLogger._loggerPool.push(logger);
    }

    /**
     * 清空对象池
     */
    public static clearPool(): void {
        LhLogger._loggerPool.length = 0;
    }

    /**
     * 获取对象池中实例的数量
     */
    public static get poolSize(): number {
        return LhLogger._loggerPool.length;
    }

    /**
     * 劫持原生 console 方法，将其替换为空函数，避免在控制台打印日志
     */
    static hijackConsole(): void {
        console.log = () => { };
        console.warn = () => { };
        console.error = () => { };
        console.info = () => { };
    }

    /**
     * 恢复原生 console 方法
     */
    static restoreConsole(): void {
        console.log = LhLogger._originalConsole.log;
        console.warn = LhLogger._originalConsole.warn;
        console.error = LhLogger._originalConsole.error;
        console.info = LhLogger._originalConsole.info;
    }

    /**
     * 默认实例，用于向后兼容静态方法调用
     */
    public static default = new LhLogger();

    /**
     * 创建一个新的日志实例，自动将默认实例作为父级
     * @param config 日志配置
     * @returns 日志实例（可能从对象池获取）
     */
    public static create(config: LhLoggerConfig): LhLogger {
        // 尝试从对象池获取实例
        const pooledLogger = LhLogger._getFromPool(config, LhLogger.default);
        if (pooledLogger) {
            return pooledLogger;
        }

        // 创建新实例
        return new LhLogger(config, LhLogger.default);
    }

    /**
     * 设置默认实例的日志配置
     */
    public static setConfig(config: LhLoggerConfig) {
        LhLogger.default.setConfig(config);
    }

    /**
     * 静态添加允许的 tag，用于向后兼容
     */
    public static addAllowTags(...tags: string[]) {
        LhLogger.default.addAllowTags(...tags);
    }

    /**
     * 静态添加禁止的 tag，用于向后兼容
     */
    public static addDenyTags(...tags: string[]) {
        LhLogger.default.addDenyTags(...tags);
    }

    /**
     * 静态清空允许的 tag，用于向后兼容
     */
    public static clearAllowTags() {
        LhLogger.default.clearAllowTags();
    }

    /**
     * 静态清空禁止的 tag，用于向后兼容
     */
    public static clearDenyTags() {
        LhLogger.default.clearDenyTags();
    }

    /**
     * 静态 log 方法，用于向后兼容
     */
    public static log(msg: string | object, ...tags: string[]) {
        LhLogger.default.log(msg, ...tags);
    }
    public static debug(msg: string | object, ...tags: string[]) {
        LhLogger.default.debug(msg, ...tags);
    }

    /**
     * 静态 info 方法，用于向后兼容
     */
    public static info(msg: string | object, ...tags: string[]) {
        LhLogger.default.info(msg, ...tags);
    }

    /**
     * 静态 warn 方法，用于向后兼容
     */
    public static warn(msg: string | object, ...tags: string[]) {
        LhLogger.default.warn(msg, ...tags);
    }

    /**
     * 静态 error 方法，用于向后兼容
     */
    public static error(msg: string | object, ...tags: string[]) {
        LhLogger.default.error(msg, ...tags);
    }
    // #endregion 静态 ------------------

    // #region 实例 ------------------
    /** 实例配置 */
    private _config: Required<LhLoggerConfig>;

    /** 父级日志实例，用于委托调用 */
    private _parentLogger: LhLogger | null = null;

    /**
     * 创建日志实例
     * @param config 日志配置
     * @param parent 可选的父级日志实例
     */
    constructor(config: LhLoggerConfig = {}, parent: LhLogger | null = null) {
        // 默认配置
        this._config = {
            logKey: "",
            logMode: (DEV || window.location?.hostname == "10.1.71.223") ? LhLogMsgMode.NORMAL : LhLogMsgMode.SIMPLE,
            tagMode: LhLoggerTagMode.DENY,
            logTags: null,
            allowTags: null,
            denyTags: null
        };

        // 设置父级日志实例
        this._parentLogger = parent;

        // 应用用户配置
        this.setConfig(config);
    }

    /**
     * 劫持原生 console 方法，将其替换为空函数，避免在控制台打印日志
     */
    hijackConsole(): void {
        LhLogger.hijackConsole();
    }

    /**
     * 恢复原生 console 方法
     */
    restoreConsole(): void {
        LhLogger.restoreConsole();
    }

    /**
     * 释放Logger实例到对象池
     * 注意：调用此方法后不应再使用该实例
     */
    public release(): void {
        LhLogger._addToPool(this);
    }

    /**
     * 获取日志模式
     * 如果有父级日志实例，则组合当前实例和父级实例的配置
     * @returns 日志模式
     */
    private getLogMode(): LhLogMsgMode {
        // 如果有父级日志实例，则组合两者的logMode
        if (this._parentLogger) {
            // 保持原有的||逻辑，即只有当两个实例都返回SIMPLE才会使用SIMPLE
            return this._config.logMode || this._parentLogger.getLogMode();
        }
        return this._config.logMode;
    }

    /**
     * 初始化日志库配置
     * @param config 日志配置
     */
    setConfig(config: LhLoggerConfig): void {
        if (!config) return;
        this._config = {
            ...this._config,
            ...config
        };
    }

    getConfig(): Required<LhLoggerConfig> {
        return this._config;
    }

    /**
     * 添加 log tag
     * @param tags tag 数组
     */
    addLogTags(...tags: string[]): void {
        this._config.logTags ? this._config.logTags.push(...tags) : (this._config.logTags = [...tags]);
    }

    /**
     * 添加允许的 tag
     * @param tags tag 数组
     */
    addAllowTags(...tags: string[]): void {
        this._config.allowTags ? this._config.allowTags.push(...tags) : (this._config.allowTags = [...tags]);
    }

    /**
     * 添加禁止的 tag
     * @param tags tag 数组
     */
    addDenyTags(...tags: string[]): void {
        this._config.denyTags ? this._config.denyTags.push(...tags) : (this._config.denyTags = [...tags]);
    }

    /**
     * 删除 log tag
     * @param tags tag 数组
     */
    delLogTags(...tags: string[]): void {
        if (!this._config.logTags) return;
        this._config.logTags = this._config.logTags.filter(tag => !tags.includes(tag)) || [];
    }

    /**
     * 删除允许的 tag
     * @param tags tag 数组
     */
    delAllowTags(...tags: string[]): void {
        if (!this._config.allowTags) return;
        this._config.allowTags = this._config.allowTags.filter(tag => !tags.includes(tag)) || [];
    }

    /**
     * 删除禁止的 tag
     * @param tags tag 数组
     */
    delDenyTags(...tags: string[]): void {
        if (!this._config.denyTags) return;
        this._config.denyTags = this._config.denyTags.filter(tag => !tags.includes(tag)) || [];
    }

    /**
     * 清空 log tag
     */
    clearLogTags(): void {
        this._config.logTags.length = 0;
    }

    /**
     * 清空允许的 tag
     */
    clearAllowTags(): void {
        this._config.allowTags.length = 0;
    }

    /**
     * 清空禁止的 tag
     */
    clearDenyTags(): void {
        this._config.denyTags.length = 0;
    }

    /**
     * 检查是否应该打印（根据 tag 控制）
     * @param tags tag 数组
     * @returns 是否应该打印
     */
    private shouldPrint(tags: string[]): boolean {
        // 如果有父级日志实例，先检查父级是否允许打印
        if (this._parentLogger && !this._parentLogger.shouldPrint(tags)) {
            return false;
        }

        const { tagMode: tagControlMode } = this._config;
        switch (tagControlMode) {
            case LhLoggerTagMode.ALL:
                return true;
            case LhLoggerTagMode.DENY:
                return this.checkDenyTags(tags);
            case LhLoggerTagMode.ALLOW:
                return this.checkAllowTags(tags);
            default:
                return true;
        }
    }

    /**
     * 检查是否有tag在禁止列表中
     * @param tags tag 数组
     * @returns 是否应该打印
     */
    private checkDenyTags(tags: string[]): boolean {
        // 先检查当前实例的禁止列表
        const currentResult = this._checkDenyTagsInternal(tags);

        // 如果有父级日志实例，需要同时检查父级的禁止列表
        if (this._parentLogger) {
            return currentResult && this._parentLogger._checkDenyTagsInternal(tags);
        }

        return currentResult;
    }

    /**
     * 内部检查是否有tag在禁止列表中的方法
     * @param tags tag 数组
     * @returns 是否应该打印
     */
    private _checkDenyTagsInternal(tags: string[]): boolean {
        // 如果任何一个 tag 在禁止列表中，则不打印
        if (!this._config.denyTags || this._config.denyTags.length === 0) {
            return true;
        }
        if (!tags || tags.length === 0) {
            return true;
        }
        return !tags.some(tag => this._config.denyTags.includes(tag));
    }

    /**
     * 检查是否有tag在允许列表中
     * @param tags tag 数组
     * @returns 是否应该打印
     */
    private checkAllowTags(tags: string[]): boolean {
        // 先检查当前实例的允许列表
        const currentResult = this._checkAllowTagsInternal(tags);

        // 如果有父级日志实例，需要同时检查父级的允许列表
        if (this._parentLogger) {
            return currentResult && this._parentLogger._checkAllowTagsInternal(tags);
        }

        return currentResult;
    }

    /**
     * 内部检查是否有tag在允许列表中的方法
     * @param tags tag 数组
     * @returns 是否应该打印
     */
    private _checkAllowTagsInternal(tags: string[]): boolean {
        // 如果没有 tag 或者所有 tag 都不在允许列表中，则不打印
        if (!this._config.allowTags || this._config.allowTags.length === 0) {
            return false;
        }
        if (!tags || tags.length === 0) {
            return false;
        }
        return tags.some(tag => this._config.allowTags.includes(tag));
    }

    /**
     * 获取当前时间字符串
     * @returns 格式化的时间字符串 HH:mm:ss.SSS
     */
    private getTimeString(): string {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    /**
     * 获取栈信息
     * @returns 调用者的文件名和行号
     */
    private getStackInfo(): string {
        const e = new Error();
        const stack = e.stack;
        if (!stack) return '';

        const lines = stack.split('\n');

        // 处理每一行，参考getStackInfoBak的方式
        for (let i: number = 0, leni: number = lines.length; i < leni; i++) {
            const line = lines[i];
            // 去掉行首空格和 'at ' 前缀
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('at ')) {
                // 从trimmedLine中去掉'at '前缀
                const processedLine = trimmedLine.substring(3);
                // 正确处理不同格式的堆栈信息
                let functionName = '';

                // 检查是否包含括号格式 (function@file:line)
                if (processedLine.includes(' (')) {
                    const parts = processedLine.split(' (');
                    functionName = parts[0];
                } else {
                    // 尝试从路径中提取函数名
                    const pathParts = processedLine.split(':');
                    if (pathParts.length > 0) {
                        const fullPath = pathParts[0];
                        const fileName = fullPath.split(/[/\\]/).pop() || '';
                        functionName = fileName.split('.')[0] || 'anonymous';
                    }
                }

                // 排除LhLogger内部方法
                if (!functionName.includes('LhLogger') && !functionName.includes('Object') && !functionName.includes('anonymous')) {
                    return functionName;
                }
            }
        }
        return '';
    }

    /**
     * 解析消息中的颜色标记
     * @param msg 消息
     * @returns 解析后的消息部分数组
     */
    private parseColoredMessage(msg: string): Array<{ text: string; color?: string }> {
        const parts: Array<{ text: string; color?: string }> = [];
        const regex = /<color=(#[0-9A-Fa-f]{6}|[a-zA-Z]+)>(.*?)<\/color>/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(msg)) !== null) {
            // 添加颜色标记之前的普通文本
            if (match.index > lastIndex) {
                parts.push({ text: msg.substring(lastIndex, match.index), color: '' });
            }
            // 添加带颜色的文本
            parts.push({ text: match[2], color: match[1] });
            lastIndex = regex.lastIndex;
        }

        // 添加最后剩余的普通文本
        if (lastIndex < msg.length) {
            parts.push({ text: msg.substring(lastIndex), color: '' });
        }

        // 如果没有匹配到任何颜色标记，返回整个消息
        if (parts.length === 0) {
            parts.push({ text: msg, color: '' });
        }

        return parts;
    }

    /**
     * 打印日志（普通模式）
     * @param msg 消息
     * @param tags tag 数组
     * @param level 日志级别
     */
    private printNormal(msg: string | object, tags: string[], level: string = 'log', styleColor: string = '#6495ed'): void {
        const time = this.getTimeString();
        let tagStr = `[${level.toUpperCase()}]`;
        level = level.toLowerCase();
        tagStr += tags ? (tags.length > 0 ? `[${tags.join('][')}]` : '') : '';
        const stack = this.getStackInfo();
        const prefix = `${time} ${tagStr} ${stack}`;

        let formatStr = '%c%s';

        const args: any[] = [
            `background:${styleColor}; padding: 2px 4px; border-radius: 5px; border: 1px solid black; color: #000; font-weight: normal;`,
            prefix
        ];

        // 检查消息是否为对象类型
        if (typeof msg === 'object' && msg !== null) {
            // 对象类型，使用%o不解析颜色
            formatStr += ' %o';
            args.push(msg);
        } else {
            // 字符串类型，解析颜色
            const msgParts = this.parseColoredMessage(msg as string);

            let currentColor: string = "";
            let currentText: string = " ";
            // 处理消息部分
            msgParts.forEach((part) => {
                if (currentColor !== part.color) {
                    // 如果当前有累积的文本，先添加它
                    if (currentText) {
                        formatStr += '%c%s';
                        args.push(currentColor ? `color: ${currentColor}; font-weight: bold;` : '');
                        args.push(currentText);
                    }
                    // 更新当前颜色和文本
                    currentColor = part.color || "";
                    currentText = part.text;
                } else {
                    // 颜色相同，合并文本
                    currentText += part.text;
                }
            });

            // 添加最后累积的文本
            if (currentText) {
                formatStr += '%c%s';
                args.push(currentColor ? `color: ${currentColor}; font-weight: bold;` : '');
                args.push(currentText);
            }
        }

        // 将格式字符串作为第一个参数
        args.unshift(formatStr);

        // 根据级别直接调用对应的原生console方法
        LhLogger._originalConsole[level] && LhLogger._originalConsole[level](...args);
    }

    /**
     * 打印日志（简易模式）
     * @param msg 消息
     * @param tags tag 数组
     * @param level 日志级别
     */
    private printSimple(msg: string | object, tags: string[], level: string = 'log'): void {
        const time = this.getTimeString();
        let tagStr = `[${level.toUpperCase()}]`;
        level = level.toLowerCase();
        tagStr += tags ? (tags.length > 0 ? `[${tags.join('][')}]` : '') : '';

        let args: any[] = [`${time} ${tagStr}`];
        if (typeof msg === 'object' && msg !== null) {
            args.unshift("%s%o");
            // 对象类型直接打印
            args.push(msg);
        } else {
            // 字符串类型，移除颜色标记
            const cleanMsg = (msg as string).replace(/<color=[^>]+>(.*?)<\/color>/g, '$1');
            args.push(cleanMsg);
        }
        LhLogger._originalConsole[level] && LhLogger._originalConsole[level](...args);
    }

    /**
     * 通用打印方法
     * @param msg 消息
     * @param tags tag 数组
     * @param level 日志级别
     */
    public print(msg: string | object, tags: string[], level: 'log' | 'info' | 'warn' | 'error' = 'log', styleColor: string = '#6495ed'): void {
        // 如果不是错误或者警告，需要检测tag
        if (level !== 'error' && level !== 'warn') {
            // 检查是否应该打印
            if (!this.shouldPrint(tags)) {
                return;
            }
        }

        tags = this._config.logTags ? [...this._config.logTags, ...tags] : tags;
        // 根据模式和日志级别选择打印方式和对应的原生console方法
        if (this.getLogMode() === LhLogMsgMode.SIMPLE) {
            this.printSimple(msg, tags, level);
        } else {
            this.printNormal(msg, tags, level, styleColor);
        }
    }

    /**
     * 打印 debug/info 级别日志
     * @param msg 消息
     * @param tags tag 数组
     */
    public log(msg: string | object, ...tags: string[]): void {
        this.print(msg, tags, 'log', LhLoggerHeadColor.Log);
    }
    public debug(msg: string | object, ...tags: string[]): void {
        this.print(msg, tags, 'log', LhLoggerHeadColor.Log);
    }

    /**
     * 打印 info 级别日志
     * @param msg 消息
     * @param tags tag 数组
     */
    public info(msg: string | object, ...tags: string[]): void {
        this.print(msg, tags, 'info', LhLoggerHeadColor.Info);
    }

    /**
     * 打印 warn 级别日志
     * @param msg 消息
     * @param tags tag 数组
     */
    public warn(msg: string | object, ...tags: string[]): void {
        this.print(msg, tags, 'warn', LhLoggerHeadColor.Warn);
    }

    /**
     * 打印 error 级别日志
     * @param msg 消息
     * @param tags tag 数组
     */
    public error(msg: string | object, ...tags: string[]): void {
        this.print(msg, tags, 'error', LhLoggerHeadColor.Error);
    }
    // #endregion 实例 ------------------
}

/**
 * Logger属性装饰器，用于自动注入Logger实例
 * 使用方式: @lhLogger({}) myLogger: Logger.LhLogger
 * @param options 装饰器选项
 * @returns 属性装饰器函数
 */
export function decoratorLogger(config?: LhLoggerConfig): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol): void {
        // 定义一个私有属性键，用于存储Logger实例
        const privateKey = Symbol(`${String(propertyKey)}_logger`);

        // 定义getter，在首次访问时创建Logger实例
        Object.defineProperty(target, propertyKey, {
            get: function () {
                // 检查实例是否已创建
                if (!this[privateKey]) {
                    // 创建新的Logger实例
                    this[privateKey] = LhLogger.create(config);
                }
                return this[privateKey];
            },
            enumerable: true,
            configurable: true
        });
    };
}