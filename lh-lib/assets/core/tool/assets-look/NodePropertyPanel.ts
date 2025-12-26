import { NodeData } from "./NodeCalculator";

/**
 * 属性信息接口
 */
interface PropertyInfo {
    value: any;
    type: string;
    editable: boolean;
    key?: string;
}

/**
 * 组件数据接口
 */
interface ComponentData {
    name: string;
    type: string;
    enabled: boolean;
    properties: Record<string, PropertyInfo>;
}

/**
 * 节点属性面板
 * 负责显示和编辑选中节点的属性信息
 */
class NodePropertyPanel {
    private container: HTMLElement | null = null;
    private header: HTMLElement | null = null;
    private propertiesContainer: HTMLElement | null = null;
    private refreshButton: HTMLButtonElement | null = null;
    private debugButton: HTMLButtonElement | null = null;
    private resizeHandle: HTMLElement | null = null;
    private isResizing: boolean = false;
    private startY: number = 0;
    private startHeight: number = 0;
    private minHeight: number = 200;
    private maxHeight: number = 800;
    private currentNode: NodeData | null = null;
    private propertyChangeCallback: ((key: string, value: any) => void) | null = null;
    private refreshNodeCallback: ((nodeData: NodeData) => NodeData | null) | null = null;
    private showTooltipCallback: ((text: string, element: HTMLElement) => void) | null = null;

    /**
     * 创建属性面板
     * @param parent - 父容器
     */
    create(parent: HTMLElement): void {
        this.container = document.createElement('div');
        this.container.className = 'property-panel node-inspector-panel';
        
        this.createHeader();
        this.createPropertiesContainer();
        this.createResizeHandle();
        this.bindResizeEvents();
        this.applyStyles();
        
        parent.appendChild(this.container);
        this.displayEmptyState();
    }

    /**
     * 创建头部
     */
    private createHeader(): void {
        this.header = document.createElement('div');
        this.header.className = 'property-panel-header';
        this.header.textContent = '节点属性';

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'header-buttons';

        // 刷新按钮
        this.refreshButton = document.createElement('button');
        this.refreshButton.textContent = '刷新';
        this.refreshButton.title = '重新读取选中节点的属性';
        this.refreshButton.className = 'header-btn';
        this.refreshButton.style.display = 'none';
        this.refreshButton.addEventListener('click', () => {
            this.refreshNodeProperties();
        });

        // 调试按钮
        this.debugButton = document.createElement('button');
        this.debugButton.textContent = '输出';
        this.debugButton.title = '输出选中节点的路径和属性';
        this.debugButton.className = 'header-btn';
        this.debugButton.disabled = true;
        this.debugButton.addEventListener('click', () => {
            this.outputNodeDebugInfo();
        });

        buttonContainer.appendChild(this.refreshButton);
        buttonContainer.appendChild(this.debugButton);
        this.header.appendChild(buttonContainer);
        this.container!.appendChild(this.header);
    }

    /**
     * 创建属性容器
     */
    private createPropertiesContainer(): void {
        this.propertiesContainer = document.createElement('div');
        this.propertiesContainer.className = 'properties-container';
        this.container!.appendChild(this.propertiesContainer);
    }

    /**
     * 创建调整大小的手柄
     */
    private createResizeHandle(): void {
        this.resizeHandle = document.createElement('div');
        this.resizeHandle.className = 'resize-handle';
        this.resizeHandle.title = '拖动调整高度';
        
        this.container!.appendChild(this.resizeHandle);
    }

    /**
     * 绑定调整大小事件
     */
    private bindResizeEvents(): void {
        if (!this.resizeHandle) return;
        
        // 绑定鼠标按下事件
        this.resizeHandle.addEventListener('mousedown', (e: MouseEvent) => {
            this.startResizing(e);
        });
    }
    
