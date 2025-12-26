// 对Cocos Creator 引擎类的扩展
declare module "cc" {
    //----------------------------------------- 对Sprite的扩展方法 -------------------------------------------------------//
    interface Sprite {
        // 动态资源信息
        curImgPath: string;
        newImgPath: string;
    }

    //----------------------------------------- 对Node的扩展方法 -------------------------------------------------------//
    interface Node {

        /** 获取节点在显示列表中的层级路径，比如：Canvas/UIContent/BtnNode */
        getViewPath(): string;
        /** 获取最终根节点 */
        getRootNode(): Node;
    }

    interface ToggleContainer {
        /** 当前选中的下标 */
        set selectedIndex(index: number);
        get selectedIndex(): number;
    }

    //----------------------------------------- 对Component的扩展方法 -------------------------------------------------------//
    interface Component {
        /** 组件是否调用过onLoad */
        isLoaded(): boolean;
    }

    //----------------------------------------- 对Spine组件的扩展方法 -------------------------------------------------------//
    export namespace sp {

        interface Skeleton {
            /** 当前使用的皮肤名称 */
            skinName: string;
        }
    }
}