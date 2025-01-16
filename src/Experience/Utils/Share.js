import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'

let instance = null

export default class Share extends EventEmitter
{
    constructor() {
        super();

        // Singleton
        if(instance) {
            return instance;
        }
        instance = this;

        this.experience = new Experience();
        this.events = this.experience.events;
        this.appState = this.experience.appState;

        this.initCanvas();

        this.addHandlers();
    }

    initCanvas() {
        var _this = this;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1080;
        this.canvas.height = 1920;
        this.canvas.style.width = '360px';
        this.canvas.style.height = '640px';
        this.canvas.style.position = 'absolute';
        this.canvas.style.display = 'block';
        this.canvas.style.zIndex = -1;
        // this.canvas.style.border = '1px dashed red';
        document.body.appendChild(this.canvas);

        // TODO: export base imgs and update path.
        this.baseImgs = {
            pink: 'share/share-pink.png',
            blue: 'share/share-pink.png',
            green: 'share/share-pink.png',
        };
        
        this.baseImgPink = new Image();
        this.baseImgPink.src = this.baseImgs[this.appState.bgColor];
        this.baseImgPink.onload = function() {
            _this.ctx.drawImage(_this.baseImgPink, 0, 0);
            _this.linesArray = _this.wrapText(_this.ctx, _this.shareHeading, 1080/2, 350, 750, 88);

            _this.linesArray.forEach(function(item) {
                _this.ctx.fillText(item[0], item[1], item[2]); 
            });
        }

        this.shareHeading = `Hey ${this.appState.loveName}, someone has something to tell you`;
        this.ctx.font = "94px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = this.appState.candyColors.bgDarker[this.appState.bgColor];
    }

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        // First, start by splitting all of our text into words, but splitting it into an array split by spaces
        let words = text.split(' ');
        let line = ''; // This will store the text of the current line
        let testLine = ''; // This will store the text when we add a word, to test if it's too long
        let lineArray = []; // This is an array of lines, which the function will return
    
        // Lets iterate over each word
        for(var n = 0; n < words.length; n++) {
            // Create a test line, and measure it..
            testLine += `${words[n]} `;
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            // If the width of this test line is more than the max width
            if (testWidth > maxWidth && n > 0) {
                // Then the line is finished, push the current line into "lineArray"
                lineArray.push([line, x, y]);
                // Increase the line height, so a new line is started
                y += lineHeight;
                // Update line and test line to use this word as the first word on the next line
                line = `${words[n]} `;
                testLine = `${words[n]} `;
            }
            else {
                // If the test line is still less than the max width, then add the word to the current line
                line += `${words[n]} `;
            }
            // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
            if(n === words.length - 1) {
                lineArray.push([line, x, y]);
            }
        }
        // Return the line array
        return lineArray;
    }


    addHandlers() {
        this.events.on('share', this.handleShare.bind(this));

        // document.getElementById('shareBtn').addEventListener('click', this.handleShare.bind(this));
    }

    async handleShare() {
        // Grab loveName, theme color.
        // Write loveName into canvas.
        // Take a snapshot of canvas.
        // Fire share function
        
        const dataUrl = this.canvas.toDataURL();
        const blob = await (await fetch(dataUrl)).blob();
        const filesArray = [new File([blob], 'Inherited-Dennis.png', { type: blob.type, lastModified: new Date().getTime() })];
        const shareData = {
            files: filesArray,
        };
        navigator.share(shareData).then(() => {
            console.log('Shared successfully');
        });
    }
}