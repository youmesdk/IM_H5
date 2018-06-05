/* global define, MOLO, $, Strophe, YIDIAN, $msg, wx*/
(function(){
    window.yim = window.yim || {};
    yim.app = yim.app || {};

    var getDateInfo = function(timestamp, key){
        var theDate = new Date(timestamp * 1000),
        info = {
            y : theDate.getFullYear(),
            m : theDate.getMonth()+1,
            d : theDate.getDate(),
            H : theDate.getHours(),
            M : theDate.getMinutes(),
            S : theDate.getSeconds()
        };
        $.each(info, function(k, v){
            info[k] = v<10 ? '0'+v : v;
        });
        return key ? info[key] : info;
    };

    var formatDate = function(timestamp){
        var info = getDateInfo(timestamp),
            dateStr = info.m+'-'+info.d;
        if(info.y!=(new Date()).getFullYear()){
            dateStr = info.y+'-'+dateStr;
        }
        return dateStr;
    };

    var formatChatToday =  function(timestamp){
        var info = getDateInfo(timestamp),
            tstr = formatDate(timestamp),
            ntstr = formatDate(+(new Date()/1000)),
            text = tstr;
        if(tstr==ntstr){
           text = '';
        }
        text = text +' '+info.H+':'+info.M;
        return text;
    };

    //添加语音消息DOM
    yim.app.addVoiceDom = function(info){
        info.msgType = 'VOICE';
        addChatList(info);
    };

    yim.app.addTipsDom = function(text){
        var $html = $('<li class="notice"><span></span></li>');
        $html.find('span').text(text);
        _appendMsgHtml($html);
    };

    yim.app.addTextDom = function(info){
        info.msgType = 'TEXT';
        addChatList(info);
    };

    var $noticeBox = $('#J_mic-notice'),
        _touchTimer = 0;

    yim.app.hideRecordUI = function(){
        if(_touchTimer){
            clearTimeout(_touchTimer);
        }
        $noticeBox.hide();
        $('#J_voice-inp').removeClass('touchstart');
    };

    var _defaultConfig = {
        onTextBtnClick: null,

        onVoiceMsgClick: null,

        //开始录音
        startRecord: null,

        //取消录音
        cancelRecord: null,

        //结束录音
        stopRecord: null
    };

    yim.app.init = function(key, fn){
        var config = {};
        if(typeof key==='object'){
            config = key;
        }else{
            config = {};
            config[key] = fn;
        }
        _defaultConfig = $.extend(_defaultConfig, config);
    };

    var getVoiceValue = function(time){
        var r = [],
            m = Math.floor(time/60),
            s = time%60;
        if(m>0){
            r.push(m+'′');
        }
        if(s>0){
            r.push(s+'″');
        }
        return r.join('');
    };

    var _lastTime = 0;
    var _renderTimer = 0;
    var _appendMsgHtml = function(html){
        var $chatBox = $('#J_userchat-list');
        $chatBox.append(html);

        clearTimeout(_renderTimer);
        _renderTimer = setTimeout(function(){
            $(document.body).scrollTop($chatBox[0].scrollHeight);
        }, 10);
    };

    var addChatList = function(info){
        var html = $('#J_temp-chatitem').html(),
            $chatBox = $('#J_userchat-list'),
            itemLen = $chatBox.find('li').length,
            allHtml = [];
        html = html.replace('{header}', './images/user_icon.png');
        html = $(html);
        info.msgTime = info.msgTime || Math.floor(+(new Date())/1000);

        //超过三分钟
        if(info.msgTime-_lastTime>180){
            _lastTime = info.msgTime;
            var node = $('<li class="notice"><span>'+formatChatToday(info.msgTime)+'</span></li>');
            allHtml.push(node[0]);
        }

        var $dom = html.find('.box').attr('data-msgid', info.msgId);
        $dom.find('.uname').text(info.msgSenderUID);
        if(info.msgType==='TEXT'){
            $dom.find('.content').addClass('text chat-arrow').text(info.msgText);
            
        }else if(info.msgType==='VOICE'){
            var _width = $('#J_userchat-list').width()-140;
            var vhtml = '<i class="voicet">'+getVoiceValue(info.voiceSize)+'</i>';
            vhtml += '<a href="javascript:void(0);" class="item-a voice chat-arrow"></a>';
            $dom.find('.content').html(vhtml);
            var width = Math.floor((+info.voiceSize)*_width/60);
            width = Math.min(width, _width);
            width = Math.max(width, 50);

            var data = {'data-msgid': info.msgId};
            if(info.voiceID){
                data['data-voiceid'] = info.voiceID;
            }else if(info.voiceURL){
                data['data-voiceurl'] = info.voiceURL;
            }
            $dom.find('.voice').attr(data).css('width', width);
        }

        if(info.myself){
            html.addClass('right');
        }
        allHtml.push(html[0]);
        _appendMsgHtml(allHtml);
    };

    var _initEvent = function(){
        $('#J_btn-send').on('click', function(){
            var text = $('#J_inp-content').val();
            text = $.trim(text);
            if(!text){
                $('#J_inp-content').val('').focus();
                return false;
            }

            _defaultConfig.onTextBtnClick(text);
            $('#J_inp-content').val('');
        });

        $('#J_userchat-list').on('click', '.voice', function(){
            _defaultConfig.onVoiceMsgClick.call(this);
        });

        var groupFooterID = '#J_groupim-footer';
        $('#J_btn-voice').on('click', function(){
            var $box = $(groupFooterID),
                cls = 'voice-footer';
            $box.toggleClass(cls);
        });

        var timeStart = 0,
            isCancel = true;
        var doTouch = function(iscancel){
            //console.log(iscancel);
            if(_touchTimer){
                clearTimeout(_touchTimer);
                _touchTimer = 0;
            }
            _touchTimer = setTimeout(function(){
                if(iscancel){
                    $noticeBox.text('松手取消发送').addClass('cancel-mic').removeClass('cancel-text').show();
                }else{
                    $noticeBox.text('上划取消发送').removeClass('cancel-mic cancel-text').show();
                }
            }, 50);
        };

        var toastTimer = 0;

        _touchstart = function(event){
            _defaultConfig.startRecord(function(code){
                if(code == yim.YIMErrorcode.YIMErrorcode_Success){
                    $(this).addClass('touchstart');
                    isCancel = false;
                    timeStart = +(new Date());
                    $noticeBox.text('上划取消发送').removeClass('cancel-mic cancel-text').show();
                }
            });
            return false;
        };

        _touchmove = function(event){
            if(timeStart<1){
                return ;
            }
            console.log(event);
            var touchItem = event.touches ? event.touches[0] : event,
                pageY = touchItem.clientY,
                winHeight = $(window).height(),
                footerHeight = $('#J_groupim-footer').height();

            //console.log(pageY+'_'+winHeight+'_'+footerHeight);
            if(pageY<winHeight-footerHeight-10){
                isCancel = true;
            }else{
                isCancel = false;
            }
            doTouch(isCancel);
            return false;
        };

        _touchend = function(){
            yim.app.hideRecordUI();
            if(timeStart<1){
                return ;
            }

            if(isCancel){
                timeStart = 0;
                return _defaultConfig.cancelRecord();
            }
            
            var time = +(new Date())-timeStart;
            if(time<500){
                $noticeBox.text('语音时间太短').addClass('cancel-text').show();
                if(toastTimer){
                    clearTimeout(toastTimer);
                }
                toastTimer = setTimeout(function(){
                    $noticeBox.hide();
                }, 1000);

                return _defaultConfig.cancelRecord();
            }

            _defaultConfig.stopRecord(time);
            timeStart = 0;
        };

        function is_touch_device() {
            if(location.href.indexOf('click')>-1){
                return false;
            }
            return 'ontouchstart' in window || navigator.maxTouchPoints;
        }

        var _tstart = 'mousedown',
            _tmove = 'mousemove',
            _tend = 'mouseup';
        if (is_touch_device()){
            _tstart = 'touchstart';
            _tmove = 'touchmove';
            _tend = 'touchend touchcancel';
        }
        console.log(_tstart);
        $('#J_voice-inp').on(_tstart, _touchstart);
        if(_tmove=='mousemove'){
            $(document.body).on(_tmove, _touchmove).on(_tend, _touchend);
        }else{
            $('#J_voice-inp').on(_tmove, _touchmove).on(_tend, _touchend);
        }

        //微信会弹确认框，会失去焦点
        $(document.body).on(_tstart, function(){
            if(timeStart>0){
                timeStart = 0;
                _defaultConfig.cancelRecord();
            }
        });
    };

    _initEvent();
}());


