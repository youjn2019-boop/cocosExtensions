// 导出多语言工具脚本
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
    if (arg === '--dataDir' && i + 1 < args.length) {
        cmdConfig.dataDir = args[++i];
    } else if (arg === '--langDir' && i + 1 < args.length) {
        cmdConfig.langDir = args[++i];
    } else if (arg === '--format' && i + 1 < args.length) {
        cmdConfig.formatEnabled = args[++i] === 'true';
    }
}

// 读取配置文件
const configPath = path.join(extensionRoot, 'tool/config/config.json');
let fileConfig = {};
if (fs.existsSync(configPath)) {
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
console.log('  - 表格数据目录:', finalConfig.dataDir || '(未配置)');
console.log('  - 导出多语言目录:', finalConfig.langDir || '(未配置)');
console.log('  - 是否格式化:', finalConfig.formatEnabled ? '是' : '否');
console.log('');

// 加载导出多语言模块（使用绝对路径）
const exportLocalizeModule = path.join(extensionRoot, 'dist/table/export-localize');
const { exportLocalize } = require(exportLocalizeModule);

// 执行导出，直接传入配置参数
const result = exportLocalize(finalConfig);

// 输出结果
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
