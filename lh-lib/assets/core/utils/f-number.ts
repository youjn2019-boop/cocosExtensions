// ==================== 定点数类 ====================

/**
 * FNumber - 高精度定点数运算类
 * 
 * 主要功能：
 * - 解决 JavaScript 浮点数精度问题
 * - 提供链式调用支持
 * - 内置对象池优化性能
 * - 支持基本数学运算和三角函数
 * 
 * 核心特性：
 * - 使用定点数算法避免浮点误差
 * - 对象池模式减少 GC 压力
 * - 缓存常用计算因子提升性能
 * 
 * 使用示例：
 * @example
 * // 基本运算
 * const num = FNumber.get(10);
 * num.add(5).mul(2).sub(3);  // (10 + 5) * 2 - 3 = 27
 * console.log(num.value);    // 27
 * 
 * // 链式调用
 * const result = FNumber.value(10).add(5).mul(2).value;  // 30
 * 
 * // 静态工具方法
 * FNumber.toFixed(3.14159, 2);  // 3.14
 */
export class FNumber {
    // ========== 数学常量 ==========
    
    /** 角度转弧度常量 (180/π) */
    public static readonly DEG = 57.29577951308232;
    
    /** 弧度转角度常量 (π/180) */
    public static readonly RAD = 0.017453292519943295;

    /** 圆周率 π */
    public static readonly PI = 3.141592653589793;
    
    /** 自然对数底数 e */
    public static readonly E = 2.718281828459045;
    
    /** ln(2) - 2 的自然对数 */
    public static readonly LN2 = 0.6931471805599453;
    
    /** ln(10) - 10 的自然对数 */
    public static readonly LN10 = 2.302585092994046;
    
    /** log₂(e) - 以 2 为底 e 的对数 */
    public static readonly LOG2E = 1.4426950408889634;
    
    /** log₁₀(e) - 以 10 为底 e 的对数 */
    public static readonly LOG10E = 0.4342944819032518;
    
    /** √(1/2) */
    public static readonly SQRT1_2 = 0.7071067811865476;
    
    /** √2 */
    public static readonly SQRT2 = 1.4142135623730951;

    // ========== 对象池配置 ==========
    
    /** 对象池 - 存储可复用的 FNumber 实例 */
    private static _pool: FNumber[] = [];
    
    /** 对象池最大容量 */
    private static _poolSize = 50;
    
    /** 链式调用专用实例（单例） */
    public static Chain: FNumber = null;

    // ========== 精度配置 ==========
    
    /** 定点数缩放比例（用于整数化运算） */
    public static Ratio = 1000;

    /** 默认保留小数位数 */
    public static Decimals = 2;
    
    /** 小数因子缓存（优化性能） */
    private static DecimalsFactor = Math.pow(10, 3);

    // ========== 实例属性 ==========
    
    /** 当前存储的数值 */
    public value: number;

    // ========== 构造函数 ==========

    /**
     * 创建 FNumber 实例
     * 
     * 建议使用 FNumber.get() 替代直接 new，以利用对象池优化
     * 
     * @param n - 初始值（可选）
     */
    constructor(n?: number) {
        this.value = 0;
        if (n !== undefined) {
            this.add(n);
        }
    }

    // ========== 静态工厂方法 - 对象池管理 ==========

    /**
     * 从对象池获取 FNumber 实例
     * 
     * 优先从对象池复用实例，提升性能
     * 
     * @param value - 初始值（可选）
     * @returns FNumber 实例
     * 
     * @example
     * const num = FNumber.get(10);
     * num.add(5);
     * console.log(num.value);  // 15
     * FNumber.put(num);  // 回收
     */
    public static get(value?: number): FNumber {
        if (this._pool.length > 0) {
            const instance = this._pool.pop();
            if (value !== undefined) {
                instance.value = 0;
                instance.add(value);
            } else {
                instance.value = 0;
            }
            return instance;
        }
        return new FNumber(value);
    }

