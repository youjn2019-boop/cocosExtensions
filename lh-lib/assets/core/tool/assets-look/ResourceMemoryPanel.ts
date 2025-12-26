import ResourceCalculator from './ResourceCalculator';

/**
 * 资源信息接口
 */
interface ResourceInfo {
    uuid: string;
    name: string;
    type: string;
    size: number;
    asset: any;
}

/**
 * 资源组数据接口
 */
interface ResourceGroupData {
    name: string;
    resources: ResourceInfo[];
    size: number;
    count: number;
}

/**
 * 资源数据接口
 */
interface ResourceData {
    bundles: Map<string, ResourceGroupData>;
    directories: Map<string, ResourceGroupData>;
    totalSize: number;
    totalCount: number;
}

/**
 * 资源内存监控面板
 * 负责显示和管理资源内存使用情况
 */
class ResourceMemoryPanel {
    private container: HTMLElement | null = null;
    private isMonitoring: boolean = false;
    private resourceData: ResourceData | null = null;
    private lastUpdateTime: Date | null = null;
    private filterText: string = '';
    private sortBy: string = 'size';
    private sortOrder: string = 'desc';
    private viewMode: string = 'bundle'; // 'bundle' 或 'directory'

    /**
     * 创建面板
     * @param parent - 父容器
     */
    create(parent: HTMLElement): void {
        this.container = document.createElement('div');
        this.container.className = 'resource-memory-panel';
        
        this.createHeader();
        this.createControls();
        this.createContent();
        this.applyStyles();
        
        parent.appendChild(this.container);
    }

