import { readFileSync, writeFileSync, existsSync } from 'fs-extra';
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
                    const result = await Editor.Dialog.select({ title, type: 'file', filters });
                    if (result.filePaths && result.filePaths.length > 0) {
                        ((this as any).config as any)[field] = result.filePaths[0];
                        (this as any).saveConfig();
                    }
                },
                
                async selectDirectory(field: string, title: string) {
                    const result = await Editor.Dialog.select({ title, type: 'directory' });
                    if (result.filePaths && result.filePaths.length > 0) {
                        ((this as any).config as any)[field] = result.filePaths[0];
                        (this as any).saveConfig();
                    }
                },
                
                // ========== 操作按钮 ==========
                async exportLocalize() {
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
                            await Editor.Dialog.info('导出成功', {
                                detail: result.message,
                                buttons: ['确定']
                            });
                        } else {
                            console.error('❌ 导出失败:', result.message);
                            await Editor.Dialog.error('导出失败', {
                                detail: result.message,
                                buttons: ['确定']
                            });
                        }
                    } catch (error: any) {
                        console.error('导出多语言异常:', error);
                        await Editor.Dialog.error('导出异常', {
                            detail: error.message || '未知错误',
                            buttons: ['确定']
                        });
                    }
                },
                
                async handleTableCopy() {
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
                            await Editor.Message.request('asset-db', 'refresh-asset', 'db://assets');
                            console.log('✅ 已通知 Cocos Creator 刷新资源');
                            
                            await Editor.Dialog.info('打表成功', {
                                detail: result.message,
                                buttons: ['确定']
                            });
                        } else {
                            console.error('❌ 打表失败:', result.message);
                            await Editor.Dialog.error('打表失败', {
                                detail: result.message,
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
                },
                
                async copyHeroModel() {
                    try {
                        const config = (this as any).config;
                        
                        // 验证必填字段
                        if (!config.heroSourceDir) {
                            await Editor.Dialog.warn('配置错误', {
                                detail: '请选择英雄模型资源目录',
                                buttons: ['确定']
                            });
                            return;
                        }
                        
                        if (!config.heroTargetDir) {
                            await Editor.Dialog.warn('配置错误', {
                                detail: '请选择英雄模型目标目录',
                                buttons: ['确定']
                            });
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
                        
                        console.log('✅ 英雄模型复制完成!');
                        
                        // 刷新 Cocos Creator 资源
                        await Editor.Message.request('asset-db', 'refresh-asset', 'db://assets');
                        console.log('✅ 已通知 Cocos Creator 刷新资源');
                        
                        await Editor.Dialog.info('复制成功', {
                            detail: `英雄模型已成功复制
共复制 ${result?.fileCount || 0} 个文件`,
                            buttons: ['确定']
                        });
                        
                    } catch (error: any) {
                        console.error('复制英雄模型异常:', error);
                        await Editor.Dialog.error('复制失败', {
                            detail: error.message || '未知错误',
                            buttons: ['确定']
                        });
                    }
                },
                
                async copySkillEffect() {
                    try {
                        const config = (this as any).config;
                        
                        // 验证必填字段
                        if (!config.skillSourceDir) {
                            await Editor.Dialog.warn('配置错误', {
                                detail: '请选择技能特效资源目录',
                                buttons: ['确定']
                            });
                            return;
                        }
                        
                        if (!config.skillTargetDir) {
                            await Editor.Dialog.warn('配置错误', {
                                detail: '请选择技能特效目标目录',
                                buttons: ['确定']
                            });
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
                        
                        console.log('✅ 技能特效复制完成!');
                        
                        // 刷新 Cocos Creator 资源
                        await Editor.Message.request('asset-db', 'refresh-asset', 'db://assets');
                        console.log('✅ 已通知 Cocos Creator 刷新资源');
                        
                        await Editor.Dialog.info('复制成功', {
                            detail: `技能特效已成功复制
共复制 ${result?.fileCount || 0} 个文件`,
                            buttons: ['确定']
                        });
                        
                    } catch (error: any) {
                        console.error('复制技能特效异常:', error);
                        await Editor.Dialog.error('复制失败', {
                            detail: error.message || '未知错误',
                            buttons: ['确定']
                        });
                    }
                },
                
                async handleTableCopyGen() {
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
                            await Editor.Dialog.info('打表成功', {
                                detail: result.message + '\
\
未找到表格，跳过生成 Tables.ts',
                                buttons: ['确定']
                            });
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
                            await Editor.Message.request('asset-db', 'refresh-asset', 'db://assets');
                            console.log('✅ 已通知 Cocos Creator 刷新资源');
                            
                            await Editor.Dialog.info('打表成功', {
                                detail: message,
                                buttons: ['确定']
                            });
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
                },
                
                async generateProto() {
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
                        
                        await Editor.Dialog.info('生成成功', {
                            detail: '协议文件已成功生成到:\
\
' + config.protoOutputDir,
                            buttons: ['确定']
                        });
                        
                    } catch (error: any) {
                        console.error('生成协议文件异常:', error);
                        await Editor.Dialog.error('生成失败', {
                            detail: error.message || '未知错误',
                            buttons: ['确定']
                        });
                    }
                },
            }
        });
        
        // 挂载 Vue 应用
        app.mount(self.$.app);
    },
    beforeClose() {},
    close() {},
});
