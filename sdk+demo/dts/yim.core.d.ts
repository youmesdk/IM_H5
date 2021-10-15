/**
 * @fileOverview 游密 H5 IM SDK Core 描述文件
 * @author benz@youme.im
 * @date 2018/6/26
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

type eventCallback = (...payload: any[]) => void;
type wildcardEventCallback = (eventName: string, ...payload: any[]) => void;

export class WildEmitter  {
    static mixin<T>(object: T): T & WildEmitter;

    isWildEmitter: true;

    emit(event: string, ...payload: any[]): any;

    off(event: string, fn?: Function): any;

    on(event: string, groupName: string, fn: eventCallback | wildcardEventCallback): any;
    on(event: string, fn: eventCallback | wildcardEventCallback): any;

    once(event: string, groupName: string, fn: eventCallback | wildcardEventCallback): any;
    once(event: string, fn: eventCallback | wildcardEventCallback): any;

    releaseGroup(groupName: string): any;
}

export type AnyJson =  boolean | number | string | null | JsonArray | JsonMap;
export interface JsonMap {  [key: string]: AnyJson; }
export interface JsonArray extends Array<AnyJson> {}

/**
 * 消息基类，供继承扩展
 * @class
 * @category 消息控制
 */
export declare abstract class Message extends WildEmitter {

    /**
     * 当消息内容创建好了，派生类须调用一下这个方法
     * 例如文字消息直接把文字输入此方法
     * 例如语音消息录音完毕后把需要传输出去的信息用 JSON 输入此方法
     * @param {string | AnyJson} content
     * @private
     */
    protected setContent(content: string | AnyJson): void;

    /**
     * 当消息内容放弃创建，派生类须调用一下这个方法
     * 例如语音消息放弃录音了
     * @private
     */
    protected setCancelled(): void;

    /**
     * 若需要上传文件，请把 Blob 输入此方法，并在 Promise 返回之后再调用 setContent
     * @param {Blob} file
     * @return {Promise<string>} 上传完成后用 Promise 回调下载地址
     */
    protected uploadFile(file: Blob): Promise<string>;

    /**
     * 若需要使用微信 token，请使用此方法
     * @return {Promise<string>}
     */
    protected requestWechatToken(): Promise<string>;

    /**
     * 自定义类型的ID 总是 0
     */
    protected typeId: number;

    /**
     * 子类实现：消息类型名字标识，文本为 'text'，语音为 'voice'，更多类型可以自定义名字
     */
    protected abstract typeName: string;

    /**
     * 子类实现：从服务器收到一串消息之后该如何初始化
     * 例如收到语音消息后，在此分析 content ，做好随时播放语音的准备
     * @param {string} content 收到的消息
     * @return {Promise<void>}
     */
    public abstract initWithContent(content: string): Promise<void>;

    /**
     * 是否已准备好
     * @return {boolean}
     */
    public isReady(): boolean;

    /**
     * 是否已经取消该消息
     * @return {boolean}
     */
    public isCanceled(): boolean;

    /**
     * 取消息内容
     * @return {string}
     */
    public getContent(): string;

    /**
     * 取消息类型ID
     * @return {number}
     */
    public getTypeId(): number;

    /**
     * 取消息类型字
     * @return {string}
     */
    public getType(): string;
}

export type ChatType = 'user' | 'group';

/**
 * 消息类型，供读取
 * @category 消息控制
 */
export interface MessageObject {
    senderId: string;
    receiverId: string;
    withPeer: string;
    isFromMe: boolean;
    chatType: ChatType;
    time: Date;
    serial?: string;
    serverId: string;
    message: Message;
}

export interface InitConfig {
    appKey: string;
    userId?: string;
    token?: string;
    roomId?: string | number;
    useMessageType?: (new () => Message) | Array<new () => Message>;
}

declare class YIM extends WildEmitter {

    constructor(config?: InitConfig);

