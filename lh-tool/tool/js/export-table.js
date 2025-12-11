// 导出表格工具脚本
const path = require('path');
const fs = require('fs-extra');

// 获取扩展根目录（从 tool/js/ 向上两级）
const extensionRoot = path.resolve(__dirname, '../../');

// 切换到扩展根目录
process.chdir(extensionRoot);

console.log('扩展根目录:', extensionRoot);
console.log('');

// 解析命令行参数
const args = process.argv.slice(2);
const cmdConfig = {};

for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--exeFile' && i + 1 < args.length) {
        cmdConfig.exeFile = args[++i];
    } else if (arg === '--dataDir' && i + 1 < args.length) {
        cmdConfig.dataDir = args[++i];
    } else if (arg === '--codeDir' && i + 1 < args.length) {
        cmdConfig.codeDir = args[++i];
    } else if (arg === '--exportDataDir' && i + 1 < args.length) {
        cmdConfig.exportDataDir = args[++i];
    } else if (arg === '--tempDir' && i + 1 < args.length) {
        cmdConfig.tempDir = args[++i];
    } else if (arg === '--exportMode' && i + 1 < args.length) {
        cmdConfig.exportMode = args[++i];
    } else if (arg === '--only-use-bat-config' && i + 1 < args.length) {
        cmdConfig.onlyUseBatConfig = args[++i] === 'true';
    }
}

// 读取配置文件
const configPath = path.join(extensionRoot, 'tool/config/config.json');
let fileConfig = {};
if (!cmdConfig.onlyUseBatConfig && fs.existsSync(configPath)) {
    try {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        fileConfig = JSON.parse(configContent);
    } catch (error) {
        console.warn('读取配置文件失败:', error.message);
    }
}

// 合并配置：命令行参数优先级高于配置文件
const finalConfig = {
    ...fileConfig,
    ...cmdConfig
};

console.log('使用的配置:');
console.log('  - 打表工具:', finalConfig.exeFile || '(未配置)');
console.log('  - 表格数据目录:', finalConfig.dataDir || '(未配置)');
console.log('  - 导出代码目录:', finalConfig.codeDir || '(未配置)');
console.log('  - 导出数据目录:', finalConfig.exportDataDir || '(未配置)');
console.log('  - 临时目录:', finalConfig.tempDir || '(未配置)');
console.log('  - 导出模式:', finalConfig.exportMode || '(未配置)');
console.log('');

// 加载导出表格模块（使用绝对路径）
const exportTableModule = path.join(extensionRoot, 'dist/table/export-table');
const { exportTable } = require(exportTableModule);

// 执行导出
async function main() {
    try {
        const result = await exportTable(finalConfig);
        
        console.log('');
        console.log('========== 结果 ==========');
        console.log(result.success ? '✅ 成功' : '❌ 失败');
        console.log('消息:', result.message);

        if (result.files) {
            console.log('文件:');
            result.files.forEach(f => console.log('  -', f));
        }

        // 设置退出码
        process.exit(result.success ? 0 : 1);
    } catch (error) {
        console.error('导出表格失败:', error.message);
        process.exit(1);
    }
}

// 执行主函数
main();