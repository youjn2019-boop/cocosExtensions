import { bv3, BVec3 } from "./b-vec3";
import { FNumber } from "./f-number";
import { LikeVec3 } from "./like-vec3";

// 定义常量，提高代码可读性
// const SQRT_3_DIV_2 = 0.866025404;
const SQRT_3 = 1.73205080756;

/**
 * 六边形工具类
 *      +z(r)
 *  -x      -y
 *  +y(s)   +x(q)
 *      -z
 */
export class HexUtil {
    public static OuterRadius: number = 60;
    public static InnerRadius: number = FNumber.value(HexUtil.OuterRadius).mul(SQRT_3).div(2).value;// 51.96

    /**把hex坐标转为像素坐标 */
    static hexToPixel(hexX: number, hexY: number, hexZ: number): BVec3 {
        let x = (hexX * HexUtil.InnerRadius * 2) + (hexZ * HexUtil.InnerRadius);// (hexX + hexZ * 0.5) * HexUtil.InnerRadius * 2;
        let y = hexZ * HexUtil.OuterRadius * 1.5;
        // let x = FNumber.value(hexZ).mul(0.5).add(hexX).value;
        // x = FNumber.value(x).mul(HexUtil.InnerRadius).mul(2).value;
        // let y = FNumber.value(hexZ).mul(HexUtil.OuterRadius).mul(1.5).value;
        return bv3(x, y);
    }

    /**把像素坐标转换成hex坐标 */
    static pixelToHex(x: number, y: number): LikeVec3 {
        return this.cartesianToCube(x, y);
        // // 先转成平行四边形坐标系
        // let rValue: number = FNumber.value(pixel.y).mul(2).div(SQRT_3).value;
        // let r: number = Math.round(FNumber.value(rValue).div(HexUtil.InnerRadius).div(2).value);
        // let qValue: number = FNumber.value(pixel.y).div(SQRT_3).value;
        // qValue = FNumber.value(pixel.x).sub(qValue).value;
        // let q: number = Math.round(FNumber.value(qValue).div(HexUtil.InnerRadius).div(2).value);
        // return [q, r];
    }

    static cartesianToCube(x: number, y: number): LikeVec3 {
        const q = (SQRT_3 / 3 * x - 1 / 3 * y) / HexUtil.OuterRadius;
        const r = (2 / 3 * y) / HexUtil.OuterRadius;

        // 初步计算的浮点坐标
        let fx = q;
        let fz = r;
        let fy = -fx - fz;

        // 四舍五入到最接近的整数坐标
        let rx = Math.round(fx);
        let ry = Math.round(fy);
        let rz = Math.round(fz);

        const xDiff = Math.abs(rx - fx);
        const yDiff = Math.abs(ry - fy);
        const zDiff = Math.abs(rz - fz);

        if (xDiff > yDiff && xDiff > zDiff) {
            rx = -ry - rz;
        } else if (yDiff > zDiff) {
            ry = -rx - rz;
        } else {
            rz = -rx - ry;
        }

        if (rx == -0) {
            rx = 0;
        }
        if (ry == -0) {
            ry = 0;
        }
        if (rz == -0) {
            rz = 0;
        }

        return { x: rx, y: ry, z: rz };
    }

    /**找到距离目标点固定距离的所有格子
     * @param q 目标点的q坐标
     * @param r 目标点的r坐标
     * @param distance 距离
     * @param inner 是否包含距离之内
     */
    static findHexesAroundPoint(q: number, r: number, distance: number, inner?: boolean): LikeVec3[] {
        let results: LikeVec3[] = [];
        let startq: number;
        let endq: number;
        for (let dz = -distance; dz <= distance; dz++) {
            startq = Math.max(-distance, -dz - distance);
            endq = Math.min(distance, -dz + distance);

            if (inner || Math.abs(dz) == distance) {
                for (let dx = startq; dx <= endq; dx++) {
                    results.push({ x: q + dx, z: r + dz, y: -q - dx - r - dz });
                }
            } else {
                results.push({ x: q + startq, z: r + dz, y: -q - startq - r - dz });
                results.push({ x: q + endq, z: r + dz, y: -q - endq - r - dz });
            }
        }
        return results;
    }

