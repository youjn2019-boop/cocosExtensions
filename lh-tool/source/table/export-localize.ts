// 1: 在dataDir目录下有一个LocalizeTable.xlsx表格
// 2：LocalizeTable.xlsx表格有"LocalizeTable-Lang", "clientLang"两个sheet
// 3：每个sheet的格式都是一样的，第一行是备注，无实际意义，第二行是字段名
// 4：第二行的第二列，是多语言的key，第二列之后，如果有内容，就代表这一列是有效的语言版本
// 5：从第三行开始，每一行都是一条多语言，第二列是key值，后面的每一列都是一个语言版本对应的多语言内容
// 6：解析表格并生成json，有几个语言版本，就生成几个json。json名用表格第二行第二列之后获取到的语言版本内容命名
// 7：生成的格式，参考./zh.json
// 8：生成的文件，放到配置的langDir目录下

import * as XLSX from 'xlsx';
import { join, resolve } from 'path';
import { readFileSync, writeFileSync, existsSync, ensureDirSync } from 'fs-extra';

/**
 * 多语言数据结构
 */
interface LocalizeData {
    [key: string]: string;
}

/**
 * 导出多语言配置
 */
export interface ExportLocalizeConfig {
    dataDir?: string;       // 表格数据目录
    langDir?: string;       // 导出多语言目录
    formatEnabled?: boolean; // 是否格式化JSON
}

/**
 * 从配置文件读取配置
 */
function loadConfigFromFile(): any {
    try {
        const extensionRoot = resolve(__dirname, '../../');
        const configPath = join(extensionRoot, 'tool/config/config.json');
        
        if (!existsSync(configPath)) {
            throw new Error('配置文件不存在，请先在面板中配置');
        }
        
        const configContent = readFileSync(configPath, 'utf-8');
        return JSON.parse(configContent);
    } catch (error: any) {
        throw new Error(`读取配置失败: ${error.message}`);
    }
}

/**
 * 导出多语言
 * @param config 可选配置，如果不传则从配置文件读取
 */
export function exportLocalize(config?: ExportLocalizeConfig): { success: boolean; message: string; files?: string[] } {
    try {
        // 如果没有传入配置，从配置文件读取
        const fileConfig = config ? {} : loadConfigFromFile();
        
        // 合并配置：传入的参数优先级更高
        const finalConfig = {
            ...fileConfig,
            ...config
        };
        
        const { dataDir, langDir, formatEnabled: format = false } = finalConfig;
        
        // 检查必需的配置
        if (!dataDir) {
            return { success: false, message: '请先配置表格数据目录' };
        }
        if (!langDir) {
            return { success: false, message: '请先配置导出多语言目录' };
        }

        // 检查数据目录
        if (!existsSync(dataDir)) {
            return { success: false, message: `数据目录不存在: ${dataDir}` };
        }

        // 检查Excel文件
        const excelPath = join(dataDir, 'LocalizeTable.xlsx');
        if (!existsSync(excelPath)) {
            return { success: false, message: `多语言表格不存在: ${excelPath}` };
        }

        // 读取Excel文件
        const workbook = XLSX.readFile(excelPath);
        
        // 要处理的sheet列表
        const sheetNames = ['LocalizeTable-Lang', 'clientLang'];
        
        // 用于合并所有sheet的数据，key是语言名称，value是多语言数据
        const allLanguageData: Map<string, LocalizeData> = new Map();
        
        // 处理每个sheet
        for (const sheetName of sheetNames) {
            if (!workbook.SheetNames.includes(sheetName)) {
                console.warn(`Sheet "${sheetName}" 不存在，跳过`);
                continue;
            }

            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

            if (jsonData.length < 3) {
                console.warn(`Sheet "${sheetName}" 数据不足，跳过`);
                continue;
            }

            // 第二行是字段名，获取语言版本列
            const headerRow = jsonData[1];
            const languageColumns: { index: number; name: string }[] = [];
            let defaultColumnIndex: number = -1; // 默认值列索引
            
            // 从第三列开始查找语言版本（索引2）
            // 如果第三列（索引2）没有key值，则作为默认值列
            if (headerRow.length > 2) {
                const thirdColumnKey = headerRow[2];
                if (!thirdColumnKey || !thirdColumnKey.toString().trim()) {
                    defaultColumnIndex = 2;
                    console.log(`Sheet "${sheetName}" 第三列作为默认值列`);
                }
            }
            
            // 从第三列之后开始查找语言版本
            for (let i = 2; i < headerRow.length; i++) {
                const langName = headerRow[i];
                if (langName && langName.toString().trim()) {
                    languageColumns.push({ index: i, name: langName.toString().trim() });
                }
            }

            if (languageColumns.length === 0) {
                console.warn(`Sheet "${sheetName}" 没有找到语言版本列，跳过`);
                continue;
            }

            // 为每个语言版本收集数据
            for (const langCol of languageColumns) {
                // 如果该语言还没有数据，创建一个空对象
                if (!allLanguageData.has(langCol.name)) {
                    allLanguageData.set(langCol.name, {});
                }
                
                const localizeData = allLanguageData.get(langCol.name)!;

                // 从第三行开始读取数据
                for (let rowIndex = 2; rowIndex < jsonData.length; rowIndex++) {
                    const row = jsonData[rowIndex];
                    
                    // 第二列是key (索引1)
                    const key = row[1];
                    if (!key || !key.toString().trim()) {
                        continue; // key为空则跳过
                    }
                    
                    const keyStr = key.toString().trim();
                    
                    // 对应语言版本的内容
                    let value = row[langCol.index];
                    
                    // 如果value为空且存在默认值列，使用默认值
                    if ((value === undefined || value === null || value.toString().trim() === '') && defaultColumnIndex !== -1) {
                        value = row[defaultColumnIndex];
                    }
                    
                    // 只有key和value都存在时才添加（value不trim，保留原始空格）
                    if (value !== undefined && value !== null && value.toString() !== '') {
                        const valueStr = value.toString(); // 不trim，保留原始空格
                        localizeData[keyStr] = valueStr;
                    }
                }
                
                console.log(`从 Sheet "${sheetName}" 读取 ${langCol.name} 语言数据`);
            }
        }

        // 确保输出目录存在
        ensureDirSync(langDir);

        // 写入所有语言的JSON文件
        const exportedFiles: string[] = [];
        for (const [langName, localizeData] of allLanguageData) {
            const outputPath = join(langDir, `${langName}.json`);
            const jsonContent = format 
                ? JSON.stringify(localizeData, null, 4)
                : JSON.stringify(localizeData);
            
            writeFileSync(outputPath, jsonContent, 'utf-8');
            exportedFiles.push(outputPath);
            
            console.log(`导出多语言: ${langName}.json (${Object.keys(localizeData).length} 条)`);
        }

        if (exportedFiles.length === 0) {
            return { success: false, message: '没有导出任何多语言文件' };
        }

        return { 
            success: true, 
            message: `成功导出 ${exportedFiles.length} 个多语言文件`,
            files: exportedFiles
        };

    } catch (error: any) {
        console.error('导出多语言失败:', error);
        return { 
            success: false, 
            message: `导出多语言失败: ${error.message}` 
        };
    }
}