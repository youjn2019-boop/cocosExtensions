"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const vue_1 = require("vue");
module.exports = Editor.Panel.define({
    listeners: {
        show() {
            console.log('show');
        },
        hide() {
            console.log('hide');
        },
    },
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
    },
    methods: {},
    ready() {
        const self = this;
        const extensionRoot = (0, path_1.resolve)(__dirname, '../../../');
        const configPath = (0, path_1.join)(extensionRoot, 'tool/config/config.json');
        // 创建 Vue 应用
        const app = (0, vue_1.createApp)({
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
                        exportModes: ['Client', 'Battle']
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
                        if ((0, fs_extra_1.existsSync)(configPath)) {
                            const loadedConfig = JSON.parse((0, fs_extra_1.readFileSync)(configPath, 'utf-8'));
                            Object.assign(this.config, loadedConfig);
                            console.log('配置已加载');
                        }
                        else {
                            // 配置文件不存在，创建默认配置
                            console.log('配置文件不存在，创建默认配置');
                            this.saveConfig();
                        }
                    }
                    catch (error) {
                        console.error('加载配置失败:', error);
                    }
                },
                saveConfig() {
                    try {
                        const fs = require('fs-extra');
                        fs.ensureDirSync((0, path_1.join)(extensionRoot, 'tool/config'));
                        (0, fs_extra_1.writeFileSync)(configPath, JSON.stringify(this.config, null, 2), 'utf-8');
                        console.log('配置已保存到:', configPath);
                    }
                    catch (error) {
                        console.error('保存配置失败:', error);
                    }
                },
                // ========== 文件/目录选择 ==========
                async selectFile(field, title, filters) {
                    const result = await Editor.Dialog.select({ title, type: 'file', filters });
                    if (result.filePaths && result.filePaths.length > 0) {
                        this.config[field] = result.filePaths[0];
                        this.saveConfig();
                    }
                },
                async selectDirectory(field, title) {
                    const result = await Editor.Dialog.select({ title, type: 'directory' });
                    if (result.filePaths && result.filePaths.length > 0) {
                        this.config[field] = result.filePaths[0];
                        this.saveConfig();
                    }
                },
                // ========== 操作按钮 ==========
                async exportLocalize() {
                    try {
                        const { exportLocalize } = require((0, path_1.join)(extensionRoot, 'dist/table/export-localize'));
                        const config = this.config;
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
                                result.files.forEach((f) => console.log('  -', f));
                            }
                            await Editor.Dialog.info('导出成功', {
                                detail: result.message,
                                buttons: ['确定']
                            });
                        }
                        else {
                            console.error('❌ 导出失败:', result.message);
                            await Editor.Dialog.error('导出失败', {
                                detail: result.message,
                                buttons: ['确定']
                            });
                        }
                    }
                    catch (error) {
                        console.error('导出多语言异常:', error);
                        await Editor.Dialog.error('导出异常', {
                            detail: error.message || '未知错误',
                            buttons: ['确定']
                        });
                    }
                },
                async handleTableCopy() {
                    try {
                        const { exportTable } = require((0, path_1.join)(extensionRoot, 'dist/table/export-table'));
                        const config = this.config;
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
                                result.files.forEach((f) => console.log('  -', f));
                            }
                            await Editor.Dialog.info('打表成功', {
                                detail: result.message,
                                buttons: ['确定']
                            });
                        }
                        else {
                            console.error('❌ 打表失败:', result.message);
                            await Editor.Dialog.error('打表失败', {
                                detail: result.message,
                                buttons: ['确定']
                            });
                        }
                    }
                    catch (error) {
                        console.error('打表异常:', error);
                        await Editor.Dialog.error('打表异常', {
                            detail: error.message || '未知错误',
                            buttons: ['确定']
                        });
                    }
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
    beforeClose() { },
    close() { },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvcGFuZWxzL2RlZmF1bHQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBbUU7QUFDbkUsK0JBQXFDO0FBQ3JDLDZCQUFnQztBQUVoQyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ2pDLFNBQVMsRUFBRTtRQUNQLElBQUk7WUFDQSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hCLENBQUM7UUFDRCxJQUFJO1lBQ0EsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QixDQUFDO0tBQ0o7SUFDRCxRQUFRLEVBQUUsSUFBQSx1QkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSw2Q0FBNkMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUMvRixLQUFLLEVBQUUsSUFBQSx1QkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSx5Q0FBeUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUN4RixDQUFDLEVBQUU7UUFDQyxHQUFHLEVBQUUsTUFBTTtLQUNkO0lBQ0QsT0FBTyxFQUFFLEVBQUU7SUFDWCxLQUFLO1FBQ0QsTUFBTSxJQUFJLEdBQUcsSUFBVyxDQUFDO1FBQ3pCLE1BQU0sYUFBYSxHQUFHLElBQUEsY0FBTyxFQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN0RCxNQUFNLFVBQVUsR0FBRyxJQUFBLFdBQUksRUFBQyxhQUFhLEVBQUUseUJBQXlCLENBQUMsQ0FBQztRQUVsRSxZQUFZO1FBQ1osTUFBTSxHQUFHLEdBQUcsSUFBQSxlQUFTLEVBQUM7WUFDbEIsSUFBSTtnQkFDQSxPQUFPO29CQUNILFNBQVMsRUFBRSxPQUFPO29CQUNsQixNQUFNLEVBQUU7d0JBQ0osT0FBTyxFQUFFLEVBQUU7d0JBQ1gsT0FBTyxFQUFFLEVB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QUssQ0FBQyxPQUFPLElBQUksTUFBTTs0QkFDL0IsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDO3lCQUNsQixDQUFDLENBQUM7b0JBQ1AsQ0FBQztnQkFDTCxDQUFDO2dCQUVELGtCQUFrQjtvQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBQ2hDLDZCQUE2QjtnQkFDakMsQ0FBQzthQUNKO1NBQ0osQ0FBQyxDQUFDO1FBRUgsWUFBWTtRQUNaLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBQ0QsV0FBVyxLQUFJLENBQUM7SUFDaEIsS0FBSyxLQUFJLENBQUM7Q0FDYixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZWFkRmlsZVN5bmMsIHdyaXRlRmlsZVN5bmMsIGV4aXN0c1N5bmMgfSBmcm9tICdmcy1leHRyYSc7XHJcbmltcG9ydCB7IGpvaW4sIHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgY3JlYXRlQXBwIH0gZnJvbSAndnVlJztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRWRpdG9yLlBhbmVsLmRlZmluZSh7XHJcbiAgICBsaXN0ZW5lcnM6IHtcclxuICAgICAgICBzaG93KCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2hvdycpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaGlkZSgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2hpZGUnKTtcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIHRlbXBsYXRlOiByZWFkRmlsZVN5bmMoam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi9zdGF0aWMvdGVtcGxhdGUvZGVmYXVsdC9pbmRleC5odG1sJyksICd1dGYtOCcpLFxyXG4gICAgc3R5bGU6IHJlYWRGaWxlU3luYyhqb2luKF9fZGlybmFtZSwgJy4uLy4uLy4uL3N0YXRpYy9zdHlsZS9kZWZhdWx0L2luZGV4LmNzcycpLCAndXRmLTgnKSxcclxuICAgICQ6IHtcclxuICAgICAgICBhcHA6ICcjYXBwJyxcclxuICAgIH0sXHJcbiAgICBtZXRob2RzOiB7fSxcclxuICAgIHJlYWR5KCkge1xyXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzIGFzIGFueTtcclxuICAgICAgICBjb25zdCBleHRlbnNpb25Sb290ID0gcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi8uLi8nKTtcclxuICAgICAgICBjb25zdCBjb25maWdQYXRoID0gam9pbihleHRlbnNpb25Sb290LCAndG9vbC9jb25maWcvY29uZmlnLmpzb24nKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyDliJvlu7ogVnVlIOW6lOeUqFxyXG4gICAgICAgIGNvbnN0IGFwcCA9IGNyZWF0ZUFwcCh7XHJcbiAgICAgICAgICAgIGRhdGEoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZVRhYjogJ3RhYmxlJyxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXhlRmlsZTogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFEaXI6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlRGlyOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3J0RGF0YURpcjogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmdEaXI6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRGlyOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3J0TW9kZTogJ0NsaWVudCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdEVuYWJsZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBvcnRNb2RlczogWydDbGllbnQnLCAnQmF0dGxlJ11cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbW91bnRlZCgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbmZpZygpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbWV0aG9kczoge1xyXG4gICAgICAgICAgICAgICAgLy8gPT09PT09PT09PSDphY3nva7nrqHnkIYgPT09PT09PT09PVxyXG4gICAgICAgICAgICAgICAgbG9hZENvbmZpZygpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzU3luYyhjb25maWdQYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9hZGVkQ29uZmlnID0gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMoY29uZmlnUGF0aCwgJ3V0Zi04JykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbigodGhpcyBhcyBhbnkpLmNvbmZpZywgbG9hZGVkQ29uZmlnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfphY3nva7lt7LliqDovb0nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOmFjee9ruaWh+S7tuS4jeWtmOWcqO+8jOWIm+W7uum7mOiupOmFjee9rlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+mFjee9ruaWh+S7tuS4jeWtmOWcqO+8jOWIm+W7uum7mOiupOmFjee9ricpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMgYXMgYW55KS5zYXZlQ29uZmlnKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCfliqDovb3phY3nva7lpLHotKU6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHNhdmVDb25maWcoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcy1leHRyYScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmcy5lbnN1cmVEaXJTeW5jKGpvaW4oZXh0ZW5zaW9uUm9vdCwgJ3Rvb2wvY29uZmlnJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZUZpbGVTeW5jKGNvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KCh0aGlzIGFzIGFueSkuY29uZmlnLCBudWxsLCAyKSwgJ3V0Zi04Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfphY3nva7lt7Lkv53lrZjliLA6JywgY29uZmlnUGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcign5L+d5a2Y6YWN572u5aSx6LSlOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyA9PT09PT09PT09IOaWh+S7ti/nm67lvZXpgInmi6kgPT09PT09PT09PVxyXG4gICAgICAgICAgICAgICAgYXN5bmMgc2VsZWN0RmlsZShmaWVsZDogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCBmaWx0ZXJzPzogYW55W10pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBFZGl0b3IuRGlhbG9nLnNlbGVjdCh7IHRpdGxlLCB0eXBlOiAnZmlsZScsIGZpbHRlcnMgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5maWxlUGF0aHMgJiYgcmVzdWx0LmZpbGVQYXRocy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICgodGhpcyBhcyBhbnkpLmNvbmZpZyBhcyBhbnkpW2ZpZWxkXSA9IHJlc3VsdC5maWxlUGF0aHNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzIGFzIGFueSkuc2F2ZUNvbmZpZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGFzeW5jIHNlbGVjdERpcmVjdG9yeShmaWVsZDogc3RyaW5nLCB0aXRsZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgRWRpdG9yLkRpYWxvZy5zZWxlY3QoeyB0aXRsZSwgdHlwZTogJ2RpcmVjdG9yeScgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5maWxlUGF0aHMgJiYgcmVzdWx0LmZpbGVQYXRocy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICgodGhpcyBhcyBhbnkpLmNvbmZpZyBhcyBhbnkpW2ZpZWxkXSA9IHJlc3VsdC5maWxlUGF0aHNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzIGFzIGFueSkuc2F2ZUNvbmZpZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vID09PT09PT09PT0g5pON5L2c5oyJ6ZKuID09PT09PT09PT1cclxuICAgICAgICAgICAgICAgIGFzeW5jIGV4cG9ydExvY2FsaXplKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgZXhwb3J0TG9jYWxpemUgfSA9IHJlcXVpcmUoam9pbihleHRlbnNpb25Sb290LCAnZGlzdC90YWJsZS9leHBvcnQtbG9jYWxpemUnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25maWcgPSAodGhpcyBhcyBhbnkpLmNvbmZpZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwb3J0Q29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YURpcjogY29uZmlnLmRhdGFEaXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYW5nRGlyOiBjb25maWcubGFuZ0RpcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdEVuYWJsZWQ6IGNvbmZpZy5mb3JtYXRFbmFibGVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+W8gOWni+WvvOWHuuWkmuivreiogC4uLicsIGV4cG9ydENvbmZpZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGV4cG9ydExvY2FsaXplKGV4cG9ydENvbmZpZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfinIUg5a+85Ye65oiQ5YqfIScsIHJlc3VsdC5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZmlsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuZmlsZXMuZm9yRWFjaCgoZjogc3RyaW5nKSA9PiBjb25zb2xlLmxvZygnICAtJywgZikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLkRpYWxvZy5pbmZvKCflr7zlh7rmiJDlip8nLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiByZXN1bHQubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbJ+ehruWumiddXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ+KdjCDlr7zlh7rlpLHotKU6JywgcmVzdWx0Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLkRpYWxvZy5lcnJvcign5a+85Ye65aSx6LSlJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDogcmVzdWx0Lm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogWyfnoa7lrponXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ+WvvOWHuuWkmuivreiogOW8guW4uDonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IEVkaXRvci5EaWFsb2cuZXJyb3IoJ+WvvOWHuuW8guW4uCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDogZXJyb3IubWVzc2FnZSB8fCAn5pyq55+l6ZSZ6K+vJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFsn56Gu5a6aJ11cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgYXN5bmMgaGFuZGxlVGFibGVDb3B5KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgZXhwb3J0VGFibGUgfSA9IHJlcXVpcmUoam9pbihleHRlbnNpb25Sb290LCAnZGlzdC90YWJsZS9leHBvcnQtdGFibGUnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25maWcgPSAodGhpcyBhcyBhbnkpLmNvbmZpZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwb3J0Q29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhlRmlsZTogY29uZmlnLmV4ZUZpbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhRGlyOiBjb25maWcuZGF0YURpcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGVEaXI6IGNvbmZpZy5jb2RlRGlyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3J0RGF0YURpcjogY29uZmlnLmV4cG9ydERhdGFEaXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRGlyOiBjb25maWcudGVtcERpcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9ydE1vZGU6IGNvbmZpZy5leHBvcnRNb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+W8gOWni+aJk+ihqCvlpI3liLYuLi4nLCBleHBvcnRDb25maWcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBleHBvcnRUYWJsZShleHBvcnRDb25maWcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn4pyFIOaJk+ihqOaIkOWKnyEnLCByZXN1bHQubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmZpbGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmZpbGVzLmZvckVhY2goKGY6IHN0cmluZykgPT4gY29uc29sZS5sb2coJyAgLScsIGYpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IEVkaXRvci5EaWFsb2cuaW5mbygn5omT6KGo5oiQ5YqfJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDogcmVzdWx0Lm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogWyfnoa7lrponXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCfinYwg5omT6KGo5aSx6LSlOicsIHJlc3VsdC5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IEVkaXRvci5EaWFsb2cuZXJyb3IoJ+aJk+ihqOWksei0pScsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHJlc3VsdC5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFsn56Gu5a6aJ11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCfmiZPooajlvILluLg6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBFZGl0b3IuRGlhbG9nLmVycm9yKCfmiZPooajlvILluLgnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGVycm9yLm1lc3NhZ2UgfHwgJ+acquefpemUmeivrycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbJ+ehruWumiddXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGhhbmRsZVRhYmxlQ29weUdlbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5omT6KGoK+WkjeWItivnlJ/miJB0YWJsZU1ncicpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IOWunueOsOaJk+ihqCvlpI3liLYr55Sf5oiQdGFibGVNZ3Llip/og71cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICAvLyDmjILovb0gVnVlIOW6lOeUqFxyXG4gICAgICAgIGFwcC5tb3VudChzZWxmLiQuYXBwKTtcclxuICAgIH0sXHJcbiAgICBiZWZvcmVDbG9zZSgpIHt9LFxyXG4gICAgY2xvc2UoKSB7fSxcclxufSk7XHJcbiJdfQ==