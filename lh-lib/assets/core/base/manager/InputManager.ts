
import { Component, EventKeyboard, EventMouse, EventTouch, Input, Node, Touch, UITransform, Vec2, _decorator, game, input } from 'cc';

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = _decorator;

/**
 * 自定义输入接口（和Unity的Input输入接口用法一样）
 * @作者 落日故人 QQ 583051842
 */
export class UInput
{
    /**
     * 鼠标位置
     */
    public static mousePosition:Vec2 = Vec2.ZERO;

    /**
     * 遥感接口（键盘方向键或者wasd键）
     */
    public static axis:Vec2 = Vec2.ZERO;

    public static keyDic:{[key:number]:number} = {};

    public static mouseBtnDic:{[key:number]:number} = {};

    /**
     * 多点触屏数据
     */
    public static touches:TouchData[] = [];

    /*public static getAxis(axisName:string):Vec2
    {
        return this.axis;
    }*/

    /**
     * 获得键盘按键按下状态
     */
    public static getKeyDown(keyCode:UKeyCode):boolean
    {
        if(UInput.keyDic[keyCode] == KeyStatus.keyDown)
        {
            return true;
        }

        return false;
    }

    /**
     * 获得键盘按键按住状态
     */
    public static getKey(keyCode:UKeyCode):boolean
    {
        if(UInput.keyDic[keyCode] == KeyStatus.keyDown || UInput.keyDic[keyCode] == KeyStatus.press)
        {
            return true;
        }

        return false;
    }

    /**
     * 获得键盘按键按并释放状态
     */
    public static getKeyUp(keyCode:UKeyCode):boolean
    {
        if(UInput.keyDic[keyCode] == KeyStatus.keyUp)
        {
            return true;
        }

        return false;
    }

    /**
     * 获得鼠标按键按下状态，参数 0 代表左键，1代表右键，2代表中键
     */
    public static getMouseButtonDown(mouseBtnCode:UKeyCode):boolean
    {
        if(UInput.mouseBtnDic[mouseBtnCode] == KeyStatus.keyDown)
        {
            return true;
        }

        return false;
    }

    /**
     * 获得鼠标按键按住状态，参数 0 代表左键，1代表右键，2代表中键
     */
    public static getMouseButton(mouseBtnCode:UKeyCode):boolean
    {
        if(UInput.mouseBtnDic[mouseBtnCode] == KeyStatus.keyDown || UInput.mouseBtnDic[mouseBtnCode] == KeyStatus.press)
        {
            return true;
        }

        return false;
    }

    /**
     * 获得鼠标按键按并释放状态，参数 0 代表左键，1代表右键，2代表中键
     */
    public static getMouseButtonUp(mouseBtnCode:UKeyCode):boolean
    {
        if(UInput.mouseBtnDic[mouseBtnCode] == KeyStatus.keyUp)
        {
            return true;
        }

        return false;
    }

    /**
     * 根据手指id获得触屏数据
     * @param fingerId 
     * @returns 
     */
    public static getTouch(fingerId:number):TouchData | null
    {
        for(var i = 0 ; i < this.touches.length; i++)
        {
            if(this.touches[i].fingerId == fingerId)
            {
                return this.touches[i];
            }
        }

        return null;
    }

    

}

/**
 * 输入管理器
 * @作者 落日故人 QQ 583051842
 */
@ccclass('InputManager')
export default class InputManager extends Component {

