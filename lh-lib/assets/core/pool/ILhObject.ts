/*
 * @file            assets/script/game/common/base/pool/ILhObject.ts
 * @description     对象池基础节点接口
 * @author          yjn
 * @createTime      2025-08-08 20:59:16
 * @lastModified    2025-08-08 21:02:18
 * Copyright ©dianhun All rights reserved
*/
export interface ILhObject {
    onFree(): void;
    onAllocc(): void;
}