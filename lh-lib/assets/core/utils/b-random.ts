/**
 * 战斗随机数生成器
 * 
 * !!!注意，该类只能由对应创建的战斗系统调用，其他系统、战斗场次不得调用!!!
 */

export class BRandom {
    public showLog: boolean = false;
    // 随机数种子
    private _rdSeed1 = 0;
    private _rdSeed2 = 0;
    private _rdSeed3 = 0;
    private _rdSeed4 = 0;

    public setRandomSeed(seed: number) {
        this._rdSeed1 = seed << 24;
        this._rdSeed2 = seed << 16;
        this._rdSeed3 = seed << 8;
        this._rdSeed4 = seed << 4;
        // 先碰撞x次，让随机平均值值趋于稳定
        for (let i = 0; i < 150; i++) {
            this.random();
        }
    }

    // 随机值(!!!只能由战斗系统调用)
    public random() {
        this._rdSeed1 >>>= 0; this._rdSeed2 >>>= 0; this._rdSeed3 >>>= 0; this._rdSeed4 >>>= 0;
        let cast32 = (this._rdSeed1 + this._rdSeed2) | 0;
        this._rdSeed1 = this._rdSeed2 ^ this._rdSeed2 >>> 9;
        this._rdSeed2 = this._rdSeed3 + (this._rdSeed3 << 3) | 0;
        this._rdSeed3 = (this._rdSeed3 << 21 | this._rdSeed3 >>> 11);
        this._rdSeed4 = this._rdSeed4 + 1 | 0;
        cast32 = cast32 + this._rdSeed4 | 0;
        this._rdSeed3 = this._rdSeed3 + cast32 | 0;
        let result = (cast32 >>> 0) / 4294967296;
        return result;
    }

    // 随机数(!!!只能由战斗系统调用)
    public randomNum(max: number, min: number = 0) {
        if (min > max) {
            let temp = max;
            max = min;
            min = temp;
        }
        return this.random() * (max - min) + min;
    }

    // 随机整数(!!!只能由战斗系统调用)
    public randomInt(max: number, min: number = 0) {
        return Math.floor(this.randomNum(max, min));
    }

    // 随机概率(!!!只能由战斗系统调用)
    public randomBool(rate = 0.5) {
        return this.random() <= rate;
    }

    // 随机万分率(!!!只能由战斗系统调用)
    public randomWBool(rate = 5000) {
        return this.random() * 10000 <= rate;
    }

    // 随机符号(!!!只能由战斗系统调用)
    public randomSign() {
        return this.randomBool() ? -1 : 1;
    }

    // 随机元素(!!!只能由战斗系统调用)
    public randomInArr<T>(arr: T[], cnt: number = 1): T[] {
        if (cnt >= arr.length) {
            return arr;
        }
        const tmp = arr.concat();
        const ret = [];
        while (cnt > 0 && tmp.length > 0) {
            const idx = this.randomInt(tmp.length);
            ret.push(tmp[idx]);
            tmp.splice(idx, 1);
            cnt--;
        }
        return ret;
    }
}