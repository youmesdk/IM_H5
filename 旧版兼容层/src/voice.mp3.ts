/**
 * @fileOverview 语音配置（MP3）
 * @author benz@youme.im
 * @date 2018/8/29
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

import VoiceMessage from 'youme-im/voice';
import MP3Recorder from 'youme-im/voice/mp3';

export function isWechat(): boolean {
    return false;
}

export function initVoice() {
    VoiceMessage.registerRecorder([MP3Recorder]);
}
