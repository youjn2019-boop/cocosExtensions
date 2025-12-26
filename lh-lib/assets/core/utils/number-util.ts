export class NumberUtil {
    public static myParseInt(string: any) {
        // return parseInt(string);
        let num: number;

        if (typeof string === 'string' && /^[\+\-]?\d+/.test(string)) {
            num = parseInt(string.trim());
        } else if(typeof string === "number") {
            num = string;
        }

        if(!num){
            num = 0;
        }

        return num;
    }
    
    public static isNumeric(n: any) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**判断数字范围 */
    public static checkNumber(num: number, type: number = 1): boolean {
        // 如果数字无效，返回false
        if(!this.isNumeric(num)){
            return false;
        }

        if(!type || type < 0){
            return true;
        }
        
        switch(type){
            case 1:
                // 大于0
                return num > 0;
            case 2:
                // 大于等于0
                return num >= 0;
            case 3:
                // 小于等于0
                return num <= 0;
            case 4:
                // 小于0
                return num < 0;
            default:
                return true;
        }
    }
}