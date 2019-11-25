#! /bin/bash
# for 微信
cat ../sdk+demo/yim.core.min.js \
../sdk+demo/yim.text.message.min.js \
../sdk+demo/yim.voice.message.min.js \
../sdk+demo/yim.mp3.recorder.min.js \
../sdk+demo/yim.wav.recorder.min.js \
../sdk+demo/yim.wechat.recorder.min.js > SDK/yim.min.js

# full for browser
cat ../sdk+demo/yim.core.min.js \
../sdk+demo/yim.text.message.min.js \
../sdk+demo/yim.voice.message.min.js \
../sdk+demo/yim.amr.recorder.min.js \
../sdk+demo/yim.mp3.recorder.min.js \
../sdk+demo/yim.wav.recorder.min.js \
../sdk+demo/yim.wechat.recorder.min.js > SDK/yim.web.min.js