    private static _instance: InputManager;
    public static get instance(): InputManager {
        if(this._instance == null)
        {

            /*var canvas:Canvas = (new Node("Canvas_Mask")).addComponent(Canvas);
            canvas.node.setSiblingIndex(100);

            var camera:Camera = (new Node("Camera_Mask")).addComponent(Camera);
            camera.node.parent = canvas.node;
            camera.priority = 2073741824;
            camera.clearFlags = Camera.ClearFlag.DEPTH_ONLY; //gfx.ClearFlagBit.DEPTH;
            canvas.cameraComponent = camera;
        
            game.addPersistRootNode(canvas.node);

            var node:Node = new Node("InputManager");
            node.addComponent(UITransform);
            node.parent = canvas.node;
            this._instance = node.addComponent(InputManager);
            this._instance.init();*/

            var node:Node = new Node("InputManager");
            game.addPersistRootNode(node);
            node.addComponent(UITransform);
            this._instance = node.addComponent(InputManager);
            this._instance.init();
        }
        return this._instance;
    }

    private discardKeyList:number[] = [];

    private mouseDiscardKeyList:number[] = [];

    private axisDir:Vec2 = new Vec2(0,0);

    private init()
    {

    }

    onLoad()
    {
        //this.node.getComponent(UITransform).setContentSize(view.getVisibleSize());
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    start()
    {
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this); 
        input.on(Input.EventType.MOUSE_UP,this.onMouseUp,this);
        input.on(Input.EventType.MOUSE_MOVE,this.onMouseMove,this);
        //input.on(Input.EventType.MOUSE_LEAVE,this.onMouseLeave,this);

        input.on(Input.EventType.TOUCH_START,this.onTouchStart,this);
        input.on(Input.EventType.TOUCH_MOVE,this.onTouchMove,this);
        input.on(Input.EventType.TOUCH_END,this.onTouchEnd,this);
        input.on(Input.EventType.TOUCH_CANCEL,this.onTouchCancle,this);
        
        /*this.node.on(Node.EventType.MOUSE_DOWN,this.onMouseDown,this,false);
        this.node.on(Node.EventType.MOUSE_UP,this.onMouseUp,this);
        this.node.on(Node.EventType.MOUSE_MOVE,this.onMouseMove,this,false);
        this.node.on(Node.EventType.MOUSE_LEAVE,this.onMouseLeave,this,false);

        /*this.node.on(Node.EventType.TOUCH_START,this.onTouchStart,this,false);
        this.node.on(Node.EventType.TOUCH_MOVE,this.onTouchMove,this,false);
        this.node.on(Node.EventType.TOUCH_END,this.onTouchEnd,this,false);
        this.node.on(Node.EventType.TOUCH_CANCEL,this.onTouchCancle,this,false);*/



        //this.node.eventProcessor.setSwallowTouches(false); //让点击可穿透。
    
    
    }

    /**
     * 启动输入管理
     */
    public startup()
    {
        console.log("InputManager 启动输入管理");
        //log("keycode?? ",macro.KEY.num0,macro.KEY.num1,macro.KEY.num3)
    }

    private onKeyDown(event:EventKeyboard) 
    {
        var keyCode:number = event.keyCode;
    
        if(event.keyCode >= 48 && event.keyCode <= 57)
        {
            keyCode += 48;
        }

        if(!UInput.keyDic[keyCode])
        {
            UInput.keyDic[keyCode] = KeyStatus.keyDown;
        }
        
    }

    private onKeyUp(event:EventKeyboard) 
    {
        var keyCode:number = event.keyCode;
    
        if(event.keyCode >= 48 && event.keyCode <= 57)
        {
            keyCode += 48;
        }

        UInput.keyDic[keyCode] = KeyStatus.keyUp;
    }

    private onMouseDown(event:EventMouse)
    {
        event.preventSwallow = true; //允许事件穿透

        if(event.getButton() == EventMouse.BUTTON_LEFT)
        {
            UInput.mouseBtnDic[MouseButtonCode.Left] = KeyStatus.keyDown;
        }else if(event.getButton() == EventMouse.BUTTON_RIGHT)
        {
            UInput.mouseBtnDic[MouseButtonCode.Right] = KeyStatus.keyDown;
        }else if(event.getButton() == EventMouse.BUTTON_MIDDLE)
        {
            UInput.mouseBtnDic[MouseButtonCode.Midden] = KeyStatus.keyDown;
        }
    }

