/*
 * @file            extensions/lh-lib/assets/startScene/init/LhStartScene.ts
 * @description     首包
 * @author          yjn
 * @createTime      2025-09-29 15:00:17
 * @lastModified    2025-09-29 15:46:09
 * Copyright ©dianhun All rights reserved
*/

import { EDITOR } from "cc/env";
import { LhConfig } from "../config/LhConfig";
import { decoratorLogger, LhLogger, LhLoggerHeadColor, LhLoggerTagMode, LhLogMsgMode } from "../hepler/LhLogger";
import { LhResManager } from "../hepler/LhResManager";

export class LhStartScene {
    static init() {
        // 初始化游戏配置
        gi.lhConfig = new LhConfig();

        // 设置全局引用
        gi.logger = LhLogger.default;
        gi.LhLoggerHeadColor = LhLoggerHeadColor;
        gi.LhLogMsgMode = LhLogMsgMode;
        gi.LhLoggerTagMode = LhLoggerTagMode;
        gi.LhLogger = LhLogger;

        gi.decoratorLogger = decoratorLogger;

        gi.logNet = (msg: string, ...tag: string[]): void => {
            tag = ["网络日志", ...tag];
            gi.logger.print(msg, tag, "log", gi.LhLoggerHeadColor.Net);
        }
        gi.logView = (msg: string, ...tag: string[]): void => {
            tag = ["视图日志", ...tag];
            gi.logger.print(msg, tag, "log", gi.LhLoggerHeadColor.View);
        }
        gi.logModel = (msg: string, ...tag: string[]): void => {
            tag = ["数据日志", ...tag];
            gi.logger.print(msg, tag, "log", gi.LhLoggerHeadColor.Model);
        }
        gi.resManager = LhResManager.instance;
        // 控制tag打印
        // gi.logger.addDenyTag("BattleLib");
    }
}

if (!EDITOR) {
    // if (!(globalThis as any).gi) {
    //     (globalThis as any).gi = {};
    // }
    gi.LhStartScene = LhStartScene;
}