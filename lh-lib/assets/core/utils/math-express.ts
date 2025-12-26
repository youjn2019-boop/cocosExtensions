import { FNumber } from "./f-number";

// ==================== 类型定义 ====================

/**
 * 运算符枚举
 * 定义支持的基本算术运算符
 */
export enum Operator {
    ADD = '+',          // 加法
    SUBTRACT = '-',     // 减法
    MULTIPLY = '*',     // 乘法
    DIVIDE = '/'        // 除法
}

/**
 * 内置函数名枚举
 * 定义系统预置的数学函数
 */
export enum BuiltinFunction {
    RANDOM = 'random',  // 随机数生成
    MAX = 'max',        // 最大值
    MIN = 'min',        // 最小值
    CLAMP = 'clamp',    // 数值限定
    FLOOR = 'floor',    // 向下取整
    CEIL = 'ceil',      // 向上取整
    ROUND = 'round'     // 四舍五入
}

/**
 * 分数运算处理器接口
 * 用于扩展自定义运算符
 * 
 * @example
 * const powerOperator: FractionOperatorHandler = {
 *   handle: (left, right) => {
 *     const result = Math.pow(left.toNumber(), right.toNumber());
 *     return Fraction.fromNumber(result);
 *   }
 * };
 */
export interface FractionOperatorHandler {
    handle(left: Fraction, right: Fraction): Fraction;
}

/**
 * 函数处理器接口
 * 用于扩展自定义函数
 * 
 * @example
 * const avgFunction: FunctionHandler = {
 *   handle: (args) => args.reduce((a, b) => a + b, 0) / args.length
 * };
 */
export interface FunctionHandler {
    handle(args: number[]): number;
}

// ==================== 分数类 ====================

/**
 * 分数类 - 用于精确数学运算
 * 
 * 通过分数形式存储数值，避免浮点数精度问题
 * 使用对象池模式优化性能，减少 GC 压力
 * 
 * @example
 * const fraction = Fraction.fromNumber(0.5);  // 1/2
 * const result = fraction.add(Fraction.fromNumber(0.3));  // 4/5
 * console.log(result.toNumber());  // 0.8
 * fraction.recycle();
 */
class Fraction {
    // ========== 对象池管理 ==========
    
    /** 对象池 - 存储可复用的 Fraction 实例 */
    private static pool: Fraction[] = [];
    
    /** 对象池最大容量 */
    private static readonly POOL_SIZE = 500;
    
    /** 临时 FNumber 对象，用于精确数值计算 */
    private static _fnumTmp: FNumber = FNumber.get(0);

    // ========== 实例属性 ==========
    
    /**
     * @param numerator - 分子
     * @param denominator - 分母
     */
    constructor(
        public numerator: number,
        public denominator: number
    ) {
        if (denominator === 0) {
            throw new Error('Denominator cannot be zero');
        }
        this.simplify();
    }

    // ========== 私有方法 ==========

    /**
     * 化简分数到最简形式
     * 
     * 1. 使用最大公约数约分
     * 2. 确保分母为正数
     * 
     * @private
     */
    private simplify(): void {
        const gcd = this.getGCD(Math.abs(this.numerator), Math.abs(this.denominator));
        this.numerator /= gcd;
        this.denominator /= gcd;
        
        // 保证分母为正
        if (this.denominator < 0) {
            this.numerator = -this.numerator;
            this.denominator = -this.denominator;
        }
    }

    /**
     * 计算最大公约数 (GCD) - 使用欧几里得算法
     * 
     * @param a - 第一个数
     * @param b - 第二个数
     * @returns 最大公约数
     * @private
     */
    private getGCD(a: number, b: number): number {
        return b === 0 ? a : this.getGCD(b, a % b);
    }

    // ========== 静态工厂方法 ==========

    /**
     * 从对象池获取或创建新的分数实例
     * 
     * 优先从对象池复用实例，提升性能
     * 
     * @param numerator - 分子
     * @param denominator - 分母（默认为 1）
     * @returns Fraction 实例
     */
    static create(numerator: number, denominator: number = 1): Fraction {
        let fraction: Fraction;
        
        if (Fraction.pool.length > 0) {
            // 从对象池复用
            fraction = Fraction.pool.pop()!;
            fraction.numerator = numerator;
            fraction.denominator = denominator;
            fraction.simplify();
        } else {
            // 创建新实例
            fraction = new Fraction(numerator, denominator);
        }
        
        return fraction;
    }

