/**
 * @fileOverview 语音配置（AMR+微信）
 * @author benz@youme.im
 * @date 2018/8/29
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

import VoiceMessage from 'youme-im/voice';
import WechatRecorder from 'youme-im/voice/wechat';
import AMRRecorder from 'youme-im/voice/amr';

declare var wx: any;

export function isWechat(): boolean {
    return WechatRecorder.isWechat();
}

export function initVoice() {
    VoiceMessage.registerRecorder([WechatRecorder, AMRRecorder]);
    if (wx) {
        WechatRecorder.setWXObject(wx);
    }
}
