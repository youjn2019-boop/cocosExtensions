// 参考table-gen.ts，实现以下逻辑
// 1: 判断是否设置了exeFile，dataDir，codeDir，exportDataDir，tempDir，exportMode
// 2: 清空临时目录 tempDir 的所有内容
// 3：全部设置之后，cd到exeFile所在的目录，执行cmd命令
// 4：{{exeFile}} -work_path {{dataDir}} -code_path  {{tempDir}} -code_type TypeScript -export_mode {{exportMode}} '-delay_load'
// 5：等待cmd成功执行完毕，有错误的话中断操作
// 6：将tempDir下的所有json，复制到exportDataDir
// 7：将tempDir下的所有ts，复制到codeDir

import { spawn } from 'child_process';
import { existsSync, readdirSync, copyFile, statSync, ensureDir, emptyDir, readFileSync, writeFileSync, ensureDirSync } from 'fs-extra';
import { join, dirname, basename, extname } from 'path';
import * as iconv from 'iconv-lite';
import { tableTemplete } from './export-table-mgr-template';

// 定义配置接口
interface ExportTableConfig {
    exeFile: string;        // 打表工具exe路径
    dataDir: string;        // 表格数据目录
    codeDir: string;        // 导出代码目录
    exportDataDir: string;  // 导出数据目录
    tempDir: string;        // 临时目录
    exportMode: string;     // 导出模式
}

// 定义返回结果接口
interface ExportResult {
    success: boolean;
    message: string;
    files?: string[];
}

/**
 * 导出表格（异步）
 * @param config 导出配置
 * @returns 导出结果
 */
export async function exportTable(config: ExportTableConfig): Promise<ExportResult> {
    try {
        // 1. 判断是否设置了所有必需参数
        const requiredFields = ['exeFile', 'dataDir', 'codeDir', 'exportDataDir', 'tempDir', 'exportMode'];
        const missingFields = requiredFields.filter(field => !config[field as keyof ExportTableConfig]);
        
        if (missingFields.length > 0) {
            return {
                success: false,
                message: `缺少必需配置: ${missingFields.join(', ')}`
            };
        }
        
        // 验证路径是否存在
        if (!existsSync(config.exeFile)) {
            return {
                success: false,
                message: `打表工具不存在: ${config.exeFile}`
            };
        }
        
        if (!existsSync(config.dataDir)) {
            return {
                success: false,
                message: `数据目录不存在: ${config.dataDir}`
            };
        }
        
        // 2. 清空临时目录
        console.log('清空临时目录:', config.tempDir);
        await ensureDir(config.tempDir);  // 确保目录存在
        await emptyDir(config.tempDir);   // 清空目录内容
        console.log('✅ 临时目录已清空');
        
        // 3. 执行打表命令（异步，等待完成）
        console.log('开始执行打表...');
        await execTableTool(config);
        
        // 4 & 5. 等待执行完成后再复制文件
        console.log('打表完成，开始复制文件...');
        const copiedFiles = await copyFiles(config);
        
        return {
            success: true,
            message: `打表成功，共复制 ${copiedFiles.length} 个文件`,
            files: copiedFiles
        };
        
    } catch (error: any) {
        console.error('导出表格失败:', error);
        return {
            success: false,
            message: error.message || '未知错误'
        };
    }
}

/**
 * 执行打表工具（异步）
 */
async function execTableTool(config: ExportTableConfig): Promise<void> {
    // 2. cd到exeFile所在的目录
    const exePath = dirname(config.exeFile);
    const exeName = basename(config.exeFile);

    // 3. 构建命令参数
    const args = [
        '-work_path', config.dataDir,
        '-code_path', config.tempDir,
        '-code_type', 'TypeScript',
        '-export_mode', config.exportMode,
        '-delay_load'
    ];

    console.log(`执行命令: ${exeName} ${args.join(' ')}`);
    console.log(`工作目录: ${exePath}`);

    // 4. 执行命令并等待完成
    return new Promise<void>((resolve, reject) => {
        // 切换到exe所在目录
        process.chdir(exePath);

        const child = spawn(exeName, args, {
            stdio: 'pipe',
            windowsHide: true
        });

        let stdout = '';
        let stderr = '';
        
        // 收集输出 - 使用 GBK 解码中文
        child.stdout.on('data', (chunk: Buffer) => {
            const output = iconv.decode(chunk, 'gbk');
            stdout += output;
            console.log(output);
        });
        
        child.stderr.on('data', (chunk: Buffer) => {
            const output = iconv.decode(chunk, 'gbk');
            stderr += output;
            console.error(output);
        });

        child.on('error', (err) => {
            reject(new Error(`执行打表工具失败: ${err.message}`));
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log('✅ 打表工具执行成功');
                resolve();
            } else {
                reject(new Error(`打表工具执行失败，退出代码: ${code}
${stderr}`));
            }
        });
    });
}

/**
 * 复制文件：将tempDir下的json复制到exportDataDir，ts复制到codeDir（异步）
 */