    /**
     * 初始化
     * @param {InitConfig} config
     * @return {Promise<void>} 完成初始化
     *   - 若设定了用户名和密码，则登录成功后回调
     *   - 若同时设定了用户名、密码、房间号，则加入房间后回调
     *   - 若没有用户名和密码，则无论是否设定房间号，都立即回调，不等待加入房间
     */
    public init(config: InitConfig): Promise<void>;

    /**
     * 反初始化，相当于 logout()
     */
    public uninit(): void;

    /***** account *****/

    /**
     * 登录
     * @param {string} userId
     * @param {string} token
     * @param {string} timestamp="",采用v3 token时需要同时传入token和timestamp，其他情况传""空字符串即可
     * @param {boolean} silent=false 若 true，则登录失败时不抛出错误（关闭 catch）
     * @returns {Promise<void>}
     * @category 用户帐户控制
     */
    public login(userId: string, token: string, timestamp?:string, silent?: boolean): Promise<void>;

    /**
     * 退出登录，同时清空内存中的聊天记录，并退出所有房间
     * @category 用户帐户控制
     */
    public logout(): void;
    
    /**
     * 是否正在进行登录中（请求了登录，但尚未成功登录）
     * @return {boolean}
     */
    public isLogging(): boolean;
    
    /**
     * 是否已经完成登录
     * @return {boolean}
     */
    public isLogged(): boolean;
    
    /**
     * 获得当前用户ID。
     * @return {string} - 用户ID。若未登录，则返回空字符串 ''。
     * @category 用户帐户控制
     */
    public getMyUserId(): string;

    /***** room *****/

    /**
     * 加入房间
     * @param {string | number} roomId
     * @return {Promise<void>}
     * @category 房间控制
     */
    public joinRoom(roomId: string | number): Promise<string>;

    /**
     * 退出房间
     * @param {string | number} roomId
     * @return {Promise<void>} 完成退出
     * @category 房间控制
     */
    public leaveRoom(roomId?: string | number): Promise<void>;

    /**
     * 检测是否在房间里
     * @param {string | number} roomId
     * @return {boolean}
     * @category 房间控制
     */
    public inRoom(roomId: string | number): boolean;

    /**
     * 已加入的房间列表
     * @return {string[]}
     * @category 房间控制
     */
    public getRoomIdList(): string[];

    /**
     * 房间内的成员列表
     * @param {string | number} roomId
     * @return {string[] | null}
     * @category 房间控制
     */

    /***** message *****/

    /**
     * 注册一个或多个消息类型（不注册则收取不到该类型的消息）
     * @param {{new(): Message} | Array<{new(): Message}>} MsgClass
     * @example YIM.registerMessageType([ TextMessage, VoiceMessage ]);
     * @category 消息控制
     */
    public registerMessageType(MsgClass: (new () => Message) | Array<new () => Message>): void;

    /**
     * 群发消息到指定房间
     * @param {string} roomId
     * @param {Message} msg
     * @param {boolean} silent=false 若 true，则发送失败时不抛出错误（关闭 catch）
     * @return {Promise<void>}
     * @category 消息控制
     */
    public sendToRoom(roomId: string | number, msg: Message, silent?: boolean): Promise<MessageObject | void>;

    /**
     * 私发消息给某人
     * @param {string} userId
     * @param {Message} msg
     * @param {boolean} silent=false 若 true，则发送失败时不抛出错误（关闭 catch）
     * @return {Promise<void>}
     * @category 消息控制
     */
    public sendToUser(userId: string, msg: Message, silent?: boolean): Promise<MessageObject | void>;

    /**
     * 获取历史消息列表
     * @param {string} userOrRoomId 接收者用户ID
     * @param {string} minMsgId 消息范围开始ID
     * @param {string} maxMsgId 消息范围结束ID
     * @param {number} day 消息天数
     * @return {Promise<MessageObject[]>}
     * @category 消息控制
     */
    public requestHistoryMessage(userOrRoomId: string, minMsgId: string, maxMsgId: string, day: number): Promise<MessageObject[]>;
    

