import { BVec3, bv3 } from "./b-vec3";
import { FNumber } from "./f-number";
import { LikeVec3 } from "./like-vec3";

/**数学计算相关 */
export class BMath {
    // 常量定义 - 避免重复计算
    private static readonly TWO_PI: number = 2 * FNumber.PI;
    private static readonly HALF_PI: number = FNumber.PI / 2;
    private static readonly DEG_TO_RAD: number = FNumber.PI / 180;
    private static readonly RAD_TO_DEG: number = 180 / FNumber.PI;

    // 临时FNumber对象 - 减少GC
    private static readonly _fnum1: FNumber = FNumber.creat();
    private static readonly _fnum2: FNumber = FNumber.creat();
    private static readonly _fnum3: FNumber = FNumber.creat();

    // 角度正弦值和余弦值缓存 - 动态生成
    private static readonly _sinCache: Record<number, number> = {};
    private static readonly _cosCache: Record<number, number> = {};
    private static readonly _tanCache: Record<number, number> = {};

    // 角度精度(度)，值越大精度越低但性能越高
    private static readonly ANGLE_STEP: number = 3;
    private static readonly ANGLE_STEP_TAN: number = 1;

    // 预计算的tan值数组，用于二分查找
    private static readonly _tanTable: number[] = [];
    private static readonly _angleTable: number[] = [];

    // 初始化三角函数表
    public static initTrigTables(): void {
        // 预计算0-360度，每ANGLE_STEP度一个值
        for (let angle = 0; angle < 90; angle += this.ANGLE_STEP_TAN) {
            const rad = angle * this.DEG_TO_RAD;
            // this._sinCache[angle] = Math.sin(rad);
            // this._cosCache[angle] = Math.cos(rad);

            // 对于tan值，我们需要特殊处理90度和270度附近的值
            if (Math.abs(angle % 180 - 90) >= this.ANGLE_STEP_TAN) {
                const tanValue = Math.tan(rad);
                this._tanCache[angle] = tanValue;

                // 添加到有序表中，用于二分查找
                this._tanTable.push(tanValue);
                this._angleTable.push(angle);
            }
        }

        // 确保tan表是有序的
        const pairs = this._tanTable.map((value, index) => ({ value, angle: this._angleTable[index] }));
        pairs.sort((a, b) => a.value - b.value);

        // 重建有序表
        this._tanTable.length = 0;
        this._angleTable.length = 0;
        for (const pair of pairs) {
            this._tanTable.push(pair.value);
            this._angleTable.push(pair.angle);
        }
    }

    /**
     * 二分查找最接近的值
     * @param arr 有序数组
     * @param target 目标值
     * @returns 最接近目标值的索引
     */
    private static binarySearchNearest(arr: number[], target: number): number {
        if (arr.length === 0) return -1;
        if (target <= arr[0]) return 0;
        if (target >= arr[arr.length - 1]) return arr.length - 1;

        let low = 0;
        let high = arr.length - 1;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);

            if (arr[mid] === target) return mid;

