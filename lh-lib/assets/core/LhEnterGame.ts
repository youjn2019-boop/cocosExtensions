/*
 * @file            extensions/lh-lib/assets/core/LhEnterGame.ts
 * @description     进入游戏后的操作
 * @author          yjn
 * @createTime      2025-09-29 15:48:35
 * @lastModified    2025-09-29 15:48:51
 * Copyright ©dianhun All rights reserved
*/

import { EDITOR } from "cc/env";
import { LhCCExtensions } from "../lhStart/hepler/LhCCExtensions";

export class LhEnterGame {
    static init() {
        // 重载cc的方法
        LhCCExtensions.init();
    }
}

if (!EDITOR) {
    // if (!(globalThis as any).gi) {
    //     (globalThis as any).gi = {};
    // }
    gi.LhEnterGame = LhEnterGame;
}