    /**
     * 从浮点数创建分数
     * 
     * 将小数转换为分数形式，最多保留 5 位小数精度
     * 
     * @param num - 浮点数
     * @returns Fraction 实例
     * 
     * @example
     * Fraction.fromNumber(0.5)   // 1/2
     * Fraction.fromNumber(0.333) // 333/1000
     */
    static fromNumber(num: number): Fraction {
        const str = num.toString();
        const hasDecimal = str.indexOf('.') >= 0;
        
        // 整数直接返回
        if (!hasDecimal) {
            return Fraction.create(num, 1);
        }

        // 转换小数为分数
        const parts = str.split('.');
        parts[1] = parts[1].substring(0, 5); // 最多保留 5 位小数
        const decimalPlaces = parts[1].length;
        const denominator = Fraction._fnumTmp.reset(10).pow(decimalPlaces).value;
        const numerator = parseInt(parts.join(''));
        
        return Fraction.create(numerator, denominator);
    }

    // ========== 对象池回收 ==========

    /**
     * 将当前实例回收到对象池
     * 
     * 使用完毕后调用此方法，可提升性能
     */
    recycle(): void {
        if (Fraction.pool.length < Fraction.POOL_SIZE) {
            Fraction.pool.push(this);
        }
    }

    // ========== 类型转换 ==========

    /**
     * 转换为浮点数
     * 
     * 使用 FNumber 进行精确除法
     * 
     * @returns 浮点数值
     */
    toNumber(): number {
        return Fraction._fnumTmp.reset(this.numerator).div(this.denominator).value;
    }

    /**
     * 转换为字符串
     * 
     * @returns 字符串表示
     */
    toString(): string {
        return this.toNumber().toString();
    }

    // ========== 算术运算 ==========

    /**
     * 加法运算
     * 
     * @param other - 另一个分数
     * @returns 相加的结果（新的 Fraction 实例）
     */
    add(other: Fraction): Fraction {
        return Fraction.create(
            this.numerator * other.denominator + other.numerator * this.denominator,
            this.denominator * other.denominator
        );
    }

    /**
     * 减法运算
     * 
     * @param other - 另一个分数
     * @returns 相减的结果（新的 Fraction 实例）
     */
    subtract(other: Fraction): Fraction {
        return Fraction.create(
            this.numerator * other.denominator - other.numerator * this.denominator,
            this.denominator * other.denominator
        );
    }

    /**
     * 乘法运算
     * 
     * @param other - 另一个分数
     * @returns 相乘的结果（新的 Fraction 实例）
     */
    multiply(other: Fraction): Fraction {
        return Fraction.create(
            this.numerator * other.numerator,
            this.denominator * other.denominator
        );
    }

    /**
     * 除法运算
     * 
     * @param other - 另一个分数
     * @returns 相除的结果（新的 Fraction 实例）
     */
    divide(other: Fraction): Fraction {
        // 防止除以零
        if (other.numerator === 0) {
            other.numerator = 1;
            other.denominator = 1;
        }
        
        return Fraction.create(
            this.numerator * other.denominator,
            this.denominator * other.numerator
        );
    }
}

// ==================== 表达式计算引擎 ====================

/**
 * 数学表达式计算工具类
 * 
 * 功能特性：
 * - 支持四则运算（+、-、*、/）
 * - 支持括号嵌套
 * - 支持变量替换
 * - 支持函数调用（内置 + 自定义）
 * - 支持运算符扩展
 * - 精确数值计算（基于分数）
 * 
 * 使用示例：
 * @example
 * const util = ExpressUtil.getInstance();
 * 
 * // 基本运算
 * util.execPress('1 + 2 * 3');  // 7
 * 
 * // 函数调用
 * util.execPress('max(1, 2, 3)');  // 3
 * 
 * // 变量替换
 * util.execPress('x * 2 + y', { x: 5, y: 3 });  // 13
 * 
 * // 自定义函数
 * util.registerFunction('double', { handle: (args) => args[0] * 2 });
 * util.execPress('double(5)');  // 10
 */
export class ExpressUtil {
    // ========== 单例模式 ==========
    
    /** 单例实例 */
    private static instance: ExpressUtil;