    /**
     * 回收 FNumber 实例到对象池
     * 
     * 使用完毕后调用此方法，可提升性能
     * 
     * @param instance - 要回收的实例
     * 
     * @example
     * const num = FNumber.get(10);
     * // ... 使用 num
     * FNumber.put(num);  // 回收到池中
     */
    public static put(instance: FNumber): void {
        if (this._pool.length < this._poolSize) {
            instance.value = 0;
            this._pool.push(instance);
        }
    }

    /**
     * 初始化对象池
     * 
     * 预先创建对象填充池，避免运行时分配
     * 建议在应用启动时调用
     * 
     * @example
     * FNumber.initPool();  // 在应用初始化时调用
     */
    public static initPool(): void {
        while (this._pool.length < this._poolSize) {
            this._pool.push(new FNumber());
        }
        // 初始化链式调用实例
        if (!this.Chain) {
            this.Chain = new FNumber();
        }
    }

    /**
     * 创建 FNumber 实例（别名方法）
     * 
     * 等同于 get() 方法
     * 
     * @param value - 初始值（可选）
     * @returns FNumber 实例
     */
    public static creat(value?: number): FNumber {
        return this.get(value);
    }

    /**
     * 链式调用 - 使用共享单例
     * 
     * 适用于临时计算，无需手动回收
     * 注意：多次调用会覆盖之前的值
     * 
     * @param value - 初始值
     * @returns 链式调用实例
     * 
     * @example
     * const result = FNumber.value(10).add(5).mul(2).value;  // 30
     */
    public static value(value: number): FNumber {
        if (!FNumber.Chain) {
            FNumber.Chain = new FNumber();
        }
        FNumber.Chain.value = 0;
        FNumber.Chain.add(value);
        return FNumber.Chain;
    }

    // ========== 静态工具方法 ==========

    /**
     * 保留 n 位小数并四舍五入
     * 
     * 使用缓存因子优化常见场景（n === Decimals）
     * 
     * @param num - 要处理的数值
     * @param n - 保留的小数位数（默认 0）
     * @returns 四舍五入后的结果
     * 
     * @example
     * FNumber.toFixed(3.14159, 2);   // 3.14
     * FNumber.toFixed(3.5, 0);       // 4
     */
    public static toFixed(num: number, n: number = 0): number {
        if (n === 0) {
            return Math.round(num);
        } else if (n === this.Decimals) {
            // 使用缓存的因子优化性能
            return Math.round(num * this.DecimalsFactor) / this.DecimalsFactor;
        } else {
            const m = Math.pow(10, n);
            return Math.round(num * m) / m;
        }
    }

    /**
     * 获取数值的小数位数
     * 
     * @param num - 要检查的数值
     * @returns 小数位数
     * 
     * @example
     * FNumber.getDecimalPlace(3.14);     // 2
     * FNumber.getDecimalPlace(100);      // 0
     * FNumber.getDecimalPlace(0.001);    // 3
     */
    public static getDecimalPlace(num: number): number {
        // 整数直接返回 0
        if (!num || num === Math.floor(num)) {
            return 0;
        }

        // 转换为字符串并查找小数点
        const str = num.toString();
        const dotIndex = str.indexOf('.');
        if (dotIndex === -1) return 0;

        return str.length - dotIndex - 1;
    }

    // ========== 实例方法 - 类型转换 ==========

    /**
     * 转换为原始数值类型
     * 
     * @returns 数值
     */
    public valueOf(): number {
        return this.value;
    }

    /**
     * 转换为字符串
     * 
     * @returns 字符串表示
     */
    public toString(): string {
        return String(this.value);
    }

    // ========== 实例方法 - 基本操作 ==========

