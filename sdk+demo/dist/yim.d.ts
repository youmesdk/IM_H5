declare module yim {
    /**
     * 是否开启sdk调用日志
     */
    export let debug: boolean;
    /**
     * 是否在微信内运行
     */
    export function isWeixin(): boolean;
    /**
     * 初始化接口
     * @param dirtyWordsArray 脏字过滤数组，如['色情', '赌博']
     * @param appKey 用户游戏产品区别于其它游戏产品的标识，可以在游密官网获取
     * @param eventCallback 相关事件回调接口对象，如：{onLogin:_loginCallback, onLogout:_logoutCallback}
     */
    export function getInstance(dirtyWordsArray: string[], appKey: string, eventCallback: IEventObject): void;
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
        onVoiceMsgSend?: (YIMErrorcodeOC: YIMErrorcode, audioInfo: { msgID: string, voiceSize: number, voiceTime: number, voiceURL: string }) => void,
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
     * 语音类
     */
    export class YIM {
        private constructor();
        /**
         * 登录
         * @param uname 用户名，调用者分配，不可为空字符串，只可由字母或数字或下划线组成
         * @param utoken 从服务端获取到的token
         */
        public login(uname: string, utoken: string): void;
        /**
         * 登出，操作结果会通过回调接口返回:onLogout
         */
        public logout(): void;
        /**
         * 加入聊天室进行群组聊天，操作结果会通过回调接口返回:onJoinChatRoom
         * @param roomID 频道编号
         */
        public joinRoom(roomID: string): void;

        /**
         * 初始化音频设备，
         * @param options 
         * @param callback 
         */
        public initAudioMedia(options:
            {
                //是否显示上传/下载语音提示
                showProgressTips: number,
                //最大语音1分钟
                maxRecordSecond: number,
                //webrtc录音
                bitRate: number,
                mp3Worker: string,
                lamejs: string
            }, callback: (ret: {
                type: string, //'webrtc' or 'weixin'
                support: boolean//0表示不支持录音，1表示支持
            }) => void): void;
        /**
         * 检查当前环境是否支持录音，建议调用startAudioMessage 前先检查
         */
        public getSupportAudioMessage():boolean;
        /**
         * 退出聊天室，操作结果会通过回调接口返回:onLeaveChatRoom
         * @param roomID 频道编号
         */
        public leaveRoom(roomID: string): void;
        /**
         * 发送文本消息
         * @param recvUid 接受者编号（用户编号或者频道编号）
         * @param chatType 聊天类型，群聊或者私聊，1为私聊，2为群聊
         * @param content 聊天内容，可以用json格式来扩展消息内容
         */
        public sendTextMessage(recvUid: string, chatType: number, content: string): void;
        /**
         * 开始录音，调用前先通过 getSupportAudioMessage() 检查是否有录音权限。
         * @param recvUid 接受者编号（用户编号或者频道编号）
         * @param chatType 聊天类型，群聊或者私聊，1为私聊，2为群聊
         * @param errInfo 错误信息
         */
        public startAudioMessage(recvUid: string, chatType: number, callBack: (code: YIMErrorcode, errInfo: { errCode: YIMErrorcode, errMsg: string }) => void): void;
        /**
         * 取消录音
         */
        public cancelAudioMessage(): void;
        /**
         * 停止录音并发送出去，当停止调用距开始调用不足一秒时会延迟1秒停止，操作结果会通过回调接口返回:onVoiceMsgSend
         * @param errInfo 错误信息
         */
        public stopAudioMessage(callBack: (code: YIMErrorcode, errInfo: { errCode: YIMErrorcode, errMsg: string }) => void): void;
        /**
         * 播放指定地址的语音
         * @param strVoiceID 语音地址
         * @param errInfo 错误信息
         */
        public playAudioMessage(strVoiceID: string, callBack: (code: YIMErrorcode, errInfo: { errCode: YIMErrorcode, errMsg: string }) => void): void;
        /**
         * 停止正在播放的语音信息
         * @param strVoiceID 语音地址
         * @param errInfo 错误信息
         */
        public stopPlayAudioMessage(strVoiceID: string, callBack: (code: YIMErrorcode, errInfo: { errCode: YIMErrorcode, errMsg: string }) => void): void;
        /**
         * 初始化语音自动播放队列
         * @param eventCallback 相关事件回调接口对象
         */
        public initAutoPlayVoiceQueue(eventCallback: {
            beginPlay: (message: { msgType: MessageBodyType, senderid: string, recvid: string, messageid: string, createtime: number, chattype: number, content: string }) => void,
            endPlay: (message: { msgType: MessageBodyType, senderid: string, recvid: string, messageid: string, createtime: number, chattype: number, content: string }) => void
        }): void;
        /**
         * 添加到自动播放列表
         * @param message 语音消息数据
         */
        public addToAutoPlayVoiceQueue(message: { msgType: MessageBodyType, senderid: string, recvid: string, messageid: string, createtime: number, chattype: number, content: string }): void;

        public getHistoryMessage(uname: string, minMsgId: string, MaxMsgId: string, day: number): void;
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
    }

    export enum MessageVoiceType {
        WEIXIN = 1,
        WEBRTC = 2
    }
}
