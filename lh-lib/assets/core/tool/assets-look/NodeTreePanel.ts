import { NodeData } from "./NodeCalculator";

/**
 * 节点树面板
 * 负责显示和管理Cocos Creator场景节点树
 */
class NodeTreePanel {
    private container: HTMLElement | null = null;
    private treeContainer: HTMLElement | null = null;
    private filterInput: HTMLInputElement | null = null;
    private filterText: string = '';
    private nodeHighlightCallback: ((nodeData: NodeData) => void) | null = null;
    private nodeSelectCallback: ((nodeData: NodeData) => void) | null = null;
    private showTooltipCallback: ((text: string, element: HTMLElement) => void) | null = null;
    private manualRefreshCallback: (() => void) | null = null; // 手动刷新回调
    private autoRefreshCallback: ((isAutoRefresh: boolean) => void) | null = null; // 自动刷新状态变化回调
    private currentNodes: NodeData[] = [];
    private expandedNodeIds: Set<string> = new Set(); // 保存展开的节点ID
    private autoRefreshCheckbox: HTMLInputElement | null = null; // 自动刷新勾选框
    private refreshButton: HTMLButtonElement | null = null; // 手动刷新按钮

    /**
     * 创建节点树面板
     * @param parent - 父容器
     */
    create(parent: HTMLElement): void {
        this.container = document.createElement('div');
        this.container.className = 'node-tree node-inspector-panel';
        
        this.createHeader();
        this.createFilter();
        this.createTreeContainer();
        this.applyStyles();
        
        parent.appendChild(this.container);
    }

    /**
     * 创建头部
     */
    private createHeader(): void {
        const header = document.createElement('div');
        header.className = 'node-tree-header';
        
        const title = document.createElement('h3');
        title.textContent = '节点树';
        header.appendChild(title);
        
        // 手动刷新按钮
        this.refreshButton = document.createElement('button');
        this.refreshButton.textContent = '刷新';
        this.refreshButton.className = 'refresh-button';
        this.refreshButton.style.display = 'none'; // 默认隐藏
        
        // 自动刷新勾选框
        this.autoRefreshCheckbox = document.createElement('input');
        this.autoRefreshCheckbox.type = 'checkbox';
        this.autoRefreshCheckbox.checked = true; // 默认勾选
        this.autoRefreshCheckbox.className = 'auto-refresh-checkbox';
        
        const checkboxLabel = document.createElement('label');
        checkboxLabel.textContent = '自动刷新';
        checkboxLabel.className = 'auto-refresh-label';
        checkboxLabel.appendChild(this.autoRefreshCheckbox);
        
        // 绑定事件
        this.autoRefreshCheckbox.addEventListener('change', () => {
            this.toggleAutoRefresh();
        });
        
        this.refreshButton.addEventListener('click', () => {
            if (this.manualRefreshCallback) {
                this.manualRefreshCallback();
            }
        });
        
        // 先添加刷新按钮，再添加勾选框
        header.appendChild(this.refreshButton);
        header.appendChild(checkboxLabel);
        this.container!.appendChild(header);
    }

    /**
     * 创建过滤器
     */
    private createFilter(): void {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        
        this.filterInput = document.createElement('input');
        this.filterInput.type = 'text';
        this.filterInput.placeholder = '过滤节点...';
        this.filterInput.className = 'filter-input';
        
        this.filterInput.addEventListener('input', (e) => {
            this.filterText = (e.target as HTMLInputElement).value.toLowerCase();
            this.updateTreeDisplay();
        });
        
        filterContainer.appendChild(this.filterInput);
        this.container!.appendChild(filterContainer);
    }

    /**
     * 创建树容器
     */
    private createTreeContainer(): void {
        this.treeContainer = document.createElement('div');
        this.treeContainer.className = 'tree-container';
        this.container!.appendChild(this.treeContainer);
    }

