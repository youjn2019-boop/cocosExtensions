import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * 复制战斗表格文件的配置接口
 */
export interface CopyBattleTableConfig {
    /** 源表格目录路径 */
    sourceTableDir: string;
    /** 目标表格目录路径 */
    destTableDir: string;
    /** 需要复制的表格类名数组 */
    tableNames: string[];
}

/**
 * 复制战斗表格文件的结果接口
 */
export interface CopyBattleTableResult {
    success: boolean;
    message: string;
    copiedFiles?: string[];
    errorFiles?: { name: string; error: string }[];
}

/**
 * 默认的表格类名列表
 */
export const DEFAULT_TABLE_NAMES = [
    'behavior',
    'buffModify',
    'buff',
    'buffType',
    'buffProcess',
    'buffTrigger',
    'buffAbility',
    'bullet',
    'condition',
    'findTarget',
    'skill',
    'summon',
    'damageExpressConfig',
    'damageExpressDefine',
    'damageExpressConst',
];

/**
 * 复制战斗表格文件
 * @param config 复制配置
 * @returns 复制结果
 */
export async function copyBattleTables(config: CopyBattleTableConfig): Promise<CopyBattleTableResult> {
    const { sourceTableDir, destTableDir, tableNames } = config;

    // 验证参数
    if (!sourceTableDir || !destTableDir) {
        return {
            success: false,
            message: '源目录和目标目录不能为空',
        };
    }

    if (!tableNames || tableNames.length === 0) {
        return {
            success: false,
            message: '表格类名列表不能为空',
        };
    }

    // 检查源目录是否存在
    if (!fs.existsSync(sourceTableDir)) {
        return {
            success: false,
            message: `源目录不存在: ${sourceTableDir}`,
        };
    }

    // 确保目标目录存在
    try {
        fs.ensureDirSync(destTableDir);
    } catch (error: any) {
        return {
            success: false,
            message: `创建目标目录失败: ${error.message}`,
        };
    }

    const copiedFiles: string[] = [];
    const errorFiles: { name: string; error: string }[] = [];

    // 复制文件
    for (const tableName of tableNames) {
        const sourcePath = path.join(sourceTableDir, `${tableName}.ts`);
        const destPath = path.join(destTableDir, `${tableName}.ts`);

        try {
            // 检查源文件是否存在
            if (!fs.existsSync(sourcePath)) {
                console.warn(`⚠️ 源文件不存在: ${sourcePath}`);
                errorFiles.push({
                    name: tableName,
                    error: '源文件不存在',
                });
                continue;
            }

            // 复制文件
            fs.copyFileSync(sourcePath, destPath);
            copiedFiles.push(destPath);
            console.log(`✅ 复制文件 => ${destPath}`);
        } catch (error: any) {
            console.error(`❌ 复制文件失败: ${tableName}`, error);
            errorFiles.push({
                name: tableName,
                error: error.message || '未知错误',
            });
        }
    }

    // 生成结果消息
    let message = `成功复制 ${copiedFiles.length} 个文件`;
    if (errorFiles.length > 0) {
        message += `，失败 ${errorFiles.length} 个文件`;
    }

    return {
        success: copiedFiles.length > 0,
        message,
        copiedFiles,
        errorFiles: errorFiles.length > 0 ? errorFiles : undefined,
    };
}

/**
 * 使用默认表格列表复制战斗表格文件
 * @param sourceTableDir 源表格目录路径
 * @param destTableDir 目标表格目录路径
 * @returns 复制结果
 */
export async function copyBattleTablesWithDefaults(
    sourceTableDir: string,
    destTableDir: string
): Promise<CopyBattleTableResult> {
    return copyBattleTables({
        sourceTableDir,
        destTableDir,
        tableNames: DEFAULT_TABLE_NAMES,
    });
}