    /**
     * 创建头部
     */
    private createHeader(): void {
        this.container!.innerHTML = `
            <div class="resource-memory-header">
                <h3>资源内存监控</h3>
                <div class="memory-stats">
                    <div class="stat-item">
                        <span class="stat-label">已用内存:</span>
                        <span class="stat-value" id="used-memory">--</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">已加载资源数量:</span>
                        <span class="stat-value" id="resource-count">--</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">最后更新:</span>
                        <span class="stat-value" id="last-update">--</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 创建控制区域
     */
    private createControls(): void {
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'resource-controls';
        controlsDiv.innerHTML = `
            <div class="control-row">
                <button id="refresh-btn" class="control-btn">刷新数据</button>
                <select id="view-mode-select" class="control-select">
                    <option value="bundle">按Bundle分组</option>
                    <option value="directory">按目录分组</option>
                </select>
            </div>
            <div class="control-row">
                <input type="text" id="filter-input" class="filter-input" placeholder="过滤资源名称...">
                <select id="sort-select" class="control-select">
                    <option value="size">按大小排序</option>
                    <option value="name">按名称排序</option>
                    <option value="type">按类型排序</option>
                </select>
            </div>
        `;
        
        this.container!.appendChild(controlsDiv);
        this.bindControlEvents();
    }

    /**
     * 创建内容区域
     */
    private createContent(): void {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'resource-content';
        contentDiv.innerHTML = '<div class="no-data">暂无资源数据，请点击刷新按钮获取数据</div>';
        this.container!.appendChild(contentDiv);
    }

    /**
     * 绑定控制事件
     */
    private bindControlEvents(): void {
        const refreshBtn = this.container!.querySelector('#refresh-btn') as HTMLButtonElement;
        const viewModeSelect = this.container!.querySelector('#view-mode-select') as HTMLSelectElement;
        const filterInput = this.container!.querySelector('#filter-input') as HTMLInputElement;
        const sortSelect = this.container!.querySelector('#sort-select') as HTMLSelectElement;

        refreshBtn?.addEventListener('click', () => {
            this.refreshData();
        });

        viewModeSelect?.addEventListener('change', (e) => {
            this.viewMode = (e.target as HTMLSelectElement).value;
            this.updateDisplay();
        });

        filterInput?.addEventListener('input', (e) => {
            this.filterText = (e.target as HTMLInputElement).value.toLowerCase();
            this.updateDisplay();
        });

        sortSelect?.addEventListener('change', (e) => {
            this.sortBy = (e.target as HTMLSelectElement).value;
            this.updateDisplay();
        });
    }

    /**
     * 应用样式
     */
    private applyStyles(): void {
        const style = document.createElement('style');
        style.textContent = `
            .resource-memory-panel {
                display: flex;
                flex-direction: column;
                height: 100%;
                overflow: hidden;
            }

            .resource-memory-header {
                flex-shrink: 0;
                padding: 10px;
                padding-right: 15px;
                background: #1a1a1a;
                border-bottom: 1px solid #444;
            }

            .resource-memory-header h3 {
                margin: 0 0 10px 0;
                font-size: 14px;
                font-weight: bold;
                color: #fff;
            }

            .memory-stats {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .stat-item {
                display: flex;
                justify-content: space-between;
                font-size: 11px;
            }

            .stat-label {
                color: #ccc;
            }

            .stat-value {
                color: #4CAF50;
                font-weight: bold;
            }

            .resource-controls {
                flex-shrink: 0;
                padding: 10px;
                background: #2a2a2a;
                border-bottom: 1px solid #444;
            }

            .control-row {
                display: flex;
                gap: 8px;
                margin-bottom: 8px;
            }

            .control-row:last-child {
                margin-bottom: 0;
            }

            .control-btn {
                padding: 4px 8px;
                background: #0078d4;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 11px;
            }

            .control-btn:hover {
                background: #106ebe;
            }

            .control-select, .filter-input {
                flex: 1;
                padding: 4px 6px;
                background: #3a3a3a;
                color: white;
                border: 1px solid #555;
                border-radius: 3px;
                font-size: 11px;
            }

            .resource-content {
                flex: 1;
                overflow-y: auto;
                padding: 10px;
            }

            .resource-group {
                margin-bottom: 15px;
            }

            .group-header {
                display: flex;
                align-items: center;
                padding: 8px;
                background: #3a3a3a;
                border-radius: 4px;
                cursor: pointer;
                user-select: none;
                margin-bottom: 5px;
            }

            .group-header:hover {
                background: #4a4a4a;
            }

            .expand-toggle {
                margin-right: 8px;
                transition: transform 0.2s;
            }

            .group-header.expanded .expand-toggle {
                transform: rotate(90deg);
            }

            .bundle-title {
                flex: 1;
                font-weight: bold;
                color: #fff;
            }

            .bundle-count {
                color: #ccc;
                font-size: 11px;
            }

            .resource-list {
                display: none;
                padding-left: 20px;
            }

            .resource-list.expanded {
                display: block;
            }

            .resource-item {
                display: flex;
                align-items: center;
                padding: 4px 8px;
                margin-bottom: 2px;
                background: #2a2a2a;
                border-radius: 3px;
                cursor: pointer;
            }

            .resource-item:hover {
                background: #3a3a3a;
            }

            .resource-detail-name {
                flex: 1;
                color: #fff;
                font-size: 11px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .resource-type {
                color: #888;
                font-size: 10px;
                margin-right: 8px;
            }

            .resource-detail-size {
                color: #4CAF50;
                font-size: 11px;
                margin-right: 8px;
                min-width: 60px;
                text-align: right;
            }

            .inspect-icon {
                color: #0078d4;
                cursor: pointer;
                font-size: 12px;
                padding: 2px;
            }

            .inspect-icon:hover {
                color: #106ebe;
            }

            .no-data {
                text-align: center;
                color: #888;
                padding: 20px;
                font-style: italic;
            }

            /* 滚动条样式 */
            .resource-content::-webkit-scrollbar {
                width: 8px;
            }

            .resource-content::-webkit-scrollbar-track {
                background: #1e1e1e;
            }

            .resource-content::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 4px;
            }

            .resource-content::-webkit-scrollbar-thumb:hover {
                background: #666;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 刷新数据
     */
    refreshData(): void {
        try {
            this.resourceData = this.collectResourceData();
            this.updateMemoryStats();
            this.updateDisplay();
            this.updateLastUpdateTime();
            console.log("资源内存监控已开始（手动刷新模式）");
        } catch (error) {
            console.warn("刷新资源数据失败:", error);
        }
    }

    /**
     * 收集资源数据
     * @returns 资源数据对象
     */
    private collectResourceData(): ResourceData {
        const data: ResourceData = {
            bundles: new Map(),
            directories: new Map(),
            totalSize: 0,
            totalCount: 0
        };

        try {
            // 获取Cocos Creator的资源管理器
            const cc = (window as any).cc;
            if (!cc || !cc.assetManager) {
                console.warn("无法访问Cocos Creator资源管理器");
                return data;
            }

            // 遍历已加载的资源
            const assets = cc.assetManager.assets;
            if (assets) {
                assets.forEach((asset: any, uuid: string) => {
                    try {
                        const size = ResourceCalculator.calculate(asset);
                        if (size > 0) {
                            const resourceInfo: ResourceInfo = {
                                uuid: uuid,
                                name: asset.name || 'Unknown',
                                type: asset.constructor.name,
                                size: size,
                                asset: asset
                            };

                            // 按Bundle分组
                            const bundleName = this.getBundleName(asset) || 'Default';
                            if (!data.bundles.has(bundleName)) {
                                data.bundles.set(bundleName, {
                                    name: bundleName,
                                    resources: [],
                                    size: 0,
                                    count: 0
                                });
                            }
                            const bundleData = data.bundles.get(bundleName)!;
                            bundleData.resources.push(resourceInfo);
                            bundleData.size += size;
                            bundleData.count++;

                            // 按目录分组
                            const dirName = this.getDirectoryName(asset) || 'Root';
                            if (!data.directories.has(dirName)) {
                                data.directories.set(dirName, {
                                    name: dirName,
                                    resources: [],
                                    size: 0,
                                    count: 0
                                });
                            }
                            const dirData = data.directories.get(dirName)!;
                            dirData.resources.push(resourceInfo);
                            dirData.size += size;
                            dirData.count++;

                            data.totalSize += size;
                            data.totalCount++;
                        }
                    } catch (error) {
                        console.warn("处理资源时出错:", error);
                    }
                });
            }
        } catch (error) {
            console.warn("收集资源数据失败:", error);
        }

        return data;
    }

    /**
     * 获取资源的Bundle名称
     * @param asset - 资源对象
     * @returns Bundle名称
     */
    private getBundleName(asset: any): string {
        try {
            if (asset._uuid) {
                const cc = (window as any).cc;
                const bundle = cc.assetManager.getBundle(asset._uuid);
                if (bundle) {
                    return bundle.name;
                }
            }
            return 'Unknown';
        } catch (error) {
            return 'Unknown';
        }
    }

    /**
     * 获取资源的目录名称
     * @param asset - 资源对象
     * @returns 目录名称
     */
    private getDirectoryName(asset: any): string {
        try {
            if (asset._nativeUrl) {
                const url = asset._nativeUrl;
                const pathParts = url.split('/');
                if (pathParts.length > 1) {
                    return pathParts[pathParts.length - 2];
                }
            }
            return 'Root';
        } catch (error) {
            return 'Root';
        }
    }

    /**
     * 更新内存统计
     */
    private updateMemoryStats(): void {
        if (!this.resourceData) return;

        const usedMemoryEl = this.container!.querySelector('#used-memory') as HTMLElement;
        const resourceCountEl = this.container!.querySelector('#resource-count') as HTMLElement;

        if (usedMemoryEl) {
            usedMemoryEl.textContent = ResourceCalculator.formatBytes(this.resourceData.totalSize);
        }

        if (resourceCountEl) {
            resourceCountEl.textContent = this.resourceData.totalCount.toString();
        }
    }

    /**
     * 更新显示
     */
    private updateDisplay(): void {
        if (!this.resourceData) return;

        const contentEl = this.container!.querySelector('.resource-content') as HTMLElement;
        if (!contentEl) return;

        const groupData = this.viewMode === 'bundle' ? this.resourceData.bundles : this.resourceData.directories;
        
        if (groupData.size === 0) {
            contentEl.innerHTML = '<div class="no-data">暂无资源数据，请点击刷新按钮获取数据</div>';
            return;
        }

        // 过滤和排序
        const filteredGroups = Array.from(groupData.values()).filter(group => {
            if (!this.filterText) return true;
            return group.name.toLowerCase().includes(this.filterText) ||
                   group.resources.some(res => res.name.toLowerCase().includes(this.filterText));
        });

        // 排序组
        filteredGroups.sort((a, b) => {
            switch (this.sortBy) {
                case 'size':
                    return this.sortOrder === 'desc' ? b.size - a.size : a.size - b.size;
                case 'name':
                    return this.sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        if (filteredGroups.length === 0) {
            contentEl.innerHTML = '<div class="no-data">没有符合筛选条件的资源数据</div>';
            return;
        }

        // 生成HTML
        let html = '';
        filteredGroups.forEach((group, index) => {
            const groupId = `group-${index}`;
            html += `
                <div class="resource-group">
                    <div class="group-header" data-target="${groupId}">
                        <span class="expand-toggle">▶</span>
                        <span class="bundle-title">${group.name}</span>
                        <span class="bundle-count">${group.count} 个资源 / ${ResourceCalculator.formatBytes(group.size)}</span>
                    </div>
                    <div class="resource-list" id="${groupId}">
                        ${this.generateResourceListHTML(group.resources)}
                    </div>
                </div>
            `;
        });

        contentEl.innerHTML = html;
        this.bindResourceEvents();
    }

    /**
     * 生成资源列表HTML
     * @param resources - 资源列表
     * @returns HTML字符串
     */
    private generateResourceListHTML(resources: ResourceInfo[]): string {
        // 过滤资源
        const filteredResources = resources.filter(res => {
            if (!this.filterText) return true;
            return res.name.toLowerCase().includes(this.filterText);
        });

        // 排序资源
        filteredResources.sort((a, b) => {
            switch (this.sortBy) {
                case 'size':
                    return this.sortOrder === 'desc' ? b.size - a.size : a.size - b.size;
                case 'name':
                    return this.sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
                case 'type':
                    return this.sortOrder === 'desc' ? b.type.localeCompare(a.type) : a.type.localeCompare(b.type);
                default:
                    return 0;
            }
        });

        return filteredResources.map(res => `
            <div class="resource-item" title="点击打开资源预览\n资源名称: ${res.name}\n提示: 会在新标签页中打开资源，同时在控制台提供Network页签定位指引">
                <span class="resource-detail-name" title="${res.name}">${res.name}</span>
                <span class="resource-type">[${res.type}]</span>
                <span class="resource-detail-size">${ResourceCalculator.formatBytes(res.size)}</span>
                <span class="inspect-icon" data-uuid="${res.uuid}" title="在新标签页打开资源预览">🔍</span>
            </div>
        `).join('');
    }

    /**
     * 绑定资源事件
     */
    private bindResourceEvents(): void {
        // 展开/收起组
        this.container!.querySelectorAll('.group-header').forEach(header => {
            header.addEventListener('click', () => {
                const targetId = header.getAttribute('data-target');
                if (!targetId) return;
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    const isExpanded = targetEl.classList.contains('expanded');
                    if (isExpanded) {
                        targetEl.classList.remove('expanded');
                        header.classList.remove('expanded');
                    } else {
                        targetEl.classList.add('expanded');
                        header.classList.add('expanded');
                    }
                }
            });
        });

        // 资源检查
        this.container!.querySelectorAll('.inspect-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const uuid = icon.getAttribute('data-uuid');
                if (uuid) {
                    this.inspectResource(uuid);
                }
            });
        });
    }

    /**
     * 检查资源
     * @param uuid - 资源UUID
     */
    private inspectResource(uuid: string): void {
        try {
            const cc = (window as any).cc;
            const asset = cc.assetManager.assets.get(uuid);
            
            if (!asset) {
                console.warn(`无法找到UUID为 ${uuid} 的资源`);
                return;
            }

            console.group(`🔍 资源信息 - ${asset.constructor.name || "Unknown"}`);
            console.log(`📋 资源UUID: ${uuid}`);
            console.log("📄 资源对象:", asset);
            console.groupEnd();
        } catch (error) {
            console.error("检查资源时发生错误:", error);
        }
    }

    /**
     * 更新最后更新时间
     */
    private updateLastUpdateTime(): void {
        const lastUpdateEl = this.container!.querySelector('#last-update') as HTMLElement;
        if (lastUpdateEl) {
            const now = new Date();
            lastUpdateEl.textContent = now.toLocaleTimeString();
        }
    }

    /**
     * 销毁面板
     */
    destroy(): void {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.resourceData = null;
    }
}

export default ResourceMemoryPanel;