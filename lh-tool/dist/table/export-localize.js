"use strict";
// 1: 在dataDir目录下有一个LocalizeTable.xlsx表格
// 2：LocalizeTable.xlsx表格有"LocalizeTable-Lang", "clientLang"两个sheet
// 3：每个sheet的格式都是一样的，第一行是备注，无实际意义，第二行是字段名
// 4：第二行的第二列，是多语言的key，第二列之后，如果有内容，就代表这一列是有效的语言版本
// 5：从第三行开始，每一行都是一条多语言，第二列是key值，后面的每一列都是一个语言版本对应的多语言内容
// 6：解析表格并生成json，有几个语言版本，就生成几个json。json名用表格第二行第二列之后获取到的语言版本内容命名
// 7：生成的格式，参考./zh.json
// 8：生成的文件，放到配置的langDir目录下
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
exports.exportLocalize = exportLocalize;
const XLSX = __importStar(require("xlsx"));
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
/**
 * 从配置文件读取配置
 */
function loadConfigFromFile() {
    try {
        const extensionRoot = (0, path_1.resolve)(__dirname, '../../');
        const configPath = (0, path_1.join)(extensionRoot, 'tool/config/config.json');
        if (!(0, fs_extra_1.existsSync)(configPath)) {
            throw new Error('配置文件不存在，请先在面板中配置');
        }
        const configContent = (0, fs_extra_1.readFileSync)(configPath, 'utf-8');
        return JSON.parse(configContent);
    }
    catch (error) {
        throw new Error(`读取配置失败: ${error.message}`);
    }
}
/**
 * 导出多语言
 * @param config 可选配置，如果不传则从配置文件读取
 */
