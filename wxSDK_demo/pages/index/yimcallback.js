const yim = require('../../utils/yim.mini.js')
const yimCallbackObject = {
  yimInstance:null,
  onLogin: function (errorcode, eve) {
    if (errorcode == yim.YIMErrorcode.YIMErrorcode_Success) {
      console.log("登录成功 :" + eve.data.userid);
      this.yimInstance.joinRoom("room123");
      //初始化语音设备
      this.yimInstance.initAudioMedia({
        //是否显示上传/下载语音提示
        showProgressTips: 1,
        //最大语音1分钟
        maxRecordSecond: 60,
        //webrtc录音
        bitRate: 64
      }, function (ret) {
        console.log("录音类型 :" + ret.type + '; 支持:' + (ret.support ? 1 : 0));
      });

      //初始化语音自动播放队列
      this.yimInstance.initAutoPlayVoiceQueue({
        beginPlay: function (msg) {
          console.log('start play!', msg);
        }, endPlay: function (msg) {
          console.log('end play!', msg);
        }
      });

    } else {
      console.log("登录失败 :" + eve.data.userid);
    }
  },
  onLogout: function (errorcode, eve) {
    console.log("退出成功:", eve.data.userid);
  },
  onJoinChatRoom: function (errorcode, eve) {
    var msg = "加入房间: " + eve.data.roomid + " 错误码：" + errorcode;
    console.log(msg);
  },
  onLeaveChatRoom: function (errorcode, eve) {
    console.log('加入房间:' + eve.data.roomid + " 错误码：" + errorcode);
  },
  onSendMessageStatus: function (errorcode, eve) {
    console.log(eve);
    console.log("OnSendMessageStatus :" + errorcode + " messageID: " + eve.data.msgid);
  },
  onRecvMessage: function (message) {
    console.log('onRecvMessage:');
    console.log(message);
    if (message.msgType == yim.MessageBodyType.MessageBodyType_Text) {
      // message.senderid / message.recvid / message.messageid / message.createtime / (敏感词过滤) yimCallbackObject.yimInstance.keywordsFilter(message.content)
    } else if (message.msgType == yim.MessageBodyType.MessageBodyType_Voice) {
      // //接收到语音消息

      //添加到自动播放列表
      yimCallbackObject.yimInstance.addToAutoPlayVoiceQueue(message);

      if (message.content.charAt(0) !== '[' && message.content.charAt(0) !== '{') {
        // app sdk 返回的 content 不是 json，是直接的 url
        var ret = {
          myself: false,
          msgId: message.messageid,
          msgRecvUID: message.recvid,
          msgSenderUID: message.senderid,
          voiceURL: message.content,
          voiceSize: (message.comment && message.comment.Time) ? (+message.comment.Time) : 12,
          chatType: message.chattype,
          msgTime: message.createtime
        };
      } else {
        var content = JSON.parse(message.content);

        if (content.recordmode == yim.MessageVoiceType.WEIXIN) {
          //微信录音
          var ret = {
            myself: false,
            msgId: message.messageid,
            msgRecvUID: message.recvid,
            msgSenderUID: message.senderid,
            voiceID: content.mediaid,
            voiceSize: +content.voicetime || 12,
            chatType: message.chattype,
            msgTime: message.createtime
          };
        }
      }
    } else if (message.msgType == yim.MessageBodyType.MessageBodyType_Buffer) {
      const { 
        senderid, // 发送者id
        recvid, // 接收者id
        chattype, // 1为私聊；2为群聊
        messageid, // message 对应的 id
        content, // 二进制消息内容
        createtime, // 消息发送时间
        msgType // 消息类型：0为文字消息；1为语音消息；2为文件消息；3为二进制消息
      } = message
     
      // 处理二进制类型消息
    }
  },
  onKickOff: function () {
    console.log('你被踢出了房间！');
  },
  onVoiceMsgSend: function (code, info) {
    if (code != yim.YIMErrorcode.YIMErrorcode_Success) {
      console.error('send voice message fail!');
      return;
    }
    //播放自己的录音
    //直接播放
    yimCallbackObject.yimInstance.playAudioMessage(info.voiceFile,info.voiceTime,function(res){});
    // 放入播放队列顺序播放
    // var message = {
    //   content: JSON.stringify({ downloadurl: info.voiceFile, voicetime: info.voiceTime,recordmode:2})
    // }
    // yimCallbackObject.yimInstance.addToAutoPlayVoiceQueue(message);

  },
  onReceiveMessageNotify: function (chatType, targedID) {
    console.log('OnReceiveMessageNotify: ' + chatType + ' targetid:' + targedID);
  },

  onReLogin: function (errorcode, eve) {
    var msg = "重新登录: " + eve.data.userid + " 错误码：" + errorcode;
    console.log(msg);
  },

  onReJoinChatRoom: function (errorcode, eve) {
    var msg = "重新加入房间: " + eve.data.roomid + " 错误码：" + errorcode;
    console.log(msg);
  }
}

module.exports = yimCallbackObject
