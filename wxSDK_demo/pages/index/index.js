//index.js
//获取应用实例
const app = getApp()
const keywords = require('../../utils/keyword.js')
const yim = require('../../utils/yim.mini.js')
const yimcallback = require('yimcallback.js')
yim.debug = false;
const APPID = "YOUMEBC2B3171A7A165DC10918A7B50A4B939F2A187D0";
const g_yimInstance = new yim.getInstance(keywords.KeywordArray, APPID, yimcallback);
yimcallback.yimInstance = g_yimInstance;

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //IM登陆事件处理函数
  bindLoginTap: function () {
    app.globalData.yimUserData={};
    app.globalData.yimUserData.userid = "youme_test201702";
    app.globalData.yimUserData.token = "201702";
    g_yimInstance.login(app.globalData.yimUserData.userid, app.globalData.yimUserData.token);
  },
  //IM开始录音事件处理函数
  bindRecordTap: function () {
    var chatType = 1; //1:私聊; 2:群聊
    var recvUid = 'youme_test201702';

    g_yimInstance.startAudioMessage(recvUid, chatType, function (code, res) {
      if (code != yim.YIMErrorcode.YIMErrorcode_Success) {
        console.error(res.errMsg);
      }
    });
  },
  //IM结束录音事件处理函数
  bindStopRecordTap: function () {
    g_yimInstance.stopAudioMessage(function (code, res) {
      if (code != yim.YIMErrorcode.YIMErrorcode_Success) {
        return;
      }
      console.log('stop record:', res);
    });
  },
  // 发送二进制消息
  bindBinaryButtonTap: function() {
    const buffer = new Uint8Array(2)
    buffer[0] = 42
    buffer[1] = 55
    
    const msgSerial = g_yimInstance.sendBufferMessage('youme_test201702', 1, buffer)
    
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
