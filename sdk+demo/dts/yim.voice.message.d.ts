/**
 * @fileOverview 语音消息类
 * @author benz@youme.im
 * @date 2018/6/28
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

import YIM from 'youme-im/core';
import { AnyJson } from 'youme-im/core';

/**
 * Recorder 基类，实现录音插件
 * IM 核心会读取 typeId 和 getJsonMsg()，然后传给对方的 initWithJsonMsg()。
 * 子类请自行定制一个 Json 的格式，存储录音的相关信息。
 * 让 IM 核心可以从 getJsonMsg() 取出该格式的 Json，并传入另一方的 initWithJsonMsg()。
 * 另一方的 initWithJsonMsg() 经过解析，可实现录音播放。
 * @class
 * @abstract
 */
export declare abstract class Recorder {

    /**
     * 子类实现：填入一个ID号，微信为1，WebRTC为2，其他类型可自定义ID号
     */
    protected abstract typeId: number;

    /**
     * 子类实现：录音机类型名字标识，微信为 'wechat'，WebRTC 为 'WebRTC'，其他类型可自定义
     */
    protected abstract typeName: string;

    public getTypeId(): number;
    public getType(): string;

    /**
     * 若需要上传音频，请把 Blob 输入此方法
     * @param {Blob} file
     * @return {Promise<string>} 上传完成后用 Promise 回调下载地址
     */
    protected uploadFile(file: Blob): Promise<string>;

    /**
     * 子类实现：判断是否支持当前系统环境，支持就返回 true
     * @return {boolean}
     */
    public abstract isEnvSupport(): boolean;

    /**
     * 子类实现：输入一个从服务器接收的 msg json 音频信息，判断能否支持其播放
     * @param {AnyJson} msg
     * @return {boolean}
     */
    public abstract isSupportMsg(msg: AnyJson): boolean;

    /********** 录音 **********/

    /**
     * 子类实现：初始化录音，然后返回 Promise
     *   若不需要初始化，请直接返回一个 Promise.resolve()
     * @return {Promise<void>} 返回初始化完毕后的 Promise
     */

    public abstract initRecord(): Promise<void>;

    /**
     * 子类实现：开始录音。
     *   子类不需要理会是否初始化，VoiceMessage 核心会先初始化了再调用这个录音的。
     *   注意：若无法支持多实例同时录音，请自行实现以下判断逻辑：
     *   若其他 VoiceMessage 实例仍在录音中，则子类须在此抛出以下错误：
     *     const err = new Error('Recorder is busy.');
     *     err.name = 'RecorderBusyError';
     *     throw err;
     * @return {Promise<void>} 处理好录音文件之后的 Promise
     */
    public abstract startRecord(): void | Promise<void>;

    /**
     * 子类实现：停止并完成录音，处理好录音文件，然后返回 Promise
     *   当 Promise 被 resolve 之后，play()、getJsonMsg()、getDuration() 须保证正常工作
     * @return {Promise<void>} 处理好录音文件之后的 Promise
     */
    public abstract finishRecord(): Promise<void>;

    /**
     * 子类实现：停止并放弃录音
     */
    public abstract cancelRecord(): void;

    /**
     * 子类实现：是否正在录音
     */
    public abstract isRecording(): boolean;

    /**
     * 子类实现：设定监听录音完成回调（包括手动停止录音&超时自动完成录音，不包括取消录音）
     *   当 callback 被回调之后，play()、getJsonMsg()、getDuration() 须保证正常工作
     * @param {function(): void} callback
     */
    public abstract onRecordEnd(callback: () => void): void;

    /**
     * 子类实现：获取用于服务器传输的 msg json
     * @return {AnyJson}
     */
    public abstract getJsonMsg(): AnyJson;

    /************ 播放 ************/

    /**
     * 子类实现：使用服务器接收的 msg json 进行初始化、下载音频
     *   注意：调用本方法之后，play()、getJsonMsg()、getDuration() 须保证正常工作
     * @param {AnyJson} json
     * @return {Promise<void>}
     */
    public abstract initWithJsonMsg(json: AnyJson): Promise<void>;

    /**
     * 子类实现：播放
     */
    public abstract play(): void;

    /**
     * 子类实现：停止
     */
    public abstract stop(): void;

