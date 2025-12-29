import TooltipManager from './TooltipManager';

/**
 * 右侧抽屉UI组件
 * 负责管理右侧的资源内存监控界面
 */
class RightDrawerUI {
    private container: HTMLElement | null = null;
    private content: HTMLElement | null = null;
    private toggleButton: HTMLElement | null = null;
    private resizeHandle: HTMLElement | null = null;
    private isOpen: boolean = false;
    private toggleCallback: ((isOpen: boolean) => void) | null = null;
    private isResizing: boolean = false;
    private startX: number = 0;
    private startWidth: number = 0;
    private minWidth: number = 200;
    private maxWidth: number = 600;
    private defaultWidth: number = 350;
    private tooltipManager: TooltipManager | null = null;

    /**
     * 创建右侧抽屉UI
     */
    create(): void {
        this.createContainer();
        this.createToggleButton();
        this.createContent();
        this.createResizeHandle();
        this.applyStyles();
        this.bindEvents();
        this.bindResizeEvents();
        this.setInitialState();
        if (this.container) {
            this.tooltipManager = new TooltipManager(this.container);
        }
    }

    /**
     * 创建容器
     */
    private createContainer(): void {
        this.container = document.createElement("div");
        this.container.id = "resource-inspector-drawer";
        this.container.style.width = `${this.defaultWidth}px`;
        document.body.appendChild(this.container);
    }

    /**
     * 创建切换按钮
     */
    private createToggleButton(): void {
        this.toggleButton = document.createElement("div");
        this.toggleButton.id = "resource-inspector-toggle";
        this.toggleButton.innerHTML = "内存监控";
        this.toggleButton.title = "切换资源监控器";
        if (this.container) {
            this.container.appendChild(this.toggleButton);
        }
    }

    /**
     * 创建内容区域
     */
    private createContent(): void {
        this.content = document.createElement("div");
        this.content.id = "resource-inspector-content";
        if (this.container) {
            this.container.appendChild(this.content);
        }
    }

    /**
     * 创建调整大小手柄
     */
    private createResizeHandle(): void {
        this.resizeHandle = document.createElement("div");
        this.resizeHandle.id = "resource-inspector-resize-handle";
        if (this.container) {
            this.container.appendChild(this.resizeHandle);
        }
    }