    /**
     * 应用样式
     */
    private applyStyles(): void {
        const style = document.createElement('style');
        style.textContent = `
            .node-tree {
                flex: 1;
                min-height: 200px;
                display: flex;
                flex-direction: column;
                overflow: auto;
            }
            
            .node-tree-header {
                display: flex;
                align-items: center;
                padding: 0 10px;
            }
            
            .node-tree-header h3 {
                flex: 1; /* 让标题占据剩余空间，使勾选框和按钮靠右固定 */
                margin: 10px 0;
                font-size: 16px;
            }
            
            .auto-refresh-label {
                display: flex;
                align-items: center;
                font-size: 12px;
                margin-right: 10px;
                cursor: pointer;
            }
            
            .auto-refresh-checkbox {
                margin-right: 5px;
                cursor: pointer;
            }
            
            .refresh-button {
                padding: 4px 8px;
                background: #0078d4;
                color: white;
                border: none;
                border-radius: 3px;
                font-size: 12px;
                cursor: pointer;
            }
            
            .refresh-button:hover {
                background: #106ebe;
            }

            .filter-container {
                padding: 8px 10px;
                border-bottom: 1px solid #444;
            }

            .filter-input {
                width: 100%;
                padding: 6px 8px;
                background: #3a3a3a;
                color: white;
                border: 1px solid #555;
                border-radius: 3px;
                font-size: 12px;
                box-sizing: border-box;
            }

            .filter-input:focus {
                outline: none;
                border-color: #0078d4;
            }

            .tree-container {
                flex: 1;
                overflow-y: auto;
                padding: 5px;
            }

            .tree-node {
                display: block;
                margin: 1px 0;
            }

            .node-item {
                display: flex;
                align-items: center;
                padding: 3px 5px;
                cursor: pointer;
                border-radius: 3px;
                font-size: 12px;
                user-select: none;
                min-height: 20px;
            }

            .node-item:hover {
                background: #3a3a3a;
            }

            .node-item.selected {
                background: #0078d4;
                color: white;
            }

            .node-item.highlighted {
                background: #ff6b35;
                color: white;
            }

            .node-expand {
                width: 12px;
                height: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 4px;
                cursor: pointer;
                font-size: 10px;
                color: #ccc;
            }

            .node-expand:hover {
                color: #fff;
            }

            .node-expand.expanded {
                transform: rotate(90deg);
            }

            .node-icon {
                width: 14px;
                height: 14px;
                margin-right: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
            }

            .node-name {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .node-info {
                font-size: 10px;
                color: #888;
                margin-left: 8px;
            }

            .node-children {
                margin-left: 16px;
                display: none;
            }

            .node-children.expanded {
                display: block;
            }

            .tree-empty {
                text-align: center;
                color: #888;
                padding: 20px;
                font-style: italic;
            }

            /* 滚动条样式 */
            .tree-container::-webkit-scrollbar {
                width: 8px;
            }

            .tree-container::-webkit-scrollbar-track {
                background: #1e1e1e;
            }

            .tree-container::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 4px;
            }

            .tree-container::-webkit-scrollbar-thumb:hover {
                background: #666;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 更新树显示
     * @param nodes - 节点数据数组
     */
    updateTree(nodes: NodeData[]): void {
        this.currentNodes = nodes || [];
        this.updateTreeDisplay();
    }

    /**
     * 更新树显示（内部方法）
     */
    private updateTreeDisplay(): void {
        if (!this.treeContainer) return;

        if (this.currentNodes.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'tree-empty';
            emptyDiv.textContent = this.filterText ? '未找到匹配的节点' : '未找到节点';
            this.treeContainer.innerHTML = '';
            this.treeContainer.appendChild(emptyDiv);
            return;
        }

        // 保存当前展开状态
        this.saveExpandedState();
        
        // 过滤节点
        const filteredNodes = this.filterNodes(this.currentNodes);
        
        // 生成树HTML
        this.treeContainer.innerHTML = '';
        filteredNodes.forEach(node => {
            const nodeElement = this.createNodeElement(node, 0);
            this.treeContainer.appendChild(nodeElement);
        });

        // 恢复展开状态
        this.restoreExpandedState();

        // 绑定事件
        this.bindNodeEvents();
    }

    /**
     * 过滤节点
     * @param nodes - 节点数组
     * @returns 过滤后的节点数组
     */
    private filterNodes(nodes: NodeData[]): NodeData[] {
        if (!this.filterText) return nodes;

        const filterNode = (node: NodeData): NodeData | null => {
            const matchesFilter = node.name.toLowerCase().includes(this.filterText);
            const filteredChildren = node.children ? node.children.map(filterNode).filter(Boolean) as NodeData[] : [];
            
            if (matchesFilter || filteredChildren.length > 0) {
                return {
                    ...node,
                    children: filteredChildren,
                    expanded: filteredChildren.length > 0 // 自动展开有匹配子节点的节点
                };
            }
            
            return null;
        };

        return nodes.map(filterNode).filter(Boolean) as NodeData[];
    }

    /**
     * 创建节点元素
     * @param nodeData - 节点数据
     * @param level - 层级
     * @returns 节点元素
     */
    private createNodeElement(nodeData: NodeData, level: number): HTMLElement {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'tree-node';
        nodeDiv.setAttribute('data-node-id', nodeData.id);

        // 节点项
        const nodeItem = document.createElement('div');
        nodeItem.className = 'node-item';
        nodeItem.style.paddingLeft = `${level * 16 + 5}px`;

        // 展开/收起按钮
        const expandBtn = document.createElement('span');
        expandBtn.className = 'node-expand';
        if (nodeData.children && nodeData.children.length > 0) {
            expandBtn.textContent = '▶';
            if (nodeData.expanded) {
                expandBtn.classList.add('expanded');
            }
        } else {
            expandBtn.style.visibility = 'hidden';
        }

        // 节点图标
        const nodeIcon = document.createElement('span');
        nodeIcon.className = 'node-icon';
        nodeIcon.textContent = this.getNodeIcon(nodeData);

        // 节点名称
        const nodeName = document.createElement('span');
        nodeName.className = 'node-name';
        nodeName.textContent = nodeData.name || '未命名节点';
        nodeName.title = `${nodeData.name}\n类型: ${nodeData.type}\n位置: (${nodeData.position?.x || 0}, ${nodeData.position?.y || 0})`;

        // 节点信息
        const nodeInfo = document.createElement('span');
        nodeInfo.className = 'node-info';
        nodeInfo.textContent = `[${nodeData.type}]`;

        nodeItem.appendChild(expandBtn);
        nodeItem.appendChild(nodeIcon);
        nodeItem.appendChild(nodeName);
        nodeItem.appendChild(nodeInfo);
        nodeDiv.appendChild(nodeItem);

        // 子节点容器
        if (nodeData.children && nodeData.children.length > 0) {
            const childrenDiv = document.createElement('div');
            childrenDiv.className = 'node-children';
            if (nodeData.expanded) {
                childrenDiv.classList.add('expanded');
            }

            nodeData.children.forEach(child => {
                const childElement = this.createNodeElement(child, level + 1);
                childrenDiv.appendChild(childElement);
            });

            nodeDiv.appendChild(childrenDiv);
        }

        return nodeDiv;
    }

    /**
     * 获取节点图标
     * @param nodeData - 节点数据
     * @returns 图标字符
     */
    private getNodeIcon(nodeData: NodeData): string {
        const iconMap: Record<string, string> = {
            'Node': '📦',
            'Canvas': '🖼️',
            'Sprite': '🖼️',
            'Label': '📝',
            'Button': '🔘',
            'Layout': '📐',
            'ScrollView': '📜',
            'EditBox': '✏️',
            'ProgressBar': '📊',
            'Slider': '🎚️',
            'Toggle': '☑️',
            'Camera': '📷',
            'Light': '💡'
        };

        return iconMap[nodeData.type] || '📦';
    }

    /**
     * 切换自动刷新状态
     */
    private toggleAutoRefresh(): void {
        if (this.autoRefreshCheckbox && this.refreshButton) {
            const isAutoRefresh = this.autoRefreshCheckbox.checked;
            this.refreshButton.style.display = isAutoRefresh ? 'none' : 'inline-block';
            
            // 触发回调通知外部自动刷新状态变化
            if (this.autoRefreshCallback) {
                this.autoRefreshCallback(isAutoRefresh);
            }
        }
    }
    
    /**
     * 设置自动刷新回调
     * @param callback - 回调函数
     */
    onAutoRefreshChange(callback: (isAutoRefresh: boolean) => void): void {
        this.autoRefreshCallback = callback;
    }
    
    /**
     * 设置手动刷新回调
     * @param callback - 回调函数
     */
    onManualRefresh(callback: () => void): void {
        this.manualRefreshCallback = callback;
    }
    
    /**
     * 绑定节点事件
     */
    private bindNodeEvents(): void {
        // 展开/收起事件
        this.treeContainer!.querySelectorAll('.node-expand').forEach(expandBtn => {
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const nodeDiv = (expandBtn as HTMLElement).closest('.tree-node') as HTMLElement;
                const childrenDiv = nodeDiv.querySelector('.node-children') as HTMLElement;
                const nodeId = nodeDiv.getAttribute('data-node-id');
                
                if (childrenDiv && nodeId) {
                    const isExpanded = childrenDiv.classList.contains('expanded');
                    if (isExpanded) {
                        childrenDiv.classList.remove('expanded');
                        expandBtn.classList.remove('expanded');
                        this.expandedNodeIds.delete(nodeId); // 移除展开记录
                    } else {
                        childrenDiv.classList.add('expanded');
                        expandBtn.classList.add('expanded');
                        this.expandedNodeIds.add(nodeId); // 添加展开记录
                    }
                }
            });
        });

        // 节点选择事件
        this.treeContainer!.querySelectorAll('.node-item').forEach(nodeItem => {
            nodeItem.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // 移除其他选中状态
                this.treeContainer!.querySelectorAll('.node-item.selected').forEach(item => {
                    item.classList.remove('selected');
                });
                
                // 设置当前选中
                nodeItem.classList.add('selected');
                
                // 获取节点数据
                const nodeDiv = (nodeItem as HTMLElement).closest('.tree-node') as HTMLElement;
                const nodeId = nodeDiv.getAttribute('data-node-id');
                if (!nodeId) return;
                const nodeData = this.findNodeById(this.currentNodes, nodeId);
                
                if (nodeData && this.nodeSelectCallback) {
                    this.nodeSelectCallback(nodeData);
                }
            });

            // 双击高亮事件
            nodeItem.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                
                const nodeDiv = (nodeItem as HTMLElement).closest('.tree-node') as HTMLElement;
                const nodeId = nodeDiv.getAttribute('data-node-id');
                if (!nodeId) return;
                const nodeData = this.findNodeById(this.currentNodes, nodeId);
                
                if (nodeData && this.nodeHighlightCallback) {
                    this.nodeHighlightCallback(nodeData);
                    
                    // 显示提示
                    if (this.showTooltipCallback) {
                        this.showTooltipCallback('节点已高亮显示', nodeItem as HTMLElement);
                    }
                }
            });
        });
    }

    /**
     * 保存当前展开状态
     */
    private saveExpandedState(): void {
        if (!this.treeContainer) return;
        
        // 从DOM中读取当前展开的节点ID
        this.treeContainer.querySelectorAll('.tree-node').forEach(nodeDiv => {
            const nodeId = nodeDiv.getAttribute('data-node-id');
            const childrenDiv = nodeDiv.querySelector('.node-children');
            
            if (nodeId && childrenDiv && childrenDiv.classList.contains('expanded')) {
                this.expandedNodeIds.add(nodeId);
            }
        });
    }

    /**
     * 恢复展开状态
     */
    private restoreExpandedState(): void {
        if (!this.treeContainer) return;
        
        // 根据保存的ID恢复展开状态
        this.treeContainer.querySelectorAll('.tree-node').forEach(nodeDiv => {
            const nodeId = nodeDiv.getAttribute('data-node-id');
            
            if (nodeId && this.expandedNodeIds.has(nodeId)) {
                const childrenDiv = nodeDiv.querySelector('.node-children');
                const expandBtn = nodeDiv.querySelector('.node-expand');
                
                if (childrenDiv && expandBtn) {
                    childrenDiv.classList.add('expanded');
                    expandBtn.classList.add('expanded');
                }
            }
        });
    }

    /**
     * 根据ID查找节点
     * @param nodes - 节点数组
     * @param nodeId - 节点ID
     * @returns 节点数据
     */
    private findNodeById(nodes: NodeData[], nodeId: string): NodeData | null {
        for (const node of nodes) {
            if (node.id === nodeId) {
                return node;
            }
            if (node.children) {
                const found = this.findNodeById(node.children, nodeId);
                if (found) return found;
            }
        }
        return null;
    }

    /**
     * 设置节点高亮回调
     * @param callback - 回调函数
     */
    onNodeHighlight(callback: (nodeData: NodeData) => void): void {
        this.nodeHighlightCallback = callback;
    }

    /**
     * 设置节点选择回调
     * @param callback - 回调函数
     */
    onNodeSelect(callback: (nodeData: NodeData) => void): void {
        this.nodeSelectCallback = callback;
    }

    /**
     * 设置显示提示回调
     * @param callback - 回调函数
     */
    onShowTooltip(callback: (text: string, element: HTMLElement) => void): void {
        this.showTooltipCallback = callback;
    }

    /**
     * 销毁面板
     */
    destroy(): void {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.treeContainer = null;
        this.filterInput = null;
    }
}

export default NodeTreePanel;