function exportLocalize(config) {
    try {
        // 如果没有传入配置，从配置文件读取
        const fileConfig = config ? {} : loadConfigFromFile();
        // 合并配置：传入的参数优先级更高
        const finalConfig = Object.assign(Object.assign({}, fileConfig), config);
        const { dataDir, langDir, formatEnabled: format = false } = finalConfig;
        // 检查必需的配置
        if (!dataDir) {
            return { success: false, message: '请先配置表格数据目录' };
        }
        if (!langDir) {
            return { success: false, message: '请先配置导出多语言目录' };
        }
        // 检查数据目录
        if (!(0, fs_extra_1.existsSync)(dataDir)) {
            return { success: false, message: `数据目录不存在: ${dataDir}` };
        }
        // 检查Excel文件
        const excelPath = (0, path_1.join)(dataDir, 'LocalizeTable.xlsx');
        if (!(0, fs_extra_1.existsSync)(excelPath)) {
            return { success: false, message: `多语言表格不存在: ${excelPath}` };
        }
        // 读取Excel文件
        const workbook = XLSX.readFile(excelPath);
        // 要处理的sheet列表
        const sheetNames = ['LocalizeTable-Lang', 'clientLang'];
        // 用于合并所有sheet的数据，key是语言名称，value是多语言数据
        const allLanguageData = new Map();
        // 处理每个sheet
        for (const sheetName of sheetNames) {
            if (!workbook.SheetNames.includes(sheetName)) {
                console.warn(`Sheet "${sheetName}" 不存在，跳过`);
                continue;
            }
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            if (jsonData.length < 3) {
                console.warn(`Sheet "${sheetName}" 数据不足，跳过`);
                continue;
            }
            // 第二行是字段名，获取语言版本列
            const headerRow = jsonData[1];
            const languageColumns = [];
            // 从第二列之后开始查找语言版本
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
                const localizeData = allLanguageData.get(langCol.name);
                // 从第三行开始读取数据
                for (let rowIndex = 2; rowIndex < jsonData.length; rowIndex++) {
                    const row = jsonData[rowIndex];
                    // 第二列是key (索引1)
                    const key = row[1];
                    // 对应语言版本的内容
                    const value = row[langCol.index];
                    // 只有key和value都存在时才添加/更新
                    if (key && key.toString().trim()) {
                        const keyStr = key.toString().trim();
                        const valueStr = value ? value.toString() : '';
                        localizeData[keyStr] = valueStr;
                    }
                }
                console.log(`从 Sheet "${sheetName}" 读取 ${langCol.name} 语言数据`);
            }
        }
        // 确保输出目录存在
        (0, fs_extra_1.ensureDirSync)(langDir);
        // 写入所有语言的JSON文件
        const exportedFiles = [];
        for (const [langName, localizeData] of allLanguageData) {
            const outputPath = (0, path_1.join)(langDir, `${langName}.json`);
            const jsonContent = format
                ? JSON.stringify(localizeData, null, 4)
                : JSON.stringify(localizeData);
            (0, fs_extra_1.writeFileSync)(outputPath, jsonContent, 'utf-8');
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
    }
    catch (error) {
        console.error('导出多语言失败:', error);
        return {
            success: false,
            message: `导出多语言失败: ${error.message}`
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LWxvY2FsaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL3RhYmxlL2V4cG9ydC1sb2NhbGl6ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0NBQXdDO0FBQ3hDLG1FQUFtRTtBQUNuRSx5Q0FBeUM7QUFDekMsZ0RBQWdEO0FBQ2hELHNEQUFzRDtBQUN0RCwrREFBK0Q7QUFDL0Qsc0JBQXNCO0FBQ3RCLDBCQUEwQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2QzFCLHdDQXlJQztBQXBMRCwyQ0FBNkI7QUFDN0IsK0JBQXFDO0FBQ3JDLHVDQUFrRjtBQWtCbEY7O0dBRUc7QUFDSCxTQUFTLGtCQUFrQjtJQUN2QixJQUFJLENBQUM7UUFDRCxNQUFNLGFBQWEsR0FBRyxJQUFBLGNBQU8sRUFBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbkQsTUFBTSxVQUFVLEdBQUcsSUFBQSxXQUFJLEVBQUMsYUFBYSxFQUFFLHlCQUF5QixDQUFDLENBQUM7UUFFbEUsSUFBSSxDQUFDLElBQUEscUJBQVUsRUFBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1lBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBRUQsTUFBTSxhQUFhLEdBQUcsSUFBQSx1QkFBWSxFQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7UUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELENBQUM7QUFDTCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0IsY0FBYyxDQUFDLE1BQTZCO0lBQ3hELElBQUksQ0FBQztRQUNELG1CQUFtQjtRQUNuQixNQUFN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QUFPO1lBQ0gsT0FBTyxFQUFFLElBQUk7WUFDYixPQUFPLEVBQUUsUUFBUSxhQUFhLENBQUMsTUFBTSxTQUFTO1lBQzlDLEtBQUssRUFBRSxhQUFhO1NBQ3ZCLENBQUM7SUFFTixDQUFDO0lBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztRQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqQyxPQUFPO1lBQ0gsT0FBTyxFQUFFLEtBQUs7WUFDZCxPQUFPLEVBQUUsWUFBWSxLQUFLLENBQUMsT0FBTyxFQUFFO1NBQ3ZDLENBQUM7SUFDTixDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIDE6IOWcqGRhdGFEaXLnm67lvZXkuIvmnInkuIDkuKpMb2NhbGl6ZVRhYmxlLnhsc3jooajmoLxcclxuLy8gMu+8mkxvY2FsaXplVGFibGUueGxzeOihqOagvOaciVwiTG9jYWxpemVUYWJsZS1MYW5nXCIsIFwiY2xpZW50TGFuZ1wi5Lik5Liqc2hlZXRcclxuLy8gM++8muavj+S4qnNoZWV055qE5qC85byP6YO95piv5LiA5qC355qE77yM56ys5LiA6KGM5piv5aSH5rOo77yM5peg5a6e6ZmF5oSP5LmJ77yM56ys5LqM6KGM5piv5a2X5q615ZCNXHJcbi8vIDTvvJrnrKzkuozooYznmoTnrKzkuozliJfvvIzmmK/lpJror63oqIDnmoRrZXnvvIznrKzkuozliJfkuYvlkI7vvIzlpoLmnpzmnInlhoXlrrnvvIzlsLHku6Pooajov5nkuIDliJfmmK/mnInmlYjnmoTor63oqIDniYjmnKxcclxuLy8gNe+8muS7juesrOS4ieihjOW8gOWni++8jOavj+S4gOihjOmDveaYr+S4gOadoeWkmuivreiogO+8jOesrOS6jOWIl+aYr2tleeWAvO+8jOWQjumdoueahOavj+S4gOWIl+mDveaYr+S4gOS4quivreiogOeJiOacrOWvueW6lOeahOWkmuivreiogOWGheWuuVxyXG4vLyA277ya6Kej5p6Q6KGo5qC85bm255Sf5oiQanNvbu+8jOacieWHoOS4quivreiogOeJiOacrO+8jOWwseeUn+aIkOWHoOS4qmpzb27jgIJqc29u5ZCN55So6KGo5qC856ys5LqM6KGM56ys5LqM5YiX5LmL5ZCO6I635Y+W5Yiw55qE6K+t6KiA54mI5pys5YaF5a655ZG95ZCNXHJcbi8vIDfvvJrnlJ/miJDnmoTmoLzlvI/vvIzlj4LogIMuL3poLmpzb25cclxuLy8gOO+8mueUn+aIkOeahOaWh+S7tu+8jOaUvuWIsOmFjee9rueahGxhbmdEaXLnm67lvZXkuItcclxuXHJcbmltcG9ydCAqIGFzIFhMU1ggZnJvbSAneGxzeCc7XHJcbmltcG9ydCB7IGpvaW4sIHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgcmVhZEZpbGVTeW5jLCB3cml0ZUZpbGVTeW5jLCBleGlzdHNTeW5jLCBlbnN1cmVEaXJTeW5jIH0gZnJvbSAnZnMtZXh0cmEnO1xyXG5cclxuLyoqXHJcbiAqIOWkmuivreiogOaVsOaNrue7k+aehFxyXG4gKi9cclxuaW50ZXJmYWNlIExvY2FsaXplRGF0YSB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDlr7zlh7rlpJror63oqIDphY3nva5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0TG9jYWxpemVDb25maWcge1xyXG4gICAgZGF0YURpcj86IHN0cmluZzsgICAgICAgLy8g6KGo5qC85pWw5o2u55uu5b2VXHJcbiAgICBsYW5nRGlyPzogc3RyaW5nOyAgICAgICAvLyDlr7zlh7rlpJror63oqIDnm67lvZVcclxuICAgIGZvcm1hdEVuYWJsZWQ/OiBib29sZWFuOyAvLyDmmK/lkKbmoLzlvI/ljJZKU09OXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDku47phY3nva7mlofku7bor7vlj5bphY3nva5cclxuICovXHJcbmZ1bmN0aW9uIGxvYWRDb25maWdGcm9tRmlsZSgpOiBhbnkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBleHRlbnNpb25Sb290ID0gcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi8nKTtcclxuICAgICAgICBjb25zdCBjb25maWdQYXRoID0gam9pbihleHRlbnNpb25Sb290LCAndG9vbC9jb25maWcvY29uZmlnLmpzb24nKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIWV4aXN0c1N5bmMoY29uZmlnUGF0aCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCfphY3nva7mlofku7bkuI3lrZjlnKjvvIzor7flhYjlnKjpnaLmnb/kuK3phY3nva4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY29uZmlnQ29udGVudCA9IHJlYWRGaWxlU3luYyhjb25maWdQYXRoLCAndXRmLTgnKTtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShjb25maWdDb250ZW50KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOivu+WPlumFjee9ruWksei0pTogJHtlcnJvci5tZXNzYWdlfWApO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog5a+85Ye65aSa6K+t6KiAXHJcbiAqIEBwYXJhbSBjb25maWcg5Y+v6YCJ6YWN572u77yM5aaC5p6c5LiN5Lyg5YiZ5LuO6YWN572u5paH5Lu26K+75Y+WXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0TG9jYWxpemUoY29uZmlnPzogRXhwb3J0TG9jYWxpemVDb25maWcpOiB7IHN1Y2Nlc3M6IGJvb2xlYW47IG1lc3NhZ2U6IHN0cmluZzsgZmlsZXM/OiBzdHJpbmdbXSB9IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgLy8g5aaC5p6c5rKh5pyJ5Lyg5YWl6YWN572u77yM5LuO6YWN572u5paH5Lu26K+75Y+WXHJcbiAgICAgICAgY29uc3QgZmlsZUNvbmZpZyA9IGNvbmZpZyA/IHt9IDogbG9hZENvbmZpZ0Zyb21GaWxlKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g5ZCI5bm26YWN572u77ya5Lyg5YWl55qE5Y+C5pWw5LyY5YWI57qn5pu06auYXHJcbiAgICAgICAgY29uc3QgZmluYWxDb25maWcgPSB7XHJcbiAgICAgICAgICAgIC4uLmZpbGVDb25maWcsXHJcbiAgICAgICAgICAgIC4uLmNvbmZpZ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgeyBkYXRhRGlyLCBsYW5nRGlyLCBmb3JtYXRFbmFibGVkOiBmb3JtYXQgPSBmYWxzZSB9ID0gZmluYWxDb25maWc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g5qOA5p+l5b+F6ZyA55qE6YWN572uXHJcbiAgICAgICAgaWYgKCFkYXRhRGlyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiAn6K+35YWI6YWN572u6KGo5qC85pWw5o2u55uu5b2VJyB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWxhbmdEaXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICfor7flhYjphY3nva7lr7zlh7rlpJror63oqIDnm67lvZUnIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDmo4Dmn6XmlbDmja7nm67lvZVcclxuICAgICAgICBpZiAoIWV4aXN0c1N5bmMoZGF0YURpcikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6IGDmlbDmja7nm67lvZXkuI3lrZjlnKg6ICR7ZGF0YURpcn1gIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDmo4Dmn6VFeGNlbOaWh+S7tlxyXG4gICAgICAgIGNvbnN0IGV4Y2VsUGF0aCA9IGpvaW4oZGF0YURpciwgJ0xvY2FsaXplVGFibGUueGxzeCcpO1xyXG4gICAgICAgIGlmICghZXhpc3RzU3luYyhleGNlbFBhdGgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiBg5aSa6K+t6KiA6KGo5qC85LiN5a2Y5ZyoOiAke2V4Y2VsUGF0aH1gIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDor7vlj5ZFeGNlbOaWh+S7tlxyXG4gICAgICAgIGNvbnN0IHdvcmtib29rID0gWExTWC5yZWFkRmlsZShleGNlbFBhdGgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOimgeWkhOeQhueahHNoZWV05YiX6KGoXHJcbiAgICAgICAgY29uc3Qgc2hlZXROYW1lcyA9IFsnTG9jYWxpemVUYWJsZS1MYW5nJywgJ2NsaWVudExhbmcnXTtcclxuICAgICAgICBcclxuICAgICAgICAvLyDnlKjkuo7lkIjlubbmiYDmnIlzaGVldOeahOaVsOaNru+8jGtleeaYr+ivreiogOWQjeensO+8jHZhbHVl5piv5aSa6K+t6KiA5pWw5o2uXHJcbiAgICAgICAgY29uc3QgYWxsTGFuZ3VhZ2VEYXRhOiBNYXA8c3RyaW5nLCBMb2NhbGl6ZURhdGE+ID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOWkhOeQhuavj+S4qnNoZWV0XHJcbiAgICAgICAgZm9yIChjb25zdCBzaGVldE5hbWUgb2Ygc2hlZXROYW1lcykge1xyXG4gICAgICAgICAgICBpZiAoIXdvcmtib29rLlNoZWV0TmFtZXMuaW5jbHVkZXMoc2hlZXROYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBTaGVldCBcIiR7c2hlZXROYW1lfVwiIOS4jeWtmOWcqO+8jOi3s+i/h2ApO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHdvcmtzaGVldCA9IHdvcmtib29rLlNoZWV0c1tzaGVldE5hbWVdO1xyXG4gICAgICAgICAgICBjb25zdCBqc29uRGF0YSA9IFhMU1gudXRpbHMuc2hlZXRfdG9fanNvbih3b3Jrc2hlZXQsIHsgaGVhZGVyOiAxIH0pIGFzIGFueVtdW107XHJcblxyXG4gICAgICAgICAgICBpZiAoanNvbkRhdGEubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBTaGVldCBcIiR7c2hlZXROYW1lfVwiIOaVsOaNruS4jei2s++8jOi3s+i/h2ApO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOesrOS6jOihjOaYr+Wtl+auteWQje+8jOiOt+WPluivreiogOeJiOacrOWIl1xyXG4gICAgICAgICAgICBjb25zdCBoZWFkZXJSb3cgPSBqc29uRGF0YVsxXTtcclxuICAgICAgICAgICAgY29uc3QgbGFuZ3VhZ2VDb2x1bW5zOiB7IGluZGV4OiBudW1iZXI7IG5hbWU6IHN0cmluZyB9W10gPSBbXTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIOS7juesrOS6jOWIl+S5i+WQjuW8gOWni+afpeaJvuivreiogOeJiOacrFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMjsgaSA8IGhlYWRlclJvdy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGFuZ05hbWUgPSBoZWFkZXJSb3dbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAobGFuZ05hbWUgJiYgbGFuZ05hbWUudG9TdHJpbmcoKS50cmltKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZUNvbHVtbnMucHVzaCh7IGluZGV4OiBpLCBuYW1lOiBsYW5nTmFtZS50b1N0cmluZygpLnRyaW0oKSB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGxhbmd1YWdlQ29sdW1ucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgU2hlZXQgXCIke3NoZWV0TmFtZX1cIiDmsqHmnInmib7liLDor63oqIDniYjmnKzliJfvvIzot7Pov4dgKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDkuLrmr4/kuKror63oqIDniYjmnKzmlLbpm4bmlbDmja5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBsYW5nQ29sIG9mIGxhbmd1YWdlQ29sdW1ucykge1xyXG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c6K+l6K+t6KiA6L+Y5rKh5pyJ5pWw5o2u77yM5Yib5bu65LiA5Liq56m65a+56LGhXHJcbiAgICAgICAgICAgICAgICBpZiAoIWFsbExhbmd1YWdlRGF0YS5oYXMobGFuZ0NvbC5uYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbExhbmd1YWdlRGF0YS5zZXQobGFuZ0NvbC5uYW1lLCB7fSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsaXplRGF0YSA9IGFsbExhbmd1YWdlRGF0YS5nZXQobGFuZ0NvbC5uYW1lKSE7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g5LuO56ys5LiJ6KGM5byA5aeL6K+75Y+W5pWw5o2uXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCByb3dJbmRleCA9IDI7IHJvd0luZGV4IDwganNvbkRhdGEubGVuZ3RoOyByb3dJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm93ID0ganNvbkRhdGFbcm93SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOesrOS6jOWIl+aYr2tleSAo57Si5byVMSlcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSByb3dbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5a+55bqU6K+t6KiA54mI5pys55qE5YaF5a65XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSByb3dbbGFuZ0NvbC5pbmRleF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWPquaciWtleeWSjHZhbHVl6YO95a2Y5Zyo5pe25omN5re75YqgL+abtOaWsFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgJiYga2V5LnRvU3RyaW5nKCkudHJpbSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleVN0ciA9IGtleS50b1N0cmluZygpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWVTdHIgPSB2YWx1ZSA/IHZhbHVlLnRvU3RyaW5nKCkgOiAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxpemVEYXRhW2tleVN0cl0gPSB2YWx1ZVN0cjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDku44gU2hlZXQgXCIke3NoZWV0TmFtZX1cIiDor7vlj5YgJHtsYW5nQ29sLm5hbWV9IOivreiogOaVsOaNrmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDnoa7kv53ovpPlh7rnm67lvZXlrZjlnKhcclxuICAgICAgICBlbnN1cmVEaXJTeW5jKGxhbmdEaXIpO1xyXG5cclxuICAgICAgICAvLyDlhpnlhaXmiYDmnInor63oqIDnmoRKU09O5paH5Lu2XHJcbiAgICAgICAgY29uc3QgZXhwb3J0ZWRGaWxlczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IFtsYW5nTmFtZSwgbG9jYWxpemVEYXRhXSBvZiBhbGxMYW5ndWFnZURhdGEpIHtcclxuICAgICAgICAgICAgY29uc3Qgb3V0cHV0UGF0aCA9IGpvaW4obGFuZ0RpciwgYCR7bGFuZ05hbWV9Lmpzb25gKTtcclxuICAgICAgICAgICAgY29uc3QganNvbkNvbnRlbnQgPSBmb3JtYXQgXHJcbiAgICAgICAgICAgICAgICA/IEpTT04uc3RyaW5naWZ5KGxvY2FsaXplRGF0YSwgbnVsbCwgNClcclxuICAgICAgICAgICAgICAgIDogSlNPTi5zdHJpbmdpZnkobG9jYWxpemVEYXRhKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdyaXRlRmlsZVN5bmMob3V0cHV0UGF0aCwganNvbkNvbnRlbnQsICd1dGYtOCcpO1xyXG4gICAgICAgICAgICBleHBvcnRlZEZpbGVzLnB1c2gob3V0cHV0UGF0aCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhg5a+85Ye65aSa6K+t6KiAOiAke2xhbmdOYW1lfS5qc29uICgke09iamVjdC5rZXlzKGxvY2FsaXplRGF0YSkubGVuZ3RofSDmnaEpYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXhwb3J0ZWRGaWxlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICfmsqHmnInlr7zlh7rku7vkvZXlpJror63oqIDmlofku7YnIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSwgXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGDmiJDlip/lr7zlh7ogJHtleHBvcnRlZEZpbGVzLmxlbmd0aH0g5Liq5aSa6K+t6KiA5paH5Lu2YCxcclxuICAgICAgICAgICAgZmlsZXM6IGV4cG9ydGVkRmlsZXNcclxuICAgICAgICB9O1xyXG5cclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCflr7zlh7rlpJror63oqIDlpLHotKU6JywgZXJyb3IpO1xyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSwgXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGDlr7zlh7rlpJror63oqIDlpLHotKU6ICR7ZXJyb3IubWVzc2FnZX1gIFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0iXX0=