    private onMouseUp(event:EventMouse)
    {
        event.preventSwallow = true; //允许事件穿透

        if(event.getButton() == EventMouse.BUTTON_LEFT)
        {
            UInput.mouseBtnDic[MouseButtonCode.Left] = KeyStatus.keyUp;
        }else if(event.getButton() == EventMouse.BUTTON_RIGHT)
        {
            UInput.mouseBtnDic[MouseButtonCode.Right] = KeyStatus.keyUp;
        }else if(event.getButton() == EventMouse.BUTTON_MIDDLE)
        {
            UInput.mouseBtnDic[MouseButtonCode.Midden] = KeyStatus.keyUp;
        }
    }

    private onMouseMove(event:EventMouse)
    {
        event.preventSwallow = true; //允许事件穿透

        UInput.mousePosition = event.getUILocation();
    }

    private onMouseLeave(event:EventMouse)
    {
        event.preventSwallow = true; //允许事件穿透

        UInput.mousePosition = Vec2.ZERO; 
    }

    private onTouchStart(event:EventTouch)
    {
        event.preventSwallow = true; //允许事件穿透

        var toucheList:Touch[] = event.getTouches();

        var touchDatas:TouchData[] = [];

        for(var i = 0 ; i < toucheList.length; i++)
        {
            var touchData:TouchData = new TouchData();
            touchData.touch = toucheList[i];
            touchData.fingerId = i;
            touchData.phase = TouchPhase.Began;

            touchDatas.push(touchData);
        }

        UInput.touches = touchDatas;
    }

    private onTouchMove(event:EventTouch)
    {
        event.preventSwallow = true; //允许事件穿透

        var toucheList:Touch[] = event.getTouches();

        var touchDatas:TouchData[] = [];
        
        for(var i = 0 ; i < toucheList.length; i++)
        {
            var touchData:TouchData = new TouchData();
            touchData.touch = toucheList[i];
            touchData.fingerId = i;
            touchData.phase = TouchPhase.Moved;

            touchDatas.push(touchData);
        }

        UInput.touches = touchDatas;
    }

    private onTouchEnd(event:EventTouch)
    {
        event.preventSwallow = true; //允许事件穿透

        for(var i = 0 ; i < UInput.touches.length; i++)
        {
            var touchData:TouchData = UInput.touches[i];
            touchData.phase = TouchPhase.Ended;
        }
    }

    private onTouchCancle(event:EventTouch)
    {
        event.preventSwallow = true; //允许事件穿透

        for(var i = 0 ; i < UInput.touches.length; i++)
        {
            var touchData:TouchData = UInput.touches[i];
            touchData.phase = TouchPhase.Canceled;
        }
    }


    update(dt:number)
    {
        this.axisDir.x = 0;
        this.axisDir.y = 0;

        if(UInput.getKey(UKeyCode.LeftArrow) || UInput.getKey(UKeyCode.A))
        {
            this.axisDir.x = -1;
        }

        if(UInput.getKey(UKeyCode.RightArrow) || UInput.getKey(UKeyCode.D))
        {
            this.axisDir.x = 1;
        }

        if(UInput.getKey(UKeyCode.UpArrow) || UInput.getKey(UKeyCode.W))
        {
            this.axisDir.y = 1;
        }

        if(UInput.getKey(UKeyCode.DownArrow) || UInput.getKey(UKeyCode.S))
        {
            this.axisDir.y = -1;
        }

        UInput.axis = this.axisDir;

    }

