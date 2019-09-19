cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: '你好，世界!'
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
        // 初始化游密 IM SDK
        var yim = new YIM({
            appKey: 'YOUME5BE427937AF216E88E0F84C0EF148BD29B691556', // 请将 appKey 进行替换
            useMessageType: [ VoiceMessage ]
        });

        // 初始化录音插件
        VoiceMessage.registerRecorder( [ WechatRecorder, MP3Recorder ] );

        VoiceMessage.initRecorder().then(function () {
            console.log('初始化录音完毕')
                // addNotice('初始化录音完毕。');
            }).catch(function (e) {
                console.log(e);
                // addNotice(getErrorMsg(e.name));
            });
    },

    // called every frame
    update: function (dt) {

    },
});