    /**
     * 获取单例实例
     * 
     * @returns ExpressUtil 实例
     */
    public static getInstance(): ExpressUtil {
        if (!ExpressUtil.instance) {
            ExpressUtil.instance = new ExpressUtil();
        }
        return ExpressUtil.instance;
    }

    // ========== 正则表达式缓存 ==========
    
    /** 括号匹配正则 - 用于识别括号内的子表达式 */
    private static _parenRegex = /\(([^()]+)\)/;
    
    /** 乘除法匹配正则 - 格式：数字 运算符 数字 */
    private static _mulDivRegex = new RegExp(
        `(\\d*\\.?\\d+)\\s*([${Operator.MULTIPLY}${Operator.DIVIDE}])\\s*(-?\\d*\\.?\\d+)`,
        'g'
    );
    
    /** 加减法匹配正则 - 格式：数字 运算符 数字 */
    private static _addSubRegex = new RegExp(
        `(\\d*\\.?\\d+)\\s*([${Operator.ADD}${Operator.SUBTRACT}])\\s*(-?\\d*\\.?\\d+)`,
        'g'
    );
    
    /** 变量名匹配正则 - 识别有效的变量标识符 */
    private static _varRegex = /[a-zA-Z_][a-zA-Z0-9_]*/g;

    // ========== 默认处理器配置 ==========

    /**
     * 默认运算符处理器映射
     * 
     * 定义了基本四则运算的处理逻辑
     */
    private static _defaultOperators: Map<string, FractionOperatorHandler> = new Map([
        [Operator.ADD, { handle: (left, right) => left.add(right) }],
        [Operator.SUBTRACT, { handle: (left, right) => left.subtract(right) }],
        [Operator.MULTIPLY, { handle: (left, right) => left.multiply(right) }],
        [Operator.DIVIDE, { handle: (left, right) => left.divide(right) }]
    ]);

    /**
     * 默认函数处理器映射
     * 
     * 定义了内置数学函数的处理逻辑
     */
    private static _defaultFunctions: Map<string, FunctionHandler> = new Map([
        // 数值限定函数
        [BuiltinFunction.CLAMP, {
            handle: (args) => {
                if (args.length === 0) return 0;
                if (args.length !== 3) return args[0];
                const [value, min, max] = args;
                return Math.min(Math.max(value, min), max);
            }
        }],
        
        // 最大值函数
        [BuiltinFunction.MAX, {
            handle: (args) => Math.max(...args)
        }],
        
        // 最小值函数
        [BuiltinFunction.MIN, {
            handle: (args) => Math.min(...args)
        }],
        
        // 随机数函数
        [BuiltinFunction.RANDOM, {
            handle: (args) => {
                if (args.length === 0) return Math.random();
                if (args.length === 1) return Math.random() * args[0];
                const min = Math.min(...args);
                const max = Math.max(...args);
                return min + Math.random() * (max - min);
            }
        }],
        
        // 向下取整函数
        [BuiltinFunction.FLOOR, {
            handle: (args) => args.length > 0 ? Math.floor(args[0]) : 0
        }],
        
        // 向上取整函数
        [BuiltinFunction.CEIL, {
            handle: (args) => args.length > 0 ? Math.ceil(args[0]) : 0
        }],
        
        // 四舍五入函数
        [BuiltinFunction.ROUND, {
            handle: (args) => args.length > 0 ? Math.round(args[0]) : 0
        }]
    ]);

    // ========== 实例属性 ==========

    /** 自定义运算符处理器 */
    private _operators: Map<string, FractionOperatorHandler>;
    
    /** 自定义函数处理器 */
    private _functions: Map<string, FunctionHandler>;
    
    /** 所有可用的函数名列表（小写，用于变量名冲突检测） */
    private _functionNames: string[];

    // ========== 构造函数 ==========

    constructor() {
        this._operators = new Map();
        this._functions = new Map();
        
        // 初始化函数名列表
        this._functionNames = Object.values(BuiltinFunction);
    }

    // ========== 公共 API - 注册扩展 ==========

    /**
     * 注册自定义运算符
     * 
     * @param op - 运算符符号
     * @param handler - 运算符处理器
     * 
     * @example
     * util.registerOperator('^', {
     *   handle: (left, right) => {
     *     const result = Math.pow(left.toNumber(), right.toNumber());
     *     return Fraction.fromNumber(result);
     *   }
     * });
     * util.execPress('2 ^ 3');  // 8
     */
    public registerOperator(op: string, handler: FractionOperatorHandler): void {
        this._operators.set(op, handler);
    }

