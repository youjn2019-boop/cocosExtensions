import { bv3, BVec3 } from "./b-vec3";
import { LikeVec3 } from "./like-vec3";

export class PerspectiveMatrix2D {
    private static _matrixPx: number = 0;
    private static _matrixPy: number = 0.0005;
    private static _matrix: number[][] = [
        [1, 0, 0],
        [0, 1, 0],
        [PerspectiveMatrix2D._matrixPx, PerspectiveMatrix2D._matrixPy, 1]
    ];

    /**
     * 应用透视矩阵到一个2D点
     * @param x 点的x坐标
     * @param y 点的y坐标
     * @returns 应用透视变换后的点的坐标
     */
    static apply(x: number | LikeVec3, y?: number): BVec3 {
        if (typeof (x) == "object") {
            y = x.y;
            x = x.x;
        }
        // 齐次坐标 (x, y, 1)
        const homogeneousPoint = [x, y, 1];
        const result = [0, 0, 0];

        // 矩阵乘法
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i] += this._matrix[i][j] * homogeneousPoint[j];
            }
        }

        // 透视除法
        const w = result[2];
        return bv3(result[0] / w, result[1] / w);
    }
}

// // 使用示例
// const perspectiveMatrix = new PerspectiveMatrix2D(0.01, 0.01);
// const point = [100, 200];
// const transformedPoint = perspectiveMatrix.apply(point[0], point[1]);
// console.log(`原始点: (${point[0]}, ${point[1]})`);
// console.log(`变换后的点: (${transformedPoint[0]}, ${transformedPoint[1]})`);