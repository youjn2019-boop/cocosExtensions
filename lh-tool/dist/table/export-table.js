"use strict";
// 参考table-gen.ts，实现以下逻辑
// 1: 判断是否设置了exeFile，dataDir，codeDir，exportDataDir，tempDir，exportMode
// 2: 清空临时目录 tempDir 的所有内容
// 3：全部设置之后，cd到exeFile所在的目录，执行cmd命令
// 4：{{exeFile}} -work_path {{dataDir}} -code_path  {{tempDir}} -code_type TypeScript -export_mode {{exportMode}} '-delay_load'
// 5：等待cmd成功执行完毕，有错误的话中断操作
// 6：将tempDir下的所有json，复制到exportDataDir
// 7：将tempDir下的所有ts，复制到codeDir
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportTable = exportTable;
exports.getModeTableNames = getModeTableNames;
exports.genTables = genTables;
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const iconv = __importStar(require("iconv-lite"));
const export_table_mgr_template_1 = require("./export-table-mgr-template");
/**
 * 导出表格（异步）
 * @param config 导出配置
 * @returns 导出结果
 */
async function exportTable(config) {
    try {
        // 1. 判断是否设置了所有必需参数
        const requiredFields = ['exeFile', 'dataDir', 'codeDir', 'exportDataDir', 'tempDir', 'exportMode'];
        const missingFields = requiredFields.filter(field => !config[field]);
        if (missingFields.length > 0) {
            return {
                success: false,
                message: `缺少必需配置: ${missingFields.join(', ')}`
            };
        }
        // 验证路径是否存在
        if (!(0, fs_extra_1.existsSync)(config.exeFile)) {
            return {
                success: false,
                message: `打表工具不存在: ${config.exeFile}`
            };
        }
        if (!(0, fs_extra_1.existsSync)(config.dataDir)) {
            return {
                success: false,
                message: `数据目录不存在: ${config.dataDir}`
            };
        }
        // 2. 清空临时目录
        console.log('清空临时目录:', config.tempDir);
        await (0, fs_extra_1.ensureDir)(config.tempDir); // 确保目录存在
        await (0, fs_extra_1.emptyDir)(config.tempDir); // 清空目录内容
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
    }
    catch (error) {
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
async function execTableTool(config) {
    // 2. cd到exeFile所在的目录
    const exePath = (0, path_1.dirname)(config.exeFile);
    const exeName = (0, path_1.basename)(config.exeFile);
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
    return new Promise((resolve, reject) => {
        // 切换到exe所在目录
        process.chdir(exePath);
        const child = (0, child_process_1.spawn)(exeName, args, {
            stdio: 'pipe',
            windowsHide: true
        });
        let stdout = '';
        let stderr = '';
        // 收集输出 - 使用 GBK 解码中文
        child.stdout.on('data', (chunk) => {
            const output = iconv.decode(chunk, 'gbk');
            stdout += output;
            console.log(output);
        });
        child.stderr.on('data', (chunk) => {
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
            }
            else {
                reject(new Error(`打表工具执行失败，退出代码: ${code}
${stderr}`));
            }
        });
    });
}
/**
 * 复制文件：将tempDir下的json复制到exportDataDir，ts复制到codeDir（异步）
 */
async function copyFiles(config) {
    const copiedFiles = [];
    if (!(0, fs_extra_1.existsSync)(config.tempDir)) {
        console.warn(`临时目录不存在: ${config.tempDir}`);
        return copiedFiles;
    }
    // 确保目标目录存在（异步）
    await (0, fs_extra_1.ensureDir)(config.exportDataDir);
    await (0, fs_extra_1.ensureDir)(config.codeDir);
    // 读取临时目录下的所有文件
    const files = (0, fs_extra_1.readdirSync)(config.tempDir);
    // 收集所有复制任务
    const copyTasks = [];
    for (const file of files) {
        const srcPath = (0, path_1.join)(config.tempDir, file);
        const stat = (0, fs_extra_1.statSync)(srcPath);
        // 只处理文件，不处理目录
        if (!stat.isFile()) {
            continue;
        }
        const ext = (0, path_1.extname)(file);
        let destPath;
        // 5. json文件复制到exportDataDir
        if (ext === '.json') {
            destPath = (0, path_1.join)(config.exportDataDir, file);
            copiedFiles.push(destPath);
            copyTasks.push((0, fs_extra_1.copyFile)(srcPath, destPath).then(() => {
                console.log(`复制 JSON: ${file} -> ${destPath}`);
            }));
        }
        // 6. ts文件复制到codeDir
        else if (ext === '.ts') {
            destPath = (0, path_1.join)(config.codeDir, file);
            copiedFiles.push(destPath);
            copyTasks.push((0, fs_extra_1.copyFile)(srcPath, destPath).then(() => {
                console.log(`复制 TS: ${file} -> ${destPath}`);
            }));
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
function getModeTableNames(dataDir, exportMode) {
    // 检查数据目录是否存在
    if (!dataDir) {
        console.error('dataDir 未设置');
        return undefined;
    }
    if (!(0, fs_extra_1.existsSync)(dataDir)) {
        console.error(`数据目录不存在: ${dataDir}`);
        return undefined;
    }
    const tableConfig = (0, path_1.join)(dataDir, 'config.json');
    try {
        let tableNames;
        if (!(0, fs_extra_1.existsSync)(tableConfig)) {
            console.log(`表格配置文件不存在: ${tableConfig}`);
            return undefined;
        }
        const data = (0, fs_extra_1.readFileSync)(tableConfig, 'utf-8');
        if (data) {
            tableNames = [];
            const configObj = JSON.parse(data);
            // 检查配置结构是否正确
            if (!configObj['ExportSettings'] || !configObj['ExportSettings'][exportMode]) {
                console.error(`配置文件中不存在导出模式: ${exportMode}`);
                return undefined;
            }
            const defaultExport = configObj['ExportSettings'][exportMode]['DefaultExportTable'];
            const TypeInfos = configObj['ExportSettings'][exportMode]['TypeInfos'];
            console.log(`默认导出 ===> mode == [${exportMode}] ------- defaultExport: ${defaultExport}`);
            for (const key in configObj['Tables']) {
                if (configObj['Tables'][key]['Name']) {
                    if (defaultExport) {
                        // 默认导出：除非明确标记为不导出，否则都导出
                        if (!TypeInfos[key] || TypeInfos[key]['Exportable']) {
                            tableNames.push(configObj['Tables'][key]['Name']);
                        }
                    }
                    else {
                        // 非默认导出：只导出明确标记为可导出的
                        if (TypeInfos[key] && TypeInfos[key]['Exportable']) {
                            tableNames.push(configObj['Tables'][key]['Name']);
                        }
                    }
                }
            }
        }
        console.log(`找到 ${(tableNames === null || tableNames === void 0 ? void 0 : tableNames.length) || 0} 个表格`);
        return tableNames;
    }
    catch (err) {
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
function genTables(tableNames, outputPath) {
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
            names += `        "${tableName}",\
`;
            importStr += export_table_mgr_template_1.tableTemplete.importStr.replace(/\{\{name\}\}/g, tableName);
            const tmpStr = export_table_mgr_template_1.tableTemplete.registerStr.replace(/\{\{name\}\}/g, tableName);
            registerStr += tmpStr.replace(/\{\{index\}\}/g, i.toString());
            getMgrStr += export_table_mgr_template_1.tableTemplete.getMgrStr.replace(/\{\{name\}\}/g, tableName);
        }
        names += "    ";
        let tableTs = export_table_mgr_template_1.tableTemplete.table;
        const placeholders = {
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
        (0, fs_extra_1.ensureDirSync)((0, path_1.dirname)(outputPath));
        (0, fs_extra_1.writeFileSync)(outputPath, tableTs, 'utf-8');
        console.log(`✅ [genTables] 生成成功 ==> ${outputPath}`);
        console.log(`   包含 ${tableNames.length} 个表格管理器`);
        return true;
    }
    catch (err) {
        console.error('❌ [genTables] 生成失败:', err);
        return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LXRhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL3RhYmxlL2V4cG9ydC10YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0JBQXdCO0FBQ3hCLHFFQUFxRTtBQUNyRSwwQkFBMEI7QUFDMUIsbUNBQW1DO0FBQ25DLCtIQUErSDtBQUMvSCwwQkFBMEI7QUFDMUIsc0NBQXNDO0FBQ3RDLDhCQUE4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4QjlCLGtDQXVEQztBQW9JRCw4Q0E2REM7QUFRRCw4QkFvREM7QUFoVkQsaURBQXNDO0FBQ3RDLHVDQUF3STtBQUN4SSwrQkFBd0Q7QUFDeEQsa0RBQW9DO0FBQ3BDLDJFQUE0RDtBQW1CNUQ7Ozs7R0FJRztBQUNJLEtBQUssVUFBVSxXQUFXLENBQUMsTUFBeUI7SUFDdkQsSUFBSSxDQUFDO1FBQ0QsbUJBQW1CO1FBQ25CLE1BQU0sY0FBYyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNuRyxNQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZ0MsQ0FBQyxDQUFDLENBQUM7UUFFaEcsSUFBSSxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQzNCLE9BQU87Z0JBQ0gsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsT0FBTyxFQUFFLFdBQVcsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTthQUNqRCxDQUFDO1FBQ04sQ0FBQztRQUVELFdBQVc7UUFDWCxJQUFJLENBQUMsSUFBQSxxQkFBVSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQzlCLE9BQU87Z0JBQ0gsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsT0FBTyxF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O1lBQ2pCLFdBQVcsRUFBRSxTQUFTO1lBQ3RCLGFBQWEsRUFBRSxXQUFXO1lBQzFCLFdBQVcsRUFBRSxTQUFTO1NBQ3pCLENBQUM7UUFFRixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO1lBQ3RELE1BQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsR0FBRyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDcEQsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFFRCxXQUFXO1FBQ1gsSUFBQSx3QkFBYSxFQUFDLElBQUEsY0FBTyxFQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDbkMsSUFBQSx3QkFBYSxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUNwRCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsVUFBVSxDQUFDLE1BQU0sU0FBUyxDQUFDLENBQUM7UUFDakQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8g5Y+C6ICDdGFibGUtZ2VuLnRz77yM5a6e546w5Lul5LiL6YC76L6RXHJcbi8vIDE6IOWIpOaWreaYr+WQpuiuvue9ruS6hmV4ZUZpbGXvvIxkYXRhRGly77yMY29kZURpcu+8jGV4cG9ydERhdGFEaXLvvIx0ZW1wRGly77yMZXhwb3J0TW9kZVxyXG4vLyAyOiDmuIXnqbrkuLTml7bnm67lvZUgdGVtcERpciDnmoTmiYDmnInlhoXlrrlcclxuLy8gM++8muWFqOmDqOiuvue9ruS5i+WQju+8jGNk5YiwZXhlRmlsZeaJgOWcqOeahOebruW9le+8jOaJp+ihjGNtZOWRveS7pFxyXG4vLyA077yae3tleGVGaWxlfX0gLXdvcmtfcGF0aCB7e2RhdGFEaXJ9fSAtY29kZV9wYXRoICB7e3RlbXBEaXJ9fSAtY29kZV90eXBlIFR5cGVTY3JpcHQgLWV4cG9ydF9tb2RlIHt7ZXhwb3J0TW9kZX19ICctZGVsYXlfbG9hZCdcclxuLy8gNe+8muetieW+hWNtZOaIkOWKn+aJp+ihjOWujOavle+8jOaciemUmeivr+eahOivneS4reaWreaTjeS9nFxyXG4vLyA277ya5bCGdGVtcERpcuS4i+eahOaJgOaciWpzb27vvIzlpI3liLbliLBleHBvcnREYXRhRGlyXHJcbi8vIDfvvJrlsIZ0ZW1wRGly5LiL55qE5omA5pyJdHPvvIzlpI3liLbliLBjb2RlRGlyXHJcblxyXG5pbXBvcnQgeyBzcGF3biB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xyXG5pbXBvcnQgeyBleGlzdHNTeW5jLCByZWFkZGlyU3luYywgY29weUZpbGUsIHN0YXRTeW5jLCBlbnN1cmVEaXIsIGVtcHR5RGlyLCByZWFkRmlsZVN5bmMsIHdyaXRlRmlsZVN5bmMsIGVuc3VyZURpclN5bmMgfSBmcm9tICdmcy1leHRyYSc7XHJcbmltcG9ydCB7IGpvaW4sIGRpcm5hbWUsIGJhc2VuYW1lLCBleHRuYW1lIH0gZnJvbSAncGF0aCc7XHJcbmltcG9ydCAqIGFzIGljb252IGZyb20gJ2ljb252LWxpdGUnO1xyXG5pbXBvcnQgeyB0YWJsZVRlbXBsZXRlIH0gZnJvbSAnLi9leHBvcnQtdGFibGUtbWdyLXRlbXBsYXRlJztcclxuXHJcbi8vIOWumuS5iemFjee9ruaOpeWPo1xyXG5pbnRlcmZhY2UgRXhwb3J0VGFibGVDb25maWcge1xyXG4gICAgZXhlRmlsZTogc3RyaW5nOyAgICAgICAgLy8g5omT6KGo5bel5YW3ZXhl6Lev5b6EXHJcbiAgICBkYXRhRGlyOiBzdHJpbmc7ICAgICAgICAvLyDooajmoLzmlbDmja7nm67lvZVcclxuICAgIGNvZGVEaXI6IHN0cmluZzsgICAgICAgIC8vIOWvvOWHuuS7o+eggeebruW9lVxyXG4gICAgZXhwb3J0RGF0YURpcjogc3RyaW5nOyAgLy8g5a+85Ye65pWw5o2u55uu5b2VXHJcbiAgICB0ZW1wRGlyOiBzdHJpbmc7ICAgICAgICAvLyDkuLTml7bnm67lvZVcclxuICAgIGV4cG9ydE1vZGU6IHN0cmluZzsgICAgIC8vIOWvvOWHuuaooeW8j1xyXG59XHJcblxyXG4vLyDlrprkuYnov5Tlm57nu5PmnpzmjqXlj6NcclxuaW50ZXJmYWNlIEV4cG9ydFJlc3VsdCB7XHJcbiAgICBzdWNjZXNzOiBib29sZWFuO1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG4gICAgZmlsZXM/OiBzdHJpbmdbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIOWvvOWHuuihqOagvO+8iOW8guatpe+8iVxyXG4gKiBAcGFyYW0gY29uZmlnIOWvvOWHuumFjee9rlxyXG4gKiBAcmV0dXJucyDlr7zlh7rnu5PmnpxcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleHBvcnRUYWJsZShjb25maWc6IEV4cG9ydFRhYmxlQ29uZmlnKTogUHJvbWlzZTxFeHBvcnRSZXN1bHQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgLy8gMS4g5Yik5pat5piv5ZCm6K6+572u5LqG5omA5pyJ5b+F6ZyA5Y+C5pWwXHJcbiAgICAgICAgY29uc3QgcmVxdWlyZWRGaWVsZHMgPSBbJ2V4ZUZpbGUnLCAnZGF0YURpcicsICdjb2RlRGlyJywgJ2V4cG9ydERhdGFEaXInLCAndGVtcERpcicsICdleHBvcnRNb2RlJ107XHJcbiAgICAgICAgY29uc3QgbWlzc2luZ0ZpZWxkcyA9IHJlcXVpcmVkRmllbGRzLmZpbHRlcihmaWVsZCA9PiAhY29uZmlnW2ZpZWxkIGFzIGtleW9mIEV4cG9ydFRhYmxlQ29uZmlnXSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKG1pc3NpbmdGaWVsZHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBg57y65bCR5b+F6ZyA6YWN572uOiAke21pc3NpbmdGaWVsZHMuam9pbignLCAnKX1gXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOmqjOivgei3r+W+hOaYr+WQpuWtmOWcqFxyXG4gICAgICAgIGlmICghZXhpc3RzU3luYyhjb25maWcuZXhlRmlsZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYOaJk+ihqOW3peWFt+S4jeWtmOWcqDogJHtjb25maWcuZXhlRmlsZX1gXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghZXhpc3RzU3luYyhjb25maWcuZGF0YURpcikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYOaVsOaNruebruW9leS4jeWtmOWcqDogJHtjb25maWcuZGF0YURpcn1gXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIDIuIOa4heepuuS4tOaXtuebruW9lVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCfmuIXnqbrkuLTml7bnm67lvZU6JywgY29uZmlnLnRlbXBEaXIpO1xyXG4gICAgICAgIGF3YWl0IGVuc3VyZURpcihjb25maWcudGVtcERpcik7ICAvLyDnoa7kv53nm67lvZXlrZjlnKhcclxuICAgICAgICBhd2FpdCBlbXB0eURpcihjb25maWcudGVtcERpcik7ICAgLy8g5riF56m655uu5b2V5YaF5a65XHJcbiAgICAgICAgY29uc29sZS5sb2coJ+KchSDkuLTml7bnm67lvZXlt7LmuIXnqbonKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyAzLiDmiafooYzmiZPooajlkb3ku6TvvIjlvILmraXvvIznrYnlvoXlrozmiJDvvIlcclxuICAgICAgICBjb25zb2xlLmxvZygn5byA5aeL5omn6KGM5omT6KGoLi4uJyk7XHJcbiAgICAgICAgYXdhaXQgZXhlY1RhYmxlVG9vbChjb25maWcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIDQgJiA1LiDnrYnlvoXmiafooYzlrozmiJDlkI7lho3lpI3liLbmlofku7ZcclxuICAgICAgICBjb25zb2xlLmxvZygn5omT6KGo5a6M5oiQ77yM5byA5aeL5aSN5Yi25paH5Lu2Li4uJyk7XHJcbiAgICAgICAgY29uc3QgY29waWVkRmlsZXMgPSBhd2FpdCBjb3B5RmlsZXMoY29uZmlnKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBg5omT6KGo5oiQ5Yqf77yM5YWx5aSN5Yi2ICR7Y29waWVkRmlsZXMubGVuZ3RofSDkuKrmlofku7ZgLFxyXG4gICAgICAgICAgICBmaWxlczogY29waWVkRmlsZXNcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ+WvvOWHuuihqOagvOWksei0pTonLCBlcnJvcik7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ+acquefpemUmeivrydcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog5omn6KGM5omT6KGo5bel5YW377yI5byC5q2l77yJXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBleGVjVGFibGVUb29sKGNvbmZpZzogRXhwb3J0VGFibGVDb25maWcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIC8vIDIuIGNk5YiwZXhlRmlsZeaJgOWcqOeahOebruW9lVxyXG4gICAgY29uc3QgZXhlUGF0aCA9IGRpcm5hbWUoY29uZmlnLmV4ZUZpbGUpO1xyXG4gICAgY29uc3QgZXhlTmFtZSA9IGJhc2VuYW1lKGNvbmZpZy5leGVGaWxlKTtcclxuXHJcbiAgICAvLyAzLiDmnoTlu7rlkb3ku6Tlj4LmlbBcclxuICAgIGNvbnN0IGFyZ3MgPSBbXHJcbiAgICAgICAgJy13b3JrX3BhdGgnLCBjb25maWcuZGF0YURpcixcclxuICAgICAgICAnLWNvZGVfcGF0aCcsIGNvbmZpZy50ZW1wRGlyLFxyXG4gICAgICAgICctY29kZV90eXBlJywgJ1R5cGVTY3JpcHQnLFxyXG4gICAgICAgICctZXhwb3J0X21vZGUnLCBjb25maWcuZXhwb3J0TW9kZSxcclxuICAgICAgICAnLWRlbGF5X2xvYWQnXHJcbiAgICBdO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGDmiafooYzlkb3ku6Q6ICR7ZXhlTmFtZX0gJHthcmdzLmpvaW4oJyAnKX1gKTtcclxuICAgIGNvbnNvbGUubG9nKGDlt6XkvZznm67lvZU6ICR7ZXhlUGF0aH1gKTtcclxuXHJcbiAgICAvLyA0LiDmiafooYzlkb3ku6TlubbnrYnlvoXlrozmiJBcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgLy8g5YiH5o2i5YiwZXhl5omA5Zyo55uu5b2VXHJcbiAgICAgICAgcHJvY2Vzcy5jaGRpcihleGVQYXRoKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2hpbGQgPSBzcGF3bihleGVOYW1lLCBhcmdzLCB7XHJcbiAgICAgICAgICAgIHN0ZGlvOiAncGlwZScsXHJcbiAgICAgICAgICAgIHdpbmRvd3NIaWRlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBzdGRvdXQgPSAnJztcclxuICAgICAgICBsZXQgc3RkZXJyID0gJyc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g5pS26ZuG6L6T5Ye6IC0g5L2/55SoIEdCSyDop6PnoIHkuK3mlodcclxuICAgICAgICBjaGlsZC5zdGRvdXQub24oJ2RhdGEnLCAoY2h1bms6IEJ1ZmZlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvdXRwdXQgPSBpY29udi5kZWNvZGUoY2h1bmssICdnYmsnKTtcclxuICAgICAgICAgICAgc3Rkb3V0ICs9IG91dHB1dDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cob3V0cHV0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBjaGlsZC5zdGRlcnIub24oJ2RhdGEnLCAoY2h1bms6IEJ1ZmZlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvdXRwdXQgPSBpY29udi5kZWNvZGUoY2h1bmssICdnYmsnKTtcclxuICAgICAgICAgICAgc3RkZXJyICs9IG91dHB1dDtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihvdXRwdXQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjaGlsZC5vbignZXJyb3InLCAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoYOaJp+ihjOaJk+ihqOW3peWFt+Wksei0pTogJHtlcnIubWVzc2FnZX1gKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNoaWxkLm9uKCdjbG9zZScsIChjb2RlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjb2RlID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn4pyFIOaJk+ihqOW3peWFt+aJp+ihjOaIkOWKnycpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg5omT6KGo5bel5YW35omn6KGM5aSx6LSl77yM6YCA5Ye65Luj56CBOiAke2NvZGV9XHJcbiR7c3RkZXJyfWApKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDlpI3liLbmlofku7bvvJrlsIZ0ZW1wRGly5LiL55qEanNvbuWkjeWItuWIsGV4cG9ydERhdGFEaXLvvIx0c+WkjeWItuWIsGNvZGVEaXLvvIjlvILmraXvvIlcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGNvcHlGaWxlcyhjb25maWc6IEV4cG9ydFRhYmxlQ29uZmlnKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xyXG4gICAgY29uc3QgY29waWVkRmlsZXM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgaWYgKCFleGlzdHNTeW5jKGNvbmZpZy50ZW1wRGlyKSkge1xyXG4gICAgICAgIGNvbnNvbGUud2Fybihg5Li05pe255uu5b2V5LiN5a2Y5ZyoOiAke2NvbmZpZy50ZW1wRGlyfWApO1xyXG4gICAgICAgIHJldHVybiBjb3BpZWRGaWxlcztcclxuICAgIH1cclxuXHJcbiAgICAvLyDnoa7kv53nm67moIfnm67lvZXlrZjlnKjvvIjlvILmraXvvIlcclxuICAgIGF3YWl0IGVuc3VyZURpcihjb25maWcuZXhwb3J0RGF0YURpcik7XHJcbiAgICBhd2FpdCBlbnN1cmVEaXIoY29uZmlnLmNvZGVEaXIpO1xyXG5cclxuICAgIC8vIOivu+WPluS4tOaXtuebruW9leS4i+eahOaJgOacieaWh+S7tlxyXG4gICAgY29uc3QgZmlsZXMgPSByZWFkZGlyU3luYyhjb25maWcudGVtcERpcik7XHJcblxyXG4gICAgLy8g5pS26ZuG5omA5pyJ5aSN5Yi25Lu75YqhXHJcbiAgICBjb25zdCBjb3B5VGFza3M6IFByb21pc2U8dm9pZD5bXSA9IFtdO1xyXG5cclxuICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xyXG4gICAgICAgIGNvbnN0IHNyY1BhdGggPSBqb2luKGNvbmZpZy50ZW1wRGlyLCBmaWxlKTtcclxuICAgICAgICBjb25zdCBzdGF0ID0gc3RhdFN5bmMoc3JjUGF0aCk7XHJcblxyXG4gICAgICAgIC8vIOWPquWkhOeQhuaWh+S7tu+8jOS4jeWkhOeQhuebruW9lVxyXG4gICAgICAgIGlmICghc3RhdC5pc0ZpbGUoKSkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGV4dCA9IGV4dG5hbWUoZmlsZSk7XHJcbiAgICAgICAgbGV0IGRlc3RQYXRoOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIC8vIDUuIGpzb27mlofku7blpI3liLbliLBleHBvcnREYXRhRGlyXHJcbiAgICAgICAgaWYgKGV4dCA9PT0gJy5qc29uJykge1xyXG4gICAgICAgICAgICBkZXN0UGF0aCA9IGpvaW4oY29uZmlnLmV4cG9ydERhdGFEaXIsIGZpbGUpO1xyXG4gICAgICAgICAgICBjb3BpZWRGaWxlcy5wdXNoKGRlc3RQYXRoKTtcclxuICAgICAgICAgICAgY29weVRhc2tzLnB1c2goXHJcbiAgICAgICAgICAgICAgICBjb3B5RmlsZShzcmNQYXRoLCBkZXN0UGF0aCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYOWkjeWItiBKU09OOiAke2ZpbGV9IC0+ICR7ZGVzdFBhdGh9YCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyA2LiB0c+aWh+S7tuWkjeWItuWIsGNvZGVEaXJcclxuICAgICAgICBlbHNlIGlmIChleHQgPT09ICcudHMnKSB7XHJcbiAgICAgICAgICAgIGRlc3RQYXRoID0gam9pbihjb25maWcuY29kZURpciwgZmlsZSk7XHJcbiAgICAgICAgICAgIGNvcGllZEZpbGVzLnB1c2goZGVzdFBhdGgpO1xyXG4gICAgICAgICAgICBjb3B5VGFza3MucHVzaChcclxuICAgICAgICAgICAgICAgIGNvcHlGaWxlKHNyY1BhdGgsIGRlc3RQYXRoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg5aSN5Yi2IFRTOiAke2ZpbGV9IC0+ICR7ZGVzdFBhdGh9YCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDnrYnlvoXmiYDmnInlpI3liLbku7vliqHlrozmiJBcclxuICAgIGF3YWl0IFByb21pc2UuYWxsKGNvcHlUYXNrcyk7XHJcblxyXG4gICAgY29uc29sZS5sb2coYOWFseWkjeWItiAke2NvcGllZEZpbGVzLmxlbmd0aH0g5Liq5paH5Lu2YCk7XHJcbiAgICByZXR1cm4gY29waWVkRmlsZXM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDojrflj5bmjIflrprmqKHlvI/kuIvnmoTooajlkI3liJfooahcclxuICogQHBhcmFtIGRhdGFEaXIg5pWw5o2u55uu5b2V77yI5YyF5ZCrIGNvbmZpZy5qc29u77yJXHJcbiAqIEBwYXJhbSBleHBvcnRNb2RlIOWvvOWHuuaooeW8j1xyXG4gKiBAcmV0dXJucyDooajlkI3liJfooahcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNb2RlVGFibGVOYW1lcyhkYXRhRGlyOiBzdHJpbmcsIGV4cG9ydE1vZGU6IHN0cmluZyk6IHN0cmluZ1tdIHwgdW5kZWZpbmVkIHtcclxuICAgIC8vIOajgOafpeaVsOaNruebruW9leaYr+WQpuWtmOWcqFxyXG4gICAgaWYgKCFkYXRhRGlyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignZGF0YURpciDmnKrorr7nva4nKTtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghZXhpc3RzU3luYyhkYXRhRGlyKSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYOaVsOaNruebruW9leS4jeWtmOWcqDogJHtkYXRhRGlyfWApO1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGFibGVDb25maWcgPSBqb2luKGRhdGFEaXIsICdjb25maWcuanNvbicpO1xyXG4gICAgXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCB0YWJsZU5hbWVzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIWV4aXN0c1N5bmModGFibGVDb25maWcpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGDooajmoLzphY3nva7mlofku7bkuI3lrZjlnKg6ICR7dGFibGVDb25maWd9YCk7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkYXRhID0gcmVhZEZpbGVTeW5jKHRhYmxlQ29uZmlnLCAndXRmLTgnKTtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICB0YWJsZU5hbWVzID0gW107XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZ09iaiA9IEpTT04ucGFyc2UoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAvLyDmo4Dmn6XphY3nva7nu5PmnoTmmK/lkKbmraPnoa5cclxuICAgICAgICAgICAgaWYgKCFjb25maWdPYmpbJ0V4cG9ydFNldHRpbmdzJ10gfHwgIWNvbmZpZ09ialsnRXhwb3J0U2V0dGluZ3MnXVtleHBvcnRNb2RlXSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihg6YWN572u5paH5Lu25Lit5LiN5a2Y5Zyo5a+85Ye65qih5byPOiAke2V4cG9ydE1vZGV9YCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0RXhwb3J0OiBib29sZWFuID0gY29uZmlnT2JqWydFeHBvcnRTZXR0aW5ncyddW2V4cG9ydE1vZGVdWydEZWZhdWx0RXhwb3J0VGFibGUnXTtcclxuICAgICAgICAgICAgY29uc3QgVHlwZUluZm9zID0gY29uZmlnT2JqWydFeHBvcnRTZXR0aW5ncyddW2V4cG9ydE1vZGVdWydUeXBlSW5mb3MnXTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGDpu5jorqTlr7zlh7ogPT09PiBtb2RlID09IFske2V4cG9ydE1vZGV9XSAtLS0tLS0tIGRlZmF1bHRFeHBvcnQ6ICR7ZGVmYXVsdEV4cG9ydH1gKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbmZpZ09ialsnVGFibGVzJ10pIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb25maWdPYmpbJ1RhYmxlcyddW2tleV1bJ05hbWUnXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWZhdWx0RXhwb3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOm7mOiupOWvvOWHuu+8mumZpOmdnuaYjuehruagh+iusOS4uuS4jeWvvOWHuu+8jOWQpuWImemDveWvvOWHulxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIVR5cGVJbmZvc1trZXldIHx8IFR5cGVJbmZvc1trZXldWydFeHBvcnRhYmxlJ10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlTmFtZXMucHVzaChjb25maWdPYmpbJ1RhYmxlcyddW2tleV1bJ05hbWUnXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDpnZ7pu5jorqTlr7zlh7rvvJrlj6rlr7zlh7rmmI7noa7moIforrDkuLrlj6/lr7zlh7rnmoRcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGVJbmZvc1trZXldICYmIFR5cGVJbmZvc1trZXldWydFeHBvcnRhYmxlJ10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlTmFtZXMucHVzaChjb25maWdPYmpbJ1RhYmxlcyddW2tleV1bJ05hbWUnXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coYOaJvuWIsCAke3RhYmxlTmFtZXM/Lmxlbmd0aCB8fCAwfSDkuKrooajmoLxgKTtcclxuICAgICAgICByZXR1cm4gdGFibGVOYW1lcztcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYOivu+WPluihqOagvOmFjee9ruWksei0pTpgLCBlcnIpO1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDnlJ/miJAgVGFibGVzIOeuoeeQhuexu+S7o+eggVxyXG4gKiBAcGFyYW0gdGFibGVOYW1lcyDooajlkI3liJfooahcclxuICogQHBhcmFtIG91dHB1dFBhdGgg6L6T5Ye65paH5Lu26Lev5b6E77yI5a6M5pW06Lev5b6E77yM5YyF5ZCr5paH5Lu25ZCN77yJXHJcbiAqIEByZXR1cm5zIOaYr+WQpuaIkOWKn1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdlblRhYmxlcyh0YWJsZU5hbWVzOiBzdHJpbmdbXSwgb3V0cHV0UGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoIXRhYmxlTmFtZXMgfHwgdGFibGVOYW1lcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ+ihqOWQjeWIl+ihqOS4uuepuu+8jOi3s+i/h+eUn+aIkCBUYWJsZXMnKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmICghb3V0cHV0UGF0aCkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ+i+k+WHuui3r+W+hOacquiuvue9ricpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBuYW1lcyA9IFwiXFxcclxuXCI7XHJcbiAgICAgICAgbGV0IGltcG9ydFN0ciA9IFwiXCI7XHJcbiAgICAgICAgbGV0IHJlZ2lzdGVyU3RyID0gXCJcIjtcclxuICAgICAgICBsZXQgZ2V0TWdyU3RyID0gXCJcIjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJsZU5hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhYmxlTmFtZSA9IHRhYmxlTmFtZXNbaV07XHJcbiAgICAgICAgICAgIG5hbWVzICs9IGAgICAgICAgIFwiJHsgdGFibGVOYW1lfVwiLFxcXHJcbmA7XHJcbiAgICAgICAgICAgIGltcG9ydFN0ciArPSB0YWJsZVRlbXBsZXRlLmltcG9ydFN0ci5yZXBsYWNlKC9cXHtcXHtuYW1lXFx9XFx9L2csIHRhYmxlTmFtZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRtcFN0ciA9IHRhYmxlVGVtcGxldGUucmVnaXN0ZXJTdHIucmVwbGFjZSgvXFx7XFx7bmFtZVxcfVxcfS9nLCB0YWJsZU5hbWUpO1xyXG4gICAgICAgICAgICByZWdpc3RlclN0ciArPSB0bXBTdHIucmVwbGFjZSgvXFx7XFx7aW5kZXhcXH1cXH0vZywgaS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgZ2V0TWdyU3RyICs9IHRhYmxlVGVtcGxldGUuZ2V0TWdyU3RyLnJlcGxhY2UoL1xce1xce25hbWVcXH1cXH0vZywgdGFibGVOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbmFtZXMgKz0gXCIgICAgXCI7XHJcblxyXG4gICAgICAgIGxldCB0YWJsZVRzID0gdGFibGVUZW1wbGV0ZS50YWJsZTtcclxuICAgICAgICBjb25zdCBwbGFjZWhvbGRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XHJcbiAgICAgICAgICAgICduYW1lc1N0cic6IG5hbWVzLFxyXG4gICAgICAgICAgICAnaW1wb3J0U3RyJzogaW1wb3J0U3RyLFxyXG4gICAgICAgICAgICAncmVnaXN0ZXJTdHInOiByZWdpc3RlclN0cixcclxuICAgICAgICAgICAgJ2dldE1nclN0cic6IGdldE1nclN0clxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHBsYWNlaG9sZGVycykpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBcXFxce1xcXFx7JHtrZXl9XFxcXH1cXFxcfWAsICdnJyk7XHJcbiAgICAgICAgICAgIHRhYmxlVHMgPSB0YWJsZVRzLnJlcGxhY2UocmVnZXgsIHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOehruS/nei+k+WHuuebruW9leWtmOWcqFxyXG4gICAgICAgIGVuc3VyZURpclN5bmMoZGlybmFtZShvdXRwdXRQYXRoKSk7XHJcbiAgICAgICAgd3JpdGVGaWxlU3luYyhvdXRwdXRQYXRoLCB0YWJsZVRzLCAndXRmLTgnKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhg4pyFIFtnZW5UYWJsZXNdIOeUn+aIkOaIkOWKnyA9PT4gJHtvdXRwdXRQYXRofWApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGAgICDljIXlkKsgJHt0YWJsZU5hbWVzLmxlbmd0aH0g5Liq6KGo5qC8566h55CG5ZmoYCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCfinYwgW2dlblRhYmxlc10g55Sf5oiQ5aSx6LSlOicsIGVycik7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==