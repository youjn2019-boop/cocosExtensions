import { NumberUtil } from "./number-util";

export class ArrayUtil {
    /**
     * 合并多个数组并去除重复项
     * @param arrays 要合并的数组列表
     * @returns 合并后的无重复数组
     */
    public static mergeUnique<T>(...arrays: T[][]): T[] {
        // 使用 Map 来去重，key 和 value 都使用元素本身
        const uniqueMap = new Map<T, T>();
        
        // 遍历所有数组
        arrays.forEach(arr => {
            arr.forEach(item => {
                uniqueMap.set(item, item);
            });
        });
        
        // 将 Map 的值转回数组
        return Array.from(uniqueMap.values());
    }

    /**
     * 合并多个对象数组并根据指定的键去除重复项
     * @param key 用于判断重复的键名
     * @param arrays 要合并的对象数组列表
     * @returns 合并后的无重复对象数组
     */
    public static mergeUniqueByKey<T extends object>(key: keyof T, ...arrays: T[][]): T[] {
        const uniqueMap = new Map<any, T>();
        
        arrays.forEach(arr => {
            arr.forEach(item => {
                uniqueMap.set(item[key], item);
            });
        });
        
        return Array.from(uniqueMap.values());
    }

    /**
     * 将字符串按指定分隔符分割成数组
     * @param str 要分割的字符串
     * @param separator 分隔符，可以是字符串或字符串数组，默认为 ","
     * @param filterEmpty 是否过滤空字符串，默认为 true
     * @returns 分割后的数组
     */
    public static splitToArray(str: string, separator: string | string[] = "#", filterEmpty: boolean = false): string[] {
        if (!str) {
            return [];
        }

        let array: string[];
        if (Array.isArray(separator)) {
            // 使用正则表达式一次性分割，避免多次遍历
            const regexStr = separator.map(sep => 
                // 转义特殊字符
                sep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            ).join('|');
            array = str.split(new RegExp(regexStr));
        } else {
            array = str.split(separator);
        }
        
        // 使用 for 循环过滤，避免创建新数组
        if (filterEmpty) {
            let validCount = 0;
            for (let i = 0; i < array.length; i++) {
                if (array[i] !== "") {
                    if (i !== validCount) {
                        array[validCount] = array[i];
                    }
                    validCount++;
                }
            }
            array.length = validCount;
        }
        
        return array;
    }

    /**
     * 将字符串按指定分隔符分割成数字数组
     * @param str 要分割的字符串
     * @param separator 分隔符，可以是字符串或字符串数组，默认为 ","
     * @param filterEmpty 是否过滤空字符串，默认为 true
     * @returns 分割后的数字数组
     */
    public static splitToNumberArray(str: string, separator: string | string[] = "#", filterEmpty: boolean = false): number[] {
        const strArray = this.splitToArray(str, separator, filterEmpty);
        // 使用 for 循环转换，避免创建中间数组
        const numbers = new Array(strArray.length);
        for (let i = 0; i < strArray.length; i++) {
            numbers[i] = NumberUtil.myParseInt(strArray[i]);
        }
        return numbers;
    }

    /**
     * 将字符串按多个分隔符分割成多维数组
     * @param str 要分割的字符串
     * @param separators 分隔符数组，按顺序分割
     * @param filterEmpty 是否过滤空字符串，默认为 true
     * @returns 分割后的多维数组
     */
    public static splitToMultiArray(str: string, separators: string[], filterEmpty: boolean = false): any[] {
        if (!str || !separators.length) {
            return [];
        }

        // 预分配数组大小以避免动态扩容
        const result = new Array(16); // 初始大小可根据实际情况调整
        let resultLength = 0;

        // 获取当前层级的分隔符
        const separator = separators[0];
        
        // 手动分割字符串，避免 split 方法的开销
        let start = 0;
        let end = 0;
        const strLength = str.length;
        const sepLength = separator.length;

        while (end <= strLength) {
            // 找到分隔符或到达字符串末尾
            if (end === strLength || str.startsWith(separator, end)) {
                const segment = str.slice(start, end);
                
                // 过滤空字符串
                if (!filterEmpty || segment !== "") {
                    if (separators.length > 1) {
                        // 递归处理下一层，复用数组
                        result[resultLength++] = this.splitToMultiArray(segment, separators.slice(1), filterEmpty);
                    } else {
                        result[resultLength++] = segment;
                    }
                }
                
                start = end + sepLength;
                end = start;
            } else {
                end++;
            }
        }

        // 调整数组长度为实际大小
        result.length = resultLength;
        return result;
    }

    /**
     * 将字符串按多个分隔符分割成多维数字数组
     * @param str 要分割的字符串
     * @param separators 分隔符数组，按顺序分割
     * @param filterEmpty 是否过滤空字符串，默认为 true
     * @returns 分割后的多维数字数组
     */
    public static splitToMultiNumberArray(str: string, separators: string[], filterEmpty: boolean = false): number[][] {
        const array = this.splitToMultiArray(str, separators, filterEmpty);
        
        // 递归转换为数字，避免使用 map
        const convertToNumber = (arr: any[]): any[] => {
            const result = new Array(arr.length);
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                result[i] = Array.isArray(item) ? convertToNumber(item) : NumberUtil.myParseInt(item);
            }
            return result;
        };

        return convertToNumber(array);
    }
} 