# 小程序 IM SDK 使用指南

## 集成小程序 SDK

第一步：在 [游密官网](https://console.youme.im/user/register) 注册游密账号。

第二步：在控制台添加游戏，获得接入需要的 Appkey、Appsecret。

第三步：放置 sdk 相关 js 文件，将 yim.mini.js 以及 base64.js 这两个文件放到小程序默认的 `utils` 文件夹中，并在项目中引入 yim.mini.js。

> yim.mini.js 和 base64.js 这两个文件不一定非得放在 utils 文件夹中，但是这两个文件必须放在同一个目录下。

## 典型功能实现方法

> js文件加载完成，可以使用 `yim.debug = true;` 开启sdk调用日志。

### 页面启动的第一时间需要调用初始化接口

- **相关接口与参数：**
  - `yim.getInstance`,  初始化接口
  - `dirtyWordsArray`:  脏字过滤数组，如['色情', '赌博']
  - `appKey`:           用户游戏产品区别于其它游戏产品的标识，按照上面集成 SDK 的步骤获取
  - `eventCallback`:    相关事件回调接口对象，如：{onLogin:_loginCallback, onLogout:_logoutCallback}
- 代码示例与详细说明: [初始化SDK](https://github.com/youmesdk/IM_H5/wiki/IM-SDK-for-HTML5-%E5%BC%80%E5%8F%91%E6%8C%87%E5%BC%95#%E5%88%9D%E5%A7%8B%E5%8C%96-sdk)

### 点击进入按钮，调用IM SDK登录接口

- 接口名称: `login`
- 接口参数:
  - `strYouMeID`: 由调用者分配，不可为空字符串，只可由字母或数字或下划线组成
  - `strPasswd`:  这里传入从服务端获取到的token，请参考《游密后台服务接口文档》->添加用户，文档获取请联系客服。
- 回调方法:  `eventCallback.onLogin`
- 回调参数:
  - `YIMErrorcodeOC`：错误码，详细描述见错误码定义
  - `event`: 回调事件
    - `code`:  状态，同YIMErrorcodeOC
    - `message`:  相关信息
    - `data`:  {userid: 同strYouMeID}

代码示例与详细说明：[登录接口](https://github.com/youmesdk/IM_H5/wiki/IM-SDK-for-HTML5-%E5%BC%80%E5%8F%91%E6%8C%87%E5%BC%95#1%E7%99%BB%E5%BD%95)

### 进入各个聊天频道

> 进入游戏后，调用加入房间接口，进入世界、公会、区域等需要进入的聊天频道。
> 游戏需要为各个聊天频道设置一个唯一的频道ID。


- 接口名称: `joinRoom`
- 接口参数: `strRoomID`: 请求加入的频道ID
- 回调方法: `eventCallback.onJoinChatRoom`
- 回调参数:
  - `YIMErrorcodeOC`：错误码，详细描述见错误码定义
  - `event`: 回调事件
    - `code`:  状态，同YIMErrorcodeOC
    - `message`:  相关信息
    - `data`:  {roomid: 同strRoomID}

代码示例与详细说明：[加入聊天室](https://github.com/youmesdk/IM_H5/wiki/IM-SDK-for-HTML5-%E5%BC%80%E5%8F%91%E6%8C%87%E5%BC%95#1%E5%8A%A0%E5%85%A5%E8%81%8A%E5%A4%A9%E5%AE%A4)

### 发送文字、表情消息

> 点击发送按钮，调用发消息接口，将输入框中的内容发送出去
> 发送出的消息出现在聊天框右侧
> 表情消息可以将表情信息打包成Json格式发送


- 接口名称: `sendTextMessage`
- 接口参数:
  - `strRecvID`:  接收者ID（用户ID或者群ID）
  - `chatType`:   聊天类型，群聊/私聊
  - `strContent`: 聊天内容
- 接口返回: `strMessageID` 消息ID
- 回调方法: `eventCallback.onSendMessageStatus`
- 回调参数:
  - `YIMErrorcodeOC`：错误码，详细描述见错误码定义
  - `strMessageID`: 消息ID

代码示例与详细说明：[发送文本消息](https://github.com/youmesdk/IM_H5/wiki/IM-SDK-for-HTML5-%E5%BC%80%E5%8F%91%E6%8C%87%E5%BC%95#1%E5%8F%91%E9%80%81%E6%96%87%E6%9C%AC%E6%B6%88%E6%81%AF)

> 拓展功能： 发送消息时，可以将玩家头像、昵称、角色等级、vip等级等要素打包成json格式发送。

### 发送语音消息

> 按住语音按钮时，调用startAudioMessage
> 松开按钮，调用stopAudioMessage接口，发送消息，成功发送后会回调even.onVoiceMsgSend()
> 按住过程若需要取消发送，调用cancelAudioMessage取消发送


接口名称: `startAudioMessage(recvUid, chatType, function(YIMErrorcodeOC){})`<br />接口参数:<br />- `strRecvID`:  接收者ID（用户ID或者群ID）<br />- `chatType`:   聊天类型，群聊/私聊<br />- `callback`: 回调方法，第一个参数是否允许语音录制，参考错误码

接口名称: `cancelAudioMessage(function(YIMErrorcodeOC){})`<br />接口参数: 回调函数，可无

接口名称: `stopAudioMessage(callback)`<br />接口参数:

```javascript
function(YIMErrorcodeOC, ret){
  //ret.errMsg;
}
```

- 语音消息发送回调方法:  `eventCallback.onVoiceMsgSend`
- 回调参数:
  - `YIMErrorcodeOC`：错误码，详细描述见错误码定义
  - `msgInfo`: 语音相关详情
    - `strMessageID`:  消息ID
    - `strVoiceID`:    语音ID
    - `intVoiceTime`:  语音时长

> 初始化消息自动播放队列事件
> 接口名称: `initAutoPlayVoiceQueue(option)`
> 接口参数:


- `option`:  {beginPlay: 开始播放回调, endPlay:结束播放回调}

> 添加接收的语音消息到自动播放队列
> 接口名称: `addToAutoPlayVoiceQueue(message)`
> 接口参数:


- `message`:  接收到语音消息的完整结构体，方便回调时消息对应

代码示例与详细说明: [发送语音消息](https://github.com/youmesdk/IM_H5/wiki/IM-SDK-for-HTML5-%E5%BC%80%E5%8F%91%E6%8C%87%E5%BC%95#2%E5%8F%91%E9%80%81%E8%AF%AD%E9%9F%B3%E6%B6%88%E6%81%AF)

## 接收消息

> 通过OnRecvMessage接口被动接收消息，需要开发者实现


- 接口名称: `eventCallback.onRecvMessage`
- 接口参数:
  - `intMessageType`:  消息类型
  - `strSenderID`:     消息发送者ID
  - `strRecvID`:       消息接收者ID
  - `strMessageID`:    消息ID
  - `intCreateTime`:   消息创建时间
  - `chatType`:        聊天类型，群聊/私聊
  - `strVoiceID`:      语音消息VoiceID

代码示例与详细说明：[接收消息](https://github.com/youmesdk/IM_H5/wiki/IM-SDK-for-HTML5-%E5%BC%80%E5%8F%91%E6%8C%87%E5%BC%95#3%E6%8E%A5%E6%94%B6%E6%B6%88%E6%81%AF)

### 接收语音消息并播放

> intMessageType分拣出语音消息（`yim.MessageBodyType.MessageBodyType_Voice`）
> 点击语音气泡，调用函数数`playAudioMessage`播放语音消息
> 调用`stopPlayAudioMessage`停止播放语音消息


- 接口名称: `playAudioMessage`
- 接口参数:
  - `strVoiceID`:  语音消息ID
  - `endCallback`: 播放结束回调方法


- 接口名称: `stopPlayAudioMessage`
- 接口参数:
  - `strVoiceID`:  停止播放语音ID
  - `callback`: 结果回调方法，如function(YIMErrorcodeOC){}

### 更换账号或角色，登出SDK

> 注销账号时，调用登出接口Logout登出IM系统


- 接口名称: `logout`
- 接口参数: 无
- 回调方法: `eventCallback.onLogout`
- 回调参数: `YIMErrorcodeOC`：错误码，详细描述见错误码定义

### 离开房间

> 需要更换房间


- 接口名称: `leaveRoom`
- 接口参数: `strRoomID`: 请求离开的频道ID
- 回调方法: `eventCallback.onLeaveChatRoom`
- 回调参数:
  - `YIMErrorcodeOC`：错误码，详细描述见错误码定义
  - `event`: 同 eventCallback.onJoinChatRoom

### 退出游戏，反初始化SDK

- 接口名称: `uninit`
- 接口参数: 无

### 重复登录剔出回调

- 回调方法: `eventCallback.onKickOff`
- 回调参数: 无

## 错误码定义
| 错误码前缀：`yim.YIMErrorcode.` | 含义 |
| --- | --- |
| YIMErrorcode_Success = 0 | 成功 |
| YIMErrorcode_EngineNotInit = 1 | IM SDK未初始化 |
| YIMErrorcode_NotLogin = 2 | IM SDK未登录 |
| YIMErrorcode_ParamInvalid = 3 | 无效的参数 |
| YIMErrorcode_TimeOut = 4 | 超时 |
| YIMErrorcode_StatusError = 5 | 状态错误 |
| YIMErrorcode_SDKInvalid = 6 | Appkey无效 |
| YIMErrorcode_AlreadyLogin = 7 | 已经登录 |
| YIMErrorcode_LoginInvalid = 1001 | 登录无效 |
| YIMErrorcode_ServerError = 8 | 服务器错误 |
| YIMErrorcode_NetError = 9 | 网络错误 |
| YIMErrorcode_LoginSessionError = 10 | 登录状态出错 |
| YIMErrorcode_NotStartUp = 11 | SDK未启动 |
| YIMErrorcode_FileNotExist = 12 | 文件不存在 |
| YIMErrorcode_SendFileError = 13 | 文件发送出错 |
| YIMErrorcode_UploadFailed = 14 | 文件上传失败 |
| YIMErrorcode_UsernamePasswordError = 15, | 用户名密码错误 |
| YIMErrorcode_UserStatusError = 16, | 用户状态为无效用户 |
| YIMErrorcode_MessageTooLong = 17, | 消息太长 |
| YIMErrorcode_ReceiverTooLong = 18, | 接收方ID过长（检查频道名） |
| YIMErrorcode_InvalidChatType = 19, | 无效聊天类型 |
| YIMErrorcode_InvalidReceiver = 20, | 无效用户ID |
| YIMErrorcode_UnknowError = 21, | 未知错误 |
| YIMErrorcode_InvalidAppkey = 22, | AppKey无效 |
| YIMErrorcode_ForbiddenSpeak = 23, | 被禁止发言 |
| YIMErrorcode_CreateFileFailed = 24, | 创建文件失败 |
| YIMErrorcode_UnsupportFormat = 25, | 支持的文件格式 |
| YIMErrorcode_ReceiverEmpty = 26, | 接收方为空 |
| YIMErrorcode_RoomIDTooLong = 27, | 房间名太长 |
| YIMErrorcode_ContentInvalid = 28, | 聊天内容严重非法 |
| YIMErrorcode_NoLocationAuthrize = 29, | 未打开定位权限 |
| YIMErrorcode_UnknowLocation = 30, | 未知位置 |
| YIMErrorcode_Unsupport = 31, | 不支持该接口 |
| YIMErrorcode_NoAudioDevice = 32, | 无音频设备 |
| YIMErrorcode_AudioDriver = 33, | 音频驱动问题 |
| YIMErrorcode_DeviceStatusInvalid = 34, | 设备状态错误 |
| YIMErrorcode_ResolveFileError = 35, | 文件解析错误 |
| YIMErrorcode_ReadWriteFileError = 36, | 文件读写错误 |
| YIMErrorcode_NoLangCode = 37, | 语言编码错误 |
| YIMErrorcode_TranslateUnable = 38, | 翻译接口不可用 |
| YIMErrorcode_PTT_Start = 2000 | 开始录音 |
| YIMErrorcode_PTT_Fail = 2001 | 录音失败 |
| YIMErrorcode_PTT_DownloadFail = 2002 | 语音消息文件下载失败 |
| YIMErrorcode_PTT_GetUploadTokenFail = 2003 | 获取语音消息Token失败 |
| YIMErrorcode_PTT_UploadFail = 2004 | 语音消息文件上传失败 |
| YIMErrorcode_PTT_NotSpeech = 2005 | 没有录音内容 |
| YIMErrorcode_PTT_DeviceStatusError = 2006, | 语音设备状态错误 |
| YIMErrorcode_PTT_IsSpeeching = 2007, | 录音中 |
| YIMErrorcode_PTT_FileNotExist = 2008, | 文件不存在 |
| YIMErrorcode_PTT_ReachMaxDuration = 2009, | 达到最大时长限制 |
| YIMErrorcode_PTT_SpeechTooShort = 2010, | 录音时间太短 |
| YIMErrorcode_PTT_StartAudioRecordFailed = 2011, | 启动录音失败 |
| YIMErrorcode_PTT_SpeechTimeout = 2012, | 音频输入超时 |
| YIMErrorcode_PTT_IsPlaying = 2013, | 在播放 |
| YIMErrorcode_PTT_NotStartPlay = 2014, | 未开始播放 |
| YIMErrorcode_PTT_CancelPlay = 2015, | 主动取消播放 |
| YIMErrorcode_PTT_NotStartRecord = 2016, | 未开始语音 |
| YIMErrorcode_Fail = 10000 | 语音服务启动失败 |
| YIMErrorcode_NOTLOGIN = 20001, | 未登录 |
| YIMErrorcode_INVALID_PARAM = 20002, | 参数设置无效 |
| YIMErrorcode_INVALID_LOGIN = 20003, | 登录失败 |
| YIMErrorcode_USERNAME_TOKEN_ERROR = 20004, | 用户名、token无效 |
| YIMErrorcode_LOGIN_TIMEOUT = 20005, | 登录超时 |
| YIMErrorcode_SERVICE_OVERLOAD = 20006, | 服务器超载 |
| YIMErrorcode_MSG_TOO_LONG = 20007 | 发送消息内容超长 |


## 语音接口错误码定义

| 错误码前缀:`yim.YIMAudioCode.` | 含义|
| --- | --- |
| INVOKE_TOOFAST = 9001 | 接口调用太快，请稍后重试|
| WAITFOR_LASTINVOKE = 9002 | 上次调用为结束，请等待|
| INVALID_INVOKE = 9003 | 无效的调用|
| DUPLICATE_INVOKE = 9004 | 重复调用|
| INVOKE_OUTTIME = 9005 | 调用响应超时|
| VOICE_TOOSHORT = 9006 | 语音消息太短，不足1秒|