    /***** events *****/

    /**
     * 用户登录成功。
     * @event YIM#event:"account.login"
     * @category 用户帐户控制
     */
    /**
     * 正在登录。
     * @event YIM#event:"account.logging"
     * @category 用户帐户控制
     */
    /**
     * 已登出。
     * @event YIM#event:"account.logout"
     * @category 用户帐户控制
     */
    /**
     * 被踢下线。
     * @event YIM#event:"account.kickoff"
     * @category 用户帐户控制
     */
    /**
     * 用户名或密码错误
     * @event YIM#event:"account.error:UsernameOrTokenError"
     * @property {Error} e - 错误对象，e.name = 'UsernameOrTokenError'
     * @category 用户帐户控制
     */

    /**
     * 本帐户正在请求进入房间[roomId]。
     * @event YIM#event:"room.joining:[roomId]"
     * @property {string} roomId - 房间ID
     * @category 房间控制
     */
    /**
     * 本帐户进入了房间[roomId]。
     * @event YIM#event:"room.join:[roomId]"
     * @property {string} roomId - 房间ID
     * @category 房间控制
     */
    /**
     * 本帐户离开了房间[roomId]。
     * @event YIM#event:"room.leave:[roomId]"
     * @property {string} roomId - 房间ID
     * @category 房间控制
     */

    /**
     * 成功发送了消息
     * @event YIM#event:"message:send:['user'|'group']:[userId|roomId]"
     * @property {MessageObject} msgObj - 消息对象
     * @category 消息控制
     */
    /**
     * 发送消息失败：长度超限
     * @event YIM#event:"message:send-failed:MessageTooLongError:['user'|'group']:[userId|roomId]"
     * @property {Message} msgInstance - 消息对象
     * @category 消息控制
     */
    /**
     * 发送消息失败：未登录
     * @event YIM#event:"message:send-failed:NotLoginError:['user'|'group']:[userId|roomId]"
     * @property {Message} msgInstance - 消息对象
     * @category 消息控制
     */
    /**
     * 接收到消息
     * @event YIM#event:"message:receive:['user'|'group']:[userId|roomId]"
     * @property {MessageObject} msgObj - 消息对象
     * @category 消息控制
     */

    /**
     * 信令连接状态改变。
     * @event YIM#event:"signaling.status:[status]"
     * @property {string} status - 新的状态值，状态的取值：<br>
     *  - `disconnected`: 未连接；<br>
     *  - `connecting`: 正在尝试连接；<br>
     *  - `connected`: 已连接；<br>
     *  - `reconnecting`: （掉线后）重新连接；<br>
     *  - `ended`: 用户主动结束了连接。<br>
     * @category 信令服务器连接
     */
    /**
     * 信令服务器已经成功连接，等同于事件 `signaling.status:connected`
     * @event YIM#event:"signaling.ready"
     * @category 信令服务器连接
     */


    /***** classes *****/

    /**
     * 放出 WildEmitter 类，供扩展插件选择使用
     * 详情参阅：https://github.com/HenrikJoreteg/wildemitter
     * @class
     */
    public static WildEmitter: typeof WildEmitter;

    /**
     * 消息基类，供继承扩展
     * @class
     * @category 消息控制
     */
    public static Message: typeof Message;
}

type WE = WildEmitter;
type MsgType = Message;
type MessageObjectType = MessageObject;
type InitConfigType = InitConfig;
type ChatType2 = ChatType;
type AnyJsonType = AnyJson;
type JsonMapType = JsonMap;
type JsonArrayType = JsonArray;
declare namespace YIM {
    export type WildEmitter = WE;
    export type Message = MsgType;
    export type MessageObject = MessageObjectType;
    export type InitConfig = InitConfigType;
    export type ChatType = ChatType2;
    export type AnyJson = AnyJsonType;
    export type JsonMap = JsonMapType;
    export type JsonArray = JsonArrayType;
}

export default YIM;
