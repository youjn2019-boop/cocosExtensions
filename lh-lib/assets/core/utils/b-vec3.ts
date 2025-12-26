import { FNumber } from "./f-number";
import { LikeVec3 } from "./like-vec3";

/**
 * 高性能3D向量类 - 使用FNumber进行精确计算
 * 用于游戏中需要精确计算的向量运算
 */
export class BVec3 {
    // 使用静态对象池减少对象创建
    private static _pool: BVec3[] = [];
    private static _poolSize = 100;

    // 静态常量向量 - 避免重复创建
    private static _zero: BVec3;
    private static _one: BVec3;
    private static _x: BVec3;
    private static _y: BVec3;
    private static _z: BVec3;

    // 向量数据
    values: number[];

    // FNumber实例 - 复用以减少GC
    private _fnum1: FNumber;
    private _fnum2: FNumber;
    private _fnum3: FNumber;

    // 临时向量 - 用于内部计算避免创建新对象
    private static _tempVec1: BVec3;
    private static _tempVec2: BVec3;
    private static _tempVec3: BVec3;

    constructor(x: number, y: number, z: number);
    constructor(values: number[]);
    constructor(a: number | number[], b?: number, c?: number) {
        if (a instanceof Array) {
            this.values = a;
        } else {
            this.values = [a, b!, c!];
        }
        this._fnum1 = FNumber.creat();
        this._fnum2 = FNumber.creat();
        this._fnum3 = FNumber.creat();
    }

    /**
     * 获取对象池中的向量实例
     */
    static get(): BVec3 {
        if (this._pool.length > 0) {
            return this._pool.pop()!;
        }
        return new BVec3(0, 0, 0);
    }

    /**
     * 回收向量到对象池
     */
    static put(v: BVec3): void {
        if (this._pool.length < this._poolSize) {
            v.setTo(0, 0, 0);
            this._pool.push(v);
        }
    }

    /**
     * 预先创建对象池
     */
    static initPool(): void {
        while (this._pool.length < this._poolSize) {
            this._pool.push(new BVec3(0, 0, 0));
        }
    }

    /**
     * 获取临时向量1 - 仅用于内部计算
     */
    private static get _emp1(): BVec3 {
        if (!this._tempVec1) {
            this._tempVec1 = new BVec3(0, 0, 0);
        }
        return this._tempVec1;
    }

    /**
     * 获取临时向量2 - 仅用于内部计算
     */
    private static get temp2(): BVec3 {
        if (!this._tempVec2) {
            this._tempVec2 = new BVec3(0, 0, 0);
        }
        return this._tempVec2;
    }

    /**
     * 获取临时向量2 - 仅用于内部计算
     */
    static get Temp(): BVec3 {
        if (!this._tempVec3) {
            this._tempVec3 = new BVec3(0, 0, 0);
        }
        return this._tempVec3;
    }

    get x(): number { return this.values[0]; }
    get y(): number { return this.values[1]; }
    get z(): number { return this.values[2]; }

    set x(val: number) { this.values[0] = val; }
    set y(val: number) { this.values[1] = val; }
    set z(val: number) { this.values[2] = val; }

    /**
     * 设置向量值 - 优化版本
     */
    setTo(x: number, y: number): BVec3;
    setTo(x: number, y: number, z: number): BVec3;
    setTo(values: LikeVec3): BVec3;
    setTo(a: number | LikeVec3, b?: number, c?: number): BVec3 {
        if (typeof (a) == "object") {
            this.values[0] = a.x;
            this.values[1] = a.y;
            this.values[2] = a.z ?? 0; // 使用空值合并运算符
            return this;
        }
        this.values[0] = a;
        this.values[1] = b!;
        this.values[2] = c ?? 0;
        return this;
    }

    /**
     * 获取零向量
     */
    static get Zero(): BVec3 {
        if (!this._zero) {
            this._zero = new BVec3(0, 0, 0);
        }
        return this._zero;
    }

    /**
     * 获取单位向量
     */
    static get One(): BVec3 {
        if (!this._one) {
            this._one = new BVec3(1, 1, 1);
        }
        return this._one;
    }

    /**
     * 获取X轴单位向量
     */
    static get X(): BVec3 {
        if (!this._x) {
            this._x = new BVec3(1, 0, 0);
        }
        return this._x;
    }

    /**
     * 获取Y轴单位向量
     */
    static get Y(): BVec3 {
        if (!this._y) {
            this._y = new BVec3(0, 1, 0);
        }
        return this._y;
    }

    /**
     * 获取Z轴单位向量
     */
    static get Z(): BVec3 {
        if (!this._z) {
            this._z = new BVec3(0, 0, 1);
        }
        return this._z;
    }

