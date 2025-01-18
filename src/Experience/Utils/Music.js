import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'

let instance = null;
let _this;

export default class Music extends EventEmitter
{
    constructor() {
        super();

        // Singleton
        if(instance) {
            return instance;
        }
        instance = this;
        _this = this;

        this.experience = new Experience();
        this.events = this.experience.events;

        this.setupAudio();
        this.fireAudioContext();
    }

    setupAudio() {
        this.audioTag = document.createElement('audio');
        this.audioLoad();
    }

    fireAudioContext() {
        if (this.audioContext) return;

        // Create audio context and analyser node
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256 * 1; // Size of the FFT for frequency data
        
        // Create source node from the audio element and connect it to the analyser
        this.source = this.audioContext.createMediaElementSource(this.audioTag);
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        // TODO: uncomment fade after figuring out audio not playing on mobile.
        // // Volume aka gain
        // this.gainNode = this.audioContext.createGain();
        // this.gainNode.gain.value = -1;
        // this.source.connect(this.gainNode).connect(this.audioContext.destination);
    }

    audioLoad() {
        new Promise((resolve, reject) => {
            // TODO: test on Android, this fix might be needed on all devices, not only iOS.
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) _this.audioTag.autoplay = true;

            _this.audioTag.addEventListener("loadeddata", resolve, { once: true });
            _this.audioTag.src = 'audio/DennisNilsen.mp3';

        }).then(() => {
            _this.audioLoaded = true;
            _this.events.trigger('audioLoaded');

            console.log("Audio is ready to play!");
            // var tester = document.createElement('div');
            // tester.style.width = '20px';
            // tester.style.height = '20px';
            // tester.style.display = 'block';
            // tester.style.position = 'fixed';
            // tester.style.top = '50px';
            // tester.style.left = '50px';
            // tester.style.backgroundColor = 'red';
            // tester.style.zIndex = 999999999;
            // document.body.appendChild(tester);
        }, () => {
            console.log('audio tag load promise rejected');
        });
    }

}