    /**
     * 注册自定义函数
     * 
     * @param name - 函数名（大小写不敏感）
     * @param handler - 函数处理器
     * 
     * @example
     * util.registerFunction('avg', {
     *   handle: (args) => args.reduce((a, b) => a + b, 0) / args.length
     * });
     * util.execPress('avg(1, 2, 3)');  // 2
     */
    public registerFunction(name: string, handler: FunctionHandler): void {
        this._functions.set(name, handler);
        
        // 添加到函数名列表（避免与变量名冲突）
        const lowerName = name.toLowerCase();
        if (!this._functionNames.includes(lowerName)) {
            this._functionNames.push(lowerName);
        }
    }

    // ========== 公共 API - 获取处理器 ==========

    /**
     * 获取运算符处理器
     * 
     * 优先返回自定义处理器，其次返回默认处理器
     * 
     * @param op - 运算符
     * @returns 运算符处理器
     * @throws {Error} 未知运算符
     */
    public getOperatorHandler(op: string): FractionOperatorHandler {
        // 优先使用自定义处理器
        if (this._operators.has(op)) {
            return this._operators.get(op)!;
        }
        
        // 使用默认处理器
        if (ExpressUtil._defaultOperators.has(op)) {
            return ExpressUtil._defaultOperators.get(op)!;
        }
        
        throw new Error(`Unknown operator: ${op}`);
    }

    /**
     * 获取函数处理器
     * 
     * 优先返回自定义处理器，其次返回默认处理器
     * 
     * @param name - 函数名（小写）
     * @returns 函数处理器
     * @throws {Error} 未知函数
     */
    public getFunctionHandler(name: string): FunctionHandler {
        // 优先使用自定义处理器
        if (this._functions.has(name)) {
            return this._functions.get(name)!;
        }
        
        // 使用默认处理器
        if (ExpressUtil._defaultFunctions.has(name)) {
            return ExpressUtil._defaultFunctions.get(name)!;
        }
        
        throw new Error(`Unknown function: ${name}`);
    }

    // ========== 公共 API - 表达式计算 ==========

    /**
     * 执行表达式计算
     * 
     * 完整的计算流程：
     * 1. 参数校验
     * 2. 函数调用解析与计算
     * 3. 变量替换
     * 4. 括号匹配检查
     * 5. 表达式求值
     * 
     * @param express - 数学表达式字符串
     * @param obj - 变量上下文对象（可选）
     * @returns 计算结果
     * 
     * @example
     * execPress('1 + 2 * 3');                    // 7
     * execPress('(1 + 2) * 3');                  // 9
     * execPress('max(1, 2, 3)');                 // 3
     * execPress('x * 2', { x: 5 });              // 10
     * execPress('max(a, b) + c', { a:1, b:2, c:3 });  // 5
     */
    public execPress(express: string, obj?: any): number {
        // ===== 1. 参数校验 =====
        if (!express) return 0;
        if (typeof express !== 'string') return 0;

        let formula = express;

        // ===== 2. 函数调用解析 =====
        // 递归处理所有嵌套函数，直到表达式中不再包含函数调用
        let lastFormula = '';
        while (lastFormula !== formula) {
            lastFormula = formula;
            formula = this.processFunctions(formula, obj);
        }

        // ===== 3. 变量替换 =====
        if (obj) {
            formula = this.replaceVariables(formula, obj);
        }

        // ===== 4. 括号匹配检查 =====
        if (!this.validateParentheses(formula)) {
            return 0;
        }

        // ===== 5. 表达式求值 =====
        return this.evaluateExpression(formula);
    }

    // ========== 私有方法 - 表达式处理流程 ==========

    /**
     * 替换表达式中的变量
     * 
     * 将表达式中的变量名替换为对应的数值
     * 注意：不会替换函数名
     * 
     * @param formula - 表达式字符串
     * @param variables - 变量上下文对象
     * @returns 替换后的表达式
     * @private
     */
    private replaceVariables(formula: string, variables: any): string {
        ExpressUtil._varRegex.lastIndex = 0;
        
        return formula.replace(ExpressUtil._varRegex, (match) => {
            // 检查是否是函数名（避免误替换）
            const lowerMatch = match.toLowerCase();
            const isFunctionName = this._functionNames.includes(lowerMatch);
            
            // 仅替换非函数名的变量
            if (variables.hasOwnProperty(match) && !isFunctionName) {
                const value = variables[match];
                if (typeof value === 'number') {
                    return value.toString();
                }
            }
            
            return match;
        });
    }

