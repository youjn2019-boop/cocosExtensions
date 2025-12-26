import { BRandom } from "./b-random";

export class RandomUtils {
    private static _randoms: Record<number, BRandom> = {};
    /**根据类型获取一个random类 */
    public static getRandom(type: number = 0): BRandom {
        if (!type) return null;
        if (!this._randoms[type]) {
            this._randoms[type] = new BRandom();
        }
        return this._randoms[type];
    }

    /**
     * 根据权重数组随机选择一个索引
     * @param weights 权重数组
     * @returns 选中的索引，如果权重数组为空或所有权重为0，返回-1
     * @example
     * randomByWeight([10, 20, 30]) // 10% 概率返回0，20%概率返回1，30%概率返回2
     */
    public static randomByWeight(weights: number[], random: BRandom): number {
        const len = weights?.length;
        if (!len) return -1;

        // 快速计算总权重
        let totalWeight = weights[0];
        for (let i = 1; i < len; i++) {
            totalWeight += weights[i];
        }
        if (totalWeight <= 0) return -1;

        // 随机一个权重值
        const randomWeight = random.randomInt(totalWeight);

        // 使用累积权重数组优化查找
        let currentWeight = weights[0];
        if (randomWeight < currentWeight) return 0;

        for (let i = 1; i < len; i++) {
            currentWeight += weights[i];
            if (randomWeight < currentWeight) {
                return i;
            }
        }
        return len - 1;
    }

    /**
     * 根据权重数组随机选择多个不重复的索引
     * @param weights 权重数组
     * @param count 需要选择的数量
     * @returns 选中的索引数组
     */
    public static randomMultiByWeight(weights: number[], count: number, random: BRandom): number[] {
        const len = weights?.length;
        if (!len || count <= 0) return [];
        if (count >= len) return Array.from(Array(len).keys());

        // 预分配数组
        const result = new Array(count);
        const tempWeights = new Array(len);

        // 快速复制权重数组
        for (let i = 0; i < len; i++) {
            tempWeights[i] = weights[i];
        }

        // 使用原地交换法，避免额外的索引数组
        for (let i = 0; i < count; i++) {
            const remainingCount = len - i;
            const index = i + this.randomByWeight(tempWeights.slice(i, len), random);
            if (index === -1) break;

            // 记录选中的索引
            result[i] = index;

            // 交换权重到已选区域
            if (i !== index) {
                const temp = tempWeights[i];
                tempWeights[i] = tempWeights[index];
                tempWeights[index] = temp;
            }
        }

        return result;
    }
}