import Logger from './Logger';

/**
 * 向量接口
 */
interface Vector3 {
    x: number;
    y: number;
    z: number;
}

/**
 * 向量2D接口
 */
interface Vector2 {
    x: number;
    y: number;
}

/**
 * 颜色接口
 */
interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}

/**
 * 变换数据接口
 */
interface TransformData {
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
}

/**
 * 尺寸数据接口
 */
interface SizeData {
    width: number;
    height: number;
}

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
 * 节点数据接口
 */
export interface NodeData {
    id: string;
    name: string;
    type: string;
    uuid: string | null;
    active: boolean;
    ccNode: any;
    components: ComponentData[];
    children: NodeData[];
    parent: string | null;
    parentNode?: NodeData;
    zIndex?: number;
    position?: Vector3;
    scale?: Vector3;
    angle?: number;
    expanded?: boolean;
}

/**
 * 屏幕矩形接口
 */
interface ScreenRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * 节点计算器
 * 负责处理Cocos Creator节点的数据转换、属性更新和屏幕位置计算
 */
class NodeCalculator {
    private creatorVersion: string;
    private highlightElement: HTMLElement | null = null;
    private highlightTimer: NodeJS.Timeout = null;

    constructor() {
        this.creatorVersion = this.detectCreatorVersion();
    }

    /**
     * 检测Cocos Creator版本
     * @returns 版本信息
     */
    private detectCreatorVersion(): string {
        try {
            const cc = (window as any).cc;
            if (!cc) return 'Unknown';

            const version = cc.ENGINE_VERSION || cc.engine?.VERSION || 'Unknown';
            Logger.log('检测到Cocos Creator版本:', version);
            return version;
        } catch (error) {
            Logger.warn('检测Creator版本失败:', error);
            return 'Unknown';
        }
    }

    /**
     * 判断是否为Cocos Creator 3.x版本
     * @returns 是否为3.x版本
     */
    private isCreator3x(): boolean {
        return this.creatorVersion.startsWith('3.') || this.creatorVersion.startsWith('4.');
    }

    /**
     * 转换CC节点为节点数据
     * @param ccNode - Cocos Creator节点对象
     * @returns 节点数据对象
     */
    convertCCNodeToNodeData(ccNode: any): NodeData | null {
        if (!ccNode) return null;

        try {
            const transformData = this.getTransformData(ccNode);

            // 获取角度，2.x中是rotation，3.x中是rotation.z
            let angle = 0;
            if (this.isCreator3x()) {
                angle = transformData.rotation.z || 0;
            } else {
                angle = transformData.rotation.z || ccNode.rotation || 0;
            }

            const nodeData: NodeData = {
                id: this.generateNodeId(ccNode),
                name: this.getNodeName(ccNode),
                type: this.getNodeType(ccNode),
                uuid: ccNode.uuid || ccNode._uuid || null,
                active: ccNode.active !== undefined ? ccNode.active : ccNode.activeInHierarchy,
                ccNode: ccNode, // 保持对原始节点的引用
                components: this.getComponentsData(ccNode),
                children: [],
                parent: null,
                position: transformData.position,
                scale: transformData.scale,
                angle: angle
            };

            // 处理子节点
            if (ccNode.children && ccNode.children.length > 0) {
                nodeData.children = ccNode.children.map((child: any) => {
                    const childData = this.convertCCNodeToNodeData(child);
                    if (childData) {
                        childData.parent = nodeData.name;
                        childData.parentNode = nodeData;
                    }
                    return childData;
                }).filter(Boolean);
            }

            return nodeData;
        } catch (error) {
            Logger.warn('转换节点数据失败:', error);
            return null;
        }
    }

