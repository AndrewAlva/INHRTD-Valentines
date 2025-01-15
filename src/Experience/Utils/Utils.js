import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'

let instance = null
let _queries = {};
let _searchParams = new URLSearchParams(window.location.search);

export default class Utils extends EventEmitter
{
    constructor() {
        super();

        // Singleton
        if(instance) {
            return instance;
        }
        instance = this;

        window.Utils = this;

        this.experience = new Experience();
    }

    query(key, value) {
        if (value !== undefined) _queries[key] = value;

        if (_queries[key] !== undefined) return _queries[key];

        if (_searchParams) {
            value = _searchParams.get(key);
            if (value === '0') value = 0;
            else if (value === 'false' || value === null) value = false;
            else if (value === '') value = true;
        } else {
            let escapedKey = encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&');
            value = decodeURIComponent(window.location.search.replace(new RegExp(`^(?:.*?[&?]${escapedKey}(?:\=([^&]*)|[&$]))?.*$`, 'i'), '$1'));
            if (value == '0') {
                value = 0;
            } else if (value == 'false') {
                value = false;
            } else if (!value.length) {
                value = new RegExp(`[&?]${escapedKey}(?:[&=]|$)`, 'i').test(window.location.search);
            }
        }
        _queries[key] = value;
        return value;
    };
}