    /**
     * 重置数值
     * 
     * @param n - 新值（可选，默认 0）
     * @returns 当前实例（支持链式调用）
     * 
     * @example
     * num.reset(10);  // 重置为 10
     * num.reset();    // 重置为 0
     */
    public reset(n?: number): FNumber {
        this.value = n !== undefined ? n : 0;
        return this;
    }

    // ========== 实例方法 - 基本算术运算 ==========

    /**
     * 加法运算
     * 
     * 使用定点数算法避免浮点数精度问题
     * 
     * @param num - 要加的数值
     * @returns 当前实例（支持链式调用）
     * 
     * @example
     * const n = FNumber.get(0.1);
     * n.add(0.2);
     * console.log(n.value);  // 0.3（精确）
     */
    public add(num: number): FNumber {
        if (!num) return this;
        
        // 转换为整数运算，避免浮点误差
        const a = Math.floor(this.value * FNumber.Ratio);
        const b = Math.floor(num * FNumber.Ratio);
        this.value = (a + b) / FNumber.Ratio;
        
        return this;
    }

    /**
     * 减法运算
     * 
     * 使用定点数算法避免浮点数精度问题
     * 
     * @param num - 要减的数值
     * @returns 当前实例（支持链式调用）
     * 
     * @example
     * const n = FNumber.get(0.3);
     * n.sub(0.1);
     * console.log(n.value);  // 0.2（精确）
     */
    public sub(num: number): FNumber {
        if (!num) {
            return this;
        }
        
        // 转换为整数运算，避免浮点误差
        this.value = (
            Math.floor(this.value * FNumber.Ratio) - 
            Math.floor(num * FNumber.Ratio)
        ) / FNumber.Ratio;
        
        return this;
    }

    /**
     * 乘法运算
     * 
     * 使用定点数算法避免浮点数精度问题
     * 
     * @param num - 要乘的数值
     * @returns 当前实例（支持链式调用）
     * 
     * @example
     * const n = FNumber.get(0.2);
     * n.mul(0.1);
     * console.log(n.value);  // 0.02（精确）
     */
    public mul(num: number): FNumber {
        if (!num) {
            this.value = 0;
            return this;
        }
        
        // 转换为整数运算，避免浮点误差
        this.value = (
            Math.floor(this.value * FNumber.Ratio) * 
            Math.floor(num * FNumber.Ratio)
        ) / FNumber.Ratio / FNumber.Ratio;
        
        return this;
    }

    /**
     * 除法运算
     * 
     * 使用定点数算法避免浮点数精度问题
     * 
     * @param num - 除数
     * @returns 当前实例（支持链式调用）
     * 
     * @example
     * const n = FNumber.get(0.3);
     * n.div(3);
     * console.log(n.value);  // 0.1（精确）
     */
    public div(num: number): FNumber {
        if (!num) {
            this.value = 0;
            return this;
        }
        
        // 转换为整数运算，避免浮点误差
        this.value = Math.floor(
            (Math.floor(this.value * FNumber.Ratio) / 
             Math.floor(num * FNumber.Ratio)) * FNumber.Ratio
        ) / FNumber.Ratio;
        
        return this;
    }

    /**
     * 取余运算
     * 
     * 计算除法的余数
     * 
     * @param num - 除数
     * @returns 余数
     * 
     * @example
     * const n = FNumber.get(10);
     * const remainder = n.rem(3);  // 1
     */
    public rem(num: number): number {
        if (!num) {
            return 0;
        }
        
        // 根据小数位数确定放大倍数
        const m = Math.pow(
            10, 
            Math.max(
                FNumber.getDecimalPlace(this.value), 
                FNumber.getDecimalPlace(num)
            )
        );
        
        return FNumber.toFixed(this.value * m) % FNumber.toFixed(num * m) / m;
    }

    // ========== 实例方法 - 高级数学运算 ==========

