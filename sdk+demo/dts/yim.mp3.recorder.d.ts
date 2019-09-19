/**
 * @fileOverview MP3 格式录音插件，H5浏览器端使用，只能与浏览器通讯
 * @author benz@youme.im
 * @date 2018/7/12
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

import { AnyJson } from 'youme-h5-im/core';
import VoiceMessage from 'youme-h5-im/voice';

export default class MP3Recorder extends VoiceMessage.Recorder {
    protected typeId: number;
    protected typeName: string;

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
