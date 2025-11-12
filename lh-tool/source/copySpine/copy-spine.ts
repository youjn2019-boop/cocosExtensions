// 源路径 D:\workspace\Pro6\Art\动作\avatar
// 目标路径 D:\workspace\Pro6\Client\branches\branchs0.1\kljtgame\assets\bundle\spine\hero
// 1：递归查找源路径下所有skel文件
// 2：同级目录是否同时存在同名的skel, atlas, png文件
// 3：如果存在，将skel, atlas, png文件复制到目标路径
// 4：如果不存在，继续检查下一个skel

import { readdir, existsSync, mkdirSync, createReadStream, createWriteStream } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { Dirent } from 'fs';

// 配置路径 (相对于当前脚本文件)
// 默认路径
const defaultSourcePath = '..\\..\\..\\..\\..\\..\\Art\\动作\\avatar';
const defaultTargetPath = '..\\..\\assets\\bundle\\spine\\hero';

/**
 * 递归查找源路径下所有skel文件
 * @param dir - 要查找的目录
 * @returns 找到的skel文件路径数组
 */
function findSkelFiles(dir: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        let results: string[] = [];
        readdir(dir, { withFileTypes: true }, (err, entries: Dirent[]) => {
            if (err) {
                return reject(err);
            }

            const promises = entries.map(entry => {
                const fullPath = join(dir, entry.name);

                if (entry.isDirectory()) {
                    // 递归处理子目录，并将结果合并到results数组
                    return findSkelFiles(fullPath).then(subResults => {
                        results = results.concat(subResults);
                    });
                } else if (entry.isFile() && extname(entry.name) === '.skel') {
                    results.push(fullPath);
                    return Promise.resolve();
                }
                return Promise.resolve();
            });

            Promise.all(promises)
                .then(() => resolve(results))
                .catch(reject);
        });
    });
}

/**
 * 复制文件
 * @param source - 源文件路径
 * @param target - 目标文件路径
 */
function copyFile(source: string, target: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // 确保目标目录存在
        const targetDir = dirname(target);
        if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
        }

        const readStream = createReadStream(source);
        const writeStream = createWriteStream(target);

        readStream.on('error', reject);
        writeStream.on('error', reject);
        writeStream.on('finish', resolve);

        readStream.pipe(writeStream);
    });
}

/**
 * 检查并复制资源文件
 * @param skelFilePath - skel文件路径
 * @param targetPath - 目标路径
 * @returns 是否成功复制
 */
async function checkAndCopyResources(skelFilePath: string, targetPath: string): Promise<boolean> {
    try {
        const baseName = basename(skelFilePath, '.skel');
        const dirName = dirname(skelFilePath);

        // 检查是否存在同名的atlas和png文件
        const atlasFilePath = join(dirName, `${baseName}.atlas`);
        const pngFilePath = join(dirName, `${baseName}.png`);

        if (existsSync(atlasFilePath) && existsSync(pngFilePath)) {
            // 构建目标路径
            const targetSkelPath = join(targetPath, `${baseName}.skel`);
            const targetAtlasPath = join(targetPath, `${baseName}.atlas`);
            const targetPngPath = join(targetPath, `${baseName}.png`);

            // 复制文件
            await copyFile(skelFilePath, targetSkelPath);
            await copyFile(atlasFilePath, targetAtlasPath);
            await copyFile(pngFilePath, targetPngPath);

            console.log(`成功复制资源: ${baseName}`);
            return true;
        } else {
            console.log(`资源不完整，跳过: ${baseName}`);
            console.log(`  缺少文件: ${!existsSync(atlasFilePath) ? atlasFilePath : ''} ${!existsSync(pngFilePath) ? pngFilePath : ''}`);
            return false;
        }
    } catch (error) {
        console.error(`处理文件时出错: ${skelFilePath}`, error);
        return false;
    }
}

/**
 * 导出的复制函数，供其他模块调用
 * @param sourcePath - 源路径
 * @param targetPath - 目标路径
 * @returns 复制结果
 */
export async function copySpineFiles(sourcePath: string, targetPath: string): Promise<{ fileCount: number; success: boolean }> {
    try {
        console.log('开始复制骨骼动画资源...');
        console.log(`源路径: ${sourcePath}`);
        console.log(`目标路径: ${targetPath}`);

        // 确保目标路径存在
        if (!existsSync(targetPath)) {
            mkdirSync(targetPath, { recursive: true });
        }

        // 查找所有skel文件
        const skelFiles = await findSkelFiles(sourcePath);
        console.log(`找到 ${skelFiles.length} 个skel文件`);

        // 检查并复制每个资源
        let successCount = 0;
        for (const skelFile of skelFiles) {
            const success = await checkAndCopyResources(skelFile, targetPath);
            if (success) {
                successCount++;
            }
        }

        console.log(`复制完成，成功复制 ${successCount} 组资源`);
        return { fileCount: successCount * 3, success: true }; // 每组资源3个文件（skel, atlas, png）
    } catch (error) {
        console.error('复制资源失败:', error);
        return { fileCount: 0, success: false };
    }
}

/**
 * 主函数
 */
async function main(): Promise<void> {
    // 从命令行参数获取路径
    let sourcePath = defaultSourcePath;
    let targetPath = defaultTargetPath;

    // 解析命令行参数
    const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i++) {
        if ((args[i] === '--source' || args[i] === '-s') && i + 1 < args.length) {
            sourcePath = args[i + 1];
            i++;
        } else if ((args[i] === '--target' || args[i] === '-t') && i + 1 < args.length) {
            targetPath = args[i + 1];
            i++;
        }
    }

    await copySpineFiles(sourcePath, targetPath);
}

// 如果是直接运行脚本，执行主函数
if (require.main === module) {
    main();
}
