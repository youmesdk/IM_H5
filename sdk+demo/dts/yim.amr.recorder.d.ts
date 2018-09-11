/**
 * @fileOverview AMR 格式录音插件，H5浏览器端使用，可与客户端、微信端互通
 * @author benz@youme.im
 * @date 2018/6/28
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

import { AnyJson } from 'youme-im/core';
import VoiceMessage from 'youme-im/voice';

export default class AMRRecorder extends VoiceMessage.Recorder {
    protected typeId: number;
    protected typeName: string;

    /**
     * 设置微信公众平台接口的跨域代理接口，用于获取从微信发来的消息
     *   由于微信公众平台接口不支持前端跨域获取文件，
     *   因此，若需要浏览器与微信互通，则需在同域服务器开放一个跨域代理接口。
     *   （跨域代理接口、中转服务接口2选1，这里设置跨域代理接口）
     *   （若没有浏览器与微信互通的需求，可以二者都不用设置，不影响浏览器与客户端互通）
     * @param {string} proxyUrl 接口中转服务器 URL
     * @param {string} [urlParamName] 中转服务器获取微信接口链接的参数名字，默认值为 'url'
     * @example 若 proxyUrl='/proxy.php'，urlParamName='corsUrl'，则跨域代理接口为：
     *   '/proxy.php?corsUrl=https%3A%2F%2Fapi.weixin.qq.com%2Fcgi-bin%2Fmedia%2Fget...'
     */
    public static setCrossDomainProxy(proxyUrl: string, urlParamName?: string): void;

    /**
     * 设置微信临时语音文件的中转服务接口
     *   由于微信公众平台接口不支持前端跨域获取文件，
     *   因此，若需要浏览器与微信互通，则需在同域服务器自行搭建一个中转服务接口。
     *   （跨域代理接口、中转服务接口2选1，这里设置中转服务接口）
     *   （若没有浏览器与微信互通的需求，可以二者都不用设置，不影响浏览器与客户端互通）
     *   中转服务器做两件事：
     *    1. 获取 ACCESS_TOKEN：https://mp.weixin.qq.com/wiki?action=doc&id=mp1421140183
     *    2. 根据 mediaId 获取临时语音文件：https://mp.weixin.qq.com/wiki?action=doc&id=mp1444738727
     *    3. 获得的语音文件原样传回前端。
     * @param {string} url 获取微信录音文件的代理 URL
     * @param {string} [mediaIdParamName] 微信 mediaId 参数名，默认值为 'mediaId'
     */
    public static setWechatVoiceDownloadUrl(url: string, mediaIdParamName?: string): void;

    /**
     * 判断浏览器环境是否支持
     * @return {boolean}
     */
    public isEnvSupport(): boolean;

    /**
     * 判断是否支持播放某条消息
     * @return {boolean}
     */
    public isSupportMsg(msg: AnyJson): boolean;

    /**
     * 初始化录音，然后返回 Promise
     * @return {Promise<void>} 返回初始化完毕后的 Promise
     */
    public initRecord(): Promise<void>;

    /**
     * 开始录音
     */
    public startRecord(): void;

    /**
     * 停止并完成录音，上传录音文件，之后返回 Promise
     * @return {Promise<void>} 处理好录音文件之后的 Promise
     */
    public finishRecord(): Promise<void>;

    /**
     * 停止并放弃录音
     */
    public cancelRecord(): void;

    /**
     * 是否正在录音
     */
    public isRecording(): boolean;

    /**
     * 设定监听录音完成回调（包括手动停止录音&超时自动完成录音，不包括取消录音）
     * @param {function(): void} callback
     */
    public onRecordEnd(callback: () => void): void;

    /**
     * 获取用于服务器传输的 msg json
     * @return {AnyJson}
     */
    public getJsonMsg(): AnyJson;


    /************ 播放 ************/

    /**
     * 使用服务器接收的 msg json 进行初始化、下载音频
     * @param {AnyJson} json
     * @return {Promise<void>}
     */
    public initWithJsonMsg(json: AnyJson): Promise<void>;

    /**
     * 播放
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
     * 设定监听播放完毕回调（包括手动停止播放&播放到末尾自动停止）
     * @param {function(): void} callback
     */
    public onPlayEnd(callback: () => void): void;

    /**
     * 获取录音长度，（单位：秒），可以有小数
     * @return {number}
     */
    public getDuration(): number;
}
