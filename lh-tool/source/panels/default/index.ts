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
                        exportMode: 'all',
                        formatEnabled: false,
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
                            Object.assign(this.config, loadedConfig);
                            console.log('配置已加载');
                        }
                    } catch (error) {
                        console.error('加载配置失败:', error);
                    }
                },
                
                saveConfig() {
                    try {
                        const fs = require('fs-extra');
                        fs.ensureDirSync(join(extensionRoot, 'tool/config'));
                        writeFileSync(configPath, JSON.stringify(this.config, null, 2), 'utf-8');
                        console.log('配置已保存');
                    } catch (error) {
                        console.error('保存配置失败:', error);
                    }
                },
                
                // ========== 文件/目录选择 ==========
                async selectFile(field: string, title: string, filters?: any[]) {
                    const result = await Editor.Dialog.select({ title, type: 'file', filters });
                    if (result.filePaths && result.filePaths.length > 0) {
                        (this.config as any)[field] = result.filePaths[0];
                        this.saveConfig();
                    }
                },
                
                async selectDirectory(field: string, title: string) {
                    const result = await Editor.Dialog.select({ title, type: 'directory' });
                    if (result.filePaths && result.filePaths.length > 0) {
                        (this.config as any)[field] = result.filePaths[0];
                        this.saveConfig();
                    }
                },
                
                // ========== 操作按钮 ==========
                async exportLocalize() {
                    try {
                        const { exportLocalize } = require(join(extensionRoot, 'dist/table/export-localize'));
                        
                        const exportConfig = {
                            dataDir: this.config.dataDir,
                            langDir: this.config.langDir,
                            formatEnabled: this.config.formatEnabled,
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
                
                handleTableCopy() {
                    console.log('打表+复制');
                    // TODO: 实现打表+复制功能
                },
                
                handleTableCopyGen() {
                    console.log('打表+复制+生成tableMgr');
                    // TODO: 实现打表+复制+生成tableMgr功能
                },
            }
        });
        
        // 挂载 Vue 应用
        app.mount(self.$.app);
    },
    beforeClose() {},
    close() {},
});
