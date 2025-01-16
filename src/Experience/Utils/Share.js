import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'

let instance = null
let _this;

export default class Share extends EventEmitter
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
        this.appState = this.experience.appState;

        this.width = 1080;
        this.height = 1920;
        this.initCanvas();
        this.initImages();
        this.shareData = {};
        this.shareImgTitle = 'Inherited-Dennis.png';
        this.filesArray = [];
        this.shareBtn = document.getElementById('shareBtn');

        this.addHandlers();
    }

    initCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = '360px';
        this.canvas.style.height = '640px';
        this.canvas.style.position = 'absolute';
        this.canvas.style.display = 'block';
        this.canvas.style.zIndex = -1;
        // this.canvas.style.border = '1px dashed red';
        document.body.appendChild(this.canvas);
    }

    initImages() {
        // TODO: export base imgs and update path.
        this.baseImgs = {
            pink: new Image(),
            blue: new Image(),
            green: new Image(),

            paths: {
                pink: 'share/share-pink.png',
                blue: 'share/share-blue.png',
                green: 'share/share-green.png',
            }
        };

        this.baseImgs.pink.src = this.baseImgs.paths.pink;
        this.baseImgs.blue.src = this.baseImgs.paths.blue;
        this.baseImgs.green.src = this.baseImgs.paths.green;

        this.baseToRender = this.baseImgs[this.appState.bgColor];
        // this.baseImg.onload = this.renderShareImage.bind(this);
    }

    async renderShareImage() {
        // TODO: improve animateIn/out of share button.
        this.shareBtn.classList.remove('show');

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.baseToRender = this.baseImgs[this.appState.bgColor];
        this.ctx.drawImage(this.baseToRender, 0, 0);

        this.shareHeading = `Hey ${this.appState.loveName}, someone has something to tell you`;
        // TODO: update font family.
        this.ctx.font = "94px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = this.appState.candyColors.shareText[this.appState.bgColor];

        this.linesArray = this.wrapText(this.ctx, this.shareHeading, 1080/2, 350, 750, 88);

        this.linesArray.forEach(function(item) {
            _this.ctx.fillText(item[0], item[1], item[2]); 
        });


        this.dataUrl = this.canvas.toDataURL();
        this.blob = await (await fetch(this.dataUrl)).blob();
        this.filesArray[0] = new File([this.blob], this.shareImgTitle, { type: this.blob.type, lastModified: new Date().getTime() });
        this.shareData.files = this.filesArray;

        // TODO: improve animateIn/out of share button.
        this.shareBtn.classList.add('show');
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
        this.appState.on('stepChange', (newStep) => {
            if (newStep == 3) {
                this.renderShareImage();
            }
        });

        this.shareBtn.addEventListener('click', this.handleShare.bind(this));
    }

    handleShare() {
        navigator.share(this.shareData).then(() => {
            console.log('Shared successfully');
        });
    }
}