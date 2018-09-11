(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.yim = factory());
}(this, (function () {
	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var core = createCommonjsModule(function (module, exports) {
	!function(t,i){module.exports=i();}(commonjsGlobal,function(){var r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,i){t.__proto__=i;}||function(t,i){for(var n in i)i.hasOwnProperty(n)&&(t[n]=i[n]);};function e(t,i){function n(){this.constructor=t;}r(t,i),t.prototype=null===i?Object.create(i):(n.prototype=i.prototype,new n);}var i=t;function t(){}t.mixin=function(t){var i=t.prototype||t;i.isWildEmitter=!0,i.on=function(t,i,n){this.callbacks=this.callbacks||{};var r=3===arguments.length,e=r?i:void 0,s=r?n:i;return s.t=e,(this.callbacks[t]=this.callbacks[t]||[]).push(s),this},i.once=function(i,t,n){var r=this,e=3===arguments.length,s=e?t:void 0,o=e?n:t;return this.on(i,s,function t(){r.off(i,t),o.apply(this,arguments);}),this},i.releaseGroup=function(t){var i,n,r,e;for(i in this.callbacks=this.callbacks||{},this.callbacks)for(n=0,r=(e=this.callbacks[i]).length;n<r;n++)e[n].t===t&&(e.splice(n,1),n--,r--);return this},i.off=function(t,i){this.callbacks=this.callbacks||{};var n,r=this.callbacks[t];return r&&(1===arguments.length?delete this.callbacks[t]:(n=r.indexOf(i),r.splice(n,1),0===r.length&&delete this.callbacks[t])),this},i.emit=function(t){this.callbacks=this.callbacks||{};var i,n,r,e=[].slice.call(arguments,1),s=this.callbacks[t],o=this.getWildcardCallbacks(t);if(s)for(i=0,n=(r=s.slice()).length;i<n&&r[i];++i)r[i].apply(this,e);if(o)for(n=o.length,i=0,n=(r=o.slice()).length;i<n&&r[i];++i)r[i].apply(this,[t].concat(e));return this},i.getWildcardCallbacks=function(t){this.callbacks=this.callbacks||{};var i,n,r=[];for(i in this.callbacks)n=i.split("*"),("*"===i||2===n.length&&t.slice(0,n[0].length)===n[0])&&(r=r.concat(this.callbacks[i]));return r};},t.mixin(t);var s=function(i){function t(){var t=i.call(this)||this;return t.i={appKey:"",userId:"",token:""},t}return e(t,i),t.prototype.set=function(t,i){this.i[t]=i,this.emit("change:"+t,t,i);},t.prototype.get=function(t){return this.i[t]},t}(i),o=function(r){function t(t,i){var n=r.call(this)||this;return n.n=t,n.r=i,n.e=!1,n.s=!1,n.o="",n.u="",n.h="",n.f=6,n.r.on("message:7",function(){n.r.close(),n.s=!1,n.emit("kickoff");}),n}return e(t,r),t.prototype.login=function(t,i,n){var r=this;return this.s?i!==this.u?(this.logout(),new Promise(function(t){setTimeout(function(){return t()},100);}).then(function(){return r.login(t,i,n)})):Promise.resolve():(this.e=!0,this.n.set("appKey",t),this.n.set("userId",i),this.n.set("token",n),this.o=t,this.u=i,this.h=n,this.emit("logging"),this.r.send(1,{appkey:t,userid:i+"",session:n+"",notify:1,base:{os_type:this.f,ip:"",port:0}}).then(function(){r.e=!1,r.s=!0,r.emit("login");}).catch(function(t){throw r.e=!1,r.s=!1,r.r.close(),r.emit("error:"+t.name,t),t}))},t.prototype.logout=function(){this.r.close(),this.s=!1,this.emit("logout");},t.prototype.isLogging=function(){return this.e},t.prototype.isLogged=function(){return this.s},t.prototype.doIfLogged=function(){var e=this;return new Promise(function(t,i){if(e.s)t();else{var n=setTimeout(function(){e.off("login",r);var t=new Error;t.name="NotLoginError",i(t);},1e4),r=function(){t(),clearTimeout(n);};e.once("login",r);}})},t.prototype.getMyUserId=function(){return this.u},t.prototype.reconnect=function(){return this.s=!1,this.login(this.o,this.u,this.h)},t}(i),u=function(r){function t(t,i){var n=r.call(this)||this;return n.n=t,n.r=i,n.c={},n.r.on("status:ended",function(){return n.clear()}),n}return e(t,r),t.prototype.joinRoom=function(i){var n=this;return i+="",this.c[i]||(this.c[i]=[this.n.get("userId")]),this.emit("joining:"+i,i),this.r.send(3,{roomid:i}).then(function(t){return n.emit("join:"+i,i),i}).catch(function(t){throw n.emit("join-error:"+t.name,t,i),delete n.c[i],t})},t.prototype.leaveRoom=function(i){var n=this;return i+="",this.r.send(4,{roomid:i}).then(function(){delete n.c[i],n.emit("leave:"+i,i);}).catch(function(t){throw n.emit("leave-error:"+t.name,t,i),t})},t.prototype.leaveAllRoom=function(){for(var t=[],i=0,n=Object.keys(this.c);i<n.length;i++){var r=n[i];t.push(this.leaveRoom(r));}return Promise.all(t).then(function(){})},t.prototype.clear=function(){for(var t=0,i=Object.keys(this.c);t<i.length;t++){var n=i[t];this.emit("leave:"+n,n);}this.c={};},t.prototype.doIfJoinedRoom=function(i){var n=this;return new Promise(function(t){i+="",n.inRoom(i)?t():n.once("join:"+i,function(){return t()});})},t.prototype.inRoom=function(t){return t+="",!!this.c[t]},t.prototype.getRoomIdList=function(){return Object.keys(this.c)},t.prototype.reconnect=function(){for(var i=this,t=function(t){n.r.send(4,{roomid:t}).then(function(){return i.r.send(3,{roomid:t})});},n=this,r=0,e=this.getRoomIdList();r<e.length;r++){t(e[r]);}},t}(i),h="wss://webrtctest.youme.im",f=function(t){return t?"wss://"+t.substr(t.length-8).toLowerCase()+".h5.youme.im:443":""},c="disconnected",a="connected",v="reconnecting",l="ended",d={0:"OK",20001:"NotLoginError",20002:"InvalidParamError",20003:"InvalidLoginError",20004:"UsernameOrTokenError",20005:"LoginTimeoutError",20006:"ServiceOverloadError",20007:"MessageTooLongError"},w=function(n){function t(t){var i=n.call(this)||this;return i.n=t,i.a=1,i.f=6,i.v=null,i.l=h,i.d=c,i.w=[],i.g={},i.m={},i.y={},i.p=!1,i.b=[],i.A=[],i.j=1530625445318,i.T=0,i}return e(t,n),t.prototype.init=function(t){return t||(t=f(this.n.get("appKey"))),t&&(this.l=t,this.P(),this.k("connecting")),this},t.prototype.send=function(n,t){var r=this;if((this.d===c||this.d===l)&&(this.init(),this.d===c||this.d===l)){var i=new Error;return i.name="NotLoginError",Promise.reject(i)}return this.j++,t.base=t.base||{},t.base=Object.assign(t.base,{msgtype:n,seq:this.j+"",version:this.a,os_type:this.f}),this.w.push(t),this.I(),this.T&&clearTimeout(this.T),this.T=setTimeout(function(){return r.O()},6e4),new Promise(function(t,i){r.g[r.j]=t,r.m[r.j]=i,r.y[n]=r.j;})},t.prototype.getStatus=function(){return this.d},t.prototype.close=function(){this.k(l),this.v&&(this.v.close(),this.v=null),this.w=[],this.g={},this.j=0,this.T&&(clearTimeout(this.T),this.T=0);},t.prototype.checkNetwork=function(){var n=this;return new Promise(function(t,i){n.b.push(t),n.A.push(i),n.p||n.O();})},t.prototype.P=function(){this.v&&this.v.close(),this.v=new WebSocket(this.l),this.B();},t.prototype.C=function(){var t=this;if(this.d!==l){if(this.d!==v){for(var i in this.m)this.m.hasOwnProperty(i)&&this.m[i](new DOMException("Socket was closed.","NetworkError"));this.g={},this.m={},this.k(v);}this.v=null,setTimeout(function(){t.d===v&&t.P();},1e3);}this.T&&(clearTimeout(this.T),this.T=0);},t.prototype.B=function(){var u=this;this.v&&(this.v.addEventListener("open",function(){u.k(a),u.emit("ready"),u.I();}),this.v.addEventListener("error",function(t){u.emit("error",t);}),this.v.addEventListener("close",function(){u.C();}),this.v.addEventListener("message",function(t){var i=JSON.parse(t.data),n=i.ret,r=i.base,e=r.msgtype,s=r.seq;if(s||(s=u.y[e]),s&&u.g[s]){if(n&&"0"!==n){var o=new Error;o.name=d[n]||"Error-"+n,u.m[s](o);}else u.g[s](i);delete u.g[s],delete u.m[s];}u.emit("message:"+e,i);}));},t.prototype.k=function(t){this.d!==t&&(this.d=t,this.emit("status:"+t,t));},t.prototype.I=function(){if(this.d===a&&this.v){for(var t=0,i=this.w;t<i.length;t++){var n=i[t];this.v.send(JSON.stringify(n));var r=n.base;this.emit("send:"+r.msgtype,n);}this.w=[];}},t.prototype.O=function(){var t=this;if(!this.p){this.p=!0;var i=setTimeout(function(){t.U(!1),t.v&&t.v.close(),t.C();},1e4);this.send(0,{}).then(function(){clearTimeout(i),t.U(!0);}).catch(function(){clearTimeout(i),t.U(!1);});}},t.prototype.U=function(t){if(t)for(var i=0,n=this.b;i<n.length;i++){var r=n[i];r&&r();}else for(var e=0,s=this.A;e<s.length;e++){var o=s[e];o&&o();}this.b=[],this.A=[],this.p=!1;},t}(i),E="undefined"!=typeof window?window:"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:{};var n,g=(function(p){!function(){var f="input is invalid type",t="object"==typeof window,i=t?window:{};i.JS_MD5_NO_WINDOW&&(t=!1);var n=!t&&"object"==typeof self,r=!i.JS_MD5_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;r?i=E:n&&(i=self);var e,s=!i.JS_MD5_NO_COMMON_JS&&p.exports,c=!i.JS_MD5_NO_ARRAY_BUFFER&&"undefined"!=typeof ArrayBuffer,o="0123456789abcdef".split(""),u=[128,32768,8388608,-2147483648],a=[0,8,16,24],h=["hex","array","digest","buffer","arrayBuffer","base64"],v="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),l=[];if(c){var d=new ArrayBuffer(68);e=new Uint8Array(d),l=new Uint32Array(d);}!i.JS_MD5_NO_NODE_JS&&Array.isArray||(Array.isArray=function(t){return "[object Array]"===Object.prototype.toString.call(t)}),!c||!i.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW&&ArrayBuffer.isView||(ArrayBuffer.isView=function(t){return "object"==typeof t&&t.buffer&&t.buffer.constructor===ArrayBuffer});var w=function(i){return function(t){return new m(!0).update(t)[i]()}},g=function(i){var n=[eval][0]("require('crypto')"),r=[eval][0]("require('buffer').Buffer");return function(t){if("string"==typeof t)return n.createHash("md5").update(t,"utf8").digest("hex");if(null==t)throw f;return t.constructor===ArrayBuffer&&(t=new Uint8Array(t)),Array.isArray(t)||ArrayBuffer.isView(t)||t.constructor===r?n.createHash("md5").update(new r(t)).digest("hex"):i(t)}};function m(t){if(t)l[0]=l[16]=l[1]=l[2]=l[3]=l[4]=l[5]=l[6]=l[7]=l[8]=l[9]=l[10]=l[11]=l[12]=l[13]=l[14]=l[15]=0,this.blocks=l,this.buffer8=e;else if(c){var i=new ArrayBuffer(68);this.buffer8=new Uint8Array(i),this.blocks=new Uint32Array(i);}else this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];this.h0=this.h1=this.h2=this.h3=this.start=this.bytes=this.hBytes=0,this.finalized=this.hashed=!1,this.first=!0;}m.prototype.update=function(t){if(!this.finalized){var i,n=typeof t;if("string"!==n){if("object"!==n)throw f;if(null===t)throw f;if(c&&t.constructor===ArrayBuffer)t=new Uint8Array(t);else if(!(Array.isArray(t)||c&&ArrayBuffer.isView(t)))throw f;i=!0;}for(var r,e,s=0,o=t.length,u=this.blocks,h=this.buffer8;s<o;){if(this.hashed&&(this.hashed=!1,u[0]=u[16],u[16]=u[1]=u[2]=u[3]=u[4]=u[5]=u[6]=u[7]=u[8]=u[9]=u[10]=u[11]=u[12]=u[13]=u[14]=u[15]=0),i)if(c)for(e=this.start;s<o&&e<64;++s)h[e++]=t[s];else for(e=this.start;s<o&&e<64;++s)u[e>>2]|=t[s]<<a[3&e++];else if(c)for(e=this.start;s<o&&e<64;++s)(r=t.charCodeAt(s))<128?h[e++]=r:(r<2048?h[e++]=192|r>>6:(r<55296||57344<=r?h[e++]=224|r>>12:(r=65536+((1023&r)<<10|1023&t.charCodeAt(++s)),h[e++]=240|r>>18,h[e++]=128|r>>12&63),h[e++]=128|r>>6&63),h[e++]=128|63&r);else for(e=this.start;s<o&&e<64;++s)(r=t.charCodeAt(s))<128?u[e>>2]|=r<<a[3&e++]:(r<2048?u[e>>2]|=(192|r>>6)<<a[3&e++]:(r<55296||57344<=r?u[e>>2]|=(224|r>>12)<<a[3&e++]:(r=65536+((1023&r)<<10|1023&t.charCodeAt(++s)),u[e>>2]|=(240|r>>18)<<a[3&e++],u[e>>2]|=(128|r>>12&63)<<a[3&e++]),u[e>>2]|=(128|r>>6&63)<<a[3&e++]),u[e>>2]|=(128|63&r)<<a[3&e++]);this.lastByteIndex=e,this.bytes+=e-this.start,64<=e?(this.start=e-64,this.hash(),this.hashed=!0):this.start=e;}return 4294967295<this.bytes&&(this.hBytes+=this.bytes/4294967296<<0,this.bytes=this.bytes%4294967296),this}},m.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var t=this.blocks,i=this.lastByteIndex;t[i>>2]|=u[3&i],56<=i&&(this.hashed||this.hash(),t[0]=t[16],t[16]=t[1]=t[2]=t[3]=t[4]=t[5]=t[6]=t[7]=t[8]=t[9]=t[10]=t[11]=t[12]=t[13]=t[14]=t[15]=0),t[14]=this.bytes<<3,t[15]=this.hBytes<<3|this.bytes>>>29,this.hash();}},m.prototype.hash=function(){var t,i,n,r,e,s,o=this.blocks;this.first?i=((i=((t=((t=o[0]-680876937)<<7|t>>>25)-271733879<<0)^(n=((n=(-271733879^(r=((r=(-1732584194^2004318071&t)+o[1]-117830708)<<12|r>>>20)+t<<0)&(-271733879^t))+o[2]-1126478375)<<17|n>>>15)+r<<0)&(r^t))+o[3]-1316259209)<<22|i>>>10)+n<<0:(t=this.h0,i=this.h1,n=this.h2,i=((i+=((t=((t+=((r=this.h3)^i&(n^r))+o[0]-680876936)<<7|t>>>25)+i<<0)^(n=((n+=(i^(r=((r+=(n^t&(i^n))+o[1]-389564586)<<12|r>>>20)+t<<0)&(t^i))+o[2]+606105819)<<17|n>>>15)+r<<0)&(r^t))+o[3]-1044525330)<<22|i>>>10)+n<<0),i=((i+=((t=((t+=(r^i&(n^r))+o[4]-176418897)<<7|t>>>25)+i<<0)^(n=((n+=(i^(r=((r+=(n^t&(i^n))+o[5]+1200080426)<<12|r>>>20)+t<<0)&(t^i))+o[6]-1473231341)<<17|n>>>15)+r<<0)&(r^t))+o[7]-45705983)<<22|i>>>10)+n<<0,i=((i+=((t=((t+=(r^i&(n^r))+o[8]+1770035416)<<7|t>>>25)+i<<0)^(n=((n+=(i^(r=((r+=(n^t&(i^n))+o[9]-1958414417)<<12|r>>>20)+t<<0)&(t^i))+o[10]-42063)<<17|n>>>15)+r<<0)&(r^t))+o[11]-1990404162)<<22|i>>>10)+n<<0,i=((i+=((t=((t+=(r^i&(n^r))+o[12]+1804603682)<<7|t>>>25)+i<<0)^(n=((n+=(i^(r=((r+=(n^t&(i^n))+o[13]-40341101)<<12|r>>>20)+t<<0)&(t^i))+o[14]-1502002290)<<17|n>>>15)+r<<0)&(r^t))+o[15]+1236535329)<<22|i>>>10)+n<<0,i=((i+=((r=((r+=(i^n&((t=((t+=(n^r&(i^n))+o[1]-165796510)<<5|t>>>27)+i<<0)^i))+o[6]-1069501632)<<9|r>>>23)+t<<0)^t&((n=((n+=(t^i&(r^t))+o[11]+643717713)<<14|n>>>18)+r<<0)^r))+o[0]-373897302)<<20|i>>>12)+n<<0,i=((i+=((r=((r+=(i^n&((t=((t+=(n^r&(i^n))+o[5]-701558691)<<5|t>>>27)+i<<0)^i))+o[10]+38016083)<<9|r>>>23)+t<<0)^t&((n=((n+=(t^i&(r^t))+o[15]-660478335)<<14|n>>>18)+r<<0)^r))+o[4]-405537848)<<20|i>>>12)+n<<0,i=((i+=((r=((r+=(i^n&((t=((t+=(n^r&(i^n))+o[9]+568446438)<<5|t>>>27)+i<<0)^i))+o[14]-1019803690)<<9|r>>>23)+t<<0)^t&((n=((n+=(t^i&(r^t))+o[3]-187363961)<<14|n>>>18)+r<<0)^r))+o[8]+1163531501)<<20|i>>>12)+n<<0,i=((i+=((r=((r+=(i^n&((t=((t+=(n^r&(i^n))+o[13]-1444681467)<<5|t>>>27)+i<<0)^i))+o[2]-51403784)<<9|r>>>23)+t<<0)^t&((n=((n+=(t^i&(r^t))+o[7]+1735328473)<<14|n>>>18)+r<<0)^r))+o[12]-1926607734)<<20|i>>>12)+n<<0,i=((i+=((s=(r=((r+=((e=i^n)^(t=((t+=(e^r)+o[5]-378558)<<4|t>>>28)+i<<0))+o[8]-2022574463)<<11|r>>>21)+t<<0)^t)^(n=((n+=(s^i)+o[11]+1839030562)<<16|n>>>16)+r<<0))+o[14]-35309556)<<23|i>>>9)+n<<0,i=((i+=((s=(r=((r+=((e=i^n)^(t=((t+=(e^r)+o[1]-1530992060)<<4|t>>>28)+i<<0))+o[4]+1272893353)<<11|r>>>21)+t<<0)^t)^(n=((n+=(s^i)+o[7]-155497632)<<16|n>>>16)+r<<0))+o[10]-1094730640)<<23|i>>>9)+n<<0,i=((i+=((s=(r=((r+=((e=i^n)^(t=((t+=(e^r)+o[13]+681279174)<<4|t>>>28)+i<<0))+o[0]-358537222)<<11|r>>>21)+t<<0)^t)^(n=((n+=(s^i)+o[3]-722521979)<<16|n>>>16)+r<<0))+o[6]+76029189)<<23|i>>>9)+n<<0,i=((i+=((s=(r=((r+=((e=i^n)^(t=((t+=(e^r)+o[9]-640364487)<<4|t>>>28)+i<<0))+o[12]-421815835)<<11|r>>>21)+t<<0)^t)^(n=((n+=(s^i)+o[15]+530742520)<<16|n>>>16)+r<<0))+o[2]-995338651)<<23|i>>>9)+n<<0,i=((i+=((r=((r+=(i^((t=((t+=(n^(i|~r))+o[0]-198630844)<<6|t>>>26)+i<<0)|~n))+o[7]+1126891415)<<10|r>>>22)+t<<0)^((n=((n+=(t^(r|~i))+o[14]-1416354905)<<15|n>>>17)+r<<0)|~t))+o[5]-57434055)<<21|i>>>11)+n<<0,i=((i+=((r=((r+=(i^((t=((t+=(n^(i|~r))+o[12]+1700485571)<<6|t>>>26)+i<<0)|~n))+o[3]-1894986606)<<10|r>>>22)+t<<0)^((n=((n+=(t^(r|~i))+o[10]-1051523)<<15|n>>>17)+r<<0)|~t))+o[1]-2054922799)<<21|i>>>11)+n<<0,i=((i+=((r=((r+=(i^((t=((t+=(n^(i|~r))+o[8]+1873313359)<<6|t>>>26)+i<<0)|~n))+o[15]-30611744)<<10|r>>>22)+t<<0)^((n=((n+=(t^(r|~i))+o[6]-1560198380)<<15|n>>>17)+r<<0)|~t))+o[13]+1309151649)<<21|i>>>11)+n<<0,i=((i+=((r=((r+=(i^((t=((t+=(n^(i|~r))+o[4]-145523070)<<6|t>>>26)+i<<0)|~n))+o[11]-1120210379)<<10|r>>>22)+t<<0)^((n=((n+=(t^(r|~i))+o[2]+718787259)<<15|n>>>17)+r<<0)|~t))+o[9]-343485551)<<21|i>>>11)+n<<0,this.first?(this.h0=t+1732584193<<0,this.h1=i-271733879<<0,this.h2=n-1732584194<<0,this.h3=r+271733878<<0,this.first=!1):(this.h0=this.h0+t<<0,this.h1=this.h1+i<<0,this.h2=this.h2+n<<0,this.h3=this.h3+r<<0);},m.prototype.toString=m.prototype.hex=function(){this.finalize();var t=this.h0,i=this.h1,n=this.h2,r=this.h3;return o[t>>4&15]+o[15&t]+o[t>>12&15]+o[t>>8&15]+o[t>>20&15]+o[t>>16&15]+o[t>>28&15]+o[t>>24&15]+o[i>>4&15]+o[15&i]+o[i>>12&15]+o[i>>8&15]+o[i>>20&15]+o[i>>16&15]+o[i>>28&15]+o[i>>24&15]+o[n>>4&15]+o[15&n]+o[n>>12&15]+o[n>>8&15]+o[n>>20&15]+o[n>>16&15]+o[n>>28&15]+o[n>>24&15]+o[r>>4&15]+o[15&r]+o[r>>12&15]+o[r>>8&15]+o[r>>20&15]+o[r>>16&15]+o[r>>28&15]+o[r>>24&15]},m.prototype.array=m.prototype.digest=function(){this.finalize();var t=this.h0,i=this.h1,n=this.h2,r=this.h3;return [255&t,t>>8&255,t>>16&255,t>>24&255,255&i,i>>8&255,i>>16&255,i>>24&255,255&n,n>>8&255,n>>16&255,n>>24&255,255&r,r>>8&255,r>>16&255,r>>24&255]},m.prototype.buffer=m.prototype.arrayBuffer=function(){this.finalize();var t=new ArrayBuffer(16),i=new Uint32Array(t);return i[0]=this.h0,i[1]=this.h1,i[2]=this.h2,i[3]=this.h3,t},m.prototype.base64=function(){for(var t,i,n,r="",e=this.array(),s=0;s<15;)t=e[s++],i=e[s++],n=e[s++],r+=v[t>>>2]+v[63&(t<<4|i>>>4)]+v[63&(i<<2|n>>>6)]+v[63&n];return t=e[s],r+=v[t>>>2]+v[t<<4&63]+"=="};var y=function(){var i=w("hex");r&&(i=g(i)),i.create=function(){return new m},i.update=function(t){return i.create().update(t)};for(var t=0;t<h.length;++t){var n=h[t];i[n]=w(n);}return i}();s?p.exports=y:i.md5=y;}();}(n={exports:{}},n.exports),n.exports),m=(g.hex,g.array,g.digest,g.arrayBuffer,g.buffer,g.create),y=(g.update,g.base64,function(t){function c(){var i=null!==t&&t.apply(this,arguments)||this;return i.__isReady=!1,i.__isCanceled=!1,i.__reqUpTk=null,i.__reqWXTk=null,i.__onReadyQueue=[],i.__onCancelQueue=[],i.__onSetUpTkFn=[],i.__onSetWXTkFn=[],i.__content="",i.typeId=0,i.__controls={initWithContent:function(t){return i.initWithContent(t).then(function(){return i.setContent(t)})},getContent:function(){return i.getContent()},getTypeId:function(){return i.getTypeId()},getType:function(){return i.getType()},onRequestUploadToken:function(t){return i.__onReqUpTk(t)},onRequestWechatToken:function(t){return i.__onReqWXTk(t)},waitForContent:function(){return i.__waitForContent()}},i}return e(c,t),c.prototype.setContent=function(t){this.__content="string"==typeof t?t:JSON.stringify(t),this.__isReady=!0;for(var i=0,n=this.__onReadyQueue;i<n.length;i++){(0, n[i])(this.__content);}this.__onReadyQueue=[];},c.prototype.setCanceled=function(){this.__isCanceled=!0;for(var t=0,i=this.__onCancelQueue;t<i.length;t++){var n=i[t],r=new Error("Message Canceled.");r.name="CanceledError",n(r);}this.__onCancelQueue=[];},c.prototype.uploadFile=function(h){var f=this;return new Promise(function(s,o){var e,u=new FileReader;u.onload=function(){if(!(e=u.result)){var t=new Error;return t.name="UploadFileError",o(t)}var i=m();i.update(e);var n=i.hex(),r=function(n){var r=new XMLHttpRequest;r.ontimeout=function(t){o(t);},r.onerror=function(t){o(t);},r.onreadystatechange=function(){if(4==r.readyState&&200==r.status){var t=n.downloadUrl,i=t.indexOf(":");-1<i&&i<7&&(t=t.substr(i+1)),s(t);}};var t=n.uploadUrl,i=t.indexOf(":");for(var e in-1<i&&i<7&&(t=t.substr(i+1)),r.open("PUT",t,!0),r.timeout=6e4,n.headers)"host"!==e&&n.headers.hasOwnProperty(e)&&r.setRequestHeader(e,n.headers[e]);r.send(h);};if(f.__reqUpTk)f.__reqUpTk(h.size,n,n,h.type.split("/")[1]).then(r).catch(function(t){return o(t)});else if(c.__gControls.reqUpTk)c.__gControls.reqUpTk(h.size,n,n,h.type.split("/")[1]).then(r).catch(function(t){return o(t)});else{new Promise(function(t){f.__onSetUpTkFn.push(t);}).then(function(){f.__reqUpTk(h.size,n,n,h.type.split("/")[1]).then(r).catch(function(t){return o(t)});});}},u.readAsArrayBuffer(h);})},c.prototype.requestWechatToken=function(){var i=this;return this.__reqWXTk?this.__reqWXTk():c.__gControls.reqWXTk?c.__gControls.reqWXTk():new Promise(function(t){i.__onSetWXTkFn.push(t);}).then(function(){return i.__reqWXTk()})},c.prototype.isReady=function(){return this.__isReady},c.prototype.isCanceled=function(){return this.__isCanceled},c.prototype.onReady=function(t,i){if(this.__isReady)return t();this.__isCanceled?i&&i():this.__waitForContent().then(function(){t();}).catch(function(t){"CanceledError"===t.name&&i&&i();});},c.prototype.getContent=function(){var t;if(this.__isCanceled)throw(t=new Error("Message Canceled.")).name="CanceledError",t;if(!this.__isReady)throw(t=new Error("Content is not ready yet.")).name="ContentNotReadyError",t;return this.__content},c.prototype.getTypeId=function(){return this.typeId},c.prototype.getType=function(){return this.typeName},c.prototype.__onReqUpTk=function(t){this.__reqUpTk=t;for(var i=0,n=this.__onSetUpTkFn;i<n.length;i++){(0, n[i])();}this.__onSetUpTkFn=[];},c.prototype.__onReqWXTk=function(t){this.__reqWXTk=t;for(var i=0,n=this.__onSetWXTkFn;i<n.length;i++){(0, n[i])();}this.__onSetWXTkFn=[];},c.prototype.__waitForContent=function(){var n=this;if(this.__isReady)return Promise.resolve(this.__content);if(this.__isCanceled){var t=new Error("Message Canceled.");return t.name="CanceledError",Promise.reject(t)}return new Promise(function(t,i){n.__onReadyQueue.push(t),n.__onCancelQueue.push(i);})},c.__gControls={},c}(i)),p=function(r){function s(t,i){var n=r.call(this)||this;return n.n=t,n.r=i,n.x={},n.M={},n.N=new Set,n._={},n.L={},n.S="",n.q=new Date(0),n.r.on("message:9",function(t){t&&"object"==typeof t.args&&n.r.send(10,{msgid:"0"}).then(function(t){n.D(t);});}),y.__gControls.reqUpTk=n.F.bind(n),y.__gControls.reqWXTk=n.R.bind(n),n}return e(s,r),s.prototype.registerMessageType=function(t){var i=new t,n=i.__controls.getTypeId(),r=i.__controls.getType();0===n&&"text"!==r?this.L[r]=t:this._[n]=t;},s.prototype.sendToRoom=function(n,r){var e=this;return n+="",this.K(r).then(function(i){var t=s.J(n,"group",i);return e.W(t).then(function(t){var i=e.z(n,"group",t.svr_msgid,r);return e.H(i),e.emit("send:group:"+n,i),i}).catch(function(t){throw e.emit("send-failed:"+t.name+":group:"+n+":"+t.name,i,t),t})})},s.prototype.sendToUser=function(n,r){var e=this;return this.K(r).then(function(i){var t=s.J(n,"user",i);return e.W(t).then(function(t){var i=e.z(n,"user",t.svr_msgid,r);return e.H(i),e.emit("send:user:"+n,i),i}).catch(function(t){throw e.emit("send-failed:"+t.name+":user:"+n,i,t),t})})},s.prototype.requestHistoryMessage=function(t,i,n,r){var o=this;return this.r.send(11,{interlocutor:t,min_msgid:i,max_msgid:n,day_interval:r}).then(function(t){for(var i=[],n=0,r=t.msg_list;n<r.length;n++){var e=r[n],s=o.X(e);i.push(s);}return i})},s.prototype.clear=function(){this.x={},this.M={},this.N.clear();},s.prototype.D=function(t){for(var e=this,i=t.msg_list,n=function(t){var i=s.X(t),n=i.withPeer,r=i.chatType;s.H(i)&&s.K(i.message).then(function(){e.emit("receive:"+r+":"+n,i);});},s=this,r=0,o=i;r<o.length;r++){n(o[r]);}},s.prototype.X=function(t){var i,n=this,r=t.sender,e=t.receiver,s=t.sender===this.n.get("userId");switch(t.chattype){case 1:default:i="user";break;case 2:i="group";}var o,u=new Date(1e3*t.timespan),h=t.msgtype,f=t.content;if(0===h){var c=f.match(/^(.+?)!/),a=c?c[1]:null;a?(f=f.replace(/^(.+?)!/,""),o=this.L[a]):o=this._[0];}else o=this._[h];if(!o){var v=new Error;throw v.name="MessageTypeMissingError",v}var l=new o;return l.__controls.initWithContent(f).catch(function(t){n.emit("error:"+t.name,t);}),{senderId:r,receiverId:e,withPeer:s||"group"===i?e:r,isFromMe:s,chatType:i,time:u,serial:t.serial,serverId:t.svr_msgid,message:l}},s.J=function(t,i,n){var r,e;switch(i){case"user":default:r=1;break;case"group":r=2;}return e=0===n.getTypeId()&&"text"!==n.getType()?n.getType()+"!"+n.getContent():n.getContent(),{msgbodytype:n.getTypeId(),chattype:r,receiver:t,content:e}},s.prototype.z=function(t,i,n,r){return {senderId:this.n.get("userId"),receiverId:t,withPeer:t,isFromMe:!0,chatType:i,time:new Date,serverId:n,message:r}},s.prototype.H=function(t){if(this.N.has(t.serverId))return !1;var i=t.withPeer;switch(t.chatType){case"group":for(this.M[i]=this.M[i]||[],this.M[i].push(t),this.N.add(t.serverId);30<this.M[i].length;){(n=this.M[i].shift())&&this.N.delete(n.serverId);}break;case"user":for(this.x[i]=this.x[i]||[],this.x[i].push(t),this.N.add(t.serverId);30<this.x[i].length;){var n;(n=this.x[i].shift())&&this.N.delete(n.serverId);}}return !0},s.prototype.W=function(t){return this.r.send(5,t)},s.prototype.K=function(t){var e=this;return t.__controls.onRequestUploadToken(function(t,i,n,r){return e.F(t,i,n,r)}),t.__controls.onRequestWechatToken(function(){return e.R()}),t.__controls.waitForContent().then(function(){return t}).catch(function(t){throw"CanceledError"===t.name&&e.emit("error:"+t.name,t),t})},s.prototype.F=function(t,i,n,r){return this.r.send(8,{filename:n,filesize:t,filemd5:i,filesuffix:r}).then(function(t){return {headers:t.headers,uploadUrl:t.token,downloadUrl:t.downloadurl}})},s.prototype.R=function(){var i=this,t=+new Date-+this.q;return this.S&&t<3e5?Promise.resolve(this.S):this.r.send(12,{}).then(function(t){return i.S=t.token,i.q=new Date,i.S})},s}(i);return function(n){function t(t){var i=n.call(this)||this;return i.o="",i.n=new s,i.r=new w(i.n),i.G=new o(i.n,i.r),i.Q=new u(i.n,i.r),i.V=new p(i.n,i.r),i.Y(),i.Z(),i.$(),i.tt(),i.it(),t&&i.init(t).then(),i}return e(t,n),t.prototype.init=function(t){var i=[];if(this.o=t.appKey,t.userId&&t.token&&i.push(this.login(t.userId,t.token,!0).then(function(){})),t.roomId){t.roomId instanceof Array||(t.roomId=[t.roomId]);for(var n=0,r=t.roomId;n<r.length;n++){var e=r[n];i.push(this.joinRoom(e).then(function(){}));}}return t.useMessageType&&this.registerMessageType(t.useMessageType),t.userId&&t.token?Promise.all(i).then(function(){}):Promise.resolve()},t.prototype.uninit=function(){this.logout();},t.prototype.login=function(t,i,n){return void 0===n&&(n=!1),this.G.login(this.o,t,i).catch(function(t){if(!n)throw t})},t.prototype.logout=function(){this.Q.clear(),this.V.clear(),this.G.logout();},t.prototype.isLogging=function(){return this.G.isLogging()},t.prototype.isLogged=function(){return this.G.isLogged()},t.prototype.getMyUserId=function(){return this.G.getMyUserId()},t.prototype.joinRoom=function(t){var i=this;return this.G.doIfLogged().then(function(){return i.Q.joinRoom(t)})},t.prototype.leaveRoom=function(t){var i=this;return this.G.doIfLogged().then(function(){return t?i.Q.leaveRoom(t):i.Q.leaveAllRoom()})},t.prototype.inRoom=function(t){return this.Q.inRoom(t)},t.prototype.getRoomIdList=function(){return this.Q.getRoomIdList()},t.prototype.registerMessageType=function(t){if(t instanceof Array)for(var i=0,n=t;i<n.length;i++){var r=n[i];this.V.registerMessageType(r);}else this.V.registerMessageType(t);},t.prototype.sendToRoom=function(t,i,n){var r=this;return void 0===n&&(n=!1),this.G.doIfLogged().then(function(){return r.Q.doIfJoinedRoom(t)}).then(function(){return r.V.sendToRoom(t,i)}).catch(function(t){if(!n&&(n=!0,!i.isCanceled()))throw t})},t.prototype.sendToUser=function(t,i,n){var r=this;return void 0===n&&(n=!1),this.G.doIfLogged().then(function(){return r.V.sendToUser(t,i)}).catch(function(t){if(!n&&(n=!0,!i.isCanceled()))throw t})},t.prototype.requestHistoryMessage=function(t,i,n,r){return this.V.requestHistoryMessage(t,i,n,r)},t.prototype.Y=function(){var t=this;this.r.on("status:reconnecting",function(){return t.G.reconnect().then(function(){return t.Q.reconnect()})});},t.prototype.Z=function(){var n=this;this.G.on("login",function(){return n.emit("account.login")}),this.G.on("logging",function(){return n.emit("account.logging")}),this.G.on("logout",function(){return n.emit("account.logout")}),this.G.on("kickoff",function(){return n.emit("account.kickoff")}),this.G.on("error:*",function(t,i){return n.emit("account."+t,i)});},t.prototype.$=function(){var r=this;this.Q.on("join:*",function(t,i){return r.emit("room.join:"+i,i)}),this.Q.on("joining:*",function(t,i){return r.emit("room.joining:"+i,i)}),this.Q.on("leave:*",function(t,i){return r.emit("room.leave:"+i,i)}),this.Q.on("join-error:*",function(t,i,n){return r.emit("room.join-error:"+i.name,i,n)}),this.Q.on("leave-error:*",function(t,i,n){return r.emit("room.leave-error:"+i.name,i,n)});},t.prototype.tt=function(){var r=this;this.V.on("send:*",function(t,i){return r.emit("message:send:"+i.chatType+":"+i.withPeer,i)}),this.V.on("send-failed:*",function(t,i,n){return r.emit("message:"+t,i,n)}),this.V.on("receive:*",function(t,i){return r.emit("message:receive:"+i.chatType+":"+i.withPeer,i)});},t.prototype.it=function(){var n=this;this.r.on("status:*",function(t,i){return n.emit("signaling.status:"+i,i)}),this.r.on("ready",function(){return n.emit("signaling.ready")}),this.r.on("message:*",function(t,i){return n.emit("signaling.receive:"+i.base.msgtype,i)}),this.r.on("send:*",function(t,i){return n.emit("signaling.send:"+i.base.msgtype,i)}),this.r.on("error",function(t){return n.emit("signaling.error",t)});},t.Message=y,t.WildEmitter=i,t}(i)});
	});

	var text = createCommonjsModule(function (module, exports) {
	!function(n,t){module.exports=t(core);}(commonjsGlobal,function(n){n=n&&n.hasOwnProperty("default")?n.default:n;var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t;}||function(n,t){for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i]);};return function(i){function n(n){var t=i.call(this)||this;return t.n="",t.typeId=0,t.typeName="text",void 0!==n&&t.setText(n),t}return function(n,t){function i(){this.constructor=n;}e(n,t),n.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i);}(n,i),n.prototype.setText=function(n){this.n=n.toString(),this.setContent(this.n);},n.prototype.getText=function(){return this.n},n.prototype.initWithContent=function(n){return this.n=n.toString(),Promise.resolve()},n.filterDirty=function(n,t){return void 0===t&&(t="**"),this.t?n.replace(this.t,t):n},n.setDirtyWords=function(n){this.t=n?new RegExp(n.join("|"),"ig"):null;},n.t=null,n}(n.Message)});
	});

	var voice = createCommonjsModule(function (module, exports) {
	!function(t,i){module.exports=i(core);}(commonjsGlobal,function(t){t=t&&t.hasOwnProperty("default")?t.default:t;var n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,i){t.__proto__=i;}||function(t,i){for(var r in i)i.hasOwnProperty(r)&&(t[r]=i[r]);};var r=function(){function t(){var n=this;this.__uploadFn=null,this.__onSetUploadFn=[],this.__getWXTkFn=null,this.__onSetWXTkFn=[],this.__controls={setUploadFunc:function(t){n.__uploadFn=t;for(var i=0,r=n.__onSetUploadFn;i<r.length;i++){(0, r[i])();}n.__onSetUploadFn=[];},setWechatTokenFunc:function(t){n.__getWXTkFn=t;for(var i=0,r=n.__onSetWXTkFn;i<r.length;i++){(0, r[i])();}n.__onSetWXTkFn=[];}};}return t.prototype.getTypeId=function(){return this.typeId},t.prototype.getType=function(){return this.typeName},t.prototype.uploadFile=function(t){var i=this;return this.__uploadFn?this.__uploadFn(t):new Promise(function(t){i.__onSetUploadFn.push(t);}).then(function(){return i.__uploadFn(t)})},t.prototype.requestWechatToken=function(){var i=this;return this.__getWXTkFn?this.__getWXTkFn():new Promise(function(t){i.__onSetWXTkFn.push(t);}).then(function(){return i.__getWXTkFn()})},t}();return function(i){function o(){var t=null!==i&&i.apply(this,arguments)||this;return t.typeId=1,t.typeName="voice",t.t=null,t.i=null,t.r=!1,t.n=0,t}return function(t,i){function r(){this.constructor=t;}n(t,i),t.prototype=null===i?Object.create(i):(r.prototype=i.prototype,new r);}(o,i),o.registerRecorder=function(t){for(var i=0,r=t;i<r.length;i++){var n=r[i],s=new n;s.isEnvSupport()&&(this.s.push(n),this.o.push(s));}},o.isEnvSupport=function(){return !!this.s.length},o.initRecorder=function(){return (new o).initRecord()},o.h=function(){var t=this;if(this.e[0]){var i=this.e[0];this.u.emit("begin-play",i),i.play(),i.on("end-play",function(){t.u.emit("end-play",i),t.e.shift(),t.e[0]&&t.u.emit("next",t.e[0]),t.h();});}else this.u.emit("all-ended");},o.addToAutoPlayQueue=function(t){this.e.push(t),this.u.emit("add",t),1===this.e.length&&this.h();},o.getAutoPlayQueueLength=function(){return this.e.length},o.getCurrentAutoPlayingMessage=function(){return this.e[0]},o.nextAutoPlay=function(){this.e.length&&(this.e[0].stop(),this.e.shift(),this.e[0]&&this.u.emit("next",this.e[0]),this.h());},o.stopAndClearAutoPlayQueue=function(){this.e.length&&(this.e[0].stop(),this.e=[],this.h());},o.bindAutoPlayEvent=function(t,i){this.u.on(""+t,i);},o.unbindAutoPlayEvent=function(t,i){this.u.off(""+t,i);},o.prototype.initWithContent=function(i){var r,t=this;try{r=JSON.parse(i);}catch(t){r=i;}for(var n=0,s=o.s.length;n<s;n++)if(o.o[n].isSupportMsg(r))return this.t=new o.s[n],this.t.__controls.setUploadFunc(this.uploadFile.bind(this)),this.t.__controls.setWechatTokenFunc(this.requestWechatToken.bind(this)),this.t.initWithJsonMsg(r).then(function(){t.t.onPlayEnd(function(){t.emit("end-play");}),t.setContent(i);});return this.i=new Error("Unsupported voice message format."),this.i.name="UnsupportedVoiceFormatError",Promise.reject(this.i)},o.prototype.initRecord=function(){return o.isEnvSupport()?this.isReady()?(this.i=new Error,this.i.name="AlreadyReadyError"):this.isCanceled()&&(this.i=new Error,this.i.name="CanceledError"):(this.i=new Error,this.i.name="DeviceNotSupportedError"),this.i?(this.emit("error:"+this.i.name,this.i),Promise.reject(this.i)):this.t?Promise.resolve():(this.t=new o.s[0],this.t.__controls.setUploadFunc(this.uploadFile.bind(this)),this.t.__controls.setWechatTokenFunc(this.requestWechatToken.bind(this)),this.t.initRecord().catch(function(t){throw"NotSupportedError"===t.name&&(t.name="DeviceNotSupportedError"),t}))},o.prototype.startRecord=function(i){var r=this;return void 0===i&&(i=!1),this.r=!0,this.isCanceled()?(this.i=new Error,this.i.name="CanceledError",i?Promise.resolve():Promise.reject(this.i)):(this.i=null,this.initRecord().then(function(){if(!r.isCanceled())return r.t.onPlayEnd(function(){r.emit("end-play");}),r.t.onRecordEnd(function(){r.setContent(r.t.getJsonMsg()),r.emit("finish-record");}),r.t.startRecord()}).then(function(){if(r.isError()){if(r.t&&r.t.cancelRecord(),i)return;throw r.i}r.n=setTimeout(function(){r.r=!1;},1e3),r.emit("start-record");}).catch(function(t){if(r.i=t,r.emit("error:"+t.name,t),r.cancelRecord(),!i)throw r.i}))},o.prototype.finishRecord=function(i){var r=this;return void 0===i&&(i=!1),this.i||(this.t?this.isCanceled()&&(this.i=new Error,this.i.name="CanceledError"):(this.i=new Error,this.i.name="RecorderNotStartedError")),this.i?(this.emit("error:"+this.i.name),i?Promise.resolve():Promise.reject(this.i)):this.r?(this.t&&this.t.cancelRecord(),this.setCanceled(),this.i=new Error,this.i.name="RecordTooShortError",this.emit("error:"+this.i.name),clearTimeout(this.n),i?Promise.resolve():Promise.reject(this.i)):(this.emit("finishing-record"),this.t.finishRecord().catch(function(t){if(r.setCanceled(),(r.i=t)&&t.name&&r.emit("error:"+t.name),!i)throw t}))},o.prototype.cancelRecord=function(){this.t&&this.t.cancelRecord(),this.setCanceled(),this.emit("cancel-record");},o.prototype.isRecording=function(){return !!this.t&&this.t.isRecording()},o.prototype.isError=function(){return !!this.i},o.prototype.getErrorName=function(){return this.i?this.i.name:""},o.prototype.play=function(){var t=this;this.onReady(function(){t.t.play(),t.emit("play");});},o.prototype.stop=function(){this.isReady()&&this.t&&this.t.isPlaying()&&(this.t.stop(),this.emit("stop"));},o.prototype.isPlaying=function(){return !!this.t&&this.t.isPlaying()},o.prototype.getDuration=function(){return this.t?this.t.getDuration():0},o.s=[],o.o=[],o.Recorder=r,o.e=[],o.u=new t.WildEmitter,o}(t.Message)});
	});

	var wechat = createCommonjsModule(function (module, exports) {
	!function(n,t){module.exports=t(voice);}(commonjsGlobal,function(n){n=n&&n.hasOwnProperty("default")?n.default:n;var r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t;}||function(n,t){for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i]);};return function(t){function o(){var n=null!==t&&t.apply(this,arguments)||this;return n.n="",n.t="",n.i=0,n.o=0,n.r=!1,n.e=!1,n.u=!1,n.s=function(){},n.c=function(){},n.f=function(){},n.typeId=1,n.typeName="wechat",n}return function(n,t){function i(){this.constructor=n;}r(n,t),n.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i);}(o,t),o.h=function(){var o=this;if(this.a)return Promise.resolve();if(this.l)return new Promise(function(n,t){o.m.push(n),o.v.push(t),300<o.m.length&&(o.m.unshift(),o.v.unshift());});var i=this.d;if(!i){var n=new Error;return n.name="WXObjectIsEmptyError",Promise.reject(n)}return this.l=!0,new Promise(function(n){i.ready(function(){n();});}).then(function(){return new Promise(function(s,c){var f=["startRecord","stopRecord","playVoice","pauseVoice","stopVoice","uploadVoice","downloadVoice"];i.checkJsApi({jsApiList:f,success:function(n){if(!n||!n.checkResult)return (t=new Error).name="WXObjectNoConfigError",void c(t);for(var t,i=n.checkResult,o=[],r=0,e=f;r<e.length;r++){var u=e[r];i[u]||o.push(u);}if(o.length)return (t=new Error).name="WXNoPermissionError",void c(t);s();}});})}).then(function(){return new Promise(function(n,t){i.startRecord({success:function(){setTimeout(function(){i.stopRecord({success:function(){},complete:function(){setTimeout(function(){return n()},100);}});},200);},fail:function(){var n=new Error;n.name="NotAllowedError",t(n);}});})}).then(function(){o.a=!0,o.l=!1;for(var n=0,t=o.m;n<t.length;n++){(0, t[n])();}return o.m.splice(0,333),o.v.splice(0,333),o.d.onVoiceRecordEnd({complete:function(n){o.w&&o.p.call(o.w,n);}}),o.d.onVoicePlayEnd({success:function(n){o.P.call(o.y,n);}}),Promise.resolve()}).catch(function(n){for(var t=0,i=o.v;t<i.length;t++){(0, i[t])(n);}throw n})},o.b=function(t,n,i){var o=this;if(this.w){var r=new Error("Recorder is busy.");throw r.name="RecorderBusyError",r}this.y&&this.j(),this.w=n,this.p=i,this.T=!0,this.d.startRecord(Object.assign({},t,{success:function(n){t&&t.success&&t.success(n),setTimeout(function(){o.T=!1;},900);}}));},o.g=function(){var t=this;this.T?setTimeout(function(){return t.g()},500):this.d.stopRecord({success:function(n){t.w&&t.p.call(t.w,n),t.w=null,t.p=function(){};}});},o.O=function(n,t,i){var o=this;if(this.y)return this.j(),void setTimeout(function(){return o.O(n,t,i)},100);this.d.playVoice(n),this.y=t,this.V=n,this.P=i;},o.j=function(){this.d.stopVoice(this.V),this.y&&this.P.call(this.y),this.y=null,this.V={},this.P=function(){};},o.D=function(n){var i=this;return new Promise(function(t){i.d.downloadVoice({serverId:n,isShowProgressTips:0,success:function(n){t(n.localId||"");}});})},o.I=function(n){var i=this;return new Promise(function(t){i.d.uploadVoice({localId:n,isShowProgressTips:0,success:function(n){t(n.serverId);}});})},o.setWXObject=function(n){this.d=n;},o.isWechat=function(){return !!navigator.userAgent.toLowerCase().match(/micromessenger/i)},o.prototype.isEnvSupport=function(){return o.isWechat()},o.prototype.isSupportMsg=function(n){return "object"==typeof n&&"string"==typeof n.mediaid&&0<n.mediaid.length},o.prototype.initRecord=function(){return o.h().then(function(){})},o.prototype.startRecord=function(){var i=this;return this.o=+new Date,new Promise(function(n,t){o.b({success:function(){i.o=+new Date,n();}},i,i.R),i.r=!0,i.u=!1;})},o.prototype.finishRecord=function(){var i=this;return new Promise(function(n,t){i.c=n,o.g(),i.i=(+new Date-i.o)/1e3;})},o.prototype.cancelRecord=function(){this.u=!0,o.g();},o.prototype.isRecording=function(){return this.r},o.prototype.onRecordEnd=function(n){this.s=n;},o.prototype.getJsonMsg=function(){return {voicetime:this.getDuration().toFixed(2),mediaid:this.t,recordmode:this.getTypeId()}},o.prototype.initWithJsonMsg=function(n){var t=this;return this.i=n.voicetime,this.t=n.mediaid,o.h().then(function(){return o.D(t.t)}).then(function(n){t.n=n;})},o.prototype.play=function(){o.O({localId:this.n},this,this._),this.e=!0,o.y=this;},o.prototype.stop=function(){o.j(),this.e=!1,o.y=null;},o.prototype.isPlaying=function(){return this.e},o.prototype.onPlayEnd=function(n){this.f=n;},o.prototype.getDuration=function(){return this.i},o.prototype._=function(){this.e=!1,this.f();},o.prototype.R=function(n){var t=this,i=n.localId;this.u||(this.i=this.i<.1?(+new Date-this.o)/1e3:this.i,o.I(i).then(function(n){t.n=i,t.t=n,t.c(),t.s(),t.c=function(){},t.r=!1;}));},o.d=null,o.a=!1,o.l=!1,o.T=!1,o.m=[],o.v=[],o.w=null,o.y=null,o.V={},o}(n.Recorder)});
	});

	/**
	 * @fileOverview 语音配置（微信）
	 * @author benz@youme.im
	 * @date 2018/8/29
	 *
	 * 每位工程师都有保持代码优雅的义务
	 * each engineer has a duty to keep the code elegant
	 */
	function isWechat() {
	    return wechat.isWechat();
	}
	function initVoice() {
	    voice.registerRecorder([wechat]);
	    if (wx) {
	        wechat.setWXObject(wx);
	    }
	}

	/**
	 * @fileOverview 兼容旧版本 H5 IM 接口的外壳
	 * @author benz@youme.im
	 * @date 2018/8/23
	 *
	 * 每位工程师都有保持代码优雅的义务
	 * each engineer has a duty to keep the code elegant
	 */
	var yim;
	(function (yim) {
	    /**
	     * 是否开启sdk调用日志
	     */
	    yim.debug = false;
	    /**
	     * 是否在微信内运行
	     */
	    function isWeixin() {
	        return isWechat();
	    }
	    yim.isWeixin = isWeixin;
	    /**
	     * 初始化类接口
	     */
	    var getInstance = /** @class */ (function () {
	        /**
	         * 初始化接口
	         * @param dirtyWordsArray 脏字过滤数组，如['色情', '赌博']
	         * @param appKey 用户游戏产品区别于其它游戏产品的标识，可以在游密官网获取
	         * @param eventCallback 相关事件回调接口对象，如：{onLogin:_loginCallback, onLogout:_logoutCallback}
	         */
	        function getInstance(dirtyWordsArray, appKey, eventCallback) {
	            var _this = this;
	            this._curRecVoiceMsg = null;
	            this._curPlayVoiceMsg = null;
	            this._autoPlayContentList = [];
	            this.socketio = new core.WildEmitter();
	            initVoice();
	            // 设置脏字过滤
	            text.setDirtyWords(dirtyWordsArray);
	            // 建立对象
	            this.newInstance = new core({
	                appKey: appKey,
	                useMessageType: [text, voice]
	            });
	            // 绑定各个事件
	            this._eventCallbacks = eventCallback;
	            this.newInstance.on('account.login', function () {
	                if (eventCallback.onLogin) {
	                    eventCallback.onLogin(0, {
	                        code: 0,
	                        message: 'ok',
	                        data: {
	                            userid: _this.newInstance.getMyUserId()
	                        }
	                    });
	                }
	            });
	            this.newInstance.on('account.logout', function () {
	                if (eventCallback.onLogout) {
	                    eventCallback.onLogout(0, {
	                        code: 0,
	                        message: 'ok',
	                        data: {
	                            userid: _this.newInstance.getMyUserId()
	                        }
	                    });
	                }
	            });
	            this.newInstance.on('account.kickoff', function () {
	                if (eventCallback.onKickOff) {
	                    eventCallback.onKickOff();
	                }
	            });
	            this.newInstance.on('account.error:UsernameOrTokenError', function () {
	                if (eventCallback.onLogin) {
	                    eventCallback.onLogin(YIMErrorcode.YIMErrorcode_USERNAME_TOKEN_ERROR, {
	                        code: YIMErrorcode.YIMErrorcode_USERNAME_TOKEN_ERROR,
	                        message: '用户名或token错误',
	                        data: {
	                            userid: _this.newInstance.getMyUserId()
	                        }
	                    });
	                }
	            });
	            this.newInstance.on('room.join:*', function (eventFullName, roomId) {
	                if (eventCallback.onJoinChatRoom) {
	                    eventCallback.onJoinChatRoom(0, {
	                        code: 0,
	                        message: 'ok',
	                        data: {
	                            roomid: roomId
	                        }
	                    });
	                }
	            });
	            this.newInstance.on('room.leave:*', function (eventFullName, roomId) {
	                if (eventCallback.onLeaveChatRoom) {
	                    eventCallback.onLeaveChatRoom(0, {
	                        code: 0,
	                        message: 'ok',
	                        data: {
	                            roomid: roomId
	                        }
	                    });
	                }
	            });
	            this.newInstance.on('message:send:*', function (eventFullName, msgObj) {
	                if (eventCallback.onSendMessageStatus) {
	                    eventCallback.onSendMessageStatus(0, {
	                        code: 0,
	                        message: 'ok',
	                        data: {
	                            msgid: parseInt(msgObj.serial || '0')
	                        }
	                    });
	                }
	            });
	            this.newInstance.on('message:send-failed:MessageTooLongError:*', function ( /*eventFullName: string, msgInstance: Message*/) {
	                if (eventCallback.onSendMessageStatus) {
	                    eventCallback.onSendMessageStatus(20007, {
	                        code: 20007,
	                        message: 'Message too long.',
	                        data: {
	                            msgid: 0
	                        }
	                    });
	                }
	            });
	            this.newInstance.on('message:send-failed:NotLoginError:*', function ( /*eventFullName: string, msgInstance: Message*/) {
	                if (eventCallback.onSendMessageStatus) {
	                    eventCallback.onSendMessageStatus(20001, {
	                        code: 20001,
	                        message: 'Not login.',
	                        data: {
	                            msgid: 0
	                        }
	                    });
	                }
	            });
	            this.newInstance.on('message:receive:*', function (eventFullName, msgObj) {
	                if (eventCallback.onRecvMessage) {
	                    eventCallback.onRecvMessage({
	                        msgType: msgObj.message.getTypeId(),
	                        senderid: msgObj.serverId,
	                        recvid: msgObj.receiverId,
	                        messageid: msgObj.serial || '0',
	                        createtime: Math.round(msgObj.time.getTime() / 1000),
	                        chattype: msgObj.chatType === 'user' ? 1 : 2,
	                        content: msgObj.message.getContent(),
	                        final: false,
	                        history: false
	                    });
	                }
	            });
	            this.newInstance.on('signaling.ready', function () {
	                _this.socketio.emit('connect');
	            });
	            this.newInstance.on('signaling.error', function (err) {
	                _this.socketio.emit('error', err);
	                _this.socketio.emit('connect_error', err);
	            });
	            this.newInstance.on('signaling.send:*', function (eventName, msg) {
	                _this.socketio.emit('send', 'yim', JSON.stringify(msg), msg);
	            });
	            this.newInstance.on('signaling.receive:*', function (eventName, msg) {
	                _this.socketio.emit('message', { target: _this.newInstance, data: msg });
	                _this.socketio.emit('yim', msg);
	            });
	            this.newInstance.on('signaling.status:ended', function () {
	                _this.socketio.emit('close', { target: _this.newInstance });
	                _this.socketio.emit('disconnect', { target: _this.newInstance });
	            });
	            this.newInstance.on('*', function (eventName) {
	                if (yim.debug) {
	                    console.log('[yim] ' + eventName, arguments);
	                }
	            });
	        }
	        /**
	         * 初始化完成的回调
	         * @param callBack
	         */
	        getInstance.prototype.ready = function (callBack) {
	            this.newInstance.on('signaling.ready', callBack);
	        };
	        /**
	         * 登录
	         * @param userId 用户名，调用者分配，不可为空字符串，只可由字母或数字或下划线组成
	         * @param token 从服务端获取到的token
	         */
	        getInstance.prototype.login = function (userId, token) {
	            this.newInstance.login(userId, token).catch();
	        };
	        /**
	         * 登出，操作结果会通过回调接口返回:onLogout
	         */
	        getInstance.prototype.logout = function () {
	            this.newInstance.logout();
	        };
	        /**
	         * 加入聊天室进行群组聊天，操作结果会通过回调接口返回:onJoinChatRoom
	         * @param roomId 频道编号
	         */
	        getInstance.prototype.joinRoom = function (roomId) {
	            this.newInstance.joinRoom(roomId).catch();
	        };
	        /**
	         * 退出聊天室，操作结果会通过回调接口返回:onLeaveChatRoom
	         * @param roomId 频道编号
	         */
	        getInstance.prototype.leaveRoom = function (roomId) {
	            this.newInstance.leaveRoom(roomId).catch();
	        };
	        /**
	         * 发送文本消息
	         * @param receiveUid 接受者编号（用户编号或者频道编号）
	         * @param chatType 聊天类型，群聊或者私聊，1为私聊，2为群聊
	         * @param content 聊天内容，可以用json格式来扩展消息内容
	         */
	        getInstance.prototype.sendTextMessage = function (receiveUid, chatType, content) {
	            var msg = new text(content);
	            if (chatType === 2) {
	                this.newInstance.sendToRoom(receiveUid, msg).catch();
	            }
	            else {
	                this.newInstance.sendToUser(receiveUid, msg).catch();
	            }
	        };
	        /**
	         * 初始化音频设备，这里的 options 选项已经全部作废
	         * @param options
	         * @param callback
	         */
	        getInstance.prototype.initAudioMedia = function (options, callback) {
	            var type = isWechat() ? 'weixin' : 'webrtc';
	            if (voice.isEnvSupport()) {
	                voice.initRecorder().then(function () { return callback({
	                    type: type,
	                    support: true
	                }); }).catch(function () { return callback({
	                    type: type,
	                    support: false
	                }); });
	            }
	            else {
	                callback({
	                    type: type,
	                    support: false
	                });
	            }
	        };
	        /**
	         * 检查当前环境是否支持录音，建议调用startAudioMessage 前先检查
	         */
	        getInstance.prototype.getSupportAudioMessage = function () {
	            return voice.isEnvSupport();
	        };
	        /**
	         * 开始录音
	         * @param receiveUid 接受者编号（用户编号或者频道编号）
	         * @param chatType 聊天类型，群聊或者私聊，1为私聊，2为群聊
	         * @param callBack 回调
	         */
	        getInstance.prototype.startAudioMessage = function (receiveUid, chatType, callBack) {
	            var _this = this;
	            if (this._curRecVoiceMsg && !this._curRecVoiceMsg.isReady() && !this._curRecVoiceMsg.isCanceled()) {
	                this.cancelAudioMessage();
	            }
	            this._curRecVoiceMsg = new voice();
	            this._curRecVoiceMsg.startRecord()
	                .then(function () { return callBack(0, {
	                errCode: 0,
	                errMsg: 'ok'
	            }); })
	                .catch(function (e) {
	                switch (e.name) {
	                    case 'DeviceNotSupportedError':
	                        callBack(YIMErrorcode.YIMErrorcode_Fail, {
	                            errCode: YIMAudioCode.WEBRTC_ERROR,
	                            errMsg: '当前浏览器不支持录音'
	                        });
	                        break;
	                    case 'NotAllowedError':
	                        callBack(YIMErrorcode.YIMErrorcode_Fail, {
	                            errCode: YIMAudioCode.WEBRTC_ERROR,
	                            errMsg: '没有录音权限'
	                        });
	                        break;
	                    case 'RecorderNotStartedError':
	                        callBack(YIMErrorcode.YIMErrorcode_Fail, {
	                            errCode: YIMAudioCode.INVALID_INVOKE,
	                            errMsg: '无效的调用'
	                        });
	                        break;
	                    case 'RecorderBusyError':
	                        callBack(YIMErrorcode.YIMErrorcode_Fail, {
	                            errCode: YIMAudioCode.DUPLICATE_INVOKE,
	                            errMsg: '录音系统繁忙'
	                        });
	                        break;
	                    case 'RecordTooShortError':
	                        callBack(YIMErrorcode.YIMErrorcode_Fail, {
	                            errCode: YIMAudioCode.VOICE_TOOSHORT,
	                            errMsg: '语音时长过短，请重新发送'
	                        });
	                        break;
	                }
	            });
	            var then = function (msg) {
	                if (!msg) {
	                    return;
	                }
	                if (_this._eventCallbacks.onVoiceMsgSend) {
	                    var voiceURL = _this._curRecVoiceMsg.getContent();
	                    var voiceID = voiceURL;
	                    try {
	                        var content = JSON.parse(voiceURL);
	                        voiceURL = content['downloadurl'];
	                        voiceID = content['mediaid'];
	                    }
	                    catch (e) { }
	                    _this._eventCallbacks.onVoiceMsgSend(0, {
	                        msgID: msg.serial || '0',
	                        voiceTime: _this._curRecVoiceMsg.getDuration(),
	                        voiceURL: voiceURL,
	                        voiceServerID: voiceID
	                    });
	                }
	            };
	            if (chatType === 2) {
	                this.newInstance.sendToRoom(receiveUid, this._curRecVoiceMsg).then(then).catch();
	            }
	            else {
	                this.newInstance.sendToUser(receiveUid, this._curRecVoiceMsg).then(then).catch();
	            }
	        };
	        /**
	         * 取消录音
	         */
	        getInstance.prototype.cancelAudioMessage = function () {
	            if (this._curRecVoiceMsg) {
	                this._curRecVoiceMsg.cancelRecord();
	            }
	        };
	        /**
	         * 停止录音并发送出去，当停止调用距开始调用不足一秒时会延迟1秒停止，操作结果会通过回调接口返回:onVoiceMsgSend
	         * @param callBack 回调
	         */
	        getInstance.prototype.stopAudioMessage = function (callBack) {
	            if (!this._curRecVoiceMsg) {
	                callBack(YIMErrorcode.YIMErrorcode_Fail, {
	                    errCode: YIMAudioCode.INVALID_INVOKE,
	                    errMsg: '无效的调用'
	                });
	                return;
	            }
	            this._curRecVoiceMsg.finishRecord()
	                .then(function () { return callBack(0, {
	                errCode: 0,
	                errMsg: 'ok'
	            }); })
	                .catch(function (e) {
	                switch (e.name) {
	                    case 'DeviceNotSupportedError':
	                        callBack(YIMErrorcode.YIMErrorcode_Fail, {
	                            errCode: YIMAudioCode.WEBRTC_ERROR,
	                            errMsg: '当前浏览器不支持录音'
	                        });
	                        break;
	                    case 'NotAllowedError':
	                        callBack(YIMErrorcode.YIMErrorcode_Fail, {
	                            errCode: YIMAudioCode.WEBRTC_ERROR,
	                            errMsg: '没有录音权限'
	                        });
	                        break;
	                    case 'RecorderNotStartedError':
	                        callBack(YIMErrorcode.YIMErrorcode_Fail, {
	                            errCode: YIMAudioCode.INVALID_INVOKE,
	                            errMsg: '无效的调用'
	                        });
	                        break;
	                    case 'RecorderBusyError':
	                        callBack(YIMErrorcode.YIMErrorcode_Fail, {
	                            errCode: YIMAudioCode.DUPLICATE_INVOKE,
	                            errMsg: '录音系统繁忙'
	                        });
	                        break;
	                    case 'RecordTooShortError':
	                        callBack(YIMErrorcode.YIMErrorcode_Fail, {
	                            errCode: YIMAudioCode.VOICE_TOOSHORT,
	                            errMsg: '语音时长过短，请重新发送'
	                        });
	                        break;
	                }
	            });
	        };
	        /**
	         * 播放指定地址的语音
	         * @param voiceIdOrUrl 语音地址
	         * @param callBack 回调
	         */
	        getInstance.prototype.playAudioMessage = function (voiceIdOrUrl, callBack) {
	            var _this = this;
	            if (this._curPlayVoiceMsg && this._curPlayVoiceMsg.isPlaying()) {
	                this._curPlayVoiceMsg.stop();
	            }
	            var isVoiceUrl = voiceIdOrUrl.substr(0, 2) === '//'
	                || voiceIdOrUrl.substr(0, 7) === 'http://'
	                || voiceIdOrUrl.substr(0, 7) === 'https:/';
	            var content = isVoiceUrl ? { 'downloadurl': voiceIdOrUrl } : { 'mediaid': voiceIdOrUrl };
	            this._curPlayVoiceMsg = new voice();
	            this._curPlayVoiceMsg.initWithContent(JSON.stringify(content)).then(function () {
	                _this._curPlayVoiceMsg.play();
	                _this._curPlayVoiceMsg.once('end-play', function () {
	                    callBack(0, { errCode: 0, errMsg: 'ok' });
	                });
	            });
	        };
	        /**
	         * 停止正在播放的语音信息
	         * @param voiceIdOrUrl 语音地址
	         * @param callBack 回调
	         */
	        getInstance.prototype.stopPlayAudioMessage = function (voiceIdOrUrl, callBack) {
	            if (this._curPlayVoiceMsg && this._curPlayVoiceMsg.isPlaying()) {
	                this._curPlayVoiceMsg.stop();
	                callBack(0, { errCode: 0, errMsg: 'ok' });
	            }
	        };
	        /**
	         * 初始化语音自动播放队列
	         * @param eventCallback 相关事件回调接口对象
	         */
	        getInstance.prototype.initAutoPlayVoiceQueue = function (eventCallback) {
	            var _this = this;
	            voice.bindAutoPlayEvent('next', function () {
	                _this._autoPlayContentList.unshift();
	            });
	            voice.bindAutoPlayEvent('begin-play', function () {
	                eventCallback.beginPlay(_this._autoPlayContentList[0]);
	            });
	            voice.bindAutoPlayEvent('end-play', function () {
	                eventCallback.endPlay(_this._autoPlayContentList[0]);
	            });
	        };
	        /**
	         * 添加到自动播放列表
	         * @param message 语音消息数据
	         */
	        getInstance.prototype.addToAutoPlayVoiceQueue = function (message) {
	            var _this = this;
	            if (typeof message === 'object' && message['content']) {
	                var m_1 = new voice();
	                m_1.initWithContent(message['content']).then(function () {
	                    _this._autoPlayContentList.push(message);
	                    voice.addToAutoPlayQueue(m_1);
	                }).catch();
	            }
	        };
	        getInstance.prototype.getHistoryMessage = function (userOrRoomId, minMsgId, maxMsgId, day) {
	            var _this = this;
	            this.newInstance.requestHistoryMessage(userOrRoomId, minMsgId, maxMsgId, day).then(function (list) {
	                list.forEach(function (msg) {
	                    _this.newInstance.emit("message:receive:" + msg.chatType + ":" + msg.withPeer, msg);
	                });
	            });
	        };
	        getInstance.prototype.keywordsFilter = function (text$$1) {
	            return text.filterDirty(text$$1);
	        };
	        return getInstance;
	    }());
	    yim.getInstance = getInstance;
	    /**
	     * 错误码定义
	     */
	    var YIMErrorcode;
	    (function (YIMErrorcode) {
	        /**
	         * 成功
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_Success"] = 0] = "YIMErrorcode_Success";
	        /**
	         * IM SDK未初始化
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_EngineNotInit"] = 1] = "YIMErrorcode_EngineNotInit";
	        /**
	         * IM SDK未登录
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_NotLogin"] = 2] = "YIMErrorcode_NotLogin";
	        /**
	         * 无效的参数
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_ParamInvalid"] = 3] = "YIMErrorcode_ParamInvalid";
	        /**
	         * 超时
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_TimeOut"] = 4] = "YIMErrorcode_TimeOut";
	        /**
	         * 状态错误
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_StatusError"] = 5] = "YIMErrorcode_StatusError";
	        /**
	         * Appkey无效
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_SDKInvalid"] = 6] = "YIMErrorcode_SDKInvalid";
	        /**
	         * 已经登录
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_AlreadyLogin"] = 7] = "YIMErrorcode_AlreadyLogin";
	        /**
	         * 登录无效
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_LoginInvalid"] = 8] = "YIMErrorcode_LoginInvalid";
	        /**
	         * 服务器错误
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_ServerError"] = 9] = "YIMErrorcode_ServerError";
	        /**
	         * 网络错误
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_NetError"] = 10] = "YIMErrorcode_NetError";
	        /**
	         * 登录状态出错
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_LoginSessionError"] = 11] = "YIMErrorcode_LoginSessionError";
	        /**
	         * SDK未启动
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_NotStartUp"] = 12] = "YIMErrorcode_NotStartUp";
	        /**
	         * 文件不存在
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_FileNotExist"] = 13] = "YIMErrorcode_FileNotExist";
	        /**
	         * 文件发送出错
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_SendFileError"] = 14] = "YIMErrorcode_SendFileError";
	        /**
	         * 文件上传失败
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_UploadFailed"] = 15] = "YIMErrorcode_UploadFailed";
	        /**
	         * 用户名密码错误
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_UsernamePasswordError"] = 16] = "YIMErrorcode_UsernamePasswordError";
	        /**
	         * 用户状态为无效用户
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_UserStatusError"] = 17] = "YIMErrorcode_UserStatusError";
	        /**
	         * 消息太长
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_MessageTooLong"] = 18] = "YIMErrorcode_MessageTooLong";
	        /**
	         * 接收方ID过长（检查频道名）
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_ReceiverTooLong"] = 19] = "YIMErrorcode_ReceiverTooLong";
	        /**
	         * 无效聊天类型
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_InvalidChatType"] = 20] = "YIMErrorcode_InvalidChatType";
	        /**
	         * 无效用户ID
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_InvalidReceiver"] = 21] = "YIMErrorcode_InvalidReceiver";
	        /**
	         * 未知错误
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_UnknowError"] = 22] = "YIMErrorcode_UnknowError";
	        /**
	         * AppKey无效
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_InvalidAppkey"] = 23] = "YIMErrorcode_InvalidAppkey";
	        /**
	         * 被禁止发言
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_ForbiddenSpeak"] = 24] = "YIMErrorcode_ForbiddenSpeak";
	        /**
	         * 创建文件失败
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_CreateFileFailed"] = 25] = "YIMErrorcode_CreateFileFailed";
	        /**
	         * 支持的文件格式
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_UnsupportFormat"] = 26] = "YIMErrorcode_UnsupportFormat";
	        /**
	         * 接收方为空
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_ReceiverEmpty"] = 27] = "YIMErrorcode_ReceiverEmpty";
	        /**
	         * 房间名太长
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_RoomIDTooLong"] = 28] = "YIMErrorcode_RoomIDTooLong";
	        /**
	         * 聊天内容严重非法
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_ContentInvalid"] = 29] = "YIMErrorcode_ContentInvalid";
	        /**
	         * 未打开定位权限
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_NoLocationAuthrize"] = 30] = "YIMErrorcode_NoLocationAuthrize";
	        /**
	         * 未知位置
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_UnknowLocation"] = 31] = "YIMErrorcode_UnknowLocation";
	        /**
	         * 不支持该接口
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_Unsupport"] = 32] = "YIMErrorcode_Unsupport";
	        /**
	         * 无音频设备
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_NoAudioDevice"] = 33] = "YIMErrorcode_NoAudioDevice";
	        /**
	         * 音频驱动问题
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_AudioDriver"] = 34] = "YIMErrorcode_AudioDriver";
	        /**
	         * 设备状态错误
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_DeviceStatusInvalid"] = 35] = "YIMErrorcode_DeviceStatusInvalid";
	        /**
	         * 文件解析错误
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_ResolveFileError"] = 36] = "YIMErrorcode_ResolveFileError";
	        /**
	         * 文件读写错误
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_ReadWriteFileError"] = 37] = "YIMErrorcode_ReadWriteFileError";
	        /**
	         * 语言编码错误
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_NoLangCode"] = 38] = "YIMErrorcode_NoLangCode";
	        /**
	         * 翻译接口不可用
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_TranslateUnable"] = 39] = "YIMErrorcode_TranslateUnable";
	        /**
	         * 开始录音
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_Start"] = 40] = "YIMErrorcode_PTT_Start";
	        /**
	         * 录音失败
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_Fail"] = 41] = "YIMErrorcode_PTT_Fail";
	        /**
	         * 语音消息文件下载失败
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_DownloadFail"] = 42] = "YIMErrorcode_PTT_DownloadFail";
	        /**
	         * 获取语音消息Token失败
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_GetUploadTokenFail"] = 43] = "YIMErrorcode_PTT_GetUploadTokenFail";
	        /**
	         * 语音消息文件上传失败
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_UploadFail"] = 44] = "YIMErrorcode_PTT_UploadFail";
	        /**
	         * 没有录音内容
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_NotSpeech"] = 45] = "YIMErrorcode_PTT_NotSpeech";
	        /**
	         * 语音设备状态错误
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_DeviceStatusError"] = 46] = "YIMErrorcode_PTT_DeviceStatusError";
	        /**
	         * 录音中
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_IsSpeeching"] = 47] = "YIMErrorcode_PTT_IsSpeeching";
	        /**
	         * 文件不存在
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_FileNotExist"] = 48] = "YIMErrorcode_PTT_FileNotExist";
	        /**
	         * 达到最大时长限制
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_ReachMaxDuration"] = 49] = "YIMErrorcode_PTT_ReachMaxDuration";
	        /**
	         * 录音时间太短
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_SpeechTooShort"] = 50] = "YIMErrorcode_PTT_SpeechTooShort";
	        /**
	         * 启动录音失败
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_StartAudioRecordFailed"] = 51] = "YIMErrorcode_PTT_StartAudioRecordFailed";
	        /**
	         * 音频输入超时
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_SpeechTimeout"] = 52] = "YIMErrorcode_PTT_SpeechTimeout";
	        /**
	         * 在播放
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_IsPlaying"] = 53] = "YIMErrorcode_PTT_IsPlaying";
	        /**
	         * 未开始播放
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_NotStartPlay"] = 54] = "YIMErrorcode_PTT_NotStartPlay";
	        /**
	         * 主动取消播放
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_CancelPlay"] = 55] = "YIMErrorcode_PTT_CancelPlay";
	        /**
	         * 未开始语音
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_PTT_NotStartRecord"] = 56] = "YIMErrorcode_PTT_NotStartRecord";
	        /**
	         * 语音服务启动失败
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_Fail"] = 57] = "YIMErrorcode_Fail";
	        /**
	         * 未登录
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_NOTLOGIN"] = 58] = "YIMErrorcode_NOTLOGIN";
	        /**
	         * 参数设置无效
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_INVALID_PARAM"] = 59] = "YIMErrorcode_INVALID_PARAM";
	        /**
	         * 登录失败
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_INVALID_LOGIN"] = 60] = "YIMErrorcode_INVALID_LOGIN";
	        /**
	         * 用户名、token无效
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_USERNAME_TOKEN_ERROR"] = 61] = "YIMErrorcode_USERNAME_TOKEN_ERROR";
	        /**
	         * 登录超时
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_LOGIN_TIMEOUT"] = 62] = "YIMErrorcode_LOGIN_TIMEOUT";
	        /**
	         * 服务器超载
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_SERVICE_OVERLOAD"] = 63] = "YIMErrorcode_SERVICE_OVERLOAD";
	        /**
	         * 发送消息内容超长
	         */
	        YIMErrorcode[YIMErrorcode["YIMErrorcode_MSG_TOO_LONG"] = 64] = "YIMErrorcode_MSG_TOO_LONG";
	    })(YIMErrorcode = yim.YIMErrorcode || (yim.YIMErrorcode = {}));
	    /**
	     * 消息类型
	     */
	    var MessageBodyType;
	    (function (MessageBodyType) {
	        /**
	         * 文本
	         */
	        MessageBodyType[MessageBodyType["MessageBodyType_Text"] = 0] = "MessageBodyType_Text";
	        /**
	         * 语音
	         */
	        MessageBodyType[MessageBodyType["MessageBodyType_Voice"] = 1] = "MessageBodyType_Voice";
	        /**
	         * 微信语音
	         */
	        MessageBodyType[MessageBodyType["WEIXIN"] = 2] = "WEIXIN";
	    })(MessageBodyType = yim.MessageBodyType || (yim.MessageBodyType = {}));
	    /**
	     * 语音接口错误码
	     */
	    var YIMAudioCode;
	    (function (YIMAudioCode) {
	        /**
	         * 接口调用太快，请稍后重试
	         */
	        YIMAudioCode[YIMAudioCode["INVOKE_TOOFAST"] = 9001] = "INVOKE_TOOFAST";
	        /**
	         * 上次调用为结束，请等待
	         */
	        YIMAudioCode[YIMAudioCode["WAITFOR_LASTINVOKE"] = 9002] = "WAITFOR_LASTINVOKE";
	        /**
	         * 无效的调用
	         */
	        YIMAudioCode[YIMAudioCode["INVALID_INVOKE"] = 9003] = "INVALID_INVOKE";
	        /**
	         * 重复调用
	         */
	        YIMAudioCode[YIMAudioCode["DUPLICATE_INVOKE"] = 9004] = "DUPLICATE_INVOKE";
	        /**
	         * 调用响应超时
	         */
	        YIMAudioCode[YIMAudioCode["INVOKE_OUTTIME"] = 9005] = "INVOKE_OUTTIME";
	        /**
	         * 语音消息太短，不足1秒
	         */
	        YIMAudioCode[YIMAudioCode["VOICE_TOOSHORT"] = 9006] = "VOICE_TOOSHORT";
	        /**
	         * 当前环境不支持录音
	         */
	        YIMAudioCode[YIMAudioCode["WEBRTC_ERROR"] = 9089] = "WEBRTC_ERROR";
	        /**
	         * mediaID invalid
	         */
	        YIMAudioCode[YIMAudioCode["INVOKE_ERROR"] = 9090] = "INVOKE_ERROR";
	    })(YIMAudioCode = yim.YIMAudioCode || (yim.YIMAudioCode = {}));
	    var MessageVoiceType;
	    (function (MessageVoiceType) {
	        MessageVoiceType[MessageVoiceType["WEIXIN"] = 1] = "WEIXIN";
	        MessageVoiceType[MessageVoiceType["WEBRTC"] = 2] = "WEBRTC";
	    })(MessageVoiceType = yim.MessageVoiceType || (yim.MessageVoiceType = {}));
	})(yim || (yim = {}));
	var yim$1 = yim;

	return yim$1;

})));
//# sourceMappingURL=yim.wechat.js.map
