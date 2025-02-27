import SplitText from '@activetheory/split-text';
import { gsap } from "gsap";
import BaseTransitions from './BaseTransitions.js'

export default class NameTransitions extends BaseTransitions {
    constructor() {
        super();
        this.initUI();
        this.setupSubmitAnimations();
        this.addHandlers();
    }

    initUI() {
        this.view = document.getElementById('nameContainer');

        this.heading = {};
        this.heading.top = new SplitText('#splitNameTop', { type: 'chars' });
        this.heading.bottom = new SplitText('#splitNameBottom', { type: 'chars' });
        this.heading.top.chars.forEach((char) => { char.style.transformOrigin = 'top'; });
        this.heading.bottom.chars.forEach((char) => { char.style.transformOrigin = 'bottom'; });
        
        this.placeholder = new SplitText('#nameLabel', { type: 'words' });
        this.inputUnderline = document.getElementById('inputUnderline');
        this.inputLabel = document.getElementById('nameLabel');
        this.nameInput = document.getElementById('nameInput');

        this.submitBtn = document.getElementById('submitName');
        this.btnLabel = new SplitText('#splitNameBtnLabel', { type: 'words' });

        this.backBtn = document.querySelector('#nameContainer .h-back .btn');
    }

    setupSubmitAnimations() {
        // ANIMATE IN
        this.submitBtnTL = gsap.timeline({ paused: true })
            .set(this.submitBtn, {
                opacity: 0,
                clipPath: `inset(0% 50% round 25px)`
            }).set(this.btnLabel.words, {
                opacity: 0,
                y: 15

            }).to(this.submitBtn, {
                duration: 1.2,
                clipPath: `inset(0% 0% round 25px)`,
                ease: 'power2.out',
            })
            .to(this.submitBtn, {
                duration: 0.5,
                opacity: 1,
                ease: 'power2.out',
            }, '<')
            .to(this.btnLabel.words, {
                duration: 0.6,
                y: 0,
                opacity: 1,
                stagger: 0.005,
                ease: 'power2.out'
            }, `<+0.15`);


        // ANIMATE OUT
        this.outTimelines = {};
        this.outTimelines.submitBtnTL = gsap.timeline({ paused: true })
            .set(this.submitBtn, {
                clipPath: `inset(0% 0.001% round 25px)`
            }).to(this.submitBtn, {
                duration: 0.6,
                clipPath: `inset(0% 50% round 25px)`,
                ease: 'power2.out'
            }).to(this.btnLabel.words, {
                duration: 0.4,
                opacity: 0,
                stagger: 0.005,
                ease: 'power2.out'
            }, `<`);
    }

    headingSplitInChars() {
        this.heading.top.options.type = 'chars';
        this.heading.top.split();
        this.heading.top.chars.forEach((char) => { char.style.transformOrigin = 'top'; });

        this.heading.bottom.options.type = 'chars';
        this.heading.bottom.split();
        this.heading.bottom.chars.forEach((char) => { char.style.transformOrigin = 'bottom'; });
    }
    
    headingSplitInWords() {
        this.heading.top.options.type = 'words';
        this.heading.top.split();

        this.heading.bottom.options.type = 'words';
        this.heading.bottom.split();

        this.animateOutWords = gsap.utils.toArray([
            this.heading.top.words,
            this.heading.bottom.words,
        ]);
        this.animateOutWords.shuffle();
    }

    setInitialStates()  {
        this.setAnimateInTimelines();
    }

    setAnimateInTimelines()  {
        ///////////////////////////////////////////////////////////////////////
        // HEADING BOX
        var topLineDelay = 0.3;
        var bottomLineDelay = topLineDelay + 0.1;

        // PER LINE
        if (!this.headingBoxLinesTL) this.headingBoxLinesTL = gsap.timeline({ paused: true })
            .set('#splitNameTop', { scale: 1.65 })
            .set('#splitNameBottom', { scale: 1.65 })
            .to('#splitNameTop', {
                duration: 1.5,
                scale: 1,
                ease: 'power2.out'
            }, topLineDelay)
            .to('#splitNameBottom', {
                duration: 1.5,
                scale: 1,
                ease: 'power2.out'
            }, `<+${bottomLineDelay}`);


        //// PER CHARACTER
        this.headingBoxChars = gsap.utils.toArray([
            this.heading.top.chars,
            this.heading.bottom.chars
        ]);
        this.headingBoxCharsTL = gsap.timeline({ paused: true })
            .set(this.heading.top.chars, { 
                opacity: 0,
                x: (i) => 10 * (i - ((this.heading.top.chars.length - 1) / 2)),
                y: -10,
                rotateX: -100,

            }).set(this.heading.bottom.chars, {
                opacity: 0,
                x: (i) => 10 * (i - ((this.heading.bottom.chars.length - 1) / 2)),
                y: 10,
                rotateX: -100,

            }).to(this.headingBoxChars, {
                duration: 0.6,
                x: 0,
                y: 0,
                rotateX: 0,
                stagger: 0.04,
                ease: 'power2.out'

            }, topLineDelay )
            .to(this.headingBoxChars, {
                duration: 2.5,
                opacity: 1,
                stagger: 0.04,
                ease: 'power2.out'
            }, "<");


        ///////////////////////////////////////////////////////////////////////
        // INPUT PLACEHOLDER
        const placeholderDelay = 1;
        if (!this.placeholderTL) this.placeholderTL = gsap.timeline({ paused: true })
            .set(this.placeholder.words, {
                opacity: 0,
                y: 15
            }).set(this.inputUnderline, {
                clipPath: 'inset(50% round 15px)',
            }).to(this.placeholder.words, {
                duration: 0.5,
                y: 0,
                stagger: 0.05,
                ease: 'power2.out'
            }, `<+${placeholderDelay}`)
            .to(this.placeholder.words, {
                duration: 0.7,
                opacity: 1,
                stagger: 0.05,
                ease: 'power2.out'
            }, `<`)
            .to(this.inputUnderline, {
                duration: 0.7,
                clipPath: 'inset(0% round 15px)',
                ease: 'power2.out'
            }, `<+0.7`);



        ///////////////////////////////////////////////////////////////////////
        // RESTART HEADER (back button)
        const headerBackDelay = 1.5;
        if (!this.headerBackTL) this.headerBackTL = gsap.timeline({ paused: true })
            .set(this.backBtn, {
                clipPath: 'inset(50% round 15px)',
            })
            .to(this.backBtn, {
                duration: 0.5,
                clipPath: 'inset(0% round 15px)',
                ease: 'power2.out'
            }, `<+${headerBackDelay}`);
    }

