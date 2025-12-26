import { Node } from "cc";
import { ViewStateData } from "./ViewStateData";


export interface IViewState {

    readonly data: ViewStateData;
    /** 初始化 */
    initialize(node: Node, data: ViewStateData): void;
    /** 切换状态值 */
    changeValue(index: number): void;
    /** 在编辑器模式下切换 */
    changeValueOnEditor(index: number): void;
    /** 销毁 */
    dispose(): void;
}