    /**
     * 子类实现：是否正在播放
     * @return {boolean}
     */
    public abstract isPlaying(): boolean;

    /**
     * 子类实现：设定监听播放完毕回调（包括手动停止播放&播放到末尾自动停止）
     * @param {function(): void} callback
     */
    public abstract onPlayEnd(callback: () => void): void;

    /**
     * 子类实现：获取录音长度，（单位：秒），可以有小数
     * @return {number}
     */
    public abstract getDuration(): number;

    /************ ？？ ************/
    public __controls: {[fnName: string]: Function};
}

declare class VoiceMessage extends YIM.Message {
    /**
     * 放出 Recorder 基类，所有 Recorder 基于此基类开发
     * @type {Recorder}
     */
    public static Recorder: typeof Recorder;

    /**
     * 注册一个 Recorder
     * @param {Array<{new: Recorder}>} RecClass 数组，Recorder 类列表（直接传入，不要 new 和括号）
     */
    public static registerRecorder(RecClass: (new () => Recorder)[]): void;

    /**
     * 设备是否支持录音
     * @return {boolean}
     */
    public static isEnvSupport(): boolean;

    /**
     * 提前初始化录音，用于像“按住说话”之类的场景，提前让用户授权
     * @return {Promise<void>}
     */
    public static initRecorder(): Promise<void>;

    /**
     * 加入自动播放列表
     * @param {VoiceMessage} msg
     */
    public static addToAutoPlayQueue(msg: VoiceMessage): void;

    /**
     * 获取自动播放列表待播放的数量
     * @return {number} 数量
     */
    public static getAutoPlayQueueLength(): number;

    /**
     * 获取当前自动播放中正在播放的 VoiceMessage
     * @return {VoiceMessage | undefined} 返回 Message，没有自动播放则返回 undefined
     */
    public static getCurrentAutoPlayingMessage(): VoiceMessage | undefined;

    /**
     * 跳到下一音频
     */
    public static nextAutoPlay(): void;

    /**
     * 停止播放并清空播放列表
     */
    public static stopAndClearAutoPlayQueue(): void;

    /**
     * 绑定自动播放事件
     * @param {string} event 事件名
     * @param {Function} cb 事件 Function
     * @category 自动播放列表
     */
    public static bindAutoPlayEvent(event: string, cb: (...payload: any[]) => void): void;

    /**
     * 解绑自动播放事件
     * @param {string} event 事件名
     * @param {Function=} cb 事件 Function，若不填则清空所有事件
     * @category 自动播放列表
     */
    public static unbindAutoPlayEvent(event: string, cb?: (...payload: any[]) => void): void;

    protected typeId: number;
    protected typeName: string;

    /**
     * 使用服务器返回的或者其他实例获得的 JSON 或字符串内容来初始化语音，初始化成功后应可直接播放
     * @param content
     * @return Promise 成功初始化
     */
    public initWithContent(content: string): Promise<void>;

    /**
     * 初始化录音
     * 正常情况下可以直接调用 startRecord 开始录音，然后用户若尚未授权，系统会向用户询问授权
     * 若需要提前取得授权，可以调用此方法
     * @return {Promise<void>}
     */
    public initRecord(): Promise<void>;

    /**
     * 开始录音，若尚未初始化，会先自动初始化
     * 另外，视系统而定，两个 VoiceMessage 实例不一定可以同时录音。
     * 若另一 VoiceMessage 尚未结束录音，本实例调用 startRecord 可能会报错。
     * 目前，AMR、MP3 可支持多实例同时录音，微信不支持。
     * @param {boolean=false} silent 若为 true，出错时js不会报错，不能 catch，
     *           但可以通过监听 'error:*' 事件，或 isError() 获取错误信息。
     * @return {Promise<void>}
     */
    public startRecord(silent?: boolean): Promise<void>;

    /**
     * 结束录音
     * @param {boolean=false} silent 若为 true，出错时js不会报错，不能 catch，
     *           但可以通过监听 'error:*' 事件，或 isError() 获取错误信息。
     * @return {Promise<void>}
     */
    public finishRecord(silent?: boolean): Promise<void>;

    /**
     * 放弃录音
     */
    public cancelRecord(): void;

    /**
     * 是否正在录音
     * @return {boolean}
     */
    public isRecording(): boolean;