    lateUpdate()
    {
        //-------------------------处理键盘按键-----------------------------
        for(var i = 0 ; i < this.discardKeyList.length ; i++)
        {
            delete UInput.keyDic[this.discardKeyList[i]];
        }

        this.discardKeyList.length = 0;

        for(var keyCode in UInput.keyDic)
        {
            if(UInput.keyDic[keyCode] == KeyStatus.keyDown)
            {
                UInput.keyDic[keyCode] = KeyStatus.press;
            }

            if(UInput.keyDic[keyCode] == KeyStatus.keyUp)
            {
                UInput.keyDic[keyCode] = KeyStatus.none;
                this.discardKeyList.push(Number(keyCode));
            }
        }

        //-------------------------处理鼠标按键-----------------------------
        for(var i = 0 ; i < this.mouseDiscardKeyList.length ; i++)
        {
            delete UInput.mouseBtnDic[this.mouseDiscardKeyList[i]];
        }

        this.mouseDiscardKeyList.length = 0;

        for(var mouseBtnCode in UInput.mouseBtnDic)
        {
            if(UInput.mouseBtnDic[mouseBtnCode] == KeyStatus.keyDown)
            {
                UInput.mouseBtnDic[mouseBtnCode] = KeyStatus.press;
            }

            if(UInput.mouseBtnDic[mouseBtnCode] == KeyStatus.keyUp)
            {
                UInput.mouseBtnDic[mouseBtnCode] = KeyStatus.none;
                this.mouseDiscardKeyList.push(Number(mouseBtnCode));
            }
        }

        //-------------------------处理触屏-----------------------------
        for(var i = 0 ; i < UInput.touches.length; i++)
        {
            var touchData:TouchData = UInput.touches[i];

            if(touchData.phase == TouchPhase.Began || touchData.phase == TouchPhase.Moved)
            {
                touchData.phase = TouchPhase.Stationary;
            }
            
            if(touchData.phase == TouchPhase.Ended || touchData.phase == TouchPhase.Canceled)
            {
                UInput.touches.splice(i,1);
                i--;
            }
        }
    }

}


//CC_JSB

//if(!(sys.platform == sys.EDITOR_PAGE))


declare const CC_EDITOR:boolean;

if(!CC_EDITOR)
{
    // InputManager.instance.startup();//启动输入管理
}

export enum KeyStatus
{
    none,
    keyDown,
    press,
    keyUp,
}

export enum UKeyCode
{
    None = 0,

    Space = 32,
    Enter = 13,
    Ctrl = 17,
    Alt = 18,
    Escape = 27,

    LeftArrow = 37,
    UpArrow = 38,
    RightArrow = 39,
    DownArrow = 40,

    A = 65,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    I,
    J,
    K,
    L,
    M,
    N,
    O,
    P,
    Q,
    R,
    S,
    T,
    U,
    V,
    W,
    X,
    Y,
    Z,

    F1 = 112,
    F2,
    F3,
    F4,
    F5,
    F6,
    F7,
    F8,
    F9,
    F10,
    F11,
    F12,

    Num0 = 96,
    Num1,
    Num2,
    Num3,
    Num4,
    Num5,
    Num6,
    Num7,
    Num8,
    Num9,

}

export enum MouseButtonCode
{
    Left = 0,
    Right = 1,
    Midden = 2,
}

/**
 * 触摸数据
 */
 export class TouchData
 {
     /**
      * 触摸信息
      */
     public touch:Touch | null = null;
 
     /**
      * 触摸的手指Id
      */
     public fingerId:number = 0;
 
     /**
      * 触摸阶段
      */
     public phase:TouchPhase = TouchPhase.Began;
 }
 
 /**
  * 触摸阶段
  */
 export enum TouchPhase
 {
     /**
      * 手指刚触摸屏幕时触发一次
      */
     Began = 0,
     
     /**
      * 手指在屏幕滑动时一直触发
      */
     Moved = 1,
     
     /**
      *手指长按屏幕时一直触发 
      */
     Stationary = 2,
     
     /**
      * 手指从屏幕移开时触发一次
      */
     Ended = 3,
     
     /**
      * 触摸被取消时触发
      */
     Canceled = 4
 }