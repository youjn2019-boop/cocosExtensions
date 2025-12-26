import Logger from './Logger';
import NodeCalculator, { NodeData } from './NodeCalculator';
import NodePropertyPanel from './NodePropertyPanel';
import NodeTreePanel from './NodeTreePanel';


/**
 * 节点管理器
 * 负责协调节点树面板和属性面板的交互，管理节点监控
 */
class NodeManager {
    private nodeTreePanel: NodeTreePanel | null = null;
    private propertyPanel: NodePropertyPanel | null = null;
    private calculator: NodeCalculator;
    private selectedNode: NodeData | null = null;
    private nodeUpdateInterval: number | null = null;
    private showTooltipCallback: ((text: string, element: HTMLElement) => void) | null = null;

    constructor() {
        this.calculator = new NodeCalculator();
    }

    /**
     * 初始化节点管理器
     * @param container - 容器元素
     * @param showTooltipCallback - 显示提示回调
     */
    initialize(container: HTMLElement | null, showTooltipCallback: ((text: string, element: HTMLElement) => void) | null): void {
        if (!container) return;
        
        this.showTooltipCallback = showTooltipCallback;
        
        // 创建节点树面板
        this.nodeTreePanel = new NodeTreePanel();
        this.nodeTreePanel.create(container);
        
        // 创建属性面板
        this.propertyPanel = new NodePropertyPanel();
        this.propertyPanel.create(container);
        
        // 绑定事件
        this.bindEvents();
        
        // 默认开始节点监控（因为勾选框默认是勾选的）
        this.startNodeMonitoring();
        
        Logger.log('节点管理器已初始化');
    }

    /**
     * 绑定事件
     */
    private bindEvents(): void {
        if (!this.nodeTreePanel || !this.propertyPanel) return;

        // 节点选择事件
        this.nodeTreePanel.onNodeSelect((nodeData: NodeData) => {
            this.selectNode(nodeData);
        });

        // 节点高亮事件
        this.nodeTreePanel.onNodeHighlight((nodeData: NodeData) => {
            this.highlightNodeInScene(nodeData);
        });

        // 属性变化事件
        this.propertyPanel.onPropertyChange((key: string, value: any) => {
            if (this.selectedNode) {
                this.updateNodeProperty(this.selectedNode, key, value);
            }
        });

        // 刷新节点事件
        this.propertyPanel.onRefreshNode((nodeData: NodeData) => {
            if (nodeData.ccNode) {
                return this.convertCCNodeToNodeData(nodeData.ccNode);
            } else {
                console.warn('无法刷新节点：ccNode引用不存在');
                return nodeData;
            }
        });

        // 自动刷新状态变化事件
        this.nodeTreePanel.onAutoRefreshChange((isAutoRefresh: boolean) => {
            if (isAutoRefresh) {
                this.startNodeMonitoring();
            } else {
                this.stopNodeMonitoring();
            }
        });

        // 手动刷新事件
        this.nodeTreePanel.onManualRefresh(() => {
            this.updateNodeTree();
        });

        // 设置显示提示回调
        if (this.showTooltipCallback) {
            this.nodeTreePanel.onShowTooltip(this.showTooltipCallback);
            this.propertyPanel.onShowTooltip(this.showTooltipCallback);
        }
    }

    /**
     * 选择节点
     * @param nodeData - 节点数据
     */
    private selectNode(nodeData: NodeData): void {
        this.selectedNode = nodeData;
        if (this.propertyPanel) {
            this.propertyPanel.displayNodeProperties(nodeData);
        }
        Logger.log('已选择节点:', nodeData.name);
    }

    /**
     * 开始节点监控
     */
    startNodeMonitoring(): void {
        if (this.nodeUpdateInterval) {
            this.stopNodeMonitoring();
        }

        this.nodeUpdateInterval = window.setInterval(() => {
            this.updateNodeTree();
        }, 2000);

        console.log('节点监控已开始');
    }

    /**
     * 停止节点监控
     */
    stopNodeMonitoring(): void {
        if (this.nodeUpdateInterval) {
            clearInterval(this.nodeUpdateInterval);
            this.nodeUpdateInterval = null;
            console.log('节点监控已停止');
        }
    }

    /**
     * 更新节点树
     */
    private updateNodeTree(): void {
        const rootNodes = this.getAllRootNodes();
        if (this.nodeTreePanel) {
            this.nodeTreePanel.updateTree(rootNodes);
        }
    }

    /**
     * 获取所有根节点
     * @returns 根节点数组
     */
    private getAllRootNodes(): NodeData[] {
        const rootNodes: NodeData[] = [];
        
        try {
            const cc = (window as any).cc;
            const director = cc?.director;
            
            if (director) {
                const scene = director.getScene();
                if (scene && scene.children && scene.children.length > 0) {
                    scene.children.forEach((child: any) => {
                        const nodeData = this.convertCCNodeToNodeData(child);
                        if (nodeData) {
                            rootNodes.push(nodeData);
                        }
                    });
                }
            }
        } catch (error) {
            console.warn('无法获取Creator场景节点:', error);
        }

        return rootNodes;
    }

    /**
     * 转换CC节点为节点数据
     * @param ccNode - CC节点
     * @returns 节点数据
     */
    private convertCCNodeToNodeData(ccNode: any): NodeData | null {
        return this.calculator.convertCCNodeToNodeData(ccNode);
    }

    /**
     * 更新节点属性
     * @param nodeData - 节点数据
     * @param key - 属性键
     * @param value - 新值
     */
    private updateNodeProperty(nodeData: NodeData, key: string, value: any): void {
        if (nodeData.ccNode) {
            try {
                this.calculator.updateNodeProperty(nodeData, key, value);
            } catch (error) {
                console.error('更新节点属性失败:', error);
            }
        }
    }

    /**
     * 在场景中高亮节点
     * @param nodeData - 节点数据
     */
    private highlightNodeInScene(nodeData: NodeData): void {
        const ccNode = nodeData.ccNode;
        
        if (ccNode) {
            if (typeof document !== 'undefined') {
                try {
                    const rect = this.calculator.getNodeScreenRect(ccNode);
                    if (!rect) {
                        console.warn('无法获取节点屏幕位置');
                        return;
                    }

                    Logger.log('显示到dom上的rect', rect.x, rect.y, rect.width, rect.height);
                    this.calculator.createDOMHighlight(rect);
                } catch (error) {
                    console.error('高亮节点时出错:', error);
                }
            } else {
                console.warn('非浏览器环境，无法显示DOM高亮效果');
            }
        } else {
            console.warn('无法高亮节点：ccNode引用不存在');
        }
    }

    /**
     * 销毁节点管理器
     */
    destroy(): void {
        this.stopNodeMonitoring();
        
        if (this.nodeTreePanel) {
            this.nodeTreePanel.destroy();
            this.nodeTreePanel = null;
        }
        
        if (this.propertyPanel) {
            this.propertyPanel.destroy();
            this.propertyPanel = null;
        }
        
        this.selectedNode = null;
    }
}

export default NodeManager;