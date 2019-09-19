# 游密科技 IM SDK for Web

游密科技即时通讯(IM)服务，是坐拥上亿玩家实力背书，专注游戏社交全场景解决方案的即时通讯云。

本 SDK 用于 Web 端接入游密科技即时通讯服务。

**注意：**此版本的 SDK 接口设计与 1.0 版本完全不同，若您使用了 1.0 版本的 SDK ，则无法直接更新到此版本，需要根据新的接口重新适配您的应用。但是此版本的 `TextMessage` 以及 `VoiceMessage` 下的 `MP3Recorder`、`WechatRecorder` 插件可以与 1.0 版本相互通讯。

## 兼容性

文本通讯兼容性：

 - **Android:** 4.4+ （原生浏览器）
 - **Chrome for Android:** 16+
 - **iOS:** 6.1+
 - **IE for Windows:** 10+
 - **Edge for Windows:** 全版本支持
 - **Chrome for Windows/MacOS/Linux:** 16+
 - **Firefox for Windows/MacOS/Linux/Android:** 11+
 - **Safari for Windows/MacOS/Linux:** 7+
 - **微信:** WebView/小程序/小游戏 全版本支持
 - **手机QQ:** 全版本支持

语音通讯兼容性：

 - **Android:** 7.1+ （原生浏览器）
 - **Chrome for Android:** 56+
 - **iOS:** 11.1+ （微信不受 iOS 版本影响）
 - **IE for Windows:** 不支持
 - **Edge for Windows:** 全版本支持
 - **Chrome for Windows/MacOS/Linux:** 53+
 - **Firefox for Windows/MacOS/Linux/Android:** 42+
 - **Safari for Windows/MacOS/Linux:** 11.1+
 - **微信:** 6.5.3+ WebView （暂时不支持小程序、小游戏）
 - **手机QQ:** 暂时只在 Android 版本支持

## 接入指南

### 方法一：引入 JS 文件

本 SDK 采用插件机制，除了 `yim.core.min.js` 是必需的文件外，其他 JS 文件可根据实际需求灵活配置。

`yim.*.message.min.js` 为消息类型插件文件，要让 SDK 正常工作，SDK 需要引入至少一种消息类型插件。

游密官方提供两个消息类型插件，分别是：

 - `yim.text.message.min.js` 文字消息；
 - `yim.voice.message.min.js` 语音消息。

其中语音消息 `yim.voice.message.min.js` 还需要引入录音类型插件，以兼容不同的平台。

游密官方提供多种录音类型插件，分别是：

 文件 | 兼容场景 | 说明
 ---- | ---- | ----
 `yim.wav.recorder.min.js` | 仅兼容 Web 端对 Web 端 | WAV格式录音，优点是 JS 代码体积小，但是由于 WAV 是无压缩的音频格式，音频体积一般比较大，因此**不建议使用**。
 `yim.mp3.recorder.min.js` | 仅兼容 Web 端对 Web 端 | MP3格式录音，JS 代码包含 lame 编码器（不包含解码器），体积适中，若不需要多平台互通，则建议选用本插件。
 `yim.amr.recorder.min.js` | Web 端使用，与所有平台实现互通 | AMR格式录音，JS 代码包含了 AMR 编码、解码器，体积比较庞大，但是可以与其他各端 SDK 互通，包括微信、iOS/Android app，兼容性最好。
 `yim.wechat.recorder.min.js` | 微信H5端专用 | 通过调用微信 JS-SDK 来录音，如果微信端要与其他端（包括原生 app 和 web）实现互通，还需要同时引入 `yim.amr.recorder.min.js` 以解码其他端的语音消息。

SDK 初始化示例：

```html5
<script src="path/to/yim.core.js"></script>
<script src="path/to/yim.text.message.js"></script>
<script src="path/to/yim.voice.message.js"></script>
<script src="path/to/yim.amr.recorder.js"></script>
<script src="path/to/yim.wechat.recorder.js"></script>
```

```javascript
// 初始化 YIM 实例，注册消息类型插件
var yim = new YIM({
    appKey: 'YOUMEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    userId: 'user',
    token: 'xxx',
    roomId: 'xxxxx',
    useMessageType: [TextMessage, VoiceMessage]
});

// 为语音消息插件注册录音类型插件
VoiceMessage.registerRecorder([AmrRecorder, WechatRecorder]);

// 发送文本消息示例
function sendText(text) {
    var msg = new TextMessage(text);
    yim.sendToRoom('xxxxx', msg);
}

// 发送语音消息示例
var voice;
function startRecord() {
    voice = new VoiceMessage();  // 新建实例
    voice.startRecord();         // 开始录音
}
function finishRecord() {
    voice.finishRecord();           // 结束录音
    yim.sendToRoom('xxxxx', voice); // 发送录音
}

// 接收消息示例
yim.on('message:receive:*', function (eventName, msg) {
    // 获得消息对象（TextMessage 或 VoiceMessage）
    var msgObj = msg.message;
    // 根据消息类型做出相应操作
    switch (msgObj.getType()) {
        // 文本消息 TextMessage
        case 'text':
            alert('收到文本消息: ' + msgObj.getText());
            break;
        // 语音消息 VoiceMessage
        case 'voice':
            msgObj.play();
            break;
    }
});
```

更多接口和操作，请参看下文的 API 文档。

### 方法二：使用 npm 包

如上述**方法一**所述，本 SDK 采用插件机制，用户可以根据实际需求选择不同的插件，从而在满足需求的同时尽量减少 JS 文件的体积，或者实现异步加载等。

本 SDK 支持 npm 方式引入，具体步骤如下：

（这里假定读者已经掌握 npm 的基本操作，并已经安装好 node.js。）

首先，安装本 SDK 的 npm 包：

```sh
npm install youme-h5-im --save
```

然后，引入文件（这里使用 TypeScript 示范）：

```typescript
// 对应 `yim.core.min.js`
import YIM from 'youme-h5-im/core';

// 对应 `yim.text.message.min.js`
import TextMessage from 'youme-h5-im/text';

// 对应 `yim.voice.message.min.js`
import VoiceMessage from 'youme-h5-im/voice';

// 对应 `yim.amr.message.min.js`
import AmrRecorder from 'youme-h5-im/voice/amr';

// 对应 `yim.wechat.message.min.js`
import WechatRecorder from 'youme-h5-im/voice/wechat';

// 引入一个 interface 用于 TypeScript 类型标识
import { MessageObject } from 'youme-h5-im/core';

// 初始化 YIM 实例，注册消息类型插件
const yim = new YIM({
    // 游密 appKey
    appKey: 'YOUMEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    // 用户名
    userId: 'user',
    // token的生成，请参看《游密后台IM服务接口文档.docx》
    token: 'xxx',
    roomId: 'xxxxx',
    useMessageType: [TextMessage, VoiceMessage]
});

// 为语音消息插件注册录音类型插件
VoiceMessage.registerRecorder([AmrRecorder, WechatRecorder]);

// 发送文本消息示例
function sendText(text: string) {
    const msg = new TextMessage(text, 'extra param');
    yim.sendToRoom('xxxxx', msg);
}

// 发送语音消息示例
let voice: VoiceMessage;
function startRecord() {
    voice = new VoiceMessage('extra param');  // 新建实例
    voice.startRecord();         // 开始录音
}
function finishRecord() {
    voice.finishRecord();           // 结束录音
    yim.sendToRoom('xxxxx', voice); // 发送录音
}

// 接收消息示例
yim.on('message:receive:*', function (eventName: string, msg: MessageObject) {
    // 获得消息对象（TextMessage 或 VoiceMessage）
    const msgObj = msg.message;
    // 根据消息类型做出相应操作
    if (msgObj instanceof TextMessage) {
        alert('收到文本消息: ' + msgObj.getText() + msgObj.message.getAttachParam());
    }
    if (msgObj instanceof VoiceMessage) {
        alert('附加参数是：'+ msgObj.message.getExtra())
        msgObj.play();
    }
});
```

以下列出官方提供的 npm 包和 JS 文件的对应关系：

 npm 包 | 对应 JS 文件
 ---- | ----
 `youme-h5-im/core` | `yim.core.min.js`
 `youme-h5-im/text` | `yim.text.message.min.js`
 `youme-h5-im/voice` | `yim.voice.message.min.js`
 `youme-h5-im/voice/wav` | `yim.wav.recorder.min.js`
 `youme-h5-im/voice/mp3` | `yim.mp3.recorder.min.js`
 `youme-h5-im/voice/amr` | `yim.amr.recorder.min.js`
 `youme-h5-im/voice/wechat` | `yim.wechat.recorder.min.js`

## 事件机制

本 SDK 的事件机制基于 [WildEmitter](https://github.com/HenrikJoreteg/wildemitter)，支持后缀通配符 `*`。

本 SDK 在事件名称的设计上多数采用了 `[事件分类]:[事件名称]:[某个重要参数]:[另一个重要参数]` 的格式，以方便后缀通配符的使用。

例如，消息的事件名称为 `message:['send'|'receive']:['user'|'group']:[用户名|房间名]`。

若要监听接收所有消息，可以这么写：

```javascript
yim.on('message:receive:*', function(eventName, msg) {});
``` 

当使用了通配符 `*` 的时候，回调的第一个参数 `eventName` 将传入事件名称的全称，例如 `message:receive:group:room123`。

若只需监听房间号为“room123”里面的消息，可以这么写：

```javascript
yim.on('message:receive:group:room123', function(msg) {});
``` 

注意回调的参数，若没有使用通配符 `*`，将不会传入 `eventName`。 

## 消息对象

本 SDK 把要传输的消息抽象成一个 `Message` 基类，从 `Message` 基类的基础上派生出各种类型的消息。

游密官方提供 `TextMessage` 和 `VoiceMessage` 来传输文本和语音消息。

### 发送消息

每次发送消息，都需要用 `new` 来实例化某一种派生类，然后把消息注入到这个实例，最后才发送出去。

例如，文本消息应该这样发送：

```typescript
// 新建文本消息实例
const msg = new TextMessage('我是消息消息');
// 发送
yim.sendToRoom('room123', msg);
```

而语音消息类应该这样发送：

```typescript
// 新建语音消息实例
const msg = new VoiceMessage();
// 开始录音
msg.startRecord();
// 以下语句应该放到应该停止录音的地方，而不是刚刚开始就结束，这里只为示例用
// （过一会儿）结束录音
msg.finishRecord();
// 发送
yim.sendToRoom('room123', msg);
```

消息类的内部含有特定的标记，以标示该消息的内容是否已经准备妥当（例如文本消息已经传入文本，语音消息已经结束录音）。开发者在 `new` 新建实例之后，随时传入到 `yim.sendToRoom()` 或 `yim.sendToUser()` ，`YIM` 类会自动等待，直到消息内容准备妥当后才会把消息真正发送给对方。开发者无须再写复杂的等待回调。

### 接收消息

在初始化核心 `YIM` 类的时候，应该使用 `new YIM()` 的 `useMessageType` 属性或者 `yim.registerMessageType()` 来注册所用到的消息类。例如：

```typescript
yim.registerMessageType([
    TextMessage,
    VoiceMessage
]);
```

这个注册的目的是让 `YIM` 当接受到消息的时候从注册列表中判断所接受的消息类型，然后自动使用相应的消息类 `new` 新建相应的消息实例。

例如，若不注册 `VoiceMessage`，当 `YIM` 接收到语音消息时，将会无法识别消息，导致非法消息错误。

然后，接收消息需要监听：

```typescript
yim.on('message:receive:*', function (eventName: string, msg: MessageObject) {
    // ...
});
```

### 其他消息类型

开发者可以自行开发特定的消息类型插件，只要从 `Message` 派生出来的类，并符合 `Message` 的接口定义，就可以使用本 SDK 传输。

关于 `Message` 的接口定义，可参阅接口定义文件 `dts/yim.core.d.ts`。

## 语音消息插件

由于各种平台的录音、播放接口不尽相同，为了兼容各种平台并实现多平台互通，本 SDK 除了 `YIM` 使用消息类型插件机制外，`VoiceMessage` 也使用了类似的机制，以满足平台定制需求。

官方提供多个语音类型，请参阅上文的**接入指南**。

同样，语音类型也需要注册到 `VoiceMessage` 下：

```typescript
VoiceMessage.registerRecorder([AmrRecorder, WechatRecorder]);
```

同样，开发者也可以自行开发特定的语音类型，语音类型都从 `Recorder` 类派生出来。

关于 `Recorder` 的接口定义，可参阅接口定义文件 `dts/yim.voice.message.d.ts`。

## API 文档

 - [核心类 (core)](./doc/core.api.md)
 - [文本消息类 (text)](./doc/text.api.md)
 - [语音消息类 (voice)](./doc/voice.api.md)

## 常见问题

**Q. 使用本SDK，两个人聊天是否一定要加入房间？我们只需要点对点的单独聊天。**

**A.** 可以不用加入房间，聊天双方都登录之后，使用 `yim.sendToUser()` 指定对方的 userId 即可发送消息。

**Q. 我使用的浏览器版本是在兼容性列表之内的，但是初始化录音时候却报错 `DeviceNotSupportedError`？**

**A.** 对于多数浏览器，为了安全起见，使用语音时都要求使用 `https` 协议，若页面不在 `https` 下则会报 `DeviceNotSupportedError` 错误。而为了开发方便，某些浏览器（例如 Chrome）也支持在 `localhost` 下使用 `http`。

**Q. 使用微信语音功能时，当出现 `RecordTooShortError`（录音时间过短）之后，接下来的录音请求都报 `RecorderBusyError` 错误了，怎么办？**

**A.** 微信官方不允许太频繁地调用录音接口，因此录音结束之后（包括录音时间过短之后），须等待大约1秒之后，才能发起新的录音请求。

## 技术支持

若对本 SDK 有任何疑问或建议，可以发 Issue，或加入QQ群：`329145286` 讨论交流。