    /**
     * 应用样式
     */
    private applyStyles(): void {
        const style = document.createElement("style");
        style.textContent = `
            #resource-inspector-drawer {
                position: fixed;
                top: 0;
                right: 0;
                height: 100vh;
                background: #2d2d2d;
                border-left: 1px solid #444;
                z-index: 10000;
                transition: transform 0.3s ease;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 12px;
                color: #fff;
                box-shadow: -2px 0 10px rgba(0,0,0,0.3);
                min-width: ${this.minWidth}px;
                max-width: ${this.maxWidth}px;
            }

            #resource-inspector-drawer.closed {
                transform: translateX(100%);
            }

            #resource-inspector-toggle {
                position: absolute;
                top: calc(50vh - 100px);
                left: -30px;
                transform: translateY(-50%);
                width: 30px;
                height: 160px;
                background: #2d2d2d;
                border: 1px solid #444;
                border-right: none;
                border-radius: 5px 0 0 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 14px;
                color: #fff;
                user-select: none;
                transition: background 0.2s ease;
                writing-mode: vertical-rl;
                text-orientation: mixed;
            }

            #resource-inspector-toggle:hover {
                background: #3d3d3d;
            }

            #resource-inspector-resize-handle {
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 100%;
                background: transparent;
                cursor: col-resize;
                z-index: 1001;
                transition: background 0.2s ease;
            }

            #resource-inspector-resize-handle:hover {
                background: #0078d4;
            }

            #resource-inspector-content {
                width: 100%;
                height: 100%;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                padding-left: 4px;
            }

            .resource-inspector-panel {
                background: #2d2d2d;
                border-bottom: 1px solid #444;
                overflow: auto;
            }

            .resource-inspector-panel h3 {
                margin: 0;
                padding: 10px;
                font-size: 14px;
                font-weight: bold;
            }

            /* 滚动条样式 */
            .resource-inspector-panel::-webkit-scrollbar {
                width: 8px;
            }

            .resource-inspector-panel::-webkit-scrollbar-track {
                background: #1e1e1e;
            }

            .resource-inspector-panel::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 4px;
            }

            .resource-inspector-panel::-webkit-scrollbar-thumb:hover {
                background: #666;
            }

            /* 拖拽时的样式 */
            body.resizing-right-drawer {
                user-select: none;
                cursor: col-resize !important;
            }

            body.resizing-right-drawer * {
                pointer-events: none !important;
            }

            body.resizing-right-drawer #resource-inspector-drawer {
                pointer-events: auto !important;
            }

            body.resizing-right-drawer #resource-inspector-resize-handle {
                pointer-events: auto !important;
            }

            /* 防止iframe或canvas干扰 */
            body.resizing-right-drawer iframe,
            body.resizing-right-drawer canvas,
            body.resizing-right-drawer embed,
            body.resizing-right-drawer object {
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 绑定事件
     */
    private bindEvents(): void {
        if (this.toggleButton) {
            this.toggleButton.addEventListener("click", () => {
                this.toggle();
            });
        }
    }

    /**
     * 切换抽屉状态
     */
    toggle(): void {
        if (this.container) {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.container.classList.remove("closed");
            } else {
                this.container.classList.add("closed");
            }
            if (this.toggleCallback) {
                this.toggleCallback(this.isOpen);
            }
        }
    }

    /**
     * 设置切换回调
     * @param callback - 切换回调函数
     */
    onToggle(callback: (isOpen: boolean) => void): void {
        this.toggleCallback = callback;
    }

    /**
     * 获取内容容器
     * @returns 内容容器元素
     */
    getContentContainer(): HTMLElement | null {
        return this.content;
    }

    /**
     * 销毁抽屉UI
     */
    destroy(): void {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.content = null;
        this.toggleButton = null;
        this.resizeHandle = null;
    }

    /**
     * 设置初始状态
     */
    private setInitialState(): void {
        if (this.container) {
            this.container.classList.add("closed");
        }
    }

    /**
     * 绑定调整大小事件
     */
    private bindResizeEvents(): void {
        if (this.resizeHandle) {
            this.resizeHandle.addEventListener("mousedown", (e: MouseEvent) => {
                this.startResize(e);
            });

            document.addEventListener("mousemove", (e: MouseEvent) => {
                this.handleResize(e);
            }, { capture: true });

            document.addEventListener("mouseup", () => {
                this.stopResize();
            }, { capture: true });

            document.addEventListener("mouseleave", () => {
                this.stopResize();
            });

            window.addEventListener("blur", () => {
                this.stopResize();
            });
        }
    }

    /**
     * 开始调整大小
     * @param e - 鼠标事件
     */
    private startResize(e: MouseEvent): void {
        this.isResizing = true;
        this.startX = e.clientX;
        this.startWidth = this.container?.clientWidth || 0;
        document.body.classList.add("resizing-right-drawer");
        if (this.resizeHandle) {
            this.resizeHandle.style.background = "#0078d4";
        }
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }

    /**
     * 处理调整大小
     * @param e - 鼠标事件
     */
    private handleResize(e: MouseEvent): void {
        if (!this.isResizing || !this.container) return;

        const deltaX = this.startX - e.clientX; // 注意：右侧抽屉的计算方向相反
        const newWidth = Math.max(
            this.minWidth,
            Math.min(this.maxWidth, this.startWidth + deltaX)
        );

        this.container.style.width = `${newWidth}px`;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }

    /**
     * 停止调整大小
     */
    private stopResize(): void {
        if (this.isResizing) {
            this.isResizing = false;
            document.body.classList.remove("resizing-right-drawer");
            if (this.resizeHandle) {
                this.resizeHandle.style.background = "";
            }
        }
    }

    /**
     * 显示工具提示
     * @param text - 提示文本
     * @param targetElement - 目标元素
     */
    showTooltip(text: string, targetElement: HTMLElement): void {
        if (this.tooltipManager) {
            this.tooltipManager.show(text, targetElement);
        }
    }

    /**
     * 重置宽度
     */
    resetWidth(): void {
        if (this.container) {
            this.container.style.width = `${this.defaultWidth}px`;
        }
    }
}

export default RightDrawerUI;