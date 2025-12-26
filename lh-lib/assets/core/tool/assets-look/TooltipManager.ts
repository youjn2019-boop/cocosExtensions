/**
 * 工具提示管理器
 * 负责显示和管理悬浮提示框
 */
class TooltipManager {
    private tooltip: HTMLElement | null = null;
    private tooltipTimer: NodeJS.Timeout = null;
    private parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.parent = parent;
        this.applyStyles();
    }

    /**
     * 应用工具提示的CSS样式
     */
    private applyStyles(): void {
        const style = document.createElement("style");
        style.textContent = `
            .global-inspector-tooltip {
                position: fixed; /* 使用 fixed 定位，相对于视口 */
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 9999; /* 确保在最顶层 */
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                white-space: nowrap; /* 防止文本换行 */
            }

            .global-inspector-tooltip.show {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 显示工具提示
     * @param text - 提示文本
     * @param targetElement - 目标元素
     */
    show(text: string, targetElement: HTMLElement): void {
        // 清除之前的定时器
        if (this.tooltipTimer) {
            clearTimeout(this.tooltipTimer);
        }

        // 创建或获取工具提示元素
        if (!this.tooltip) {
            this.tooltip = document.createElement("div");
            this.tooltip.className = "global-inspector-tooltip";
            this.parent.appendChild(this.tooltip);
        }

        this.tooltip.textContent = text;

        // 计算位置
        const targetRect = targetElement.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const top = targetRect.top - 40;
        const left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;

        // 设置位置
        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;

        // 强制重绘
        this.tooltip.offsetWidth;

        // 显示工具提示
        this.tooltip.classList.add("show");

        // 设置自动隐藏定时器
        this.tooltipTimer = setTimeout(() => {
            if (this.tooltip) {
                this.tooltip.classList.remove("show");
            }
        }, 2000);
    }
}

export default TooltipManager;