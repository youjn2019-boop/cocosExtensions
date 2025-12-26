import { _decorator, Asset, CCBoolean, CCFloat, CCString, Color, Component, Enum, Node, Rect, Size, Vec3 } from 'cc';
import { ViewStateType } from './ViewStateType';

const { ccclass, property } = _decorator;

/**
 * 视图自定义数据
 */
@ccclass('ViewCustomData')
class ViewCustomData {
    /** 属性类型 */
    @property public valueName: string = "strings";
    /** 属性名称 */
    @property public propName: string = "";
    /** 
     * 当属性值是数组类型时，指定数组下标，
     * 当index=-1时，表示覆盖整个数组
     * */
    @property public index: number = 0;
    /** 是否是数组 */
    @property public isArray: boolean = false;

}

@ccclass('ViewStateData')
export class ViewStateData {
    @property public enabled: boolean = true;
    @property public isTween: boolean = false;
    @property public tweenDuration: number = 0.2;
    @property public compName: string = "cc.Node";
    @property({ type: Enum(ViewStateType) }) public type: ViewStateType = ViewStateType.None;
    @property({ type: ViewCustomData }) public customData: ViewCustomData = new ViewCustomData();

    //---------------- 支持的数据类型 ---------------------// 
    @property({ type: [Size] }) public sizes: Size[] = [];
    @property({ type: [Rect] }) public rects: Rect[] = [];
    @property({ type: [Vec3] }) public vectors: Vec3[] = [];
    @property({ type: [Color] }) public colors: Color[] = [];
    @property({ type: [Asset] }) public assets: Asset[] = [];
    @property({ type: [CCFloat] }) public numbers: number[] = [];
    @property({ type: [CCString] }) public strings: string[] = [];
    @property({ type: [CCBoolean] }) public booleans: boolean[] = [];
    @property({ type: [Component] }) public components: Component[] = [];
    @property({ type: [Node] }) public nodes: Node[] = [];

    public dispose() {
        this.sizes.length = 0;
        this.rects.length = 0;
        this.vectors.length = 0;
        this.colors.length = 0;
        this.assets.length = 0;
        this.numbers.length = 0;
        this.strings.length = 0;
        this.booleans.length = 0;
        this.components.length = 0;
        this.nodes.length = 0;
    }
}