    /**
     * 验证括号是否匹配
     * 
     * @param formula - 表达式字符串
     * @returns 括号是否匹配
     * @private
     */
    private validateParentheses(formula: string): boolean {
        let depth = 0;
        
        for (const char of formula) {
            if (char === '(') {
                depth++;
            } else if (char === ')') {
                depth--;
            }
            
            // 右括号多于左括号
            if (depth < 0) {
                return false;
            }
        }
        
        // 左右括号数量不匹配
        return depth === 0;
    }

    /**
     * 计算表达式的值
     * 
     * 处理流程：
     * 1. 递归处理括号内的子表达式
     * 2. 处理乘除法（优先级高）
     * 3. 处理加减法（优先级低）
     * 
     * @param expression - 表达式字符串
     * @returns 计算结果
     * @private
     */
    private evaluateExpression(expression: string): number {
        let formula = expression.trim();

        // ===== 1. 递归处理括号 =====
        while (ExpressUtil._parenRegex.test(formula)) {
            formula = formula.replace(ExpressUtil._parenRegex, (_, subExpr) => {
                const result = this.evaluateExpression(subExpr);
                return result.toString();
            });
        }

        // ===== 2. 处理乘除法 =====
        formula = this.processOperators(formula, ExpressUtil._mulDivRegex);

        // ===== 3. 处理加减法 =====
        formula = this.processOperators(formula, ExpressUtil._addSubRegex);

        return parseFloat(formula) || 0;
    }

    /**
     * 处理指定类型的运算符
     * 
     * 使用正则表达式匹配运算符，并进行分数运算
     * 
     * @param formula - 表达式字符串
     * @param regex - 运算符匹配正则
     * @returns 处理后的表达式
     * @private
     */
    private processOperators(formula: string, regex: RegExp): string {
        regex.lastIndex = 0;
        
        while (regex.test(formula)) {
            regex.lastIndex = 0;
            
            formula = formula.replace(regex, (_, n1, op, n2) => {
                // 转换为分数
                const num1 = Fraction.fromNumber(parseFloat(n1));
                const num2 = Fraction.fromNumber(parseFloat(n2));
                
                // 执行运算
                const handler = this.getOperatorHandler(op);
                const fraction = handler.handle(num1, num2);
                const result = fraction.toNumber();
                
                // 回收对象
                num1.recycle();
                num2.recycle();
                fraction.recycle();
                
                return result.toString();
            });
        }
        
        return formula;
    }

    /**
     * 处理函数调用
     * 
     * 查找并计算表达式中的函数调用
     * 支持函数嵌套和多参数
     * 
     * @param text - 表达式字符串
     * @param variables - 变量上下文
     * @param funcNames - 要处理的函数名列表（可选）
     * @returns 处理后的表达式
     * @private
     */
    private processFunctions(text: string, variables: any, funcNames?: string[]): string {
        const targetFuncNames = funcNames || this._functionNames;
        let result = text;
        
        // 预编译函数名正则表达式
        const funcRegexMap = this.buildFunctionRegexMap(targetFuncNames);
        
        let found = true;
        while (found) {
            found = false;
            
            // 查找最早出现的函数调用
            const funcMatch = this.findEarliestFunction(result, targetFuncNames, funcRegexMap);
            
            if (!funcMatch) {
                break;
            }
            
            // 解析函数调用
            const { startIndex, endIndex, args, funcName } = funcMatch;
            
            // 递归计算参数
            const calculatedArgs = args.map(arg => this.execPress(arg, variables));
            
            // 执行函数
            const handler = this.getFunctionHandler(funcName.toLowerCase());
            const value = handler.handle(calculatedArgs);
            
            // 替换函数调用为结果
            result = result.substring(0, startIndex) + value + result.substring(endIndex);
            found = true;
        }
        
        return result;
    }

