import MainApp from './MainApp';
import Utils from './Utils';

/**
 * Cocos Creator 节点和资源监控工具
 * 主入口文件
 */

/**
 * 创建者环境信息接口
 */
interface CreatorEnvironment {
    DEBUG: boolean;
    EDITOR: boolean;
    isBrowser: boolean;
}

/**
 * 全局窗口对象扩展
 */
declare global {
    interface Window {
        initNodeInspector?: () => MainApp;
    }
}

/**
 * 初始化节点监控器
 * @returns {MainApp} 主应用实例
 */
function initNodeInspector(): MainApp {
    const app: MainApp = new MainApp();
    app.initialize();
    return app;
}

/**
 * 自动初始化逻辑
 */
try {
    const { DEBUG, EDITOR, isBrowser }: CreatorEnvironment = Utils.getCreatorEnvironment();
    
    // 只在DEBUG模式、非编辑器环境、浏览器环境下自动初始化
    if (DEBUG && !EDITOR && isBrowser) {
        initNodeInspector();
        console.log('Node Inspector已自动初始化');
    }
} catch (error: unknown) {
    console.warn(
        'Node Inspector自动初始化失败，请手动调用 window?.initNodeInspector?.():',
        error
    );
}

// 将初始化函数暴露到全局
if (typeof window !== 'undefined') {
    window.initNodeInspector = initNodeInspector;
}

// 导出主要类供外部使用
export {
    MainApp,
    Utils,
    initNodeInspector
};

export default initNodeInspector;