    /**
     * 是否发生过错误
     * @category 录音控制
     */
    public isError(): boolean;

    /**
     * 若有错误则返回错误名称，否则返回空字符串
     * @return {string}
     */
    public getErrorName(): string;

    /**
     * 播放
     * 视系统而定，不一定支持两个 VoiceMessage 实例同时播放。
     * 这时若另一实例仍在播放中，可能另一实例会被强制停止播放。
     * 目前，AMR、MP3 支持多个实例同时混音播放，微信不支持。
     */
    public play(): void;

    /**
     * 停止
     */
    public stop(): void;

    /**
     * 是否正在播放
     * @return {boolean}
     */
    public isPlaying(): boolean;

    /**
     * 获取录音长度，（单位：秒），可能会有小数
     * @return {number}
     */
    public getDuration(): number;



    /***** events *****/

    /**
     * 开始录音
     * @event VoiceMessage#event:"start-record"
     * @category 录音控制
     */
    /**
     * 正在完成录音（开始做转码、上传等）
     * @event VoiceMessage#event:"finishing-record"
     * @category 录音控制
     */
    /**
     * 完成录音（包括转码、上传等，已经可以播放）
     * @event VoiceMessage#event:"finish-record"
     * @category 录音控制
     */
    /**
     * 取消录音，此实例作废
     * @event VoiceMessage#event:"cancel-record"
     * @category 录音控制
     */
    /**
     * 错误：设备不支持录音
     * @event VoiceMessage#event:"error:DeviceNotSupportedError"
     * @category 录音控制
     */
    /**
     * 错误：没有录音设备权限
     * @event VoiceMessage#event:"error:NotAllowedError"
     * @category 录音控制
     */
    /**
     * 错误：此实例已经拥有录音（若要新建录音则需要 new 一个新的实例）
     * @event VoiceMessage#event:"error:AlreadyReadyError"
     * @category 录音控制
     */
    /**
     * 错误：此实例已经取消了录音，实例作废（若要新建录音则需要 new 一个新的实例）
     * @event VoiceMessage#event:"error:CanceledError"
     * @category 录音控制
     */
    /**
     * 错误：未曾开始录音（却调用了完成录音的接口）
     * @event VoiceMessage#event:"error:RecorderNotStartedError"
     * @category 录音控制
     */
    /**
     * 错误：录音系统忙碌（有其他实例正在录音或录音系统在处理数据）
     * @event VoiceMessage#event:"error:RecorderBusyError"
     * @category 录音控制
     */
    /**
     * 错误：录音时间太短
     * @event VoiceMessage#event:"error:RecordTooShortError"
     * @category 录音控制
     */

    /**
     * 开始播放
     * @event VoiceMessage#event:"play"
     * @category 播放控制
     */
    /**
     * 停止播放
     * @event VoiceMessage#event:"stop"
     * @category 播放控制
     */
    /**
     * 播放结束，包括调用 stop() 结束和播放到结尾自动结束
     * @event VoiceMessage#event:"end-play"
     * @category 播放控制
     */

    /**
     * 播放列表全部播放完毕
     * @event VoiceMessage#event:"all-ended"
     * @static
     * @category 自动播放列表
     */
    /**
     * 播放列表开始播放某一条语音
     * @event VoiceMessage#event:"begin-play"
     * @property {VoiceMessage} msg - 刚开始的语音消息对象
     * @static
     * @category 自动播放列表
     */
    /**
     * 播放列表结束播放某一条语音（包括播放到结尾和手动停止）
     * @event VoiceMessage#event:"end-play"
     * @property {VoiceMessage} msg - 刚结束的语音消息对象
     * @static
     * @category 自动播放列表
     */
    /**
     * 播放列表跳到下一条语音（包括自动跳和手动跳）
     * @event VoiceMessage#event:"next"
     * @property {VoiceMessage} msg - 下一条语音消息对象
     * @static
     * @category 自动播放列表
     */
    /**
     * 播放列表新增一条语音
     * @event VoiceMessage#event:"add"
     * @property {VoiceMessage} msg - 新增的语音消息对象
     * @static
     * @category 自动播放列表
     */
}

type RecorderType = Recorder;
declare namespace VoiceMessage {
    export type Recorder = RecorderType;
}

export default VoiceMessage;
