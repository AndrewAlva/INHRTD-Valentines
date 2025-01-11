export default class Polyfill {
    constructor() {
        this.initMathFills();
    }

    initMathFills() {
        Math.clamp = function(value, min = 0, max = 1) {
            return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
        };
    }
}