    /**
     * 幂运算
     * 
     * 计算当前值的 num 次方
     * 
     * @param num - 指数
     * @returns 当前实例（支持链式调用）
     * 
     * @example
     * const n = FNumber.get(2);
     * n.pow(3);
     * console.log(n.value);  // 8
     */
    public pow(num: number): FNumber {
        if (!num) {
            return this;
        }
        
        this.value = Math.pow(
            FNumber.toFixed(this.value, FNumber.Decimals), 
            FNumber.toFixed(num, FNumber.Decimals)
        );
        
        return this;
    }

    /**
     * 平方根运算
     * 
     * 计算当前值的平方根
     * 
     * @returns 当前实例（支持链式调用）
     * 
     * @example
     * const n = FNumber.get(9);
     * n.sqrt();
     * console.log(n.value);  // 3
     */
    public sqrt(): FNumber {
        this.value = Math.sqrt(
            FNumber.toFixed(this.value, FNumber.Decimals)
        );
        return this;
    }

    // ========== 实例方法 - 三角函数 ==========

    /**
     * 正弦函数
     * 
     * @param x - 弧度值
     * @returns 当前实例（支持链式调用）
     * 
     * @example
     * const n = FNumber.get();
     * n.sin(FNumber.PI / 2);
     * console.log(n.value);  // 1
     */
    public sin(x: number): FNumber {
        this.value = FNumber.toFixed(Math.sin(x), FNumber.Decimals);
        return this;
    }

    /**
     * 余弦函数
     * 
     * @param x - 弧度值
     * @returns 当前实例（支持链式调用）
     * 
     * @example
     * const n = FNumber.get();
     * n.cos(0);
     * console.log(n.value);  // 1
     */
    public cos(x: number): FNumber {
        this.value = FNumber.toFixed(Math.cos(x), FNumber.Decimals);
        return this;
    }

    /**
     * 正切函数
     * 
     * @param x - 弧度值
     * @returns 当前实例（支持链式调用）
     * 
     * @example
     * const n = FNumber.get();
     * n.tan(FNumber.PI / 4);
     * console.log(n.value);  // 1
     */
    public tan(x: number): FNumber {
        this.value = FNumber.toFixed(Math.tan(x), FNumber.Decimals);
        return this;
    }

    /**
     * 反正弦函数
     * 
     * @param x - 数值（[-1, 1]）
     * @returns 当前实例（支持链式调用）
     * 
     * @example
     * const n = FNumber.get();
     * n.asin(1);
     * console.log(n.value);  // π/2
     */
    public asin(x: number): FNumber {
        this.value = FNumber.toFixed(Math.asin(x), FNumber.Decimals);
        return this;
    }

    /**
     * 反余弦函数
     * 
     * @param x - 数值（[-1, 1]）
     * @returns 当前实例（支持链式调用）
     * 
     * @example
     * const n = FNumber.get();
     * n.acos(1);
     * console.log(n.value);  // 0
     */
    public acos(x: number): FNumber {
        this.value = FNumber.toFixed(Math.acos(x), FNumber.Decimals);
        return this;
    }

    /**
     * 反正切函数
     * 
     * @param x - 数值
     * @returns 当前实例（支持链式调用）
     * 
     * @example
     * const n = FNumber.get();
     * n.atan(1);
     * console.log(n.value);  // π/4
     */
    public atan(x: number): FNumber {
        this.value = FNumber.toFixed(Math.atan(x), FNumber.Decimals);
        return this;
    }

    /**
     * 双参数反正切函数
     * 
     * 返回从 x 轴到点 (x, y) 的角度（弧度）
     * 
     * @param y - Y 坐标
     * @param x - X 坐标
     * @returns 当前实例（支持链式调用）
     * 
     * @example
     * const n = FNumber.get();
     * n.atan2(1, 1);
     * console.log(n.value);  // π/4
     */
    public atan2(y: number, x: number): FNumber {
        this.value = FNumber.toFixed(Math.atan2(y, x), FNumber.Decimals);
        return this;
    }
}
