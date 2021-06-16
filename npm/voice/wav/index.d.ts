/**
 * @fileOverview
 * @author mio@youme.im
 * @date 2018/6/28
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

import { AnyJson } from 'youme-h5-im/core';
import VoiceMessage from 'youme-h5-im/voice';

export default class WAVRecorder extends VoiceMessage.Recorder {
    protected typeId: number;
    protected typeName: string;

    /**
     * 是否支持媒体设备
     * @returns {boolean}
     */
    public isEnvSupport(): boolean;

    /**
     * 是否支持信息
     * @param {AnyJson} msg
     * @returns {boolean}
     */
    public isSupportMsg(msg: AnyJson): boolean;

    /**
     * 初始化录音设备
     * @returns {Promise<void>}
     */
    public initRecord(): Promise<void>;

    /**
     * 开始录音，最大时长为60秒
     */
    public startRecord(): void;

    /**
     * 结束录音
     * @returns {Promise<void>}
     */
    public finishRecord(): Promise<void>;

    /**
     * 取消录音
     */
    public cancelRecord(): void;

    /**
     * 是否正在录音
     * @returns {boolean}
     */
    public isRecording(): boolean;

    /**
     * 设定监听录音完成回调（包括手动停止录音&超时自动完成录音，不包括取消录音）
     * @param {() => void} callback
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
     * @returns {boolean}
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
