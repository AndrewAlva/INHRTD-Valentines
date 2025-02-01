export default class Polyfill {
    constructor() {
        this.initMathFills();
        this.initNativePolyfills();
    }

    initMathFills() {
        Math.clamp = function(value, min = 0, max = 1) {
            return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
        };

        Math.HALF_PI = Math.PI / 2;
        Math.QUARTER_PI = Math.PI / 4;
        Math.EIGHTH_PI = Math.PI / 8;
        Math.SIXTEENTH_PI = Math.PI / 16;
        Math.HALF_SIXTEENTH_PI = Math.PI / 32;
        Math.QUARTER_SIXTEENTH_PI = Math.PI / 64;
    }

    initNativePolyfills() {
        function isRegExp(it) {
            var isObject = typeof it == 'object' ? it !== null : (typeof it == 'function');
            if (!isObject) return false;
            var match = it[typeof Symbol !== 'undefined' ? Symbol.match : 'match'];
            if (match !== undefined) return !!match;
            return Object.prototype.toString.call(it).slice(8, -1) === 'RegExp';
        }
    
        function notRegExp(it) {
            if (isRegExp(it)) throw new Error('First argument to String.prototype.includes must not be a regular expression');
            return it;
        }

        Object.defineProperty(String.prototype, 'includes', {
            writable: true,
            value: function(str) {
                if (!Array.isArray(str)) return !!~this.indexOf(notRegExp(str));
                for (let i = str.length - 1; i >= 0; i--) {
                    if (!!~this.indexOf(notRegExp(str[i]))) return true;
                }
                return false;
            }
        });
    }
}