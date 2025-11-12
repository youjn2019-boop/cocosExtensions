const { resolve } = require('path');
const { ProtoGenerator } = require('../../dist/proto/proto-generator');

/**
 * 协议生成脚本
 * 
 * 用法:
 * node gen-proto.js <inputPath> <outputDir> [dtsFileName] [jsFileName]
 * 
 * 参数:
 * - inputPath: 源 JSON 文件路径（必需）
 * - outputDir: 输出目录路径（必需）
 * - dtsFileName: TypeScript 声明文件名（可选，默认 'proto.d.ts'）
 * - jsFileName: JavaScript 实现文件名（可选，默认 'proto.js'）
 * 
 * 示例:
 * node gen-proto.js ../../test-data/testProto/testData.json ../../output/proto
 * node gen-proto.js ../../test-data/testProto/testData.json ../../output/proto custom.d.ts custom.js
 */

// 获取命令行参数
const args = process.argv.slice(2);

if (args.length < 2) {
    console.error('❌ 参数错误！');
    console.error('用法: node gen-proto.js <inputPath> <outputDir> [dtsFileName] [jsFileName]');
    console.error('');
    console.error('参数说明:');
    console.error('  inputPath   - 源 JSON 文件路径（必需）');
    console.error('  outputDir   - 输出目录路径（必需）');
    console.error('  dtsFileName - TypeScript 声明文件名（可选，默认 proto.d.ts）');
    console.error('  jsFileName  - JavaScript 实现文件名（可选，默认 proto.js）');
    console.error('');
    console.error('示例:');
    console.error('  node gen-proto.js ../../test-data/testProto/testData.json ../../output/proto');
    console.error('  node gen-proto.js data.json output custom.d.ts custom.js');
    process.exit(1);
}

// 解析参数
const inputPath = resolve(args[0]);
const outputDir = resolve(args[1]);
const dtsFileName = args[2] || 'proto.d.ts';
const jsFileName = args[3] || 'proto.js';

console.log('==================== 协议生成配置 ====================');
console.log('输入文件:', inputPath);
console.log('输出目录:', outputDir);
console.log('TypeScript 文件名:', dtsFileName);
console.log('JavaScript 文件名:', jsFileName);
console.log('====================================================');
console.log('');

// 创建生成器实例并生成
const generator = new ProtoGenerator();

try {
    generator.generate(inputPath, outputDir, dtsFileName, jsFileName);
    console.log('');
    console.log('✅ 协议文件生成成功！');
} catch (error) {
    console.error('');
    console.error('❌ 生成失败:', error.message);
    console.error(error.stack);
    process.exit(1);
}