    /**找到距离目标点固定距离的所有格子
     * @param q 目标点的q坐标
     * @param r 目标点的r坐标
     * @param distance 距离
     * @param inner 是否包含距离之内
     */
    static findHexesAroundPointBys(q: number, r: number, distance: number, inner?: boolean): LikeVec3[] {
        if (distance == 0) {
            return [{ x: q, y: r, z: -q - r }];
        }
        let results: LikeVec3[] = [];
        let startq: number;
        let endq: number;
        let s: number = -q - r;

        let stepFunc: (num: number) => number;
        let checkFunc: (num: number) => boolean;
        if (distance > 0) {
            stepFunc = (num: number) => {
                return num + 1;
            }
            checkFunc = (num: number) => {
                return num <= distance;
            }
        } else {
            stepFunc = (num: number) => {
                return num - 1;
            }
            checkFunc = (num: number) => {
                return num >= distance;
            }
        }

        let disTmp: number = Math.abs(distance);
        for (let ds = -distance; checkFunc(ds); ds = stepFunc(ds)) {
            startq = Math.max(-disTmp, -ds - disTmp);
            endq = Math.min(disTmp, -ds + disTmp);

            if (inner || Math.abs(ds) == disTmp) {
                for (let dx = startq; dx <= endq; dx++) {
                    if (dx == 0 && ds == 0) {
                        continue;
                    }
                    results.push({ x: q + dx, y: s + ds, z: r - dx - ds });
                }
            } else {
                results.push({ x: q + startq, y: s + ds, z: r - startq - ds });
                results.push({ x: q + endq, y: s + ds, z: r - endq - ds });
            }
        }
        return results;
    }

    // 计算两个六边形之间的距离
    static distance(hex1: LikeVec3, hex2: LikeVec3): number {
        return (Math.abs(hex1.x - hex2.x) + Math.abs(hex1.z - hex2.z) + Math.abs(hex1.y - hex2.y)) / 2;
    }

    // 计算两个六边形之间的距离
    static distanceTile(hex1: LikeVec3, hex2: LikeVec3): number {
        return Math.max(Math.max(Math.abs(hex1.x - hex2.x), Math.abs(hex1.z - hex2.z)), Math.abs(hex1.y - hex2.y));
    }
}


// // 假设 Sqrt_3 和 HexTileOuterRadius 已经定义
// const Sqrt_3 = Math.sqrt(3);
// const HexTileOuterRadius = 1;

// /**
//  * 将世界坐标（UnityPos) 转换到目标 HexGrid 下标
//  * （这个方法不是很精确）
//  * @param unityX 世界坐标
//  * @param unityZ 世界坐标
//  * @returns 所属的 HexTile 坐标
//  */
// function UnityPosToHexGrid(unityX: number, unityZ: number): HexGrid {
//     const q = (Sqrt_3 / 3.0 * unityX) - (1.0 / 3.0 * unityZ);
//     const r = 2.0 / 3.0 * unityZ;
//     return new HexGrid(HexRound(q / HexTileOuterRadius, r / HexTileOuterRadius));
// }

// /**
//  * 坐标规整；
//  */
// function HexRound(q: number, r: number): Vector2Int {
//     const s = -q - r;
//     const rq = Math.round(q);
//     const rr = Math.round(r);
//     const rs = Math.round(s);
//     const q_diff = Math.abs(rq - q);
//     const r_diff = Math.abs(rr - r);
//     const s_diff = Math.abs(rs - s);
//     if (q_diff > r_diff && q_diff > s_diff) {
//         rq = -rr - rs;
//     } else if (r_diff > s_diff) {
//         rr = -rq - rs;
//     }
//     return new Vector2Int(rq, rr);
// }
