const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 获取扩展根目录（从 tool/js/ 向上两级）
const extensionRoot = path.resolve(__dirname, '../../');

/**
 * 从 config.json 读取配置
 */
function readConfig() {
    const configPath = path.join(extensionRoot, 'tool/config/config.json');
    if (fs.existsSync(configPath)) {
        try {
            const content = fs.readFileSync(configPath, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            console.error('读取 config.json 失败:', error.message);
            return {};
        }
    }
    return {};
}

/**
 * 清理目标目录（保留.meta文件）
 */
function cleanTargetDir(targetDir) {
    if (!fs.existsSync(targetDir)) {
        return;
    }

    console.log('清理目标目录中的非meta文件...');
    const files = fs.readdirSync(targetDir);

    for (const file of files) {
        if (!file.endsWith('.meta')) {
            const filePath = path.join(targetDir, file);
            try {
                const stat = fs.statSync(filePath);
                if (stat.isFile()) {
                    fs.unlinkSync(filePath);
                    console.log('删除:', file);
                }
            } catch (error) {
                console.error('删除文件失败:', file, error.message);
            }
        }
    }
    console.log('');
}

/**
 * 执行复制操作
 */
function copySpine(sourceDir, targetDir) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '../../dist/copySpine/copy-spine.js');

        const args = [
            scriptPath,
            '--source', sourceDir,
            '--target', targetDir
        ];

        const nodeProcess = spawn('node', args, {
            stdio: 'inherit',
            shell: true
        });

        nodeProcess.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`进程退出，代码: ${code}`));
            }
        });

        nodeProcess.on('error', (error) => {
            reject(error);
        });
    });
}

/**
 * 主函数
 */
async function main() {
    // 从命令行参数获取配置
    const args = process.argv.slice(2);
    let heroSource = '';
    let heroTarget = '';
    let skillSource = '';
    let skillTarget = '';

    // 解析命令行参数
    let onlyUseBatConfig = false;
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--hero-source' && i + 1 < args.length) {
            heroSource = args[i + 1];
            i++;
        } else if (args[i] === '--hero-target' && i + 1 < args.length) {
            heroTarget = args[i + 1];
            i++;
        } else if (args[i] === '--skill-source' && i + 1 < args.length) {
            skillSource = args[i + 1];
            i++;
        } else if (args[i] === '--skill-target' && i + 1 < args.length) {
            skillTarget = args[i + 1];
            i++;
        } else if (args[i] === '--only-use-bat-config' && i + 1 < args.length) {
            onlyUseBatConfig = args[i + 1] === 'true';
            i++;
        }
    }

    // 如果参数为空且不是仅使用bat配置，则从 config.json 读取
    if (!onlyUseBatConfig) {
        const config = readConfig();
        if (!heroSource) heroSource = config.heroSourceDir || '';
        if (!heroTarget) heroTarget = config.heroTargetDir || '';
        if (!skillSource) skillSource = config.skillSourceDir || '';
        if (!skillTarget) skillTarget = config.skillTargetDir || '';
    }

    try {
        // 复制英雄模型
        if (heroSource && heroTarget) {
            console.log('========== 复制英雄模型 ==========');
            console.log('源路径:', heroSource);
            console.log('目标路径:', heroTarget);
            console.log('');

            await copySpine(heroSource, heroTarget);
            console.log('');
        } else {
            console.log('[跳过] 英雄模型参数未配置');
            console.log('');
        }

        // 复制技能特效
        if (skillSource && skillTarget) {
            console.log('========== 复制技能特效 ==========');
            console.log('源路径:', skillSource);
            console.log('目标路径:', skillTarget);
            console.log('');

            await copySpine(skillSource, skillTarget);
            console.log('');
        } else {
            console.log('[跳过] 技能特效参数未配置');
            console.log('');
        }

        console.log('======================================');
        console.log('复制完成');
        console.log('======================================');
    } catch (error) {
        console.error('复制失败:', error.message);
        process.exit(1);
    }
}

// 执行主函数
main();
