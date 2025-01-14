import EventEmitter from './EventEmitter.js'

let instance = null
var _this;

export default class Device extends EventEmitter
{
    constructor() {
        super()

        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        _this = this;
        
        // Global access
        // window.Device = this

        // Setup
        this.agent = navigator.userAgent.toLowerCase();
        this.touchCapable = !!navigator.maxTouchPoints;
        this.pixelRatio = window.devicePixelRatio;
        this.initSystemProperties();
        this.initMobileProperties();
        this.initMediaProperties();
        this.initGraphicsProperties();
        this.initStyleProperties();
        this.social = (function() {
            if (_this.agent.includes('instagram')) return 'instagram';
            if (_this.agent.includes('fban')) return 'facebook';
            if (_this.agent.includes('fbav')) return 'facebook';
            if (_this.agent.includes('fbios')) return 'facebook';
            if (_this.agent.includes('twitter')) return 'twitter';
            if (document.referrer && document.referrer.includes('//t.co/')) return 'twitter';
            return false;
        })();


        // Example setup, replace their content as needed
        this.addHandlers();
    }

    initSystemProperties() {
        this.system = {};
        this.system.retina = window.devicePixelRatio > 1;
        this.system.webworker = typeof window.Worker !== 'undefined';
        if (!window._NODE_) this.system.geolocation = typeof navigator.geolocation !== 'undefined';
        if (!window._NODE_) this.system.pushstate = typeof window.history.pushState !== 'undefined';
        this.system.webcam = !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices);
        this.system.language = window.navigator.userLanguage || window.navigator.language;
        this.system.webaudio = typeof window.AudioContext !== 'undefined';

        this.system.xr = {};
        this.system.detectXR = async function() {
            if (window.AURA) {
                _this.system.xr.vr = true;
                _this.system.xr.ar = true;
                return;
            }
    
            if (!navigator.xr) {
                _this.system.xr.vr = false;
                _this.system.xr.ar = false;
                return;
            }
    
            try {
                [_this.system.xr.vr, _this.system.xr.ar] = await Promise.all([
                    navigator.xr.isSessionSupported('immersive-vr'),
                    navigator.xr.isSessionSupported('immersive-ar')
                ]);
            } catch(e) { }
    
            if (_this.system.os == 'android') {
                if (!_this.detect('oculus')) {
                    _this.system.xr.vr = false;
                }
            }
        };

        try {
            this.system.localStorage = typeof window.localStorage !== 'undefined';
        } catch (e) {
            this.system.localStorage = false;
        }

        this.system.fullscreen = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;

        this.system.os = (function() {
            if (_this.detect(['ipad', 'iphone', 'ios']) || _this.detectIpad()) return 'ios';
            if (_this.detect(['android', 'kindle'])) return 'android';
            if (_this.detect(['blackberry'])) return 'blackberry';
            if (_this.detect(['mac os'])) return 'mac';
            if (_this.detect(['windows', 'iemobile'])) return 'windows';
            if (_this.detect(['linux'])) return 'linux';
            return 'unknown';
        })();

        this.system.version = (function() {
            try {
                if (_this.system.os == 'ios') {
                    if (_this.agent.includes('intel mac')) {
                        let num = _this.agent.split('version/')[1].split(' ')[0];
                        let split = num.split('.');
                        return Number(split[0] + '.' + split[1]);
                    } else {
                        var num = _this.agent.split('os ')[1].split('_');
                        var main = num[0];
                        var sub = num[1].split(' ')[0];
                        return Number(main + '.' + sub);
                    }
                }
                if (_this.system.os == 'android') {
                    var version = _this.agent.split('android ')[1].split(';')[0];
                    if (version.length > 3) version = version.slice(0, -2);
                    if (version.charAt(version.length-1) == '.') version = version.slice(0, -1);
                    return Number(version);
                }
                if (_this.system.os == 'windows') {
                    if (_this.agent.includes('rv:11')) return 11;
                    return Number(_this.agent.split('windows phone ')[1].split(';')[0]);
                }
            } catch(e) {}
            return -1;
        })();

        this.system.browser = (function() {
            if (_this.system.os == 'ios') {
                if (_this.detect(['twitter', 'fbios', 'instagram'])) return 'social';
                if (_this.detect(['crios'])) return 'chrome';
                if (_this.detect(['fxios'])) return 'firefox';
                if (_this.detect(['safari'])) return 'safari';
                return 'unknown';
            }
            if (_this.system.os == 'android') {
                if (_this.detect(['twitter', 'fb', 'facebook', 'instagram'])) return 'social';
                if (_this.detect(['chrome'])) return 'chrome';
                if (_this.detect(['firefox'])) return 'firefox';
                return 'browser';
            }
            if (_this.detect(['msie'])) return 'ie';
            if (_this.detect(['trident']) && _this.detect(['rv:'])) return 'ie';
            if (_this.detect(['windows']) && _this.detect(['edge'])) return 'ie';
            if (_this.detect(['chrome'])) return 'chrome';
            if (_this.detect(['safari'])) return 'safari';
            if (_this.detect(['firefox'])) return 'firefox';
    
            // TODO: test windows phone and see what it returns
            //if (_this.os == 'Windows') return 'ie';
            return 'unknown';
        })();

