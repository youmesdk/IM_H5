/**
 * @fileOverview 兼容旧版本 H5 IM 接口的外壳
 * @author benz@youme.im
 * @date 2018/8/23
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

import YIM, { JsonMap, MessageObject } from 'youme-im/core';
import TextMessage from 'youme-im/text';
import VoiceMessage from 'youme-im/voice';
import { isWechat, initVoice } from './voice.no-rec'; // rollup 编译时将替换为 './voice.xxx'

namespace yim {

    /**
     * 是否开启sdk调用日志
     */
    export let debug: boolean = false;

    /**
     * 是否在微信内运行
     */
    export function isWeixin(): boolean {
        return isWechat();
    }

    /**
     * 初始化类接口
     */
    export class getInstance {

        private _eventCallbacks: IEventObject;

        private _curRecVoiceMsg: VoiceMessage | null = null;

        private _curPlayVoiceMsg: VoiceMessage | null = null;

        private _autoPlayContentList: any[] = [];

        public newInstance: YIM;

        public socketio: YIM.WildEmitter = new YIM.WildEmitter();

        /**
         * 初始化接口
         * @param dirtyWordsArray 脏字过滤数组，如['色情', '赌博']
         * @param appKey 用户游戏产品区别于其它游戏产品的标识，可以在游密官网获取
         * @param eventCallback 相关事件回调接口对象，如：{onLogin:_loginCallback, onLogout:_logoutCallback}
         */
        constructor(dirtyWordsArray: string[], appKey: string, eventCallback: IEventObject) {

            initVoice();

            // 设置脏字过滤
            TextMessage.setDirtyWords(dirtyWordsArray);

            // 建立对象
            this.newInstance = new YIM({
                appKey,
                useMessageType: [TextMessage, VoiceMessage]
            });

            // 绑定各个事件
            this._eventCallbacks = eventCallback;
            this.newInstance.on('account.login', () => {
                if (eventCallback.onLogin) {
                    eventCallback.onLogin(0, {
                        code: 0,
                        message: 'ok',
                        data: {
                            userid: this.newInstance.getMyUserId()
                        }
                    });
                }
            });
            this.newInstance.on('account.logout', () => {
                if (eventCallback.onLogout) {
                    eventCallback.onLogout(0, {
                        code: 0,
                        message: 'ok',
                        data: {
                            userid: this.newInstance.getMyUserId()
                        }
                    });
                }
            });
            this.newInstance.on('account.kickoff', () => {
                if (eventCallback.onKickOff) {
                    eventCallback.onKickOff();
                }
            });
            this.newInstance.on('account.error:UsernameOrTokenError', () => {
                if (eventCallback.onLogin) {
                    eventCallback.onLogin(YIMErrorcode.YIMErrorcode_USERNAME_TOKEN_ERROR, {
                        code: YIMErrorcode.YIMErrorcode_USERNAME_TOKEN_ERROR,
                        message: '用户名或token错误',
                        data: {
                            userid: this.newInstance.getMyUserId()
                        }
                    });
                }
            });
            this.newInstance.on('room.join:*', (eventFullName: string, roomId: string) => {
                if (eventCallback.onJoinChatRoom) {
                    eventCallback.onJoinChatRoom(0, {
                        code: 0,
                        message: 'ok',
                        data: {
                            roomid: roomId
                        }
                    });
                }
            });
            this.newInstance.on('room.leave:*', (eventFullName: string, roomId: string) => {
                if (eventCallback.onLeaveChatRoom) {
                    eventCallback.onLeaveChatRoom(0, {
                        code: 0,
                        message: 'ok',
                        data: {
                            roomid: roomId
                        }
                    });
                }
            });
            this.newInstance.on('message:send:*', (eventFullName: string, msgObj: MessageObject) => {
                if (eventCallback.onSendMessageStatus) {
                    eventCallback.onSendMessageStatus(0, {
                        code: 0,
                        message: 'ok',
                        data: {
                            msgid: parseInt(msgObj.serial || '0')
                        }
                    });
                }
            });
            this.newInstance.on('message:send-failed:MessageTooLongError:*', (/*eventFullName: string, msgInstance: Message*/) => {
                if (eventCallback.onSendMessageStatus) {
                    eventCallback.onSendMessageStatus(20007, {
                        code: 20007,
                        message: 'Message too long.',
                        data: {
                            msgid: 0
                        }
                    });
                }
            });
            this.newInstance.on('message:send-failed:NotLoginError:*', (/*eventFullName: string, msgInstance: Message*/) => {
                if (eventCallback.onSendMessageStatus) {
                    eventCallback.onSendMessageStatus(20001, {
                        code: 20001,
                        message: 'Not login.',
                        data: {
                            msgid: 0
                        }
                    });
                }
            });
            this.newInstance.on('message:receive:*', (eventFullName: string, msgObj: MessageObject) => {
                if (eventCallback.onRecvMessage) {
                    eventCallback.onRecvMessage({
                        msgType: msgObj.message.getTypeId(),
                        senderid: msgObj.serverId,
                        recvid: msgObj.receiverId,
                        messageid: msgObj.serial || '0',
                        createtime: Math.round(msgObj.time.getTime() / 1000),
                        chattype: msgObj.chatType === 'user' ? 1 : 2,
                        content: msgObj.message.getContent(),
                        final: false,
                        history: false
                    });
                }
            });
            this.newInstance.on('signaling.ready', () => {
                this.socketio.emit('connect');
            });
            this.newInstance.on('signaling.error', (err: any) => {
                this.socketio.emit('error', err);
                this.socketio.emit('connect_error', err);
            });
            this.newInstance.on('signaling.send:*', (eventName: string, msg: JsonMap) => {
                this.socketio.emit('send', 'yim', JSON.stringify(msg), msg);
            });
            this.newInstance.on('signaling.receive:*', (eventName: string, msg: JsonMap) => {
                this.socketio.emit('message', { target: this.newInstance, data: msg });
                this.socketio.emit('yim', msg);
            });
            this.newInstance.on('signaling.status:ended', () => {
                this.socketio.emit('close', { target: this.newInstance });
                this.socketio.emit('disconnect', { target: this.newInstance });
            });
            this.newInstance.on('*', function (eventName: string) {
                if (debug) {
                    console.log('[yim] ' + eventName, arguments);
                }
            });
        }

        /**
         * 初始化完成的回调
         * @param callBack
         */
        public ready(callBack:() => void): void {
            this.newInstance.on('signaling.ready', callBack);
        }

        /**
         * 登录
         * @param userId 用户名，调用者分配，不可为空字符串，只可由字母或数字或下划线组成
         * @param token 从服务端获取到的token
         */
        public login(userId: string, token: string): void {
            this.newInstance.login(userId, token).catch();
        }

        /**
         * 登出，操作结果会通过回调接口返回:onLogout
         */
        public logout(): void {
            this.newInstance.logout();
        }

        /**
         * 加入聊天室进行群组聊天，操作结果会通过回调接口返回:onJoinChatRoom
         * @param roomId 频道编号
         */
        public joinRoom(roomId: string): void {
            this.newInstance.joinRoom(roomId).catch();
        }


        /**
         * 退出聊天室，操作结果会通过回调接口返回:onLeaveChatRoom
         * @param roomId 频道编号
         */
        public leaveRoom(roomId: string): void {
            this.newInstance.leaveRoom(roomId).catch();
        }

        /**
         * 发送文本消息
         * @param receiveUid 接受者编号（用户编号或者频道编号）
         * @param chatType 聊天类型，群聊或者私聊，1为私聊，2为群聊
         * @param content 聊天内容，可以用json格式来扩展消息内容
         */
        public sendTextMessage(receiveUid: string, chatType: number, content: string): void {
            const msg = new TextMessage(content);
            if (chatType === 2) {
                this.newInstance.sendToRoom(receiveUid, msg).catch();
            } else {
                this.newInstance.sendToUser(receiveUid, msg).catch();
            }
        }

        /**
         * 初始化音频设备，这里的 options 选项已经全部作废
         * @param options
         * @param callback
         */
        public initAudioMedia(options: {
            showProgressTips?: number,
            maxRecordSecond?: number,
            bitRate?: number,
            mp3Worker?: string,
            lamejs?: string
        }, callback: (ret: {
            type: string, // 'webrtc' or 'weixin'
            support: boolean // 是否支持录音
        }) => void): void {
            const type = isWechat() ? 'weixin' : 'webrtc';
            if (VoiceMessage.isEnvSupport()) {
                VoiceMessage.initRecorder().then(() => callback({
                    type,
                    support: true
                })).catch(() => callback({
                    type,
                    support: false
                }))
            } else {
                callback({
                    type,
                    support: false
                })
            }
        }

        /**
         * 检查当前环境是否支持录音，建议调用startAudioMessage 前先检查
         */
        public getSupportAudioMessage(): boolean {
            return VoiceMessage.isEnvSupport();
        }

        /**
         * 开始录音
         * @param receiveUid 接受者编号（用户编号或者频道编号）
         * @param chatType 聊天类型，群聊或者私聊，1为私聊，2为群聊
         * @param callBack 回调
         */
        public startAudioMessage(receiveUid: string, chatType: number, callBack: (code: YIMErrorcode, errInfo: { errCode: YIMErrorcode | YIMAudioCode, errMsg: string }) => void): void {
            if (this._curRecVoiceMsg && !this._curRecVoiceMsg.isReady() && !this._curRecVoiceMsg.isCanceled()) {
                this.cancelAudioMessage();
            }
            this._curRecVoiceMsg = new VoiceMessage();
            this._curRecVoiceMsg.startRecord()
                .then(() => callBack(0, {
                    errCode: 0,
                    errMsg: 'ok'
                }))
                .catch((e: Error) => {
                    switch (e.name) {
                        case 'DeviceNotSupportedError':
                            callBack(YIMErrorcode.YIMErrorcode_Fail, {
                                errCode: YIMAudioCode.WEBRTC_ERROR,
                                errMsg: '当前浏览器不支持录音'
                            });
                            break;
                        case 'NotAllowedError':
                            callBack(YIMErrorcode.YIMErrorcode_Fail, {
                                errCode: YIMAudioCode.WEBRTC_ERROR,
                                errMsg: '没有录音权限'
                            });
                            break;
                        case 'RecorderNotStartedError':
                            callBack(YIMErrorcode.YIMErrorcode_Fail, {
                                errCode: YIMAudioCode.INVALID_INVOKE,
                                errMsg: '无效的调用'
                            });
                            break;
                        case 'RecorderBusyError':
                            callBack(YIMErrorcode.YIMErrorcode_Fail, {
                                errCode: YIMAudioCode.DUPLICATE_INVOKE,
                                errMsg: '录音系统繁忙'
                            });
                            break;
                        case 'RecordTooShortError':
                            callBack(YIMErrorcode.YIMErrorcode_Fail, {
                                errCode: YIMAudioCode.VOICE_TOOSHORT,
                                errMsg: '语音时长过短，请重新发送'
                            });
                            break;
                    }
                });
            const then = (msg: MessageObject | void) => {
                if (!msg) { return; }
                if (this._eventCallbacks.onVoiceMsgSend) {
                    let voiceURL = this._curRecVoiceMsg!.getContent();
                    let voiceID = voiceURL;
                    try {
                        const content = JSON.parse(voiceURL);
                        voiceURL = content['downloadurl'];
                        voiceID = content['mediaid'];
                    } catch (e) { }
                    this._eventCallbacks.onVoiceMsgSend(0, {
                        msgID: msg.serial || '0',
                        voiceTime: this._curRecVoiceMsg!.getDuration(),
                        voiceURL: voiceURL,
                        voiceServerID: voiceID
                    });
                }
            };
            if (chatType === 2) {
                this.newInstance.sendToRoom(receiveUid, this._curRecVoiceMsg).then(then).catch();
            } else {
                this.newInstance.sendToUser(receiveUid, this._curRecVoiceMsg).then(then).catch();
            }
        }

        /**
         * 取消录音
         */
        public cancelAudioMessage(): void {
            if (this._curRecVoiceMsg) {
                this._curRecVoiceMsg.cancelRecord();
            }
        }

        /**
         * 停止录音并发送出去，当停止调用距开始调用不足一秒时会延迟1秒停止，操作结果会通过回调接口返回:onVoiceMsgSend
         * @param callBack 回调
         */
        public stopAudioMessage(callBack: (code: YIMErrorcode, errInfo: { errCode: YIMErrorcode | YIMAudioCode, errMsg: string }) => void): void {
            if (!this._curRecVoiceMsg) {
                callBack(YIMErrorcode.YIMErrorcode_Fail, {
                    errCode: YIMAudioCode.INVALID_INVOKE,
                    errMsg: '无效的调用'
                });
                return;
            }
            this._curRecVoiceMsg.finishRecord()
                .then(() => callBack(0, {
                    errCode: 0,
                    errMsg: 'ok'
                }))
                .catch((e: Error) => {
                switch (e.name) {
                    case 'DeviceNotSupportedError':
                        callBack(YIMErrorcode.YIMErrorcode_Fail, {
                            errCode: YIMAudioCode.WEBRTC_ERROR,
                            errMsg: '当前浏览器不支持录音'
                        });
                        break;
                    case 'NotAllowedError':
                        callBack(YIMErrorcode.YIMErrorcode_Fail, {
                            errCode: YIMAudioCode.WEBRTC_ERROR,
                            errMsg: '没有录音权限'
                        });
                        break;
                    case 'RecorderNotStartedError':
                        callBack(YIMErrorcode.YIMErrorcode_Fail, {
                            errCode: YIMAudioCode.INVALID_INVOKE,
                            errMsg: '无效的调用'
                        });
                        break;
                    case 'RecorderBusyError':
                        callBack(YIMErrorcode.YIMErrorcode_Fail, {
                            errCode: YIMAudioCode.DUPLICATE_INVOKE,
                            errMsg: '录音系统繁忙'
                        });
                        break;
                    case 'RecordTooShortError':
                        callBack(YIMErrorcode.YIMErrorcode_Fail, {
                            errCode: YIMAudioCode.VOICE_TOOSHORT,
                            errMsg: '语音时长过短，请重新发送'
                        });
                        break;
                }
            });
        }

        /**
         * 播放指定地址的语音
         * @param voiceIdOrUrl 语音地址
         * @param callBack 回调
         */
        public playAudioMessage(voiceIdOrUrl: string, callBack: (code: YIMErrorcode, errInfo: { errCode: YIMErrorcode, errMsg: string }) => void): void {
            if (this._curPlayVoiceMsg && this._curPlayVoiceMsg.isPlaying()) {
                this._curPlayVoiceMsg.stop();
            }
            const isVoiceUrl: boolean = voiceIdOrUrl.substr(0,2) === '//'
                || voiceIdOrUrl.substr(0,7) === 'http://'
                || voiceIdOrUrl.substr(0,7) === 'https:/';
            const content = isVoiceUrl ? { 'downloadurl': voiceIdOrUrl } : { 'mediaid': voiceIdOrUrl };
            this._curPlayVoiceMsg = new VoiceMessage();
            this._curPlayVoiceMsg.initWithContent(JSON.stringify(content)).then(() => {
                this._curPlayVoiceMsg!.play();
                this._curPlayVoiceMsg!.once('end-play', () => {
                    callBack(0, {errCode: 0, errMsg: 'ok'});
                });
            });
        }

        /**
         * 停止正在播放的语音信息
         * @param voiceIdOrUrl 语音地址
         * @param callBack 回调
         */
        public stopPlayAudioMessage(voiceIdOrUrl: string, callBack: (code: YIMErrorcode, errInfo: { errCode: YIMErrorcode, errMsg: string }) => void): void {
            if (this._curPlayVoiceMsg && this._curPlayVoiceMsg.isPlaying()) {
                this._curPlayVoiceMsg.stop();
                callBack(0, {errCode: 0, errMsg: 'ok'});
            }
        }

        /**
         * 初始化语音自动播放队列
         * @param eventCallback 相关事件回调接口对象
         */
        public initAutoPlayVoiceQueue(eventCallback: {
            beginPlay: (message: { msgType: MessageBodyType, senderid: string, recvid: string, messageid: string, createtime: number, chattype: number, content: string }) => void,
            endPlay: (message: { msgType: MessageBodyType, senderid: string, recvid: string, messageid: string, createtime: number, chattype: number, content: string }) => void
        }): void {
            VoiceMessage.bindAutoPlayEvent('next', () => {
                this._autoPlayContentList.unshift();
            });
            VoiceMessage.bindAutoPlayEvent('begin-play', () => {
                eventCallback.beginPlay(this._autoPlayContentList[0]);
            });
            VoiceMessage.bindAutoPlayEvent('end-play', () => {
                eventCallback.endPlay(this._autoPlayContentList[0]);
            });
        }

        /**
         * 添加到自动播放列表
         * @param message 语音消息数据
         */
        public addToAutoPlayVoiceQueue(message: any): void {
            if (typeof message === 'object' && message['content']) {
                const m = new VoiceMessage();
                m.initWithContent(message['content']).then(() => {
                    this._autoPlayContentList.push(message);
                    VoiceMessage.addToAutoPlayQueue(m);
                }).catch();
            }
        }

        public getHistoryMessage(userOrRoomId: string, minMsgId: string, maxMsgId: string, day: number): void {
            this.newInstance.requestHistoryMessage(userOrRoomId, minMsgId, maxMsgId, day).then((list: MessageObject[]) => {
                list.forEach((msg) => {
                    this.newInstance.emit(`message:receive:${msg.chatType}:${msg.withPeer}`, msg);
                });
            });
        }

        public keywordsFilter(text: string) {
            return TextMessage.filterDirty(text);
        }
    }

    export interface IEventObject {
        /**
         * 登录回调
         */
        onLogin?: (YIMErrorcodeOC: YIMErrorcode, event: { code: YIMErrorcode, message: string, data: { userid: string } }) => void,
        /**
         * 登出回调
         */
        onLogout?: (YIMErrorcodeOC: YIMErrorcode, event: { code: YIMErrorcode, message: string, data: { userid: string } }) => void,
        /**
         * 加入频道回调
         */
        onJoinChatRoom?: (YIMErrorcodeOC: YIMErrorcode, event: { code: YIMErrorcode, message: string, data: { roomid: string } }) => void,
        /**
         * 离开频道回调
         */
        onLeaveChatRoom?: (YIMErrorcodeOC: YIMErrorcode, event: { code: YIMErrorcode, message: string, data: { roomid: string } }) => void,
        /**
         * 消息发送状态回调
         */
        onSendMessageStatus?: (YIMErrorcodeOC: YIMErrorcode, event: { code: YIMErrorcode, message: string, data: { msgid: number } }) => void,
        /**
         * 语音消息录制成功发送前接口回调
         */
        onVoiceMsgSend?: (YIMErrorcodeOC: YIMErrorcode, audioInfo: { msgID: string, voiceTime: number, voiceURL: string,voiceServerID?: string }) => void,
        /**
         * 收到其他用户消息回调，其中chattype为聊天类型，1为私聊，2为群聊，另外，如果是语音消息，那么content是一个json，里面的key为downloadurl、datasize、voicetime、recordmode
         */
        onRecvMessage?: (message: { msgType: MessageBodyType, senderid: string, recvid: string, messageid: string, createtime: number, chattype: number, content: string, final: boolean, history: boolean }) => void,
        /**
         * 被踢出回调
         */
        onKickOff?: () => void
    }

    /**
     * 错误码定义
     */
    export enum YIMErrorcode {
        /**
         * 成功
         */
        YIMErrorcode_Success,
        /**
         * IM SDK未初始化
         */
        YIMErrorcode_EngineNotInit,
        /**
         * IM SDK未登录
         */
        YIMErrorcode_NotLogin,
        /**
         * 无效的参数
         */
        YIMErrorcode_ParamInvalid,
        /**
         * 超时
         */
        YIMErrorcode_TimeOut,
        /**
         * 状态错误
         */
        YIMErrorcode_StatusError,
        /**
         * Appkey无效
         */
        YIMErrorcode_SDKInvalid,
        /**
         * 已经登录
         */
        YIMErrorcode_AlreadyLogin,
        /**
         * 登录无效
         */
        YIMErrorcode_LoginInvalid,
        /**
         * 服务器错误
         */
        YIMErrorcode_ServerError,
        /**
         * 网络错误
         */
        YIMErrorcode_NetError,
        /**
         * 登录状态出错
         */
        YIMErrorcode_LoginSessionError,
        /**
         * SDK未启动
         */
        YIMErrorcode_NotStartUp,
        /**
         * 文件不存在
         */
        YIMErrorcode_FileNotExist,
        /**
         * 文件发送出错
         */
        YIMErrorcode_SendFileError,
        /**
         * 文件上传失败
         */
        YIMErrorcode_UploadFailed,
        /**
         * 用户名密码错误
         */
        YIMErrorcode_UsernamePasswordError,
        /**
         * 用户状态为无效用户
         */
        YIMErrorcode_UserStatusError,
        /**
         * 消息太长
         */
        YIMErrorcode_MessageTooLong,
        /**
         * 接收方ID过长（检查频道名）
         */
        YIMErrorcode_ReceiverTooLong,
        /**
         * 无效聊天类型
         */
        YIMErrorcode_InvalidChatType,
        /**
         * 无效用户ID
         */
        YIMErrorcode_InvalidReceiver,
        /**
         * 未知错误
         */
        YIMErrorcode_UnknowError,
        /**
         * AppKey无效
         */
        YIMErrorcode_InvalidAppkey,
        /**
         * 被禁止发言
         */
        YIMErrorcode_ForbiddenSpeak,
        /**
         * 创建文件失败
         */
        YIMErrorcode_CreateFileFailed,
        /**
         * 支持的文件格式
         */
        YIMErrorcode_UnsupportFormat,
        /**
         * 接收方为空
         */
        YIMErrorcode_ReceiverEmpty,
        /**
         * 房间名太长
         */
        YIMErrorcode_RoomIDTooLong,
        /**
         * 聊天内容严重非法
         */
        YIMErrorcode_ContentInvalid,
        /**
         * 未打开定位权限
         */
        YIMErrorcode_NoLocationAuthrize,
        /**
         * 未知位置
         */
        YIMErrorcode_UnknowLocation,
        /**
         * 不支持该接口
         */
        YIMErrorcode_Unsupport,
        /**
         * 无音频设备
         */
        YIMErrorcode_NoAudioDevice,
        /**
         * 音频驱动问题
         */
        YIMErrorcode_AudioDriver,
        /**
         * 设备状态错误
         */
        YIMErrorcode_DeviceStatusInvalid,
        /**
         * 文件解析错误
         */
        YIMErrorcode_ResolveFileError,
        /**
         * 文件读写错误
         */
        YIMErrorcode_ReadWriteFileError,
        /**
         * 语言编码错误
         */
        YIMErrorcode_NoLangCode,
        /**
         * 翻译接口不可用
         */
        YIMErrorcode_TranslateUnable,
        /**
         * 开始录音
         */
        YIMErrorcode_PTT_Start,
        /**
         * 录音失败
         */
        YIMErrorcode_PTT_Fail,
        /**
         * 语音消息文件下载失败
         */
        YIMErrorcode_PTT_DownloadFail,
        /**
         * 获取语音消息Token失败
         */
        YIMErrorcode_PTT_GetUploadTokenFail,
        /**
         * 语音消息文件上传失败
         */
        YIMErrorcode_PTT_UploadFail,
        /**
         * 没有录音内容
         */
        YIMErrorcode_PTT_NotSpeech,
        /**
         * 语音设备状态错误
         */
        YIMErrorcode_PTT_DeviceStatusError,
        /**
         * 录音中
         */
        YIMErrorcode_PTT_IsSpeeching,
        /**
         * 文件不存在
         */
        YIMErrorcode_PTT_FileNotExist,
        /**
         * 达到最大时长限制
         */
        YIMErrorcode_PTT_ReachMaxDuration,
        /**
         * 录音时间太短
         */
        YIMErrorcode_PTT_SpeechTooShort,
        /**
         * 启动录音失败
         */
        YIMErrorcode_PTT_StartAudioRecordFailed,
        /**
         * 音频输入超时
         */
        YIMErrorcode_PTT_SpeechTimeout,
        /**
         * 在播放
         */
        YIMErrorcode_PTT_IsPlaying,
        /**
         * 未开始播放
         */
        YIMErrorcode_PTT_NotStartPlay,
        /**
         * 主动取消播放
         */
        YIMErrorcode_PTT_CancelPlay,
        /**
         * 未开始语音
         */
        YIMErrorcode_PTT_NotStartRecord,
        /**
         * 语音服务启动失败
         */
        YIMErrorcode_Fail,
        /**
         * 未登录
         */
        YIMErrorcode_NOTLOGIN,
        /**
         * 参数设置无效
         */
        YIMErrorcode_INVALID_PARAM,
        /**
         * 登录失败
         */
        YIMErrorcode_INVALID_LOGIN,
        /**
         * 用户名、token无效
         */
        YIMErrorcode_USERNAME_TOKEN_ERROR,
        /**
         * 登录超时
         */
        YIMErrorcode_LOGIN_TIMEOUT,
        /**
         * 服务器超载
         */
        YIMErrorcode_SERVICE_OVERLOAD,
        /**
         * 发送消息内容超长
         */
        YIMErrorcode_MSG_TOO_LONG,
    }
    /**
     * 消息类型
     */
    export enum MessageBodyType {
        /**
         * 文本
         */
        MessageBodyType_Text,
        /**
         * 语音
         */
        MessageBodyType_Voice,
        /**
         * 微信语音
         */
        WEIXIN
    }
    /**
     * 语音接口错误码
     */
    export enum YIMAudioCode {
        /**
         * 接口调用太快，请稍后重试
         */
        INVOKE_TOOFAST = 9001,
        /**
         * 上次调用为结束，请等待
         */
        WAITFOR_LASTINVOKE = 9002,
        /**
         * 无效的调用
         */
        INVALID_INVOKE = 9003,
        /**
         * 重复调用
         */
        DUPLICATE_INVOKE = 9004,
        /**
         * 调用响应超时
         */
        INVOKE_OUTTIME = 9005,
        /**
         * 语音消息太短，不足1秒
         */
        VOICE_TOOSHORT = 9006,
        /**
         * 当前环境不支持录音
         */
        WEBRTC_ERROR = 9089,
        /**
         * mediaID invalid
         */
        INVOKE_ERROR = 9090
    }

    export enum MessageVoiceType {
        WEIXIN = 1,
        WEBRTC = 2
    }
}

export default yim;