            if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        // 找到最接近的值
        return (Math.abs(arr[low] - target) < Math.abs(arr[high] - target)) ? low : high;
    }

    /**
     * 使用查表法计算反正切值
     * @param y Y坐标
     * @param x X坐标
     * @returns 角度[0-360)
     */
    public static fastAtan2(y: number, x: number): number {
        // 特殊情况处理
        if (Math.abs(x) < 1e-6) {
            return y >= 0 ? 90 : 270;
        }
        if (Math.abs(y) < 1e-6) {
            return x >= 0 ? 0 : 180;
        }

        // 计算象限
        let quadrant = 0;
        if (x < 0) {
            quadrant = y < 0 ? 3 : 2;
        } else {
            quadrant = y < 0 ? 4 : 1;
        }

        // 计算tan值
        const tanValue = y / x;

        if (!this._tanTable || this._tanTable.length === 0) {
            this.initTrigTables();
        }

        // 使用二分查找找到最接近的角度
        const index = this.binarySearchNearest(this._tanTable, Math.abs(tanValue));
        let angle = this._angleTable[index];

        // 根据象限调整角度
        switch (quadrant) {
            case 1: break; // 第一象限，角度不变
            case 2: angle = 180 - angle; break; // 第二象限
            case 3: angle = 180 + angle; break; // 第三象限
            case 4: angle = 360 - angle; break; // 第四象限
        }

        return angle;
    }

    /**
     * 获取角度的正弦值 - 使用缓存优化，无插值
     * @param angle 角度[0-360)
     * @returns 正弦值
     */
    public static sin(angle: number): number {
        // 将角度转换到[0,360)范围
        angle = this.convertAngle(angle);

        // 找到最接近的缓存角度
        const cachedAngle = Math.round(angle / this.ANGLE_STEP) * this.ANGLE_STEP % 360;

        // 如果缓存中没有，则计算并缓存
        if (this._sinCache[cachedAngle] === undefined) {
            this._sinCache[cachedAngle] = Math.sin(cachedAngle * this.DEG_TO_RAD);
        }

        return this._sinCache[cachedAngle];
    }

    /**
     * 获取角度的余弦值 - 使用缓存优化，无插值
     * @param angle 角度[0-360)
     * @returns 余弦值
     */
    public static cos(angle: number): number {
        // 将角度转换到[0,360)范围
        angle = this.convertAngle(angle);

        // 找到最接近的缓存角度
        const cachedAngle = Math.round(angle / this.ANGLE_STEP) * this.ANGLE_STEP % 360;

        // 如果缓存中没有，则计算并缓存
        if (this._cosCache[cachedAngle] === undefined) {
            this._cosCache[cachedAngle] = Math.cos(cachedAngle * this.DEG_TO_RAD);
        }

        return this._cosCache[cachedAngle];
    }

    /**
     * 获取角度的正切值 - 使用查表优化
     * @param angle 角度[0-360)
     * @returns 正切值
     */
    public static tan(angle: number): number {
        // 避免除以零的情况
        const cosValue = this.cos(angle);
        if (Math.abs(cosValue) < 1e-6) {
            return this.sin(angle) > 0 ? 1e6 : -1e6;
        }
        return this.sin(angle) / cosValue;
    }

    /**两点距离 - 优化版本 */
    static distance(pos1x: number, pos1y: number, pos2x: number, pos2y: number): number;
    static distance(pos1: LikeVec3, pos2: LikeVec3): number;
    static distance(pos1xOrPos1: number | LikeVec3, pos1yOrPos2: number | LikeVec3, pos2x?: number, pos2y?: number): number {
        let x1: number, y1: number, x2: number, y2: number;
        
        // 重载1: distance(pos1x, pos1y, pos2x, pos2y)
        if (typeof pos1xOrPos1 === 'number' && typeof pos1yOrPos2 === 'number' && typeof pos2x === 'number' && typeof pos2y === 'number') {
            // 参数有效性检查
            if (!isFinite(pos1xOrPos1) || !isFinite(pos1yOrPos2) || !isFinite(pos2x) || !isFinite(pos2y)) {
                return 0;
            }
            
            x1 = pos1xOrPos1;
            y1 = pos1yOrPos2;
            x2 = pos2x;
            y2 = pos2y;
        } else {
            // 重载2: distance(pos1, pos2)
            const pos1 = pos1xOrPos1 as LikeVec3;
            const pos2 = pos1yOrPos2 as LikeVec3;
            
            // 参数有效性检查
            if (!pos1 || !pos2) {
                console.warn('BMath.distance: Null or undefined position parameters');
                return 0;
            }
            
            if (typeof pos1.x !== 'number' || typeof pos1.y !== 'number' || 
                typeof pos2.x !== 'number' || typeof pos2.y !== 'number') {
                console.warn('BMath.distance: Position objects missing x or y properties');
                return 0;
            }
            
            if (!isFinite(pos1.x) || !isFinite(pos1.y) || !isFinite(pos2.x) || !isFinite(pos2.y)) {
                console.warn('BMath.distance: Invalid number values in position objects');
                return 0;
            }
            
            x1 = pos1.x;
            y1 = pos1.y;
            x2 = pos2.x;
            y2 = pos2.y;
        }
        
        // 统一的距离计算逻辑
        const dx = this._fnum1.reset(x1).sub(x2).value;
        const dy = this._fnum2.reset(y1).sub(y2).value;
        
        return this._fnum3.reset(dx).mul(dx).add(
            this._fnum2.reset(dy).mul(dy).value).sqrt().value;
    }

    /**
     * 角度转弧度 - 使用常量乘法
     * @param angle 角度
     * @returns 弧度
     */
    public static angle2radian(angle: number): number {
        return angle * this.DEG_TO_RAD;
    }

    /**
     * 弧度转角度 - 使用常量乘法
     * @param radian 弧度
     * @returns 角度
     */
    public static radian2angle(radian: number): number {
        return radian * this.RAD_TO_DEG;
    }

    /**
     * 两点计算弧度 - 优化版本
     * @param pos1 起点
     * @param pos2 终点
     * @returns 弧度
     */
    public static getRadianBetweenPos(pos1: LikeVec3, pos2: LikeVec3): number {
        return this.getAngleBetweenPos(pos1, pos2) * this.DEG_TO_RAD;
    }

    /**
     * 两点计算角度 - 优化版本
     * @param pos1 起点
     * @param pos2 终点
     * @returns 角度[0-360)
     */
    public static getAngleBetweenPos(pos1: LikeVec3, pos2: LikeVec3): number {
        if (!pos2 || !pos1) return 0;

        // 直接使用临时FNumber对象
        const y = this._fnum1.reset(pos2.y).sub(pos1.y).value;
        const x = this._fnum2.reset(pos2.x).sub(pos1.x).value;

        // 使用查表法计算角度
        return this.fastAtan2(y, x);
    }

    /**
     * 将数字转为[0,range)范围内的值 - 优化版本
     * @param value 输入值
     * @param range 范围上限
     * @returns 转换后的值
     */
    public static convertToRange(value: number, range: number): number {
        // 使用更高效的取模算法
        return ((value % range) + range) % range;
    }

    /**
     * 将角度转换为[0,360)范围内的值 - 优化版本
     * @param angle 输入角度
     * @returns 转换后的角度
     */
    public static convertAngle(angle: number): number {
        return this.convertToRange(angle, 360);
    }

    /** 
     * 判断点是否在扇形中 - 优化版本
     * @param pos 待判断点
     * @param center 扇形中心
     * @param radius 扇形半径
     * @param startAngle 起始角度
     * @param endAngle 结束角度
     * @returns 是否在扇形内
     */
    static isPointInSector(pos: LikeVec3, center: LikeVec3, radius: number, startAngle: number, endAngle: number): boolean {
        // 快速路径：先检查距离
        const distSqr = this.distanceSqr(pos, center);
        if (distSqr > radius * radius) {
            return false;
        }

        // 计算点相对于中心的角度
        const angle = this.getAngleBetweenPos(center, pos);

        // 优化角度判断
        if (endAngle < startAngle) {
            // 跨越0度的情况
            return (angle >= startAngle || angle <= endAngle);
        } else {
            // 不跨越0度的情况
            return (angle >= startAngle && angle <= endAngle);
        }
    }

    /** 
     * 获取矩形的四个顶点 - 优化版本
     * @param centerPos 中心点
     * @param width 宽度
     * @param range 高度
     * @returns 四个顶点坐标数组
     */
    static getRectPointsByCenter(centerPos: LikeVec3, width: number, range: number): BVec3[] {
        // 计算半宽和半高
        const halfWidth = range * 0.5;
        const halfHeight = width * 0.5;

        // 使用临时FNumber对象
        const left = this._fnum1.reset(centerPos.x).sub(halfWidth).value;
        const right = this._fnum2.reset(centerPos.x).add(halfWidth).value;
        const bottom = this._fnum3.reset(centerPos.y).sub(halfHeight).value;
        const top = this._fnum1.reset(centerPos.y).add(halfHeight).value;

        // 创建四个顶点
        return [
            bv3(left, bottom),
            bv3(right, bottom),
            bv3(right, top),
            bv3(left, top)
        ];
    }

    /** 
     * 获取矩形的四个顶点 - 优化版本
     * @param oriPos 非中心点
     * @param range 长度
     * @param width 宽度
     * @param angle 角度
     * @returns 四个顶点坐标数组
     */
    static getRectPoints(oriPos: LikeVec3, range: number, width: number, angle: number): BVec3[] {
        // 转换角度到[0,360)范围
        angle = this.convertAngle(angle);

        // 使用查表获取正弦和余弦值
        const cosAngle = this.cos(angle);
        const sinAngle = this.sin(angle);

        // 计算长度方向的单位向量
        const vec1 = bv3(cosAngle, sinAngle).TimesSelf(range);

        // 计算宽度方向的单位向量（垂直于长度方向）
        const perpAngle = this.convertAngle(angle + 90);
        const vec2 = bv3(this.cos(perpAngle), this.sin(perpAngle)).TimesSelf(width * 0.5);

        // 计算四个顶点
        const oriVec = BVec3.Temp.setTo(oriPos);
        const pos1 = oriVec.Add(vec2);
        const pos2 = oriVec.Sub(vec2);
        const pos3 = pos2.Add(vec1);
        const pos4 = pos1.Add(vec1);

        return [pos1, pos2, pos3, pos4];
    }

    /** 
     * 判断点是否在多边形内 - 优化版本
     * 使用射线法判断点是否在多边形内
     * @param pos 待判断点
     * @param posRect 多边形顶点数组
     * @returns 是否在多边形内
     */
    static isPointInPolygon(pos: LikeVec3, posRect: LikeVec3[]): boolean {
        const nCount = posRect.length;
        if (nCount < 3) return false;

        let nCross = 0;

        // 使用临时FNumber对象
        const fnum1 = this._fnum1;
        const fnum2 = this._fnum2;
        const fnum3 = this._fnum3;

        for (let i = 0; i < nCount; i++) {
            const p1 = posRect[i];
            const p2 = posRect[(i + 1) % nCount];

            // 快速路径：如果边是水平的，跳过
            if (p1.y === p2.y) continue;

            // 快速路径：如果点在边的Y范围之外，跳过
            if (pos.y < Math.min(p1.y, p2.y) || pos.y > Math.max(p1.y, p2.y)) continue;

            // 计算交点的X坐标
            fnum1.reset(pos.y).sub(p1.y);
            fnum2.reset(p2.x).sub(p1.x);
            fnum3.reset(p2.y).sub(p1.y);

            const intersectX = fnum1.mul(fnum2.value).div(fnum3.value).add(p1.x).value;

            // 如果交点在点的右侧，则增加交点计数
            if (intersectX > pos.x) {
                nCross++;
            }
        }

        // 交点数为奇数，点在多边形内
        return (nCross % 2 === 1);
    }

    /**
     * 将一个值限制在一个指定范围内 - 优化版本
     * @param value 输入值
     * @param min 最小值
     * @param max 最大值
     * @returns 限制后的值
     */
    static clamp(value: number, min: number, max: number): number {
        return value < min ? min : (value > max ? max : value);
    }

    /**
     * 计算从点A到点B方向上距离为x的点的坐标 - 优化版本
     * @param A 起点A的坐标
     * @param B 目标点B的坐标
     * @param distance 距离x的值
     * @returns 返回距离点A为x的新点的坐标
     */
    static getPointAtDistance(A: LikeVec3, B: LikeVec3, distance: number): BVec3 {
        // 使用临时FNumber对象
        const dx = this._fnum1.reset(B.x).sub(A.x).value;
        const dy = this._fnum2.reset(B.y).sub(A.y).value;

        // 计算向量长度
        const length = this._fnum3.reset(dx).mul(dx).add(
            this._fnum1.reset(dy).mul(dy).value).sqrt().value;

        // 避免除以零
        if (length < 1e-6) {
            return bv3(A.x, A.y);
        }

        // 计算单位向量
        const normalizedDx = dx / length;
        const normalizedDy = dy / length;

        // 计算目标点坐标
        const resultX = A.x + normalizedDx * distance;
        const resultY = A.y + normalizedDy * distance;

        return bv3(resultX, resultY);
    }

    /**
     * 线性插值 - 优化版本
     * @param a 起始值
     * @param b 结束值
     * @param t 插值系数[0,1]
     * @returns 插值结果
     */
    static lerp(a: number, b: number, t: number): number {
        // 限制t在[0,1]范围内
        t = this.clamp(t, 0, 1);
        return a + (b - a) * t;
    }

    /**
     * 二维向量线性插值 - 优化版本
     * @param a 起始向量
     * @param b 结束向量
     * @param t 插值系数[0,1]
     * @returns 插值结果向量
     */
    static lerpVec(a: LikeVec3, b: LikeVec3, t: number): BVec3 {
        // 限制t在[0,1]范围内
        t = this.clamp(t, 0, 1);

        // 计算插值结果
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;
        const z = (a.z ?? 0) + ((b.z ?? 0) - (a.z ?? 0)) * t;

        return bv3(x, y, z);
    }

    /**
     * 计算两点之间的曼哈顿距离 - 优化版本
     * @param a 点A
     * @param b 点B
     * @returns 曼哈顿距离
     */
    static manhattanDistance(a: LikeVec3, b: LikeVec3): number {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs((a.z ?? 0) - (b.z ?? 0));
    }

    /**
     * 计算两点之间的平方距离 - 优化版本
     * 避免开方操作，用于距离比较
     * @param a 点A
     * @param b 点B
     * @returns 平方距离
     */
    static distanceSqr(a: LikeVec3, b: LikeVec3): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = (a.z ?? 0) - (b.z ?? 0);
        return dx * dx + dy * dy + dz * dz;
    }

    /**
     * 判断点是否在圆内 - 优化版本
     * 使用平方距离避免开方
     * @param point 待判断点
     * @param center 圆心
     * @param radius 半径
     * @returns 是否在圆内
     */
    static isPointInCircle(point: LikeVec3, center: LikeVec3, radius: number): boolean {
        return this.distanceSqr(point, center) <= radius * radius;
    }

    /**
     * 判断点是否在矩形内 - 优化版本
     * @param point 待判断点
     * @param rect 矩形四个顶点
     * @returns 是否在矩形内
     */
    static isPointInRect(point: LikeVec3, rect: LikeVec3[]): boolean {
        if (rect.length !== 4) return false;
        return this.isPointInPolygon(point, rect);
    }

    /**
     * 根据角度获取单位向量 - 使用查表优化
     * @param angle 角度[0-360)
     * @returns 单位向量
     */
    static angleToVector(angle: number): BVec3 {
        return bv3(this.cos(angle), this.sin(angle));
    }

    /**
     * 向量转角度 - 优化版本
     * @param vector 向量
     * @returns 角度[0-360)
     */
    static vectorToAngle(vector: LikeVec3): number {
        return this.getAngleBetweenPos({ x: 0, y: 0 }, vector);
    }

    /**
     * 计算两个角度之间的最小差值 - 优化版本
     * @param a 角度a
     * @param b 角度b
     * @returns 最小角度差[-180,180)
     */
    static angleDifference(a: number, b: number): number {
        // 将角度转换到[0,360)范围
        a = this.convertAngle(a);
        b = this.convertAngle(b);

        // 计算差值
        let diff = b - a;

        // 调整到[-180,180)范围
        if (diff > 180) diff -= 360;
        if (diff <= -180) diff += 360;

        return diff;
    }

    /**
     * 角度平滑插值 - 优化版本
     * @param current 当前角度
     * @param target 目标角度
     * @param t 插值系数[0,1]
     * @returns 插值后的角度
     */
    static lerpAngle(current: number, target: number, t: number): number {
        // 计算最小角度差
        const diff = this.angleDifference(current, target);

        // 进行线性插值
        return this.convertAngle(current + diff * this.clamp(t, 0, 1));
    }
}