import { FNumber } from "./f-number";

export class ObjectUtil {
    /**
     * 获取数据类型
     * @param o 
     * @returns 
     */
    static getType(o: any) {
        var s = Object.prototype.toString.call(o);
        return s.match(/\[object (.*?)\]/)[1].toLowerCase();
    }

    /**
     * 深度拷贝
     * @param data 
     * @returns 
     */
    static deepClone(data) {
        let type = this.getType(data);
        let obj;

        if (type === 'array') {
            obj = [];
        } else if (type === 'object') {
            obj = {};
        } else {
            //不再具有下一层次
            return data;
        }

        if (type === 'array') {
            for (let i = 0, len = data.length; i < len; i++) {
                obj.push(this.deepClone(data[i]));
            }
        } else if (type === 'object') {
            for (let key in data) {
                obj[key] = this.deepClone(data[key]);
            }
        }

        return obj;
    }

    /**
     * 合并多个对象
     * @param target 目标对象，合并后结果会存储在该对象中
     * @param sources 要合并的源对象列表
     * @returns 合并后的目标对象
     */
    static mergeKVnumber(target: Record<string, number>, ...sources: Record<string, number>[]): Record<string, number> {
        if (!sources.length) return target;
        const source = sources.shift();

        if (typeof target === 'object' && target !== null && typeof source === 'object' && source !== null) {
            for (const key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    const sourceValue = source[key];
                    if (typeof sourceValue === 'number') {
                        if (target.hasOwnProperty(key)) {
                            target[key] += sourceValue; // 若目标对象已有该键，累加值
                        } else {
                            target[key] = sourceValue; // 若目标对象没有该键，直接赋值
                        }
                    }
                }
            }
        }

        return this.mergeKVnumber(target, ...sources);
    }
    /**刷新数值 */
    static updateKVnumberValue(obj: Record<number, number>, type: number, value: number, cover?: boolean) {
        cover ? (obj[type] = value) : (obj[type] = FNumber.value(value).add(this.getKVnumberValue(obj, type)).value);
    }
    static getKVnumberValue(obj: Record<number, number>, type: number) {
        return obj[type] || 0;
    }

    /**
     * 将数字记录中的所有值按指定倍率计算，保持键不变
     * @param record 输入的数字记录
     * @param multiplier 倍率值（默认为2）
     * @returns 返回一个新的记录，其中的值都乘以了倍率
     */
    static multiplyRecord(record: Record<number, number>, multiplier: number = 2): Record<number, number> {
        const result: Record<number, number> = {};
        
        Object.keys(record).forEach(key => {
            result[Number(key)] = record[Number(key)] * multiplier;
        });

        return result;
    }
}