export default class Polyfill {
    constructor() {
        this.initMathFills();
        this.initNativePolyfills();
    }

    initMathFills() {
        Math.clamp = function(value, min = 0, max = 1) {
            return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
        };

        Math.quadInOutLerp = function(k) {
            if ((k *= 2) < 1) return 0.5 * k * k;
            return - 0.5 * (--k * (k - 2) - 1);
        }
        Math.cubicOutLerp = function(k) {
            return --k * k * k + 1;
        }
        Math.cubicInLerp = function(k) {
            return k * k * k;
        }
        Math.cubicInOutLerp = function(k) {
            if ((k *= 2) < 1) return 0.5 * k * k * k;
            return 0.5 * ((k -= 2) * k * k + 2 );
        }

        Math.PI_2 = Math.PI * 2;
        Math.PI_4 = Math.PI * 4;
        Math.HALF_PI = Math.PI / 2;
        Math.QUARTER_PI = Math.PI / 4;
        Math.EIGHTH_PI = Math.PI / 8;
        Math.SIXTEENTH_PI = Math.PI / 16;
        Math.HALF_SIXTEENTH_PI = Math.PI / 32;
        Math.QUARTER_SIXTEENTH_PI = Math.PI / 64;
        Math.HALF_QUARTER_SIXTEENTH_PI = Math.PI / 128;
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


        ////////////////////////////////////////////////////////
        // STRINGS
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


        ////////////////////////////////////////////////////////
        // ARRAYS
        Object.defineProperty(Array.prototype, 'shuffle', {
            writable: true,
            value: function() {
                let currentIndex = this.length, randomIndex;
        
                while (currentIndex != 0) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;
        
                    [this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
                }
        
                return this;
            }
        });
    }
}