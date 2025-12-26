/**
 * 创建者环境信息接口
 */
interface CreatorEnvironment {
    DEBUG: boolean;
    EDITOR: boolean;
    isBrowser: boolean;
}

/**
 * Cocos Creator 全局对象接口
 */
interface CocosCreator {
    ENGINE_VERSION?: string;
    engine?: {
        VERSION?: string;
    };
    env?: {
        DEBUG?: boolean;
        EDITOR?: boolean;
    };
    DEBUG?: boolean;
    EDITOR?: boolean;
    sys?: {
        isBrowser?: boolean;
    };
    director?: any;
}

/**
 * 全局窗口对象扩展
 */
declare global {
    interface Window {
        cc?: CocosCreator;
        DEBUG?: boolean;
        EDITOR?: boolean;
        CC_DEBUG?: boolean;
        CC_EDITOR?: boolean;
    }
}

/**
 * 工具函数模块
 * 提供通用的辅助函数
 */
class Utils {
    /**
     * 检测是否为Cocos Creator 3.x或4.x版本
     * @returns 是否为3.x/4.x版本
     */
    static isCreator3x(): boolean {
        const cc = window.cc;
        const version = cc?.ENGINE_VERSION || '';
        return version.startsWith('3.') || version.startsWith('4.');
    }

    /**
     * 获取Creator环境信息
     * @returns 环境信息对象
     */
    static getCreatorEnvironment(): CreatorEnvironment {
        let DEBUG = false;
        let EDITOR = false;
        let isBrowser = false;

        try {
            const cc = window.cc;
            
            if (this.isCreator3x()) {
                try {
                    const env = cc?.env;
                    if (env) {
                        DEBUG = env.DEBUG || false;
                        EDITOR = env.EDITOR || false;
                    } else {
                        DEBUG = cc?.DEBUG || window.DEBUG || window.CC_DEBUG || false;
                        EDITOR = cc?.EDITOR || window.EDITOR || window.CC_EDITOR || false;
                    }

                    const sys = cc?.sys;
                    if (sys) {
                        isBrowser = sys.isBrowser || false;
                    }
                } catch (error) {
                    DEBUG = window.DEBUG || false;
                    EDITOR = window.EDITOR || false;
                    isBrowser = (cc as any)?.sys?.isBrowser || false;
                }
            } else {
                // Cocos Creator 2.x
                DEBUG = window.CC_DEBUG || false;
                EDITOR = window.CC_EDITOR || false;
                isBrowser = cc?.sys?.isBrowser || false;
            }
        } catch (error) {
            console.warn('检测Creator环境变量失败:', error);
            DEBUG = window.DEBUG || window.CC_DEBUG || false;
            EDITOR = window.EDITOR || window.CC_EDITOR || false;
            isBrowser = cc?.sys?.isBrowser || false;
        }

        return { DEBUG, EDITOR, isBrowser };
    }

    /**
     * 格式化字节大小
     * @param bytes - 字节数
     * @returns 格式化后的大小字符串
     */
    static formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 深度克隆对象
     * @param obj - 要克隆的对象
     * @returns 克隆后的对象
     */
    static deepClone<T>(obj: T): T {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime()) as T;
        if (obj instanceof Array) return obj.map(item => this.deepClone(item)) as T;
        if (typeof obj === 'object') {
            const clonedObj: any = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
        return obj;
    }

    /**
     * 防抖函数
     * @param func - 要防抖的函数
     * @param wait - 等待时间（毫秒）
     * @returns 防抖后的函数
     */
    static debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
        let timeout: number | undefined;
        return function executedFunction(...args: Parameters<T>) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * 节流函数
     * @param func - 要节流的函数
     * @param limit - 限制时间（毫秒）
     * @returns 节流后的函数
     */
    static throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
        let inThrottle: boolean;
        return function executedFunction(...args: Parameters<T>) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * 生成唯一ID
     * @returns 唯一ID字符串
     */
    static generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * 安全地获取对象属性
     * @param obj - 对象
     * @param path - 属性路径，如 'a.b.c'
     * @param defaultValue - 默认值
     * @returns 属性值或默认值
     */
    static safeGet<T>(obj: any, path: string, defaultValue: T | undefined = undefined): T | undefined {
        try {
            const keys = path.split('.');
            let result = obj;
            
            for (const key of keys) {
                if (result === null || result === undefined) {
                    return defaultValue;
                }
                result = result[key];
            }
            
            return result !== undefined ? result : defaultValue;
        } catch (error) {
            return defaultValue;
        }
    }

    /**
     * 检查是否为有效的数字
     * @param value - 要检查的值
     * @returns 是否为有效数字
     */
    static isValidNumber(value: any): value is number {
        return typeof value === 'number' && !isNaN(value) && isFinite(value);
    }

    /**
     * 限制数值在指定范围内
     * @param value - 数值
     * @param min - 最小值
     * @param max - 最大值
     * @returns 限制后的数值
     */
    static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * 将角度转换为弧度
     * @param degrees - 角度
     * @returns 弧度
     */
    static degreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    /**
     * 将弧度转换为角度
     * @param radians - 弧度
     * @returns 角度
     */
    static radiansToDegrees(radians: number): number {
        return radians * (180 / Math.PI);
    }

    /**
     * 检查对象是否为空
     * @param obj - 要检查的对象
     * @returns 是否为空对象
     */
    static isEmpty(obj: any): boolean {
        if (obj === null || obj === undefined) return true;
        if (Array.isArray(obj)) return obj.length === 0;
        if (typeof obj === 'object') return Object.keys(obj).length === 0;
        if (typeof obj === 'string') return obj.trim().length === 0;
        return false;
    }

    /**
     * 获取对象类型
     * @param obj - 要检查的对象
     * @returns 对象类型
     */
    static getType(obj: any): string {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    }

    /**
     * 比较两个版本号
     * @param version1 - 版本号1
     * @param version2 - 版本号2
     * @returns 比较结果：-1, 0, 1
     */
    static compareVersions(version1: string, version2: string): number {
        const v1parts = version1.split('.').map(Number);
        const v2parts = version2.split('.').map(Number);
        const maxLength = Math.max(v1parts.length, v2parts.length);

        for (let i = 0; i < maxLength; i++) {
            const v1part = v1parts[i] || 0;
            const v2part = v2parts[i] || 0;

            if (v1part < v2part) return -1;
            if (v1part > v2part) return 1;
        }

        return 0;
    }

    /**
     * 创建样式表
     * @param css - CSS内容
     * @param id - 样式表ID（可选）
     * @returns 样式元素
     */
    static createStyleSheet(css: string, id: string | null = null): HTMLStyleElement {
        const style = document.createElement('style');
        style.textContent = css;
        
        if (id) {
            style.id = id;
            // 如果已存在相同ID的样式表，先移除
            const existing = document.getElementById(id);
            if (existing) {
                existing.remove();
            }
        }
        
        document.head.appendChild(style);
        return style;
    }

    /**
     * 等待指定时间
     * @param ms - 等待时间（毫秒）
     * @returns Promise对象
     */
    static sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default Utils;