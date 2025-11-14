import { existsSync, readFileSync, writeFileSync } from 'fs-extra';
import { join, resolve } from 'path';
import { createApp } from 'vue';

module.exports = Editor.Panel.define({
    listeners: {
        show() {
            console.log('show');
        },
        hide() {
            console.log('hide');
        },
    },
    template: readFileSync(join(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
    },
    methods: {},
    ready() {
        const self = this as any;
        const extensionRoot = resolve(__dirname, '../../../');
        const configPath = join(extensionRoot, 'tool/config/config.json');

        // 创建 Vue 应用
        const app = createApp({
            data() {
                return {
                    activeTab: 'table',
                    runningOperations: {}, // 使用对象跟踪每个操作的运行状态
                    config: {
                        exeFile: '',
                        dataDir: '',
                        codeDir: '',
                        exportDataDir: '',
                        langDir: '',
                        tempDir: '',
                        exportMode: 'Client',
                        formatEnabled: false,
                        exportModes: ['Client', 'Battle'],
                        // 协议配置
                        protoInputPath: '',
                        protoOutputDir: '',
                        protoDtsFileName: 'proto',
                        protoJsFileName: 'proto',
                        // 战斗表现配置
                        heroSourceDir: '',
                        heroTargetDir: '',
                        skillSourceDir: '',
                        skillTargetDir: '',
                    }
                };
            },

            mounted() {
                this.loadConfig();
            },

            methods: {
                // ========== 锁定控制 ==========
                async runLockedOperation(operationName: string, operation: () => Promise<void> | void) {
                    // 初始化runningOperations对象（如果不存在）
                    if (!this.runningOperations) {
                        this.runningOperations = {};
                    }
                    
                    // 检查特定操作是否正在运行
                    if (this.runningOperations[operationName]) {
                        console.warn(`⚠️ 当前操作[${operationName}]正在执行，请稍候`);
                        return;
                    }
                    
                    // 标记操作开始
                    this.runningOperations[operationName] = true;
                    console.log(`[${operationName}] 已开始执行`);
                    
                    try {
                        await operation();
                    } catch (error: any) {
                        console.error(`[${operationName}] 执行异常:`, error);
                    } finally {
                        // 标记操作结束
                        this.runningOperations[operationName] = false;
                        console.log(`[${operationName}] 已执行结束`);
                    }
                },

                switchTab(tabName: string) {
                    // 移除页签切换的锁定限制，允许在操作执行期间切换页签
                    this.activeTab = tabName;
                },
                
                // 判断特定操作是否正在运行
                isOperationRunning(operationName: string): boolean {
                    return this.runningOperations && this.runningOperations[operationName] || false;
                },
                
                // 判断是否有任何相关的复制操作正在运行
                isAnyCopyOperationRunning(): boolean {
                    return this.isOperationRunning('复制英雄模型') || 
                           this.isOperationRunning('复制技能特效') || 
                           this.isOperationRunning('批量复制');
                },

                // ========== 配置管理 ==========
                loadConfig() {
                    try {
                        if (existsSync(configPath)) {
                            const loadedConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
                            Object.assign((this as any).config, loadedConfig);

                            // 处理协议文件名后缀（去除后缀）
                            const config = (this as any).config;
                            if (config.protoDtsFileName && config.protoDtsFileName.endsWith('.d.ts')) {
                                config.protoDtsFileName = config.protoDtsFileName.replace(/\.d\.ts$/, '');
                            }
                            if (config.protoJsFileName && config.protoJsFileName.endsWith('.js')) {
                                config.protoJsFileName = config.protoJsFileName.replace(/\.js$/, '');
                            }

                            console.log('配置已加载');
                        } else {
                            // 配置文件不存在，创建默认配置
                            console.log('配置文件不存在，创建默认配置');
                            (this as any).saveConfig();
                        }
                    } catch (error) {
                        console.error('加载配置失败:', error);
                    }
                },

                saveConfig() {
                    try {
                        const fs = require('fs-extra');
                        fs.ensureDirSync(join(extensionRoot, 'tool/config'));
                        writeFileSync(configPath, JSON.stringify((this as any).config, null, 2), 'utf-8');
                        console.log('配置已保存到:', configPath);
                    } catch (error) {
                        console.error('保存配置失败:', error);
                    }
                },

                // ========== 文件/目录选择 ==========
                async selectFile(field: string, title: string, filters?: any[]) {
                    const config = (this as any).config;
                    const currentPath = config[field];

                    // 如果已有路径，使用它作为默认路径
                    const options: any = { title, type: 'file', filters };
                    if (currentPath) {
                        const path = require('path');
                        const fs = require('fs');

                        // 检查文件是否存在
                        if (fs.existsSync(currentPath)) {
                            options.path = currentPath;
                        } else {
                            // 如果文件不存在，尝试使用父目录
                            const dir = path.dirname(currentPath);
                            if (fs.existsSync(dir)) {
                                options.path = dir;
                            }
                        }
                    }

                    const result = await Editor.Dialog.select(options);
                    if (result.filePaths && result.filePaths.length > 0) {
                        config[field] = result.filePaths[0];
                        (this as any).saveConfig();
                    }
                },

                async selectDirectory(field: string, title: string) {
                    const config = (this as any).config;
                    const currentPath = config[field];

                    // 如果已有路径，使用它作为默认路径
                    const options: any = { title, type: 'directory' };
                    if (currentPath) {
                        const fs = require('fs');

                        // 检查目录是否存在
                        if (fs.existsSync(currentPath)) {
                            options.path = currentPath;
                        }
                    }

                    const result = await Editor.Dialog.select(options);
                    if (result.filePaths && result.filePaths.length > 0) {
                        config[field] = result.filePaths[0];
                        (this as any).saveConfig();
                    }
                },

                // ========== 操作按钮 ==========
                async exportLocalize() {
                    await (this as any).runLockedOperation('导出多语言', async () => {
                        try {
                            const { exportLocalize } = require(join(extensionRoot, 'dist/table/export-localize'));

                            const config = (this as any).config;
                            const exportConfig = {
                                dataDir: config.dataDir,
                                langDir: config.langDir,
                                formatEnabled: config.formatEnabled,
                            };

                            console.log('开始导出多语言...', exportConfig);
                            const result = exportLocalize(exportConfig);

                            if (result.success) {
                                console.log('✅ 导出成功!', result.message);
                                if (result.files) {
                                    result.files.forEach((f: string) => console.log('  -', f));
                                }
                            } else {
                                console.error('❌ 导出失败:', result.message);
                            }
                        } catch (error: any) {
                            console.error('导出多语言异常:', error);
                        }
                    });
                },

                async handleTableCopy() {
                    await (this as any).runLockedOperation('tableOperation', async () => {
                        try {
                            const { exportTable } = require(join(extensionRoot, 'dist/table/export-table'));

                            const config = (this as any).config;
                            const exportConfig = {
                                exeFile: config.exeFile,
                                dataDir: config.dataDir,
                                codeDir: config.codeDir,
                                exportDataDir: config.exportDataDir,
                                tempDir: config.tempDir,
                                exportMode: config.exportMode,
                            };

                            console.log('开始打表+复制...', exportConfig);
                            const result = await exportTable(exportConfig);

                            if (result.success) {
                                console.log('✅ 打表成功!', result.message);
                                if (result.files) {
                                    result.files.forEach((f: string) => console.log('  -', f));
                                }

                                // 刷新 Cocos Creator 资源
                                Editor.Message.request('asset-db', 'refresh-asset', 'db://assets');
                                console.log('✅ 已通知 Cocos Creator 刷新资源');
                            } else {
                                console.error('❌ 打表失败:', result.message);
                            }
                        } catch (error: any) {
                            console.error('打表异常:', error);
                        }
                    });
                },

                async handleTableCopyGen() {
                    await (this as any).runLockedOperation('tableOperation', async () => {
                        try {
                            const { exportTable, getModeTableNames, genTables } = require(join(extensionRoot, 'dist/table/export-table'));

                            const config = (this as any).config;
                            const exportConfig = {
                                exeFile: config.exeFile,
                                dataDir: config.dataDir,
                                codeDir: config.codeDir,
                                exportDataDir: config.exportDataDir,
                                tempDir: config.tempDir,
                                exportMode: config.exportMode,
                            };

                            console.log('开始打表+复制+生成tableMgr...', exportConfig);

                            // 1. 执行打表和复制
                            const result = await exportTable(exportConfig);

                            if (!result.success) {
                                console.error('❌ 打表失败:', result.message);
                                await Editor.Dialog.error('打表失败', {
                                    detail: result.message,
                                    buttons: ['确定']
                                });
                                return;
                            }

                            console.log('✅ 打表成功!', result.message);

                            // 2. 获取表名列表
                            const tableNames = getModeTableNames(config.dataDir, config.exportMode);

                            if (!tableNames || tableNames.length === 0) {
                                console.warn('⚠️ 未找到表格，跳过生成 Tables.ts');
                                return;
                            }

                            // 3. 生成 Tables.ts 到 codeDir 的上级目录
                            const path = require('path');
                            const outputPath = path.join(config.codeDir, '..', 'Tables.ts');
                            const genSuccess = genTables(tableNames, outputPath);

                            if (genSuccess) {
                                const filesCount = result.files?.length || 0;
                                const message = '打表成功，共复制 ' + filesCount + ' 个文件\
已生成 Tables.ts (包含 ' + tableNames.length + ' 个表格管理器)';
                                console.log('✅', message);

                                // 刷新 Cocos Creator 资源
                                Editor.Message.request('asset-db', 'refresh-asset', 'db://assets');
                                console.log('✅ 已通知 Cocos Creator 刷新资源');
                            } else {
                                await Editor.Dialog.warn('部分成功', {
                                    detail: result.message + '\
\
Tables.ts 生成失败',
                                    buttons: ['确定']
                                });
                            }
                        } catch (error: any) {
                            console.error('打表异常:', error);
                            await Editor.Dialog.error('打表异常', {
                                detail: error.message || '未知错误',
                                buttons: ['确定']
                            });
                        }
                    });
                },

                async generateProto() {
                    await (this as any).runLockedOperation('生成协议文件', async () => {
                        try {
                            const { ProtoGenerator } = require(join(extensionRoot, 'dist/proto/proto-generator'));

                            const config = (this as any).config;

                            // 验证必填字段
                            if (!config.protoInputPath) {
                                await Editor.Dialog.warn('配置错误', {
                                    detail: '请选择源 JSON 文件路径',
                                    buttons: ['确定']
                                });
                                return;
                            }

                            if (!config.protoOutputDir) {
                                await Editor.Dialog.warn('配置错误', {
                                    detail: '请选择输出目录路径',
                                    buttons: ['确定']
                                });
                                return;
                            }

                            console.log('开始生成协议文件...');
                            console.log('输入文件:', config.protoInputPath);
                            console.log('输出目录:', config.protoOutputDir);
                            console.log('TypeScript 文件名:', config.protoDtsFileName);
                            console.log('JavaScript 文件名:', config.protoJsFileName);

                            const generator = new ProtoGenerator();
                            generator.generate(
                                config.protoInputPath,
                                config.protoOutputDir,
                                (config.protoDtsFileName || 'proto') + '.d.ts',
                                (config.protoJsFileName || 'proto') + '.js'
                            );

                            console.log('✅ 协议文件生成成功!');
                        } catch (error: any) {
                            console.error('生成协议文件异常:', error);
                            await Editor.Dialog.error('生成失败', {
                                detail: error.message || '未知错误',
                                buttons: ['确定']
                            });
                        }
                    });
                },
                
                async copyHeroModel() {
                    await (this as any).runLockedOperation('复制英雄模型', async () => {
                        try {
                            const config = (this as any).config;

                            // 验证必填字段
                            if (!config.heroSourceDir) {
                                console.warn('⚠️ 请选择英雄模型资源目录');
                                return;
                            }

                            if (!config.heroTargetDir) {
                                console.warn('⚠️ 请选择英雄模型目标目录');
                                return;
                            }

                            console.log('开始复制英雄模型...');
                            console.log('资源目录:', config.heroSourceDir);
                            console.log('目标目录:', config.heroTargetDir);

                            // 清理目标目录（保留.meta文件）
                            const fs = require('fs');
                            const path = require('path');

                            if (fs.existsSync(config.heroTargetDir)) {
                                console.log('清理目标目录中的非meta文件...');
                                const files = fs.readdirSync(config.heroTargetDir);
                                for (const file of files) {
                                    if (!file.endsWith('.meta')) {
                                        const filePath = path.join(config.heroTargetDir, file);
                                        if (fs.statSync(filePath).isFile()) {
                                            fs.unlinkSync(filePath);
                                            console.log('删除:', file);
                                        }
                                    }
                                }
                            }

                            // 执行复制逻辑
                            const { copySpineFiles } = require(join(extensionRoot, 'dist/copySpine/copy-spine'));
                            const result = await copySpineFiles(config.heroSourceDir, config.heroTargetDir);

                            console.log('✅ 英雄模型复制完成! 共复制', result?.fileCount || 0, '个文件');

                            // 刷新 Cocos Creator 资源
                            Editor.Message.request('asset-db', 'refresh-asset', 'db://assets');
                            console.log('✅ 已通知 Cocos Creator 刷新资源');
                        } catch (error: any) {
                            console.error('复制英雄模型异常:', error);
                        }
                    });
                },

                async copySkillEffect() {
                    await (this as any).runLockedOperation('复制技能特效', async () => {
                        try {
                            const config = (this as any).config;

                            // 验证必填字段
                            if (!config.skillSourceDir) {
                                console.warn('⚠️ 请选择技能特效资源目录');
                                return;
                            }

                            if (!config.skillTargetDir) {
                                console.warn('⚠️ 请选择技能特效目标目录');
                                return;
                            }

                            console.log('开始复制技能特效...');
                            console.log('资源目录:', config.skillSourceDir);
                            console.log('目标目录:', config.skillTargetDir);

                            // 清理目标目录（保留.meta文件）
                            const fs = require('fs');
                            const path = require('path');

                            if (fs.existsSync(config.skillTargetDir)) {
                                console.log('清理目标目录中的非meta文件...');
                                const files = fs.readdirSync(config.skillTargetDir);
                                for (const file of files) {
                                    if (!file.endsWith('.meta')) {
                                        const filePath = path.join(config.skillTargetDir, file);
                                        if (fs.statSync(filePath).isFile()) {
                                            fs.unlinkSync(filePath);
                                            console.log('删除:', file);
                                        }
                                    }
                                }
                            }

                            // 执行复制逻辑
                            const { copySpineFiles } = require(join(extensionRoot, 'dist/copySpine/copy-spine'));
                            const result = await copySpineFiles(config.skillSourceDir, config.skillTargetDir);

                            console.log('✅ 技能特效复制完成! 共复制', result?.fileCount || 0, '个文件');

                            // 刷新 Cocos Creator 资源
                            Editor.Message.request('asset-db', 'refresh-asset', 'db://assets');
                            console.log('✅ 已通知 Cocos Creator 刷新资源');

                        } catch (error: any) {
                            console.error('复制技能特效异常:', error);
                        }
                    });
                },

                async copyAll() {
                    await (this as any).runLockedOperation('批量复制', async () => {
                        try {
                            const config = (this as any).config;

                            // 验证所有必填字段
                            const missingFields = [];
                            if (!config.heroSourceDir) missingFields.push('英雄模型资源目录');
                            if (!config.heroTargetDir) missingFields.push('英雄模型目标目录');
                            if (!config.skillSourceDir) missingFields.push('技能特效资源目录');
                            if (!config.skillTargetDir) missingFields.push('技能特效目标目录');

                            if (missingFields.length > 0) {
                                console.warn('⚠️ 请配置以下项目:', missingFields.join(', '));
                                return;
                            }

                            console.log('开始批量复制...');

                            const fs = require('fs');
                            const path = require('path');
                            const { copySpineFiles } = require(join(extensionRoot, 'dist/copySpine/copy-spine'));

                            let totalFileCount = 0;

                            // 复制英雄模型
                            console.log('========== 复制英雄模型 ==========');
                            console.log('资源目录:', config.heroSourceDir);
                            console.log('目标目录:', config.heroTargetDir);

                            if (fs.existsSync(config.heroTargetDir)) {
                                console.log('清理目标目录中的非meta文件...');
                                const files = fs.readdirSync(config.heroTargetDir);
                                for (const file of files) {
                                    if (!file.endsWith('.meta')) {
                                        const filePath = path.join(config.heroTargetDir, file);
                                        if (fs.statSync(filePath).isFile()) {
                                            fs.unlinkSync(filePath);
                                            console.log('删除:', file);
                                        }
                                    }
                                }
                            }

                            const heroResult = await copySpineFiles(config.heroSourceDir, config.heroTargetDir);
                            totalFileCount += heroResult?.fileCount || 0;
                            console.log('✅ 英雄模型复制完成!');
                            console.log('');

                            // 复制技能特效
                            console.log('========== 复制技能特效 ==========');
                            console.log('资源目录:', config.skillSourceDir);
                            console.log('目标目录:', config.skillTargetDir);

                            if (fs.existsSync(config.skillTargetDir)) {
                                console.log('清理目标目录中的非meta文件...');
                                const files = fs.readdirSync(config.skillTargetDir);
                                for (const file of files) {
                                    if (!file.endsWith('.meta')) {
                                        const filePath = path.join(config.skillTargetDir, file);
                                        if (fs.statSync(filePath).isFile()) {
                                            fs.unlinkSync(filePath);
                                            console.log('删除:', file);
                                        }
                                    }
                                }
                            }

                            const skillResult = await copySpineFiles(config.skillSourceDir, config.skillTargetDir);
                            totalFileCount += skillResult?.fileCount || 0;
                            console.log('✅ 技能特效复制完成!');
                            console.log('');

                            console.log('======================================');
                            console.log('✅ 批量复制完成! 共复制', totalFileCount, '个文件');
                            console.log('======================================');

                            // 刷新 Cocos Creator 资源
                            Editor.Message.request('asset-db', 'refresh-asset', 'db://assets');
                            console.log('✅ 已通知 Cocos Creator 刷新资源');
                        } catch (error: any) {
                            console.error('批量复制异常:', error);
                            await Editor.Dialog.error('复制失败', {
                                detail: error.message || '未知错误',
                                buttons: ['确定']
                            });
                        }
                    });
                },
            }
        });

        // 挂载 Vue 应用
        app.mount(self.$.app);
    },
    beforeClose() { },
    close() { },
});
