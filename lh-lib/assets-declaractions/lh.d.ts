// 全局引用
declare namespace gi {
    // 首包
    export class LhStartScene {
        static init(): void;
    }

    // 配置
    export let lhConfig: LhConfig;
    export class LhConfig {
        /**游戏状态是否正常 */
        gameRunning: boolean;
    }

    // 进入游戏
    export class LhEnterGame {
        static init(): void;
    }

    // #region 日志相关 ------------------
    export let logger: LhLogger;
    export function logNet(msg: any, ...tag: string[]);
    export function logView(msg: any, ...tag: string[]);
    export function logModel(msg: any, ...tag: string[]);
    /**
     * Logger属性装饰器，用于自动注入Logger实例
     * 使用方式: @decoratorLogger({}) myLogger: Logger.LhLogger
     * @param config 装饰器选项
     * @returns 属性装饰器函数
     */
    export function decoratorLogger(config?: Logger.LhLoggerConfig): PropertyDecorator;
    /** 日志头部背景颜色枚举 */
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

    /** 日志模式枚举 */
    export enum LhLogMsgMode {
        /** 普通模式：显示时间+tag+栈信息+msg，带样式 */
        NORMAL = 0,
        /** 简易模式：显示时间+tag+msg，无样式 */
        SIMPLE = 1
    }

    /** Tag 控制模式枚举 */
    export enum LhLoggerTagMode {
        /** 都打印 */
        ALL = 0,
        /** 被禁止的 tag 不打印 */
        DENY = 1,
        /** 只打印允许的 tag */
        ALLOW = 2
    }

    /** 日志配置接口 */
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
     * 装饰器配置接口
     */
    export interface LhLoggerDecoratorOptions {
        /** 自定义标签 */
        tags?: string[];
        /** 日志配置 */
        config?: LhLoggerConfig;
    }

    export class LhLogger {
        // 静态方法和属性
        /** 默认实例，用于向后兼容静态方法调用 */
        public static default: LhLogger;

        /**
         * 设置对象池配置
         * @param config 对象池配置
         */
        public static setPoolConfig(config: LhLoggerPoolConfig): void;

        /**
         * 清空对象池
         */
        public static clearPool(): void;

        /**
         * 获取对象池中实例的数量
         */
        public static get poolSize(): number;

        /**
         * 劫持原生 console 方法，将其替换为空函数，避免在控制台打印日志
         */
        static hijackConsole(): void;

        /**
         * 恢复原生 console 方法
         */
        static restoreConsole(): void;

        /**
         * 创建一个新的日志实例，自动将默认实例作为父级
         * @param config 日志配置
         * @returns 日志实例（可能从对象池获取）
         */
        public static create(config?: LhLoggerConfig): LhLogger;

        /**
         * 设置默认实例的日志配置
         */
        public static setConfig(config: LhLoggerConfig): void;

        /**
         * 静态添加允许的 tag，用于向后兼容
         */
        public static addAllowTags(...tags: string[]): void;

        /**
         * 静态添加禁止的 tag，用于向后兼容
         */
        public static addDenyTags(...tags: string[]): void;

        /**
         * 静态清空允许的 tag，用于向后兼容
         */
        public static clearAllowTags(): void;

        /**
         * 静态清空禁止的 tag，用于向后兼容
         */
        public static clearDenyTags(): void;

        /**
         * 静态 log 方法，用于向后兼容
         */
        public static log(msg: string | object, ...tags: string[]): void;

        /**
         * 静态 debug 方法，用于向后兼容
         */
        public static debug(msg: string | object, ...tags: string[]): void;

        /**
         * 静态 info 方法，用于向后兼容
         */
        public static info(msg: string | object, ...tags: string[]): void;

        /**
         * 静态 warn 方法，用于向后兼容
         */
        public static warn(msg: string | object, ...tags: string[]): void;

        /**
         * 静态 error 方法，用于向后兼容
         */
        public static error(msg: string | object, ...tags: string[]): void;

        // 实例方法
        /**
         * 创建日志实例
         * @param config 日志配置
         * @param parent 可选的父级日志实例
         */
        constructor(config?: LhLoggerConfig, parent?: LhLogger | null);

        /**
         * 劫持原生 console 方法，将其替换为空函数，避免在控制台打印日志
         */
        hijackConsole(): void;

        /**
         * 恢复原生 console 方法
         */
        restoreConsole(): void;

        /**
         * 释放Logger实例到对象池
         * 注意：调用此方法后不应再使用该实例
         */
        public release(): void;

        /**
         * 获取日志配置
         * @returns 当前实例的配置
         */
        getConfig(): Required<LhLoggerConfig>;

        /**
         * 设置日志配置
         * @param config 日志配置
         */
        setConfig(config: LhLoggerConfig): void;

        /**
         * 添加 log tag
         * @param tags tag 数组
         */
        addLogTags(...tags: string[]): void;

        /**
         * 添加允许的 tag
         * @param tags tag 数组
         */
        addAllowTags(...tags: string[]): void;

        /**
         * 添加禁止的 tag
         * @param tags tag 数组
         */
        addDenyTags(...tags: string[]): void;

        /**
         * 删除 log tag
         * @param tags tag 数组
         */
        delLogTags(...tags: string[]): void;

        /**
         * 删除允许的 tag
         * @param tags tag 数组
         */
        delAllowTags(...tags: string[]): void;

        /**
         * 删除禁止的 tag
         * @param tags tag 数组
         */
        delDenyTags(...tags: string[]): void;

        /**
         * 清空 log tag
         */
        clearLogTags(): void;

        /**
         * 清空允许的 tag
         */
        clearAllowTags(): void;

        /**
         * 清空禁止的 tag
         */
        clearDenyTags(): void;

        /**
         * 通用打印方法
         * @param msg 消息
         * @param tags tag 数组
         * @param level 日志级别
         */
        public print(msg: string | object, tags: string[], level?: 'log' | 'info' | 'warn' | 'error', styleColor?: string): void;

        /**
         * 打印 debug/info 级别日志
         * @param msg 消息
         * @param tags tag 数组
         */
        public log(msg: string | object, ...tags: string[]): void;

        /**
         * 打印 debug 级别日志
         * @param msg 消息
         * @param tags tag 数组
         */
        public debug(msg: string | object, ...tags: string[]): void;

        /**
         * 打印 info 级别日志
         * @param msg 消息
         * @param tags tag 数组
         */
        public info(msg: string | object, ...tags: string[]): void;

        /**
         * 打印 warn 级别日志
         * @param msg 消息
         * @param tags tag 数组
         */
        public warn(msg: string | object, ...tags: string[]): void;

        /**
         * 打印 error 级别日志
         * @param msg 消息
         * @param tags tag 数组
         */
        public error(msg: string | object, ...tags: string[]): void;
    }
    // #endregion 日志相关 ------------------

    // 资源管理
    export let resManager: LhResManager;
    export class LhResManager {
        startup(): void;
        addDynamicRef(asset: Asset): void;
        decDynamicRef(uuid: string): void;
        decDynamicRef(asset: Asset): void;
        decDynamicRef(asset: string | Asset): void;
        getDynamicAsset(uuid: string): Asset;
        onAddRef(uuid: string);
        onDecRef(uuid: string);
    }
}