        this.system.browserVersion = (function() {
            try {
                if (_this.system.browser == 'chrome') {
                    if (_this.detect('crios')) return Number(_this.agent.split('crios/')[1].split('.')[0]);
                    return Number(_this.agent.split('chrome/')[1].split('.')[0]);
                }
                if (_this.system.browser == 'firefox') return Number(_this.agent.split('firefox/')[1].split('.')[0]);
                if (_this.system.browser == 'safari') return Number(_this.agent.split('version/')[1].split('.')[0].split('.')[0]);
                if (_this.system.browser == 'ie') {
                    if (_this.detect(['msie'])) return Number(_this.agent.split('msie ')[1].split('.')[0]);
                    if (_this.detect(['rv:'])) return Number(_this.agent.split('rv:')[1].split('.')[0]);
                    return Number(_this.agent.split('edge/')[1].split('.')[0]);
                }
            } catch(e) {
                return -1;
            }
        })();
    }

    initMobileProperties() {
        this.mobile = !window._NODE_ && (!!(('ontouchstart' in window) || ('onpointerdown' in window)) && _this.system.os.includes(['ios', 'android', 'magicleap'])) ? {} : false;
        if (_this.detect('oculusbrowser')) this.mobile = true;
        if (_this.detect('quest')) this.mobile = true;
        if (this.mobile && this.detect(['windows']) && !this.detect(['touch'])) this.mobile = false;

        if (this.mobile) {
            this.mobile.tablet = Math.max(window.screen ? screen.width : window.innerWidth, window.screen ? screen.height : window.innerHeight) > 1000;
            this.mobile.phone = !this.mobile.tablet;
            this.mobile.pwa = (function() {
                if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
                if (window.navigator.standalone) return true;
                return false;
            })();
        }
    }

    initMediaProperties() {
        this.media = {};
        this.media.audio = (function() {
            if (!!document.createElement('audio').canPlayType) {
                return _this.detect(['firefox', 'opera']) ? 'ogg' : 'mp3';
            } else {
                return false;
            }
        })();

        this.media.video = (function() {
            var vid = document.createElement('video');
            vid.setAttribute('muted', true);
            vid.setAttribute('loop', true);
            vid.setAttribute('autoplay', true);
            vid.setAttribute('preload', true);
            vid.setAttribute('playsinline', true);
            vid.setAttribute('webkit-playsinline', true);
            vid.autoplay = true;
            vid.muted = true;
            vid.src = "data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAG1wNDJpc28yYXZjMW1wNDEAAANObW9vdgAAAGxtdmhkAAAAAOA5QnjgOUJ4AAAD6AAAAEMAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAmt0cmFrAAAAXHRraGQAAAAD4DlCeOA5QngAAAABAAAAAAAAAEMAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAACAAAAAgAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAABDAAAAAAABAAAAAAHjbWRpYQAAACBtZGhkAAAAAOA5QnjgOUJ4AAFfkAAAF3BVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABjm1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAU5zdGJsAAAAznN0c2QAAAAAAAAAAQAAAL5hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAACAAIABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAAMWF2Y0MBTUAo/+EAGWdNQCjspLYC1BgYGQAAAwABAAK/IA8YMZYBAAVo6uEyyAAAABNjb2xybmNseAAGAAYABgAAAAAQcGFzcAAAAAEAAAABAAAAFGJ0cnQAAAAAAAF1IAABdSAAAAAYc3R0cwAAAAAAAAABAAAAAgAAC7gAAAAUc3RzcwAAAAAAAAABAAAAAQAAABxzdHNjAAAAAAAAAAEAAAABAAAAAgAAAAEAAAAcc3RzegAAAAAAAAAAAAAAAgAAAxAAAAAMAAAAFHN0Y28AAAAAAAAAAQAAA34AAABvdWR0YQAAAGdtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAADppbHN0AAAAMql0b28AAAAqZGF0YQAAAAEAAAAASGFuZEJyYWtlIDEuNi4xIDIwMjMwMTIyMDAAAAAIZnJlZQAAAyRtZGF0AAAC9AYF///w3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2NCByMzEwMCBlZDBmN2E2IC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAyMiAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTIgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9NiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTEga2V5aW50PTMwMCBrZXlpbnRfbWluPTMwIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9MzAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMi4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCB2YnZfbWF4cmF0ZT0yMDAwMCB2YnZfYnVmc2l6ZT0yNTAwMCBjcmZfbWF4PTAuMCBuYWxfaHJkPW5vbmUgZmlsbGVyPTAgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAABRliIQAK//+9q78yyt0fpUs1YVPgQAAAAhBmiFsQn/+Vg==";
            vid.play();
    
            vid.addEventListener('canplaythrough', _ => {
                if (vid.paused && _this.mobile) _this.mobile.lowPowerMode = true;
                setTimeout(_ => vid.pause(), 500);
            });
    
            if (!!vid.canPlayType) {
                if (vid.canPlayType('video/webm;')) return 'webm';
                return 'mp4';
            } else {
                return false;
            }
        })();

        this.media.webrtc = !!(window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.msRTCPeerConnection || window.oRTCPeerConnection || window.RTCPeerConnection);
    }

    initGraphicsProperties() {
        this.graphics = {};

        this.graphics.webgl = (function() {
            let DISABLED = false;
    
            Object.defineProperty(_this.graphics, 'webgl', {
               get: () => {
                   if (DISABLED) return false;
    
                   if (_this.graphics._webglContext) return _this.graphics._webglContext;
    
                   try {
                        const names = ['webgl2', 'webgl', 'experimental-webgl'];
                        const canvas = document.createElement('canvas');
                        let gl;
                        for (let i = 0; i < names.length; i++) {
                            // if (names[i] === 'webgl2' && Utils.query('compat')) continue; // TODO: Enable Utils.query() function.
                            if (names[i] === 'webgl2' && false) continue;
                            gl = canvas.getContext(names[i]);
                            if (gl) break;
                        }
        
                        let output = { gpu: 'unknown' };
                        output.renderer = gl.getParameter(gl.RENDERER).toLowerCase();
                        output.version = gl.getParameter(gl.VERSION).toLowerCase();
                        output.glsl = gl.getParameter(gl.SHADING_LANGUAGE_VERSION).toLowerCase();
                        output.extensions = gl.getSupportedExtensions();
                        output.webgl2 = output.version.includes(['webgl 2', 'webgl2']);
                        output.canvas = canvas;
                        output.context = gl;
        
                        if (_this.system.browser === 'firefox' && _this.system.browserVersion >= 92) {
                            // WEBGL_debug_renderer_info deprecated in Firefox since 92, with
                            // “sanitized” gpu moved to the RENDERER parameter. See
                            // https://bugzil.la/1722782 and https://bugzil.la/1722113
                            output.gpu = output.renderer;
                        } else {
                            let info = gl.getExtension('WEBGL_debug_renderer_info');
                            if (info) {
                                let gpu = info.UNMASKED_RENDERER_WEBGL;
                                output.gpu = gl.getParameter(gpu).toLowerCase();
                            }
                        }
        
                        output.detect = function(matches) {
                            if (output.gpu && output.gpu.toLowerCase().includes(matches)) return true;
                            if (output.version && output.version.toLowerCase().includes(matches)) return true;
        
                            for (let i = 0; i < output.extensions.length; i++) {
                                if (output.extensions[i].toLowerCase().includes(matches)) return true;
                            }
                            return false;
                        };
        
                        if (!output.webgl2 && !output.detect('instance') && !window.AURA) DISABLED = true;
        
                        _this.graphics._webglContext = output;
                        return output;
                   } catch(e) {
                       return false;
                   }
               },
    
                set: v => {
                   if (v === false) DISABLED = true;
                }
            });
        })();

        this.graphics.metal = (function() {
            if (!window.Metal) return false;
            let output = {};
            output.gpu = Metal.device.getName().toLowerCase();
            output.detect = function(matches) {
                return output.gpu.includes(matches);
            };
            return output;
        })();

        this.graphics.gpu = (function() {
            if (!_this.graphics.webgl && !_this.graphics.metal) return false;
            let output = {};
            ['metal', 'webgl'].forEach(name => {
                if (!!_this.graphics[name] && !output.identifier) {
                    output.detect = _this.graphics[name].detect;
                    output.identifier = _this.graphics[name].gpu;
                }
            });
            return output;
        })();

        this.graphics.canvas = (function() {
            var canvas = document.createElement('canvas');
            return canvas.getContext ? true : false;
        })();
    }

    initStyleProperties() {
        const checkForStyle = (function() {
            let _tagDiv;
            return function (prop) {
                _tagDiv = _tagDiv || document.createElement('div');
                const vendors = ['Khtml', 'ms', 'O', 'Moz', 'Webkit']
                if (prop in _tagDiv.style) return true;
                prop = prop.replace(/^[a-z]/, val => {return val.toUpperCase()});
                for (let i = vendors.length - 1; i >= 0; i--) if (vendors[i] + prop in _tagDiv.style) return true;
                return false;
            }
        })();

        this.styles = {};
        this.styles.filter = checkForStyle('filter');
        this.styles.blendMode = checkForStyle('mix-blend-mode');

        this.tween = {};
        this.tween.transition = checkForStyle('transition');
        this.tween.css2d = checkForStyle('transform');
        this.tween.css3d = checkForStyle('perspective');
    }

    detect(match) {
        return this.agent.includes(match)
    }

    detectIpad() {

        let aspect = Math.max(screen.width, screen.height) / Math.min(screen.width, screen.height);
        // iPads getting bigger and bigger, 2022 iPad Pro is 1389x970. But the aspect
        // ratio has stayed consistent: iPads are all 4:3, Macbooks are 16:10.
        // Need to account for external displays too, but they're likely to be
        // closer to 16:10 than 4:3
        return _this.detect('mac') && _this.touchCapable && Math.abs(aspect - 4/3) < Math.abs(aspect - 16/10);
    }

    addHandlers() {}
}