    setAnimateOutTimelines() {
        // PER WORD
        this.outTimelines.wordsTL = gsap.timeline({ paused: true })
            .set(this.animateOutWords, { opacity: 1 })
            .to(this.animateOutWords, {
                duration: 0.4,
                opacity: 0,
                stagger: 0.015,
                ease: 'power2.out',
                onComplete: _ => {
                    this.view.classList.remove('show');
                }
            });


        // INPUT PLACEHOLDER
        if (!this.outTimelines.placeholderTL) this.outTimelines.placeholderTL = gsap.timeline({ paused: true })
            .to(this.placeholder.words, {
                duration: 0.4,
                opacity: 0,
                stagger: 0.05,
                ease: 'power2.out'
            });


        // RESTART HEADER (back button)
        if (!this.outTimelines.headerBackTL) this.outTimelines.headerBackTL = gsap.timeline({ paused: true })
            .set(this.backBtn, {
                clipPath: 'inset(0% round 15px)',
            })
            .to(this.backBtn, {
                duration: 0.2,
                clipPath: 'inset(50% round 15px)',
                ease: 'power2.out'
            });
    }



    //////////////////////////
    // Handlers
    addHandlers() {
        this.events.on('showInputSubmit', this.showSubmitBtn.bind(this));
        this.events.on('hideInputSubmit', this.hideSubmitBtn.bind(this));
    }

    showSubmitBtn() {
        if (this.isSubmitBtnShown) return;

        this.submitBtn.classList.add('show');
        this.inputLabel.classList.remove('show');

        this.outTimelines.submitBtnTL.pause();
        this.submitBtnTL.restart();

        this.isSubmitBtnShown = true;
    }

    hideSubmitBtn() {
        this.submitBtn.classList.remove('show');
        this.inputLabel.classList.add('show');

        this.submitBtnTL.pause();
        this.outTimelines.submitBtnTL.restart();

        this.isSubmitBtnShown = false;
    }




    //////////////////////////
    // Animate IN / OUT
    animateIn() {
        console.log('animateIn NameTransitions');

        // STOP timelines animating OUT
        if (this.animatedOutOnce) {
            this.outTimelines.wordsTL.pause();
            this.outTimelines.placeholderTL.pause();
            this.outTimelines.submitBtnTL.pause();
            this.outTimelines.headerBackTL.pause();
        }

        // SETUP
        this.headingSplitInChars();
        this.setAnimateInTimelines();

        this.view.classList.add('show');

        // HEADING BOX
        this.headingBoxLinesTL.restart();
        this.headingBoxCharsTL.play();

        // INPUT PLACEHOLDER
        this.placeholderTL.restart();

        // BOTTOM BUTTON
        if (this.nameInput.value.length > 0) {
            this.submitBtnTL.restart();
            this.isSubmitBtnShown = true;
        }

        // RESTART HEADER (back button)
        this.headerBackTL.restart();
    }

    animateOut() {
        console.log('animateOut NameTransitions');

        // STOP timelines animating IN
        this.headingBoxLinesTL.pause();
        this.headingBoxCharsTL.pause();
        this.placeholderTL.restart();
        this.submitBtnTL.pause();
        this.headerBackTL.pause();

        // SETUP
        this.headingSplitInWords();
        this.setAnimateOutTimelines();

        this.outTimelines.wordsTL.play();
        this.outTimelines.placeholderTL.restart();
        this.outTimelines.submitBtnTL.restart();
        this.outTimelines.headerBackTL.restart();

        this.animatedOutOnce = true;
        this.isSubmitBtnShown = false;
    }
}