async function copyFiles(config: ExportTableConfig): Promise<string[]> {
    const copiedFiles: string[] = [];

    if (!existsSync(config.tempDir)) {
        console.warn(`临时目录不存在: ${config.tempDir}`);
        return copiedFiles;
    }

    // 确保目标目录存在（异步）
    await ensureDir(config.exportDataDir);
    await ensureDir(config.codeDir);

    // 读取临时目录下的所有文件
    const files = readdirSync(config.tempDir);

    // 收集所有复制任务
    const copyTasks: Promise<void>[] = [];

    for (const file of files) {
        const srcPath = join(config.tempDir, file);
        const stat = statSync(srcPath);

        // 只处理文件，不处理目录
        if (!stat.isFile()) {
            continue;
        }

        const ext = extname(file);
        let destPath: string;

        // 5. json文件复制到exportDataDir
        if (ext === '.json') {
            destPath = join(config.exportDataDir, file);
            copiedFiles.push(destPath);
            copyTasks.push(
                copyFile(srcPath, destPath).then(() => {
                    console.log(`复制 JSON: ${file} -> ${destPath}`);
                })
            );
        }
        // 6. ts文件复制到codeDir
        else if (ext === '.ts') {
            destPath = join(config.codeDir, file);
            copiedFiles.push(destPath);
            copyTasks.push(
                copyFile(srcPath, destPath).then(() => {
                    console.log(`复制 TS: ${file} -> ${destPath}`);
                })
            );
        }
    }

    // 等待所有复制任务完成
    await Promise.all(copyTasks);

    console.log(`共复制 ${copiedFiles.length} 个文件`);
    return copiedFiles;
}

/**
 * 获取指定模式下的表名列表
 * @param dataDir 数据目录（包含 config.json）
 * @param exportMode 导出模式
 * @returns 表名列表
 */
export function getModeTableNames(dataDir: string, exportMode: string): string[] | undefined {
    // 检查数据目录是否存在
    if (!dataDir) {
        console.error('dataDir 未设置');
        return undefined;
    }

    if (!existsSync(dataDir)) {
        console.error(`数据目录不存在: ${dataDir}`);
        return undefined;
    }

    const tableConfig = join(dataDir, 'config.json');
    
    try {
        let tableNames: string[] | undefined;
        
        if (!existsSync(tableConfig)) {
            console.log(`表格配置文件不存在: ${tableConfig}`);
            return undefined;
        }

        const data = readFileSync(tableConfig, 'utf-8');
        if (data) {
            tableNames = [];
            const configObj = JSON.parse(data);

            // 检查配置结构是否正确
            if (!configObj['ExportSettings'] || !configObj['ExportSettings'][exportMode]) {
                console.error(`配置文件中不存在导出模式: ${exportMode}`);
                return undefined;
            }

            const defaultExport: boolean = configObj['ExportSettings'][exportMode]['DefaultExportTable'];
            const TypeInfos = configObj['ExportSettings'][exportMode]['TypeInfos'];
            
            console.log(`默认导出 ===> mode == [${exportMode}] ------- defaultExport: ${defaultExport}`);
            
            for (const key in configObj['Tables']) {
                if (configObj['Tables'][key]['Name']) {
                    if (defaultExport) {
                        // 默认导出：除非明确标记为不导出，否则都导出
                        if (!TypeInfos[key] || TypeInfos[key]['Exportable']) {
                            tableNames.push(configObj['Tables'][key]['Name']);
                        }
                    } else {
                        // 非默认导出：只导出明确标记为可导出的
                        if (TypeInfos[key] && TypeInfos[key]['Exportable']) {
                            tableNames.push(configObj['Tables'][key]['Name']);
                        }
                    }
                }
            }
        }
        
        console.log(`找到 ${tableNames?.length || 0} 个表格`);
        return tableNames;
    } catch (err) {
        console.error(`读取表格配置失败:`, err);
        return undefined;
    }
}

/**
 * 生成 Tables 管理类代码
 * @param tableNames 表名列表
 * @param outputPath 输出文件路径（完整路径，包含文件名）
 * @returns 是否成功
 */
export function genTables(tableNames: string[], outputPath: string): boolean {
    if (!tableNames || tableNames.length === 0) {
        console.warn('表名列表为空，跳过生成 Tables');
        return false;
    }
    
    if (!outputPath) {
        console.error('输出路径未设置');
        return false;
    }

    try {
        let names = "\
";
        let importStr = "";
        let registerStr = "";
        let getMgrStr = "";

        for (let i = 0; i < tableNames.length; i++) {
            const tableName = tableNames[i];
            names += `        "${ tableName}",\
`;
            importStr += tableTemplete.importStr.replace(/\{\{name\}\}/g, tableName);
            const tmpStr = tableTemplete.registerStr.replace(/\{\{name\}\}/g, tableName);
            registerStr += tmpStr.replace(/\{\{index\}\}/g, i.toString());
            getMgrStr += tableTemplete.getMgrStr.replace(/\{\{name\}\}/g, tableName);
        }
        names += "    ";

        let tableTs = tableTemplete.table;
        const placeholders: Record<string, string> = {
            'namesStr': names,
            'importStr': importStr,
            'registerStr': registerStr,
            'getMgrStr': getMgrStr
        };

        for (const [key, value] of Object.entries(placeholders)) {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            tableTs = tableTs.replace(regex, value);
        }

        // 确保输出目录存在
        ensureDirSync(dirname(outputPath));
        writeFileSync(outputPath, tableTs, 'utf-8');
        console.log(`✅ [genTables] 生成成功 ==> ${outputPath}`);
        console.log(`   包含 ${tableNames.length} 个表格管理器`);
        return true;
    } catch (err) {
        console.error('❌ [genTables] 生成失败:', err);
        return false;
    }
}
