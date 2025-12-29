import DrawerUI from './DrawerUI';
import NodeManager from './NodeManager';
import ResourceMemoryPanel from './ResourceMemoryPanel';
import RightDrawerUI from './RightDrawerUI';

/**
 * 主应用类
 * 负责协调所有UI组件和功能模块
 */
class MainApp {
    private drawerUI: DrawerUI;
    private rightDrawerUI: RightDrawerUI;
    private resourceMemoryPanel: ResourceMemoryPanel;
    private nodeManager: NodeManager;

    constructor() {
        this.drawerUI = new DrawerUI();
        this.rightDrawerUI = new RightDrawerUI();
        this.resourceMemoryPanel = new ResourceMemoryPanel();
        this.nodeManager = new NodeManager();
    }

    /**
     * 初始化应用
     */
    initialize(): void {
        this.createUI();
        this.bindEvents();
    }

    /**
     * 创建UI界面
     */
    private createUI(): void {
        // 创建左侧抽屉（节点调试器）
        this.drawerUI.create();

        // 创建右侧抽屉（资源监控器）
        this.rightDrawerUI.create();

        // 在右侧抽屉中创建资源内存面板
        const rightContainer = this.rightDrawerUI.getContentContainer();
        this.resourceMemoryPanel.create(rightContainer);

        // 在左侧抽屉中初始化节点管理器
        const leftContainer = this.drawerUI.getContentContainer();
        this.nodeManager.initialize(
            leftContainer,
            this.drawerUI.showTooltip.bind(this.drawerUI)
        );
    }

    /**
     * 绑定事件
     */
    private bindEvents(): void {
        // 左侧抽屉切换事件
        this.drawerUI.onToggle((isOpen: boolean) => {
            this.handleDrawerToggle(isOpen);
        });

        // 右侧抽屉切换事件
        this.rightDrawerUI.onToggle((isOpen: boolean) => {
            this.handleRightDrawerToggle(isOpen);
        });
    }

    /**
     * 处理左侧抽屉切换
     * @param isOpen - 是否打开
     */
    private handleDrawerToggle(isOpen: boolean): void {
        if (isOpen) {
            // 开始节点监控
            this.nodeManager.startNodeMonitoring();
        } else {
            // 停止节点监控并重置宽度
            this.nodeManager.stopNodeMonitoring();
            this.drawerUI.resetWidth();
        }
    }

    /**
     * 处理右侧抽屉切换
     * @param isOpen - 是否打开
     */
    private handleRightDrawerToggle(isOpen: boolean): void {
        if (isOpen) {
            // 刷新资源数据并激活监控
            this.resourceMemoryPanel.refreshData();
            console.log('<!----右侧抽屉已展开，资源内存监控已激活---->');
        } else {
            // 重置宽度
            this.rightDrawerUI.resetWidth();
            console.log('<!----右侧抽屉已收起---->');
        }
    }

    /**
     * 销毁应用
     */
    destroy(): void {
        if (this.nodeManager) {
            this.nodeManager.destroy();
        }

        if (this.drawerUI) {
            this.drawerUI.destroy();
        }

        if (this.rightDrawerUI) {
            this.rightDrawerUI.destroy();
        }

        if (this.resourceMemoryPanel) {
            this.resourceMemoryPanel.destroy();
        }
    }
}

export default MainApp;