    /**
     * 向量加法: this + that
     * 使用对象池优化
     */
    Add(that: LikeVec3): BVec3 {
        const result = BVec3.get();
        result.x = this._fnum1.reset(this.x).add(that.x).value;
        result.y = this._fnum2.reset(this.y).add(that.y).value;
        result.z = this._fnum3.reset(this.z).add(that.z ?? 0).value;
        return result;
    }

    /**
     * 向量加法: this += that (修改自身)
     * 避免创建新对象
     */
    AddSelf(that: LikeVec3): BVec3 {
        this.x = this._fnum1.reset(this.x).add(that.x).value;
        this.y = this._fnum2.reset(this.y).add(that.y).value;
        this.z = this._fnum3.reset(this.z).add(that.z ?? 0).value;
        return this;
    }

    /**
     * 向量减法: this - that
     * 使用对象池优化
     */
    Sub(that: LikeVec3): BVec3 {
        const result = BVec3.get();
        result.x = this._fnum1.reset(this.x).sub(that.x).value;
        result.y = this._fnum2.reset(this.y).sub(that.y).value;
        result.z = this._fnum3.reset(this.z).sub(that.z ?? 0).value;
        return result;
    }

    /**
     * 向量减法: this -= that (修改自身)
     * 避免创建新对象
     */
    SubSelf(that: LikeVec3): BVec3 {
        this.x = this._fnum1.reset(this.x).sub(that.x).value;
        this.y = this._fnum2.reset(this.y).sub(that.y).value;
        this.z = this._fnum3.reset(this.z).sub(that.z ?? 0).value;
        return this;
    }

    /**
     * 向量点积: this · that
     * 优化FNumber使用
     */
    Dot(that: LikeVec3): number {
        const x = this._fnum1.reset(this.x).mul(that.x).value;
        const y = this._fnum2.reset(this.y).mul(that.y).value;
        const z = this._fnum3.reset(this.z).mul(that.z ?? 0).value;
        return x + y + z;
    }

    /**
     * 向量叉积: this × that
     * 使用对象池优化
     */
    Cross(that: LikeVec3): BVec3 {
        const result = BVec3.get();

        // 优化计算顺序，减少FNumber重置次数
        const x = this._fnum1.reset(this.y).mul(that.z ?? 0).sub(
            this._fnum2.reset(this.z).mul(that.y).value).value;

        const y = this._fnum1.reset(this.z).mul(that.x).sub(
            this._fnum2.reset(this.x).mul(that.z ?? 0).value).value;

        const z = this._fnum1.reset(this.x).mul(that.y).sub(
            this._fnum2.reset(this.y).mul(that.x).value).value;

        result.setTo(x, y, z);
        return result;
    }

    /**
     * 标量乘法: k * this
     * 使用对象池优化
     */
    Times(k: number): BVec3 {
        const result = BVec3.get();
        result.x = this._fnum1.reset(this.x).mul(k).value;
        result.y = this._fnum1.reset(this.y).mul(k).value;
        result.z = this._fnum1.reset(this.z).mul(k).value;
        return result;
    }

    /**
     * 标量乘法: this *= k (修改自身)
     * 避免创建新对象
     */
    TimesSelf(k: number): BVec3 {
        this.x = this._fnum1.reset(this.x).mul(k).value;
        this.y = this._fnum1.reset(this.y).mul(k).value;
        this.z = this._fnum1.reset(this.z).mul(k).value;
        return this;
    }

    /**
     * 标量除法: this / k
     * 使用对象池优化
     */
    Div(k: number): BVec3 {
        if (Math.abs(k) < Number.EPSILON) {
            console.warn("BVec3.Div: Division by near-zero value");
            return BVec3.Zero.Clone();
        }

        const result = BVec3.get();
        result.x = this._fnum1.reset(this.x).div(k).value;
        result.y = this._fnum1.reset(this.y).div(k).value;
        result.z = this._fnum1.reset(this.z).div(k).value;
        return result;
    }

    /**
     * 标量除法: this /= k (修改自身)
     * 避免创建新对象
     */
    DivSelf(k: number): BVec3 {
        if (Math.abs(k) < Number.EPSILON) {
            console.warn("BVec3.DivSelf: Division by near-zero value");
            return this;
        }

        this.x = this._fnum1.reset(this.x).div(k).value;
        this.y = this._fnum1.reset(this.y).div(k).value;
        this.z = this._fnum1.reset(this.z).div(k).value;
        return this;
    }

    /**
     * 向量取反: -this
     * 使用对象池优化
     */
    Negate(): BVec3 {
        const result = BVec3.get();
        result.x = -this.x;
        result.y = -this.y;
        result.z = -this.z;
        return result;
    }