    /**
     * 构建函数名正则表达式映射
     * 
     * @param funcNames - 函数名列表
     * @returns 函数名到正则表达式的映射
     * @private
     */
    private buildFunctionRegexMap(funcNames: string[]): Map<string, RegExp> {
        const map = new Map<string, RegExp>();
        
        for (const funcName of funcNames) {
            // 大小写不敏感匹配
            map.set(funcName, new RegExp(`${funcName}\\(`, 'i'));
        }
        
        return map;
    }

    /**
     * 查找最早出现的函数调用
     * 
     * @param text - 表达式字符串
     * @param funcNames - 函数名列表
     * @param regexMap - 函数名正则映射
     * @returns 函数匹配信息，如果没有找到则返回 null
     * @private
     */
    private findEarliestFunction(
        text: string,
        funcNames: string[],
        regexMap: Map<string, RegExp>
    ): { startIndex: number; endIndex: number; args: string[]; funcName: string } | null {
        let earliestMatch = null;
        let earliestIndex = Infinity;
        let matchedFuncName = '';
        
        // 遍历所有函数名，找到最早出现的
        for (const funcName of funcNames) {
            const regex = regexMap.get(funcName)!;
            regex.lastIndex = 0;
            const match = regex.exec(text);
            
            if (match && match.index < earliestIndex) {
                earliestIndex = match.index;
                earliestMatch = match;
                matchedFuncName = funcName;
            }
        }
        
        if (!earliestMatch) {
            return null;
        }
        
        // 解析函数调用的参数
        const parseResult = this.parseFunctionCall(text, earliestMatch);
        
        if (!parseResult) {
            return null;
        }
        
        return {
            ...parseResult,
            funcName: earliestMatch[0].substring(0, earliestMatch[0].length - 1)
        };
    }

    /**
     * 解析函数调用的参数
     * 
     * 查找匹配的右括号，并分割参数
     * 
     * @param text - 表达式字符串
     * @param match - 正则匹配结果
     * @returns 解析结果（包含开始索引、结束索引、参数列表），失败返回 null
     * @private
     */
    private parseFunctionCall(
        text: string,
        match: RegExpExecArray
    ): { startIndex: number; endIndex: number; args: string[] } | null {
        const startIndex = match.index;
        const leftParenIndex = startIndex + match[0].length - 1;
        
        // 验证左括号
        if (text[leftParenIndex] !== '(') {
            return null;
        }
        
        // 查找匹配的右括号
        const rightParenIndex = this.findMatchingParen(text, leftParenIndex);
        
        if (rightParenIndex === -1) {
            return null;
        }
        
        // 提取参数字符串
        const argsStr = text.substring(leftParenIndex + 1, rightParenIndex);
        
        // 分割参数（支持嵌套）
        const args = this.splitArguments(argsStr);
        
        return {
            startIndex,
            endIndex: rightParenIndex + 1,
            args
        };
    }

    /**
     * 查找匹配的右括号
     * 
     * @param text - 文本字符串
     * @param leftIndex - 左括号索引
     * @returns 匹配的右括号索引，未找到返回 -1
     * @private
     */
    private findMatchingParen(text: string, leftIndex: number): number {
        let depth = 1;
        let index = leftIndex + 1;
        
        while (index < text.length && depth > 0) {
            if (text[index] === '(') {
                depth++;
            } else if (text[index] === ')') {
                depth--;
            }
            index++;
        }
        
        return depth === 0 ? index - 1 : -1;
    }

    /**
     * 分割函数参数
     * 
     * 按逗号分割，但会忽略括号内的逗号
     * 
     * @param argsStr - 参数字符串
     * @returns 参数数组
     * @private
     * 
     * @example
     * splitArguments('1, 2, max(3, 4)')  // ['1', '2', 'max(3, 4)']
     */
    private splitArguments(argsStr: string): string[] {
        const args: string[] = [];
        let depth = 0;
        let lastIndex = 0;
        
        for (let i = 0; i < argsStr.length; i++) {
            const char = argsStr[i];
            
            if (char === '(') {
                depth++;
            } else if (char === ')') {
                depth--;
            } else if (char === ',' && depth === 0) {
                // 顶层逗号，分割参数
                args.push(argsStr.substring(lastIndex, i).trim());
                lastIndex = i + 1;
            }
        }
        
        // 添加最后一个参数
        if (lastIndex < argsStr.length) {
            args.push(argsStr.substring(lastIndex).trim());
        }
        
        return args;
    }
}