/**
 * @fileOverview 游密 IM SDK for Web Demo
 * @author benz@youme.im
 * @date 2018/8/1
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

window.vc = new VConsole({
    onReady: function () {
        vc.hideSwitch();
        var ERROR_NAME = {
            // 通用
            NotLoginError: '请先登录',
            InvalidParamError: '无效的参数',
            InvalidLoginError: '无效的登录',
            UsernameOrTokenError: '用户名或token错误',
            LoginTimeoutError: '登录超时',
            ServiceOverloadError: '服务过载，消息传输过于频繁',
            MessageTooLongError: '消息长度超出限制，最大长度1400',
            // 录音
            UnsupportedVoiceFormatError: '不支持的音频格式',
            DeviceNotSupportedError: '设备不支持录音',
            AlreadyReadyError: '已经录过音或加载过音频了，要重新录音请重新 new 一个新实例',
            CanceledError: '已经取消了录音或录音出错了，要重新录音请重新 new 一个新实例',
            NotAllowedError: '没有录音权限',
            RecorderNotStartedError: '没有启动录音却企图完成录音',
            RecorderBusyError: '录音系统正忙，可能有其他实例正在录音中',
            RecordTooShortError: '录音时长太短',
            WXObjectIsEmptyError: '未传入微信wx对象',
            WXObjectNoConfigError: '微信wx对象尚未初始化',
            WXNoPermissionError: '微信wx对象没有提供录音相关接口权限'
        };

        function getErrorMsg(errorName) {
            return ERROR_NAME[errorName] || errorName;
        }

        // 用 id 获取 dom
        function E(id) {
            return document.getElementById(id);
        }

        // 聊天框的各种 html 模板
        var noticeTpl = E('tpl-notice').innerHTML;
        var leftTextTpl = E('tpl-left-text').innerHTML;
        var rightTextTpl = E('tpl-right-text').innerHTML;
        var leftVoiceTpl = E('tpl-left-voice').innerHTML;
        var rightVoiceTpl = E('tpl-right-voice').innerHTML;

        // 聊天框 Dom
        var chatDom = E('chat');

        // 所有消息的列表，{ id: Message }
        var msgHash = {};

        // 添加一条消息到聊天框
        function addDomToList(html, id) {
            var li = document.createElement('li');
            li.innerHTML = html;
            if (id) {
                li.setAttribute('data-id', id);
            }
            chatDom.appendChild(li);

            // 超过 300 条，删除第一条
            if (chatDom.childNodes.length > 300) {
                var first = chatDom.firstChild;
                var dataId = first.getAttribute('data-id');
                if (dataId && msgHash.hasOwnProperty(dataId)) {
                    delete msgHash[dataId];
                }
                chatDom.removeChild(first);
            }

            // 页面滚动到底部
            li.scrollIntoView(true);
        }

        // 添加提示消息
        function addNotice(text) {
            var html = noticeTpl.replace('{{text}}', text);
            addDomToList(html);
        }

        // 打出 console
        /*var oLog = window.console.log;
        window.console.log = function (message) {
            oLog.apply(window.console, arguments);
            addNotice(message.toString());
        };*/

        // 添加文本消息
        function addTextItem(msgObj) {
            var html = msgObj.isFromMe ? rightTextTpl : leftTextTpl;
            html = html.replace(/{{name}}/g, msgObj.senderId)
                .replace('{{text}}', msgObj.message.getText());
            addDomToList(html);
        }

        // 添加语音消息
        function addVoiceItem(msgObj) {
            var html = msgObj.isFromMe ? rightVoiceTpl : leftVoiceTpl;
            html = html.replace(/{{name}}/g, msgObj.senderId)
                .replace(/{{time}}/g, Math.round(msgObj.message.getDuration()))
                .replace(/{{id}}/g, msgObj.serverId)
                .replace(/{{width}}/g, Math.round(msgObj.message.getDuration() * 10) + 30);
            addDomToList(html, msgObj.serverId);

            // 绑定语音消息 Dom 的点击事件（播放）
            E('btn-voice-' + msgObj.serverId).onclick = function () {
                var msg = msgHash[msgObj.serverId].message;
                if (msg.isPlaying()) {
                    msg.stop();
                } else {
                    msg.play();
                }
            };

            // 绑定 msg 的播放和停止事件
            msgObj.message.on('play', function () {
                E('btn-voice-' + msgObj.serverId).className += ' voice-playing';
            });
            msgObj.message.on('end-play', function () {
                var b = E('btn-voice-' + msgObj.serverId);
                b.className = b.className.replace(/\s*voice-playing/g, '');
            });

            // 把 msgObj 存起来
            msgHash[msgObj.serverId] = msgObj;
        }

        // 添加消息（判断消息类型并选择 addTextItem 或 addVoiceItem）
        function addChatItem(msgObj) {
            switch (msgObj.message.getType()) {
                case 'text':
                    addTextItem(msgObj);
                    break;
                case 'voice':
                    addVoiceItem(msgObj);
                    break;
                default:
                    addNotice('收到未知消息类型：' + msgObj.message.getType());
            }
        }

        // 记录当前房间号
        var curRoomId = '';

        // 初始化游密 IM SDK
        var yim = new YIM({
            appKey: 'YOUMEBC2B3171A7A165DC10918A7B50A4B939F2A187D0',
            useMessageType: [ TextMessage, VoiceMessage ]
        });

        // 初始化录音插件
        VoiceMessage.registerRecorder( [ WechatRecorder, MP3Recorder ] );

        // 初始化微信录音功能
        if (WechatRecorder.isWechat()) {
            WechatRecorder.setWXObject(wx);

            // 自制简单的 jsonp 请求，以获取微信 JS-SDK 所需的数据
            (function() {
                window._yimcallback = function (json) {
                    wx.config({
                        debug: false,
                        appId: json['appid'], // 必填，公众号的唯一标识
                        timestamp: json['time'], // 必填，生成签名的时间戳
                        nonceStr: json['nonce'], // 必填，生成签名的随机串
                        signature: json['sign'],// 必填，签名
                        jsApiList: [
                            'startRecord',
                            'stopRecord',
                            'onVoiceRecordEnd',
                            'playVoice',
                            'pauseVoice',
                            'stopVoice',
                            'onVoicePlayEnd',
                            'uploadVoice',
                            'downloadVoice'
                        ] // 必填，需要使用的JS接口列表
                    });
                    addNotice('微信 config 已调用');
                };
                var script = document.createElement('script');
                script.src = '//wxtest3.youme.im/api/signatureinfo?url=' + encodeURIComponent(location.href) + '&callback=_yimcallback';
                script.async = true;
                var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
                head.insertBefore(script, head.firstChild);
            })();
        }

        // 初始化录音授权，此步骤可省略。
        // 若省略此步，调用 startRecord() 的时候，浏览器可能会弹出麦克风授权框
        VoiceMessage.initRecorder().then(function () {
            addNotice('初始化录音完毕。');
        }).catch(function (e) {
            addNotice(getErrorMsg(e.name));
        });

        // 快捷填写测试账号
        var testUsers = {
            sanji: '10001',
            zoro3000: '10002',
            youme_test201701: '201701',
            youme_test201702: '201702'
        };
        E('login-sanji').onclick
            = E('login-zoro3000').onclick
            = E('login-youme_test201701').onclick
            = E('login-youme_test201702').onclick
            = function (e) {
            var userId = e.target.value;
            var token = testUsers[userId];
            E('login-user-id').value = userId;
            E('login-user-token').value = token;
        };

        // 登录并加入房间
        var login = function () {
            var userId = E('login-user-id').value;
            var token = E('login-user-token').value;
            var roomId = E('login-room-id').value;

            if (!userId) {
                alert('请输入用户ID。');
                return;
            }
            if (!token) {
                alert('请输入token。');
                return;
            }

            // 登录
            yim.login(userId, token).catch(function(e) {
                alert('登录失败：' + getErrorMsg(e.name));
            });

            // 若填了房间号，则加入房间，会自动等待登录成功再加入房间
            if (roomId) {
                yim.joinRoom(roomId).catch(function (e) {
                    alert('加入房间失败：' + getErrorMsg(e.name));
                });
                curRoomId = roomId;
            }
        };
        E('btn-login').onclick = login;
        E('login-user-id').onkeydown = function (e) {
            if (e.key === 'Enter' || e.key === 'Tab') {
                if (e.key === 'Enter' && !e.target.value) {
                    alert('用户ID 不能为空');
                }
                E('login-user-token').focus();
                E('login-user-token').select();
            }
        };
        E('login-user-token').onkeydown = function (e) {
            if (e.key === 'Enter' || e.key === 'Tab') {
                if (e.key === 'Enter' && !e.target.value) {
                    alert('Token 不能为空');
                }
                E('login-room-id').focus();
                E('login-room-id').select();
            }
        };
        E('login-room-id').onkeydown = function (e) {
            if (e.key === 'Enter') {
                login();
            }
            if (e.key === 'Tab') {
                E('btn-login').focus();
            }
        };

        // 退出登录
        E('btn-user-logout').onclick = function () {
            yim.logout();
        };

        // 加入房间
        E('btn-room-join').onclick = function () {
            var roomId = E('text-room-id').value;
            yim.joinRoom(roomId).catch(function (e) {
                alert('加入房间失败：' + getErrorMsg(e.name));
            });
            curRoomId = roomId;
        };

        // 退出房间
        E('btn-room-leave').onclick = function () {
            yim.leaveRoom(curRoomId).catch(function (e) {
                alert('退出房间失败：' + getErrorMsg(e.name));
            });
        };

        // 切换到文字输入
        E('btn-to-text').onclick = function () {
            E('voice-ctrl').style.display = 'none';
            E('text-ctrl').style.display = 'flex';
        };

        // 切换到语音输入
        E('btn-to-voice').onclick = function () {
            E('voice-ctrl').style.display = 'flex';
            E('text-ctrl').style.display = 'none';
        };

        // 发送文字消息
        var sendText = function () {
            var text = E('text-msg').value;
            var msg = new TextMessage(text);
            yim.sendToRoom(curRoomId, msg).catch(function (e) {
                addNotice(getErrorMsg(e.name));
            });
            E('text-msg').value = '';
            E('text-msg').focus();
        };
        E('btn-send').onclick = sendText;
        E('text-msg').onkeydown = function (e) {
            if (e.key === 'Enter') {
                sendText();
            }
        };

        // 录音实例
        var voice;

        // 按下录音键（按住说话）
        var holdDown = function (e) {
            isInCancelArea = false;
            voice = new VoiceMessage();
            E('btn-hold-speak').className = 'active';
            voice.startRecord().then(function () {
                E('btn-hold-speak').className = 'active speaking';
                E('btn-hold-speak-text').innerHTML = '松开 完成';
                E('speak-display-recording').style.display = 'block';
                E('speak-display-leave-to-cancel').style.display = 'none';
            }).catch(function (e) {
                if (e.name !== 'RecordTooShortError') {
                    // 'RecordTooShortError' 错误将在 finishRecord() 中报错，这里不再重复
                    addNotice(getErrorMsg(e.name));
                }
            });

            e.preventDefault();
        };
        E('btn-hold-speak').addEventListener('touchstart', holdDown);
        E('btn-hold-speak').addEventListener('mousedown', holdDown);

        // 手指（或鼠标）在界面上移动
        var isInCancelArea = false;
        var inCancel = function () {
            if (isInCancelArea) { return; }
            isInCancelArea = true;
            E('speak-display-recording').style.display = 'none';
            E('speak-display-leave-to-cancel').style.display = 'block';
            E('btn-hold-speak-text').innerHTML = '松开 取消';
        };
        var inFinish = function () {
            if (!isInCancelArea) { return; }
            isInCancelArea = false;
            E('speak-display-recording').style.display = 'block';
            E('speak-display-leave-to-cancel').style.display = 'none';
            E('btn-hold-speak-text').innerHTML = '松开 完成';
        };
        var inWhere = function (pageY) {
            if (pageY < window.innerHeight * 0.83) {
                inCancel();
            } else {
                inFinish();
            }
        };
        E('btn-hold-speak').addEventListener('touchmove', function (e) { inWhere(e.touches[0].pageY); e.preventDefault();});
        E('btn-hold-speak').addEventListener('mousemove', function (e) { inWhere(e.pageY); e.preventDefault();});

        // 在取消区域松手
        var holdUpCancel = function () {
            E('btn-hold-speak').className = '';
            E('btn-hold-speak-text').innerHTML = '按住 说话';
            // 取消录音
            voice.cancelRecord();
        };

        // 在完成区域松手
        var holdUpFinish = function () {
            E('btn-hold-speak').className = '';
            E('btn-hold-speak-text').innerHTML = '按住 说话';
            // 完成录音
            voice.finishRecord(true);

            // 除了这样写，也可以 voice.finishRecord().then( /* yim.sendToRoom(...) */ ).catch( /* e.name */ );
            if (voice.isError()) {
                addNotice(getErrorMsg(voice.getErrorName()));
            } else {
                yim.sendToRoom(curRoomId, voice).catch(function (e) {
                    addNotice(getErrorMsg(e.name));
                });
            }
        };

        var holdUpWhere = function (e) {
            if (isInCancelArea) {
                holdUpCancel();
            } else {
                holdUpFinish();
            }
            e.preventDefault();
        };
        E('btn-hold-speak').addEventListener('touchend', holdUpWhere);
        E('btn-hold-speak').addEventListener('mouseup', holdUpWhere);

        // 事件绑定：已登录
        yim.on('account.login', function ()  {
            E('user-logged').style.display = 'block';
            E('user-no-log').style.display = 'none';
            E('login-form').style.display = 'none';
            E('dsp-user-name').innerHTML = yim.getMyUserId();
            addNotice('已登录到 ' + yim.getMyUserId());
        });

        // 事件绑定：正在登录中
        yim.on('account.logging', function ()  {
            E('user-logged').style.display = 'none';
            E('user-no-log').style.display = 'none';
            E('btn-login').setAttribute('disabled', true);
            E('btn-login').value = '登录中...';
        });

        // 事件绑定：退出登录
        yim.on('account.logout', function ()  {
            E('user-logged').style.display = 'none';
            E('user-no-log').style.display = 'block';
            E('login-form').style.display = 'flex';
            E('btn-login').removeAttribute('disabled');
            E('btn-login').value = '登录';
            addNotice('退出登录');
        });

        // 事件绑定：登录失败
        yim.on('account.error:*', function (eventName, e)  {
            E('user-logged').style.display = 'none';
            E('user-no-log').style.display = 'block';
            E('login-form').style.display = 'flex';
            E('btn-login').removeAttribute('disabled');
            E('btn-login').value = '登录';
            addNotice('登录失败：' + getErrorMsg(e.name));
        });

        // 事件绑定：被踢下线
        yim.on('account.kickoff', function ()  {
            alert('你被踢下线了');
            addNotice('你被踢下线了');
            E('user-logged').style.display = 'none';
            E('user-no-log').style.display = 'block';
            E('login-form').style.display = 'flex';
            E('btn-login').removeAttribute('disabled');
            E('btn-login').value = '登录';
        });

        // 事件绑定：正在请求加入房间
        yim.on('room.joining:*', function (eventName, roomId)  {
            E('room-joined').style.display = 'none';
            E('room-no-join').style.display = 'none';
            E('room-joining').style.display = 'block';
            E('dsp-room-joining-name').innerHTML = roomId;
        });

        // 事件绑定：加入房间
        yim.on('room.join:*', function (eventName, roomId)  {
            E('room-joined').style.display = 'block';
            E('room-no-join').style.display = 'none';
            E('room-joining').style.display = 'none';
            E('dsp-room-name').innerHTML = roomId;
            E('dsp-room-joining-name').innerHTML = roomId;
            E('text-room-id').value = roomId;
            addNotice('加入房间：' + roomId);
        });

        // 事件绑定：退出房间
        yim.on('room.leave:*', function (eventName, roomId)  {
            E('room-joined').style.display = 'none';
            E('room-no-join').style.display = 'block';
            E('room-joining').style.display = 'none';
            addNotice('退出房间：' + roomId);
        });

        // 事件绑定：加入房间失败
        yim.on('room.join-error:*', function (eventName, e, roomId)  {
            E('room-joined').style.display = 'none';
            E('room-no-join').style.display = 'block';
            E('room-joining').style.display = 'none';
            addNotice('加入房间 ' + roomId + ' 失败：' + getErrorMsg(e.name));
        });

        // 事件绑定：退出房间失败
        yim.on('room.leave-error:*', function (eventName, e, roomId)  {
            E('room-joined').style.display = 'block';
            E('room-no-join').style.display = 'none';
            E('room-joining').style.display = 'none';
            E('dsp-room-name').innerHTML = roomId;
            E('dsp-room-joining-name').innerHTML = roomId;
            E('text-room-id').value = roomId;
            addNotice('退出房间 ' + roomId + ' 失败：' + getErrorMsg(e.name));
        });

        // 事件绑定：发送/接收了消息
        yim.on('message:*', function (eventName, msgObj)  {
            addChatItem(msgObj);
        });

        // 打开 vConsole
        E('v-console-switch').onclick = function () {
            window.vc.show();
        };

        // 版本
        addNotice('Ver 8');

    }
});