    /**
     * 生成节点ID
     * @param ccNode - CC节点
     * @returns 节点ID
     */
    private generateNodeId(ccNode: any): string {
        return ccNode.uuid || ccNode._uuid || `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 获取节点名称
     * @param ccNode - CC节点
     * @returns 节点名称
     */
    private getNodeName(ccNode: any): string {
        return ccNode.name || ccNode._name || '未命名节点';
    }

    /**
     * 获取节点类型
     * @param ccNode - CC节点
     * @returns 节点类型
     */
    private getNodeType(ccNode: any): string {
        if (ccNode.constructor && ccNode.constructor.name) {
            return ccNode.constructor.name.replace('cc.', '');
        }
        return 'Node';
    }

    /**
     * 获取变换数据
     * @param ccNode - CC节点
     * @returns 变换数据
     */
    private getTransformData(ccNode: any): TransformData {
        try {
            if (this.isCreator3x()) {
                return this.getTransformData3x(ccNode);
            } else {
                return this.getTransformData2x(ccNode);
            }
        } catch (error) {
            Logger.warn('获取变换数据失败:', error);
            return {
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 }
            };
        }
    }

    /**
     * 获取Cocos Creator 2.x变换数据
     * @param ccNode - CC节点
     * @returns 变换数据
     */
    private getTransformData2x(ccNode: any): TransformData {
        return {
            position: {
                x: ccNode.x || 0,
                y: ccNode.y || 0,
                z: ccNode.z || 0
            },
            rotation: {
                x: ccNode.rotationX || 0,
                y: ccNode.rotationY || 0,
                z: ccNode.rotation || 0
            },
            scale: {
                x: ccNode.scaleX || 1,
                y: ccNode.scaleY || 1,
                z: ccNode.scaleZ || 1
            }
        };
    }

    /**
     * 获取Cocos Creator 3.x变换数据
     * @param ccNode - CC节点
     * @returns 变换数据
     */
    private getTransformData3x(ccNode: any): TransformData {
        const position = ccNode.position || ccNode.getPosition?.() || { x: 0, y: 0, z: 0 };
        const rotation = ccNode.eulerAngles || ccNode.getEulerAngles?.() || { x: 0, y: 0, z: 0 };
        const scale = ccNode.scale || ccNode.getScale?.() || { x: 1, y: 1, z: 1 };

        return {
            position: {
                x: position.x || 0,
                y: position.y || 0,
                z: position.z || 0
            },
            rotation: {
                x: rotation.x || 0,
                y: rotation.y || 0,
                z: rotation.z || 0
            },
            scale: {
                x: scale.x || 1,
                y: scale.y || 1,
                z: scale.z || 1
            }
        };
    }

    /**
     * 获取尺寸数据
     * @param ccNode - CC节点
     * @returns 尺寸数据
     */
    private getSizeData(ccNode: any): SizeData {
        try {
            if (this.isCreator3x()) {
                const uiTransform = ccNode.getComponent('cc.UITransform');
                if (uiTransform) {
                    return {
                        width: uiTransform.width || 0,
                        height: uiTransform.height || 0
                    };
                }
            } else {
                return {
                    width: ccNode.width || 0,
                    height: ccNode.height || 0
                };
            }
            return { width: 0, height: 0 };
        } catch (error) {
            Logger.warn('获取尺寸数据失败:', error);
            return { width: 0, height: 0 };
        }
    }

    /**
     * 获取组件数据
     * @param ccNode - CC节点
     * @returns 组件数据数组
     */
    private getComponentsData(ccNode: any): ComponentData[] {
        try {
            const components: ComponentData[] = [];

            if (ccNode._components) {
                ccNode._components.forEach((component: any) => {
                    if (component && component.constructor) {
                        const componentData: ComponentData = {
                            name: component.constructor.name.replace('cc.', ''),
                            type: component.constructor.name,
                            enabled: component.enabled !== undefined ? component.enabled : true,
                            properties: this.getComponentProperties(component)
                        };
                        components.push(componentData);
                    }
                });
            }

            return components;
        } catch (error) {
            Logger.warn('获取组件数据失败:', error);
            return [];
        }
    }

    private static _componentProperties = {
        'UITransform': ['_contentSize', '_anchorPoint'],
        'Sprite': ['color'],
        'UIOpacity': ['opacity'],
    }
    /**
     * 获取组件属性
     * @param component - 组件对象
     * @returns 组件属性
     */
    private getComponentProperties(component: any): Record<string, PropertyInfo> {
        const properties: Record<string, PropertyInfo> = {};

        try {
            const componentName = component.constructor.name.replace('cc.', '');
            const componentProps = NodeCalculator._componentProperties[componentName] || [];
            if (componentProps) {
                componentProps.forEach(key => {
                    const value = component[key];
                    properties[key] = {
                        value: component[key],
                        type: this.getValueType(value),
                        editable: false,
                        key: key
                    };
                    properties[key].editable = this.isEditableProperty(properties[key].type, value);
                });
            }
            // // 获取常见的组件属性
            // const excludeProps = new Set(['node', '_name', '_objFlags', '__eventTargets', '_components']);

            // for (const key in component) {
            //     if (excludeProps.has(key) || key.startsWith('_')) continue;

            //     const value = component[key];
            //     if (typeof value !== 'function') {
            //         properties[key] = {
            //             value: this.serializeValue(value),
            //             type: this.getValueType(value),
            //             editable: this.isEditableProperty(key, value)
            //         };
            //     }
            // }
        } catch (error) {
            Logger.warn('获取组件属性失败:', error);
        }

        return properties;
    }

    /**
     * 序列化值
     * @param value - 要序列化的值
     * @returns 序列化后的值
     */
    private serializeValue(value: any): any {
        if (value === null || value === undefined) return value;

        if (typeof value === 'object') {
            if (value.constructor && value.constructor.name.includes('Vec')) {
                return { x: value.x, y: value.y, z: value.z };
            }
            if (value.constructor && value.constructor.name.includes('Color')) {
                return { r: value.r, g: value.g, b: value.b, a: value.a };
            }
            // 避免循环引用
            try {
                return JSON.parse(JSON.stringify(value));
            } catch {
                return '[Object]';
            }
        }

        return value;
    }

    /**
     * 获取值类型
     * @param value - 值
     * @returns 类型字符串
     */
    private getValueType(value: any): string {
        if (value === null || value === undefined) return 'readonly';

        const type = typeof value;
        if (type === 'boolean') return 'boolean';
        if (type === 'number') return 'number';
        if (type === 'string') return 'string';

        if (type === 'object') {
            if (value.x !== undefined && value.y !== undefined) {
                return value.z !== undefined ? 'vector3' : 'vector2';
            }
            if (value.r !== undefined && value.g !== undefined && value.b !== undefined) {
                return 'color';
            }
        }

        return 'readonly';
    }

    /**
     * 判断属性是否可编辑
     * @param key - 属性键
     * @param value - 属性值
     * @returns 是否可编辑
     */
    private isEditableProperty(key: string, value: any): boolean {
        const editableProps = new Set(['enabled', 'string', 'spriteFrame', 'color', 'vector2', 'vector3']);
        const readonlyProps = new Set(['node', 'uuid', '_uuid', 'constructor']);

        if (readonlyProps.has(key)) return false;
        if (editableProps.has(key)) return true;

        const type = typeof value;
        return type === 'boolean' || type === 'number' || type === 'string';
    }

    /**
     * 更新节点属性
     * @param nodeData - 节点数据
     * @param key - 属性键
     * @param value - 新值
     */
    updateNodeProperty(nodeData: NodeData, key: string, value: any): void {
        if (!nodeData || !nodeData.ccNode) return;

        try {
            const ccNode = nodeData.ccNode;

            switch (key) {
                case 'name':
                    ccNode.name = value;
                    break;
                case 'active':
                    ccNode.active = value;
                    break;
                case 'position':
                    this.updatePosition(ccNode, value);
                    break;
                case 'rotation':
                    this.updateRotation(ccNode, value);
                    break;
                case 'scale':
                    this.updateScale(ccNode, value);
                    break;
                case 'width':
                case 'height':
                    this.updateSize(ccNode, key, value);
                    break;
                case 'zIndex':
                    ccNode.zIndex = value;
                    break;
                case 'opacity':
                    ccNode.opacity = value;
                    break;
                case 'color':
                    this.updateColor(ccNode, value);
                    break;
                case 'size':
                    this.updateSize(ccNode, key, value);
                    break;
                default:
                    Logger.warn('未知的属性键:', key);
            }

            Logger.log(`已更新节点属性: ${key} = ${JSON.stringify(value)}`);
        } catch (error) {
            Logger.warn('更新节点属性失败:', error);
        }
    }

    /**
     * 更新位置
     * @param ccNode - CC节点
     * @param position - 位置对象
     */
    private updatePosition(ccNode: any, position: Vector3): void {
        if (this.isCreator3x()) {
            if (ccNode.setPosition) {
                ccNode.setPosition(position.x, position.y, position.z);
            } else {
                ccNode.position = position;
            }
        } else {
            ccNode.x = position.x;
            ccNode.y = position.y;
            if (position.z !== undefined) ccNode.z = position.z;
        }
    }

    /**
     * 更新旋转
     * @param ccNode - CC节点
     * @param rotation - 旋转对象
     */
    private updateRotation(ccNode: any, rotation: Vector3): void {
        if (this.isCreator3x()) {
            if (ccNode.setRotationFromEuler) {
                ccNode.setRotationFromEuler(rotation.x, rotation.y, rotation.z);
            } else {
                ccNode.eulerAngles = rotation;
            }
        } else {
            ccNode.rotation = rotation.z;
            if (rotation.x !== undefined) ccNode.rotationX = rotation.x;
            if (rotation.y !== undefined) ccNode.rotationY = rotation.y;
        }
    }

    /**
     * 更新缩放
     * @param ccNode - CC节点
     * @param scale - 缩放对象
     */
    private updateScale(ccNode: any, scale: Vector3): void {
        if (this.isCreator3x()) {
            if (ccNode.setScale) {
                ccNode.setScale(scale.x, scale.y, scale.z);
            } else {
                ccNode.scale = scale;
            }
        } else {
            ccNode.scaleX = scale.x;
            ccNode.scaleY = scale.y;
            if (scale.z !== undefined) ccNode.scaleZ = scale.z;
        }
    }

    /**
     * 更新尺寸
     * @param ccNode - CC节点
     * @param key - 尺寸键（width/height）
     * @param value - 新值
     */
    private updateSize(ccNode: any, key: string, value: number): void {
        if (this.isCreator3x()) {
            const uiTransform = ccNode.getComponent('cc.UITransform');
            if (uiTransform) {
                uiTransform[key] = value;
            }
        } else {
            ccNode[key] = value;
        }
    }

    /**
     * 更新颜色
     * @param ccNode - CC节点
     * @param color - 颜色对象
     */
    private updateColor(ccNode: any, color: Color): void {
        if (ccNode.color) {
            const cc = (window as any).cc;
            if (this.isCreator3x()) {
                ccNode.color = new cc.Color(color.r * 255, color.g * 255, color.b * 255, color.a * 255);
            } else {
                ccNode.color = new cc.Color(color.r, color.g, color.b, color.a);
            }
        }
    }

    /**
     * 获取节点屏幕矩形
     * @param ccNode - CC节点
     * @returns 屏幕矩形
     */
    getNodeScreenRect(ccNode: any): ScreenRect | null {
        try {
            if (this.isCreator3x()) {
                return this.getNodeScreenRect3x(ccNode);
            } else {
                return this.getNodeScreenRect2x(ccNode);
            }
        } catch (error) {
            Logger.warn('获取节点屏幕位置失败:', error);
            return null;
        }
    }

    /**
     * 获取Cocos Creator 2.x节点屏幕矩形
     * @param ccNode - CC节点
     * @returns 屏幕矩形
     */
    private getNodeScreenRect2x(ccNode: any): ScreenRect | null {
        try {
            const cc = (window as any).cc;
            let camera = cc.Camera.findCamera(ccNode) || cc.Camera.main;
            if (!camera) {
                Logger.warn('❌ 未找到节点专属摄像机');
                return null;
            }

            let aabb = this.getNodeScreenAABB(ccNode, camera);
            return aabb;
        } catch (error) {
            Logger.warn('获取Creator 2.x节点屏幕位置失败:', error);
            return null;
        }
    }

    /**
     * 获取Cocos Creator 3.x节点屏幕矩形
     * @param ccNode - CC节点
     * @returns 屏幕矩形
     */
    private getNodeScreenRect3x(ccNode: any): ScreenRect | null {
        try {
            const camera = this.findCamera(ccNode);
            if (!camera) {
                Logger.warn('❌ 未找到节点专属摄像机');
                return null;
            }

            const uiTransform = ccNode.getComponent('cc.UITransform');
            if (!uiTransform) {
                Logger.warn('❌ 节点没有UITransform组件');
                return null;
            }

            const worldPos = ccNode.worldPosition;
            const screenPos = camera.convertToUINode(worldPos, ccNode.parent);

            return {
                x: screenPos.x - uiTransform.width * uiTransform.anchorX,
                y: screenPos.y - uiTransform.height * uiTransform.anchorY,
                width: uiTransform.width,
                height: uiTransform.height
            };
        } catch (error) {
            Logger.warn('获取Creator 3.x节点屏幕位置失败:', error);
            return null;
        }
    }

    /**
     * 获取节点屏幕AABB（2.x版本）
     * @param ccNode - CC节点
     * @param camera - 摄像机
     * @returns AABB对象
     */
    private getNodeScreenAABB(ccNode: any, camera: any): ScreenRect {
        const worldMatrix = ccNode.getNodeToWorldTransformAR();
        const rect = ccNode.getBoundingBoxToWorld();

        return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
        };
    }

    /**
     * 查找摄像机（3.x版本）
     * @param ccNode - CC节点
     * @returns 摄像机对象
     */
    private findCamera(ccNode: any): any | null {
        try {
            const cc = (window as any).cc;
            const scene = cc.director.getScene();
            if (!scene) return null;

            // 查找Canvas组件的摄像机
            let canvas = ccNode;
            while (canvas && !canvas.getComponent('cc.Canvas')) {
                canvas = canvas.parent;
            }

            if (canvas) {
                const canvasComp = canvas.getComponent('cc.Canvas');
                if (canvasComp && canvasComp.cameraComponent) {
                    return canvasComp.cameraComponent.camera;
                }
            }

            // 查找主摄像机
            const cameras = scene.getComponentsInChildren('cc.Camera');
            return cameras.length > 0 ? cameras[0] : null;
        } catch (error) {
            Logger.warn('查找摄像机失败:', error);
            return null;
        }
    }

    /**
     * 创建DOM高亮效果
     * @param rect - 矩形区域
     */
    createDOMHighlight(rect: ScreenRect): void {
        try {
            // 移除之前的高亮
            this.removeDOMHighlight();

            // 创建高亮元素
            this.highlightElement = document.createElement('div');
            this.highlightElement.style.cssText = `
                position: fixed;
                left: ${rect.x}px;
                top: ${rect.y}px;
                width: ${rect.width}px;
                height: ${rect.height}px;
                border: 2px solid #ff6b35;
                background: rgba(255, 107, 53, 0.2);
                pointer-events: none;
                z-index: 999999;
                box-sizing: border-box;
            `;

            document.body.appendChild(this.highlightElement);

            // 设置自动移除定时器
            this.highlightTimer = setTimeout(() => {
                this.removeDOMHighlight();
            }, 2000);

            Logger.log('DOM高亮已创建');
        } catch (error) {
            Logger.warn('创建DOM高亮失败:', error);
        }
    }

    /**
     * 移除DOM高亮效果
     */
    removeDOMHighlight(): void {
        if (this.highlightElement) {
            document.body.removeChild(this.highlightElement);
            this.highlightElement = null;
        }

        if (this.highlightTimer) {
            clearTimeout(this.highlightTimer);
            this.highlightTimer = null;
        }
    }
}

export default NodeCalculator;