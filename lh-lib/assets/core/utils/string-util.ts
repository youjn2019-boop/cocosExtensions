export class StringUtil {
    /** 
     * ";" 分割字符串成数组 
     * @param str 字符串
     * @param delimiters 分隔符
     */
    static splitStringToMultiArray(str: string, delimiters: string[] = [","]): Array<any> {
        return this.splitString(str, delimiters);
    }
    static splitString(str: string, delimiters: string[] = [","]): any{
        if (!str) {
            return null;
        }
        if (!delimiters || delimiters.length <= 0) {
            return str;
        }
        let delimiter: string = delimiters.shift();
        return str.split(delimiter).map((subStr) => {
            return this.splitString(subStr, delimiters.concat())
        });
    }

    /**获取时间字符串（调试用） */
    public static getDateString(): string {
        let d = new Date();
        let str = d.getHours().toString();
        let timeStr = "";
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMinutes().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getSeconds().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMilliseconds().toString();
        if (str.length == 1) str = "00" + str;
        if (str.length == 2) str = "0" + str;
        timeStr += str;

        timeStr = "[" + timeStr + "]";
        return timeStr;
    }
}