    /**
     * 开始调整大小
     */
    private startResizing(e: MouseEvent): void {
        this.isResizing = true;
        this.startY = e.clientY;
        this.startHeight = this.container?.clientHeight || 0;
        
        document.addEventListener('mousemove', this.handleResizing, { capture: true });
        document.addEventListener('mouseup', this.stopResizing, { capture: true });
        document.addEventListener('mouseleave', this.stopResizing);
        window.addEventListener('blur', this.stopResizing);
        
        // 添加全局样式类
        document.body.classList.add('resizing-property-panel');
        
        // 设置鼠标样式
        document.body.style.cursor = 'row-resize';
        
        // 高亮手柄
        if (this.resizeHandle) {
            this.resizeHandle.style.background = 'rgba(0, 120, 212, 0.5)';
        }
        
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }

    /**
     * 处理调整大小
     */
    private handleResizing = (e: MouseEvent): void => {
        if (!this.isResizing || !this.container || !this.container.parentElement) return;
        
        const deltaY = this.startY - e.clientY;
        const parentHeight = this.container.parentElement.clientHeight;
        const maxHeight = parentHeight - 50;
        const newHeight = Math.max(
            this.minHeight,
            Math.min(maxHeight, this.startHeight + deltaY)
        );
        
        this.container.style.height = `${newHeight}px`;
        
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    };



    /**
     * 停止调整大小
     */
    private stopResizing = (): void => {
        if (this.isResizing) {
            this.isResizing = false;
            document.removeEventListener('mousemove', this.handleResizing, { capture: true });
            document.removeEventListener('mouseup', this.stopResizing, { capture: true });
            document.removeEventListener('mouseleave', this.stopResizing);
            window.removeEventListener('blur', this.stopResizing);
            
            // 移除全局样式类
            document.body.classList.remove('resizing-property-panel');
            
            // 恢复鼠标样式
            document.body.style.cursor = '';
            
            // 恢复手柄样式
            if (this.resizeHandle) {
                this.resizeHandle.style.background = '';
            }
        }
    };

