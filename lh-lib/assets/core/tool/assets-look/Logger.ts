/**
 * 日志工具类
 * 负责统一管理调试日志输出
 */
class Logger {
    /**
     * 输出日志信息
     * @param args - 日志参数
     */
    static log(...args: any[]): void {
        // 在生产环境中可以关闭日志输出
        // console.log(...args);
    }

    /**
     * 输出警告信息
     * @param args - 警告参数
     */
    static warn(...args: any[]): void {
        console.warn(...args);
    }

    /**
     * 输出错误信息
     * @param args - 错误参数
     */
    static error(...args: any[]): void {
        console.error(...args);
    }

    /**
     * 输出分组开始
     * @param label - 分组标签
     */
    static group(label: string): void {
        console.group(label);
    }

    /**
     * 输出分组结束
     */
    static groupEnd(): void {
        console.groupEnd();
    }
}

export default Logger;