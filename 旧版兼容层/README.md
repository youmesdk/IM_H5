# 游密科技 IM SDK for Web 老版本适配器

为了让老客户也可以享受新版 IM SDK 的特性和稳定性，我们特别针对老版本客户推出本适配器。

本项目采用 TypeScript 编写，开放源代码。若遇到问题或bug，可以提交 issue，也欢迎提交 Pull request。

## 快速升级

老版本客户只需要下载本项目根目录的 `yim.min.js`，**直接替换**老版本的 js 文件即可。

若在微信上使用，建议把微信的 JSSDK 升级到 `1.3.2` 或以上版本。[https://res.wx.qq.com/open/js/jweixin-1.3.2.js](https://res.wx.qq.com/open/js/jweixin-1.3.2.js)

## 进阶

根目录下的 `yim.min.js` 包含老版本的全部功能，相当于 `dist/yim.mp3+wechat.js`。

老客户也可以根据需要，从 `dist` 中选择更适合自己的版本：

文件名 | 体积 | 用途
----|---|---
`dist/yim.no-rec.js` | 46KB | 纯文字，没有语音功能，语音相关的 API 将不起作用
`dist/yim.amr+wechat.js` | 494KB | 包含与客户端IM语音互通功能，某些客户可能必须使用此版本
`dist/yim.mp3+wechat.js` | 215KB | 正常版本，与根目录 `yim.min.js` 完全相同
`dist/yim.mp3.js` | 210KB | 只包含 MP3 录音的版本，适合不在微信上使用的项目
`dist/yim.wechat.js` | 50KB | 只包含微信录音的版本，适合只在微信上使用

以上版本都只需要**直接替换**老版本的 js 文件即可。

## FAQ

**Q. `initAudioMedia(options, callback)` 接口，`options` 参数好像不起作用了？**

**A.** 没错。`initAudioMedia(options, callback)` 接口，在本次更新之后，`options` 的值都将不再起作用，因为这个参数对于多数客户来说并没有任何用处。但是由于历史原因，此参数不能省略。客户替换了这个版本之后，可对 `options` 值传入 `null` 或 `{}` 或 `0`。当然偷懒保持使用旧版本时候的值不变也是可以的。

**Q. 老版本 SDK 的 js 文件体积 75 KB 左右，为什么这个版本却需要 215 KB？**

**A.** 实际上老版本 SDK 需要引入3个文件：`yim.min.js` `mp3Worker.js` `lame.min.js`，这3个文件加起来有 232 KB。新版本经过整合和优化，不再需要分成3个文件，而且体积比老版本小。另外，若只在微信上使用，可以使用 `dist/yim.wechat.js` 文件，体积仅 50 KB。若只用到纯文字传输，可以使用 `dist/yim.no-rec.js` 文件，体积更小。

**Q. 换上新版本后，老版本的 `mp3Worker.js` `lame.min.js` 是不是可以删除了？**

**A.** 是的，它们已经没有用处，可以删除了。

**Q. `yim.socketio` 这个对象似乎已经不是 SocketIO 对象了？**

**A.** `yim.socketio` 原本就应该是个私有对象，用于内部处理 WebSocket 连接的。但是有个别客户直接拿它用来监听IM服务的连接状态，因此为了兼容，我们给 `yim.socketio` 赋值一个 WebSocket 事件触发器，并把 WebSocket 相关的事件中转给它。

## 技术支持

若对本 SDK 有任何疑问或建议，可以发 Issue，或加入QQ群：`329145286` 讨论交流。