    /**
     * 向量取反: this = -this (修改自身)
     * 避免创建新对象
     */
    NegateSelf(): BVec3 {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    /**
     * 向量平方长度
     * 优化FNumber使用
     */
    MagSqr(): number {
        return this.Dot(this);
    }

    /**
     * 向量长度
     * 使用缓存的FNumber计算
     */
    Mag(): number {
        return Math.sqrt(this.MagSqr());
    }

    /**
     * 向量归一化
     * 使用对象池优化
     */
    Normalized(): BVec3 {
        const mag = this.Mag();
        if (mag < Number.EPSILON) {
            return BVec3.Zero.Clone();
        }
        return this.Div(mag);
    }

    /**
     * 向量归一化: this = this/|this| (修改自身)
     * 避免创建新对象
     */
    NormalizeSelf(): BVec3 {
        const mag = this.Mag();
        if (mag < Number.EPSILON) {
            return this;
        }
        return this.DivSelf(mag);
    }

    /**
     * 获取方位角 (XY平面)
     * 优化FNumber使用
     */
    Azimuth(): number {
        return this._fnum1.reset().atan2(this.y, this.x).value;
    }

    /**
     * 获取极角 (与Z轴夹角)
     * 优化FNumber使用和计算顺序
     */
    Polar(): number {
        const xyMag = this._fnum2.reset(this.x).mul(this.x)
            .add(this._fnum3.reset(this.y).mul(this.y).value)
            .sqrt().value;
        return this._fnum1.reset().atan2(xyMag, this.z).value;
    }

    /**
     * 克隆向量
     * 使用对象池优化
     */
    Clone(): BVec3 {
        const result = BVec3.get();
        result.setTo(this.x, this.y, this.z);
        return result;
    }

    /**
     * 转换为LikeVec3接口
     * 避免创建新对象
     */
    ToB3Like(): LikeVec3 {
        return { x: this.x, y: this.y, z: this.z };
    }

    /**
     * 限制向量长度
     * 使用对象池和优化计算
     */
    Cap(length: number): BVec3 {
        if (length <= Number.EPSILON) {
            return BVec3.Zero.Clone();
        }

        const magSqr = this.MagSqr();
        if (magSqr <= length * length) {
            return this.Clone();
        }

        const scale = length / Math.sqrt(magSqr);
        return this.Times(scale);
    }

    /**
     * 限制向量长度 (修改自身)
     * 避免创建新对象
     */
    CapSelf(length: number): BVec3 {
        if (length <= Number.EPSILON) {
            this.setTo(0, 0, 0);
            return this;
        }

        const magSqr = this.MagSqr();
        if (magSqr <= length * length) {
            return this;
        }

        const scale = length / Math.sqrt(magSqr);
        return this.TimesSelf(scale);
    }

    /**
     * 向量相等判断
     * 优化条件判断
     */
    Equal(x?: number | LikeVec3, y?: number, z?: number): boolean {
        let vx: number, vy: number, vz: number;

        if (typeof (x) == "object") {
            vx = x.x;
            vy = x.y;
            vz = x.z ?? 0;
        } else {
            vx = x ?? 0;
            vy = y ?? 0;
            vz = z ?? 0;
        }

        return this.x === vx && this.y === vy && this.z === vz;
    }

    /**
     * 近似相等判断 (考虑浮点误差)
     */
    ApproxEqual(other: LikeVec3, epsilon: number = 1e-6): boolean {
        return Math.abs(this.x - other.x) < epsilon &&
            Math.abs(this.y - other.y) < epsilon &&
            Math.abs(this.z - (other.z ?? 0)) < epsilon;
    }

    /**
     * 计算两点距离
     */
    static Distance(a: LikeVec3, b: LikeVec3): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = (a.z ?? 0) - (b.z ?? 0);
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * 线性插值
     * 使用对象池优化
     */
    static Lerp(a: LikeVec3, b: LikeVec3, t: number): BVec3 {
        const result = BVec3.get();

        // 直接计算，避免创建中间向量
        result.x = a.x + (b.x - a.x) * t;
        result.y = a.y + (b.y - a.y) * t;
        result.z = (a.z ?? 0) + ((b.z ?? 0) - (a.z ?? 0)) * t;

        return result;
    }

    /**
     * 释放FNumber资源
     */
    dispose(): void {
        // FNumber.put(this._fnum1);
        // FNumber.put(this._fnum2);
        // FNumber.put(this._fnum3);
    }
}


/**
 * 创建BVec3的便捷函数
 * 使用对象池优化
 */
export function bv3(other: LikeVec3): BVec3;
export function bv3(x?: number, y?: number, z?: number): BVec3;
export function bv3(x?: number | LikeVec3, y?: number, z?: number): BVec3 {
    if (x instanceof BVec3) {
        if (!x) {
            return null;
        }
        return x.Clone();
    }

    const result = BVec3.get();

    if (typeof (x) == "object") {
        result.setTo(x.x, x.y, x.z ?? 0);
    } else {
        result.setTo(x ?? 0, y ?? 0, z ?? 0);
    }

    return result;
}
// export const Project = (v: BVec3, n: BVec3): BVec3 => n.Times(v.Dot(n));