    /**
     * 应用样式
     */
    private applyStyles(): void {
        const style = document.createElement('style');
        style.textContent = `
            .property-panel {
                flex: 0 0 auto;
                min-height: 200px;
                height: 400px; /* 默认高度 */
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                position: relative;
            }

            .property-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 10px;
                background: #1a1a1a;
                border-bottom: 1px solid #444;
                font-size: 14px;
                font-weight: bold;
            }

            .header-buttons {
                display: flex;
                gap: 5px;
            }

            .header-btn {
                padding: 3px 8px;
                background: #0078d4;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 11px;
            }

            .header-btn:hover:not(:disabled) {
                background: #106ebe;
            }

            .header-btn:disabled {
                background: #555;
                cursor: not-allowed;
            }

            .properties-container {
                flex: 1;
                overflow-y: auto;
                padding: 8px;
            }

            .property-group {
                margin-bottom: 12px;
            }

            .property-group-title {
                font-weight: bold;
                color: #4CAF50;
                margin-bottom: 6px;
                font-size: 12px;
                border-bottom: 1px solid #444;
                padding-bottom: 2px;
            }

            .property-item {
                display: flex;
                align-items: center;
                margin-bottom: 4px;
                font-size: 11px;
            }

            .property-label {
                flex: 0 0 80px;
                color: #ccc;
                font-weight: normal;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .property-value {
                flex: 1;
                margin-left: 8px;
            }

            .property-input {
                width: 100%;
                padding: 2px 4px;
                background: #3a3a3a;
                color: white;
                border: 1px solid #555;
                border-radius: 2px;
                font-size: 11px;
                box-sizing: border-box;
            }

            .property-input:focus {
                outline: none;
                border-color: #0078d4;
            }

            .property-readonly {
                color: #888;
                font-family: monospace;
                word-break: break-all;
            }

            .property-boolean {
                display: flex;
                align-items: center;
            }

            .property-checkbox {
                margin: 0;
            }

            .property-vector {
                display: flex;
                gap: 4px;
            }

            .property-vector input {
                flex: 1;
                min-width: 0;
            }

            .property-color {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .property-color-preview {
                width: 20px;
                height: 16px;
                border: 1px solid #555;
                border-radius: 2px;
            }

            .property-empty {
                text-align: center;
                color: #888;
                padding: 20px;
                font-style: italic;
            }

            .component-section {
                margin-bottom: 15px;
                border: 1px solid #444;
                border-radius: 4px;
                overflow: hidden;
            }

            .component-header {
                background: #333;
                padding: 6px 8px;
                font-weight: bold;
                font-size: 12px;
                color: #fff;
                border-bottom: 1px solid #444;
            }

            .component-properties {
                padding: 8px;
            }

            /* 调整大小手柄样式 */
            .resize-handle {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                cursor: row-resize;
                background: transparent;
                z-index: 10; /* 确保手柄在最上层 */
                transition: background 0.2s ease;
            }

            .resize-handle:hover {
                background: rgba(0, 120, 212, 0.5);
            }

            /* 拖拽时的全局样式 */
            body.resizing-property-panel {
                user-select: none;
                cursor: row-resize !important;
            }

            body.resizing-property-panel * {
                pointer-events: none !important;
            }

            body.resizing-property-panel .property-panel {
                pointer-events: auto !important;
            }

            body.resizing-property-panel .resize-handle {
                pointer-events: auto !important;
            }

            /* 防止iframe或canvas干扰 */
            body.resizing-property-panel iframe,
            body.resizing-property-panel canvas,
            body.resizing-property-panel embed,
            body.resizing-property-panel object {
                pointer-events: none !important;
            }

            /* 滚动条样式 */
            .properties-container::-webkit-scrollbar {
                width: 8px;
            }

            .properties-container::-webkit-scrollbar-track {
                background: #1e1e1e;
            }

            .properties-container::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 4px;
            }

            .properties-container::-webkit-scrollbar-thumb:hover {
                background: #666;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 显示节点属性
     * @param nodeData - 节点数据
     */
    displayNodeProperties(nodeData: NodeData): void {
        this.currentNode = nodeData;
        
        if (!nodeData) {
            this.displayEmptyState();
            return;
        }

        // 显示按钮
        this.refreshButton!.style.display = 'inline-block';
        this.debugButton!.disabled = false;

        // 清空容器
        this.propertiesContainer!.innerHTML = '';

        // 基本信息
        let baseProperties = {
            '激活': { value: nodeData.active, type: 'boolean', editable: true, key: 'active' },
            '名称': { value: nodeData.name, type: 'string', editable: true, key: 'name' },
            '坐标': { value: nodeData.position, type: 'vector3', editable: true, key: 'position' },
            '缩放': { value: nodeData.scale, type: 'vector3', editable: true, key: 'scale' },
            '角度': { value: nodeData.angle, type: 'number', editable: true, key: 'angle' },
            // '类型': { value: nodeData.type, type: 'readonly', editable: false },
            // 'UUID': { value: nodeData.uuid || 'N/A', type: 'readonly', editable: false },
        }
        
        // if (nodeData.transform) {
        //     const transform = nodeData.transform;
        //     baseProperties['位置'] = { value: transform.position, type: 'vector3', editable: true, key: 'position' };
        //     // baseProperties['旋转'] = { value: transform.rotation, type: 'vector3', editable: true, key: 'rotation' };
        //     baseProperties['缩放'] = { value: transform.scale, type: 'vector3', editable: true, key: 'scale' };
        // }
        
        // if (nodeData.size) {
        //     baseProperties['尺寸'] = { value: nodeData.size, type: 'vector2', editable: true, key: 'size' };
        // }

        this.createPropertyGroup('Node', baseProperties);

        // // 变换信息
        // if (nodeData.transform) {
        //     const transform = nodeData.transform;
        //     this.createPropertyGroup('变换', {
        //         '位置': { value: transform.position, type: 'vector3', editable: true, key: 'position' },
        //         '旋转': { value: transform.rotation, type: 'vector3', editable: true, key: 'rotation' },
        //         '缩放': { value: transform.scale, type: 'vector3', editable: true, key: 'scale' }
        //     });
        // }

        // // 尺寸信息
        // if (nodeData.size) {
        //     this.createPropertyGroup('尺寸', {
        //         '宽度': { value: nodeData.size.width, type: 'number', editable: true, key: 'width' },
        //         '高度': { value: nodeData.size.height, type: 'number', editable: true, key: 'height' }
        //     });
        // }

        // // 层级信息
        // this.createPropertyGroup('层级信息', {
        //     '子节点数量': { value: nodeData.children ? nodeData.children.length : 0, type: 'readonly', editable: false },
        //     '父节点': { value: nodeData.parent || '无', type: 'readonly', editable: false },
        //     '层级': { value: nodeData.zIndex || 0, type: 'number', editable: true, key: 'zIndex' }
        // });

        // 组件信息
        if (nodeData.components && nodeData.components.length > 0) {
            nodeData.components.forEach(component => {
                this.createComponentSection(component);
            });
        }

        // // 其他属性
        // if (nodeData.otherProperties) {
        //     this.createPropertyGroup('其他属性', nodeData.otherProperties);
        // }
    }

    /**
     * 创建属性组
     * @param title - 组标题
     * @param properties - 属性对象
     */
    private createPropertyGroup(title: string, properties: Record<string, PropertyInfo>): void {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'property-group';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'property-group-title';
        titleDiv.textContent = title;
        groupDiv.appendChild(titleDiv);

        Object.entries(properties).forEach(([key, prop]) => {
            const propertyDiv = this.createPropertyItem(key, prop);
            groupDiv.appendChild(propertyDiv);
        });

        this.propertiesContainer!.appendChild(groupDiv);
    }

    /**
     * 创建组件区域
     * @param component - 组件数据
     */
    private createComponentSection(component: ComponentData): void {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'component-section';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'component-header';
        headerDiv.textContent = `${component.name}`;
        sectionDiv.appendChild(headerDiv);

        const propertiesDiv = document.createElement('div');
        propertiesDiv.className = 'component-properties';

        if (component.properties) {
            Object.entries(component.properties).forEach(([key, prop]) => {
                const propertyDiv = this.createPropertyItem(key, prop);
                propertiesDiv.appendChild(propertyDiv);
            });
        }

        sectionDiv.appendChild(propertiesDiv);
        this.propertiesContainer!.appendChild(sectionDiv);
    }

    /**
     * 创建属性项
     * @param label - 属性标签
     * @param property - 属性配置
     * @returns 属性元素
     */
    private createPropertyItem(label: string, property: PropertyInfo): HTMLElement {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'property-item';

        const labelDiv = document.createElement('div');
        labelDiv.className = 'property-label';
        labelDiv.textContent = label;
        labelDiv.title = label;

        const valueDiv = document.createElement('div');
        valueDiv.className = 'property-value';

        // 根据类型创建不同的输入控件
        switch (property.type) {
            case 'string':
            case 'number':
                if (property.editable) {
                    const input = document.createElement('input');
                    input.className = 'property-input';
                    input.type = property.type === 'number' ? 'number' : 'text';
                    input.value = property.value || '';
                    input.addEventListener('change', () => {
                        this.handlePropertyChange(property.key!, input.value);
                    });
                    valueDiv.appendChild(input);
                } else {
                    valueDiv.className += ' property-readonly';
                    valueDiv.textContent = property.value || 'N/A';
                }
                break;

            case 'boolean':
                if (property.editable) {
                    const checkboxDiv = document.createElement('div');
                    checkboxDiv.className = 'property-boolean';
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'property-checkbox';
                    checkbox.checked = !!property.value;
                    checkbox.addEventListener('change', () => {
                        this.handlePropertyChange(property.key!, checkbox.checked);
                    });
                    checkboxDiv.appendChild(checkbox);
                    valueDiv.appendChild(checkboxDiv);
                } else {
                    valueDiv.className += ' property-readonly';
                    valueDiv.textContent = property.value ? '是' : '否';
                }
                break;

            case 'vector2':
                if (property.editable && property.value) {
                    const vectorDiv = document.createElement('div');
                    vectorDiv.className = 'property-vector';
                    
                    ['x', 'y'].forEach(axis => {
                        const input = document.createElement('input');
                        input.className = 'property-input';
                        input.type = 'number';
                        input.step = '0.01';
                        input.value = property.value[axis] || 0;
                        input.placeholder = axis.toUpperCase();
                        input.addEventListener('change', () => {
                            const newValue = { ...property.value };
                            newValue[axis] = parseFloat(input.value) || 0;
                            this.handlePropertyChange(property.key!, newValue);
                        });
                        vectorDiv.appendChild(input);
                    });
                    
                    valueDiv.appendChild(vectorDiv);
                } else {
                    valueDiv.className += ' property-readonly';
                    const vec = property.value || { x: 0, y: 0 };
                    valueDiv.textContent = `(${vec.x}, ${vec.y})`;
                }
                break;

            case 'vector3':
                if (property.editable && property.value) {
                    const vectorDiv = document.createElement('div');
                    vectorDiv.className = 'property-vector';
                    
                    ['x', 'y', 'z'].forEach(axis => {
                        const input = document.createElement('input');
                        input.className = 'property-input';
                        input.type = 'number';
                        input.step = '0.01';
                        input.value = property.value[axis] || 0;
                        input.placeholder = axis.toUpperCase();
                        input.addEventListener('change', () => {
                            const newValue = { ...property.value };
                            newValue[axis] = parseFloat(input.value) || 0;
                            this.handlePropertyChange(property.key!, newValue);
                        });
                        vectorDiv.appendChild(input);
                    });
                    
                    valueDiv.appendChild(vectorDiv);
                } else {
                    valueDiv.className += ' property-readonly';
                    const vec = property.value || { x: 0, y: 0, z: 0 };
                    valueDiv.textContent = `(${vec.x}, ${vec.y}, ${vec.z})`;
                }
                break;

            case 'color':
                if (property.editable && property.value) {
                    const colorDiv = document.createElement('div');
                    colorDiv.className = 'property-color';
                    
                    const preview = document.createElement('div');
                    preview.className = 'property-color-preview';
                    preview.style.backgroundColor = this.colorToHex(property.value);
                    
                    const input = document.createElement('input');
                    input.className = 'property-input';
                    input.type = 'color';
                    input.value = this.colorToHex(property.value);
                    input.addEventListener('change', () => {
                        const newColor = this.hexToColor(input.value);
                        preview.style.backgroundColor = input.value;
                        this.handlePropertyChange(property.key!, newColor);
                    });
                    
                    colorDiv.appendChild(preview);
                    colorDiv.appendChild(input);
                    valueDiv.appendChild(colorDiv);
                } else {
                    valueDiv.className += ' property-readonly';
                    valueDiv.textContent = JSON.stringify(property.value);
                }
                break;

            default:
                valueDiv.className += ' property-readonly';
                valueDiv.textContent = typeof property.value === 'object' 
                    ? JSON.stringify(property.value) 
                    : (property.value || 'N/A');
        }

        itemDiv.appendChild(labelDiv);
        itemDiv.appendChild(valueDiv);
        return itemDiv;
    }

    /**
     * 处理属性变化
     * @param key - 属性键
     * @param value - 新值
     */
    private handlePropertyChange(key: string, value: any): void {
        if (this.propertyChangeCallback) {
            this.propertyChangeCallback(key, value);
        }
    }

    /**
     * 刷新节点属性
     */
    private refreshNodeProperties(): void {
        if (this.currentNode && this.refreshNodeCallback) {
            try {
                const updatedNode = this.refreshNodeCallback(this.currentNode);
                if (updatedNode) {
                    this.displayNodeProperties(updatedNode);
                }
                console.log("节点属性已刷新");
                
                if (this.showTooltipCallback && this.refreshButton) {
                    this.showTooltipCallback('属性已刷新', this.refreshButton);
                }
            } catch (error) {
                console.error("刷新节点属性失败:", error);
            }
        } else {
            console.warn("没有设置刷新回调函数");
        }
    }

    /**
     * 输出节点调试信息
     */
    private outputNodeDebugInfo(): void {
        if (!this.currentNode) {
            console.warn("没有选中的节点");
            return;
        }

        const nodePath = this.getNodePath(this.currentNode);
        const nodeProperties = this.getNodeProperties(this.currentNode);

        console.log("=== 节点调试信息 ===");
        console.log("节点路径:", nodePath);
        console.log("节点属性:", nodeProperties);
        console.log("原始节点对象:", this.currentNode);
        console.log("==================");

        if (this.debugButton && this.showTooltipCallback) {
            this.showTooltipCallback('节点信息已输出到控制台', this.debugButton);
        }
    }

    /**
     * 获取节点路径
     * @param nodeData - 节点数据
     * @returns 节点路径
     */
    private getNodePath(nodeData: NodeData): string {
        const path: string[] = [];
        let current: NodeData | undefined = nodeData;
        
        while (current) {
            path.unshift(current.name || '未命名节点');
            current = current.parentNode; // 假设有父节点引用
        }
        
        return path.join(' > ');
    }

    /**
     * 获取节点属性摘要
     * @param nodeData - 节点数据
     * @returns 属性摘要
     */
    private getNodeProperties(nodeData: NodeData): Record<string, any> {
        return {
            基本信息: {
                名称: nodeData.name,
                类型: nodeData.type,
                激活: nodeData.active,
                UUID: nodeData.uuid
            },
            // 变换信息: nodeData.transform,
            // 尺寸信息: nodeData.size,
            层级信息: {
                子节点数量: nodeData.children ? nodeData.children.length : 0,
                父节点: nodeData.parent || '无'
            },
            组件列表: nodeData.components ? nodeData.components.map(c => c.name) : []
        };
    }

    /**
     * 显示空状态
     */
    private displayEmptyState(): void {
        this.propertiesContainer!.innerHTML = '';
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'property-empty';
        emptyDiv.textContent = '请选择一个节点';
        this.propertiesContainer!.appendChild(emptyDiv);
        
        this.refreshButton!.style.display = 'none';
        this.debugButton!.disabled = true;
    }

    /**
     * 颜色转换辅助方法
     */
    private colorToHex(color: any): string {
        if (typeof color === 'string') return color;
        if (color && typeof color === 'object') {
            const r = Math.round((color.r || 0) * 255);
            const g = Math.round((color.g || 0) * 255);
            const b = Math.round((color.b || 0) * 255);
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
        return '#ffffff';
    }

    private hexToColor(hex: string): { r: number; g: number; b: number; a: number } {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return { r, g, b, a: 1 };
    }

    /**
     * 设置属性变化回调
     * @param callback - 回调函数
     */
    onPropertyChange(callback: (key: string, value: any) => void): void {
        this.propertyChangeCallback = callback;
    }

    /**
     * 设置刷新节点回调
     * @param callback - 回调函数
     */
    onRefreshNode(callback: (nodeData: NodeData) => NodeData | null): void {
        this.refreshNodeCallback = callback;
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
        // 清理资源
        if (this.resizeHandle) {
            this.resizeHandle.removeEventListener('mousedown', (e) => this.startResizing(e));
        }
        // 确保清理全局事件监听器
        document.removeEventListener('mousemove', this.handleResizing);
        document.removeEventListener('mouseup', this.stopResizing);
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.propertiesContainer = null;
        this.currentNode = null;
        this.propertyChangeCallback = null;
        this.refreshNodeCallback = null;
        this.showTooltipCallback = null;
    }
}

export default NodePropertyPanel;