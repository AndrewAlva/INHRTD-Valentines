import SplitText from '@activetheory/split-text';
import { gsap } from "gsap";
import BaseTransitions from './BaseTransitions.js'

export default class LandingTransitions extends BaseTransitions {
    constructor() {
        super();
        this.initUI();

        this.addHandlers();
    }

    initUI() {
        this.view = document.getElementById('landingContainer');

        this.heading = {};
        this.heading.top = new SplitText('#splitLandingTop', { type: 'chars' });
        this.heading.mid = new SplitText('#splitLandingMid', { type: 'chars' });
        this.heading.bottom = new SplitText('#splitLandingBottom', { type: 'chars' });
        this.heading.top.chars.forEach((char) => { char.style.transformOrigin = 'top'; });
        this.heading.mid.chars.forEach((char) => { char.style.transformOrigin = 'bottom'; });
        this.heading.bottom.chars.forEach((char) => { char.style.transformOrigin = 'bottom'; });

        this.bottom = new SplitText('#splitLandingBottomBox', { type: 'words' });
        this.btnLabel = new SplitText('#splitLandingBtnLabel', { type: 'words' });
        this.bottomBtn = document.getElementById('landingBtn');

        this.bellBtn = document.getElementById('bellBtn');
        this.bellLabel = document.getElementById('bellLabel');

    }

    headingSplitInChars() {
        this.heading.top.options.type = 'chars';
        this.heading.top.split();
        this.heading.top.chars.forEach((char) => { char.style.transformOrigin = 'top'; });

        this.heading.mid.options.type = 'chars';
        this.heading.mid.split();
        this.heading.mid.chars.forEach((char) => { char.style.transformOrigin = 'bottom'; });

        this.heading.bottom.options.type = 'chars';
        this.heading.bottom.split();
        this.heading.bottom.chars.forEach((char) => { char.style.transformOrigin = 'bottom'; });
    }
    
    headingSplitInWords() {
        this.heading.top.options.type = 'words';
        this.heading.top.split();
        // this.heading.top.words.forEach((word) => { word.style.transformOrigin = 'top'; });

        this.heading.mid.options.type = 'words';
        this.heading.mid.split();
        // this.heading.mid.words.forEach((word) => { word.style.transformOrigin = 'bottom'; });

        this.heading.bottom.options.type = 'words';
        this.heading.bottom.split();
        // this.heading.bottom.words.forEach((word) => { word.style.transformOrigin = 'bottom'; });

        this.animateOutWords = gsap.utils.toArray([
            this.heading.top.words,
            this.heading.mid.words,
            this.heading.bottom.words,
            this.bottom.words,
            this.btnLabel.words,
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
        var midLineDelay = topLineDelay + 0.1;
        var bottomLineDelay = midLineDelay + 0.17;

        // PER LINE
        this.headingBoxLinesTL = gsap.timeline({ paused: true })
            .set('#splitLandingTop', { scale: 1.65 })
            .set('#splitLandingMid', { scale: 1.65 })
            .set('#splitLandingBottom', { scale: 1.65 })
            .to('#splitLandingTop', {
                duration: 1.5,
                scale: 1,
                ease: 'power2.out'
            }, topLineDelay)
            .to('#splitLandingMid', {
                duration: 1.5,
                scale: 1,
                ease: 'power2.out'
            }, `<+${midLineDelay}`)
            .to('#splitLandingBottom', {
                duration: 1.5,
                scale: 1,
                ease: 'power2.out'
            }, `<+${bottomLineDelay}`);


        //// PER CHARACTER
        this.headingBoxChars = gsap.utils.toArray([
            this.heading.top.chars,
            this.heading.mid.chars,
            this.heading.bottom.chars
        ]);
        this.headingBoxCharsTL = gsap.timeline({ paused: true })
            .set(this.heading.top.chars, { 
                opacity: 0,
                x: (i) => 10 * (i - ((this.heading.top.chars.length - 1) / 2)),
                y: -10,
                rotateX: -100,
            }).set(this.heading.mid.chars, {
                opacity: 0,
                x: (i) => 10 * (i - ((this.heading.mid.chars.length - 1) / 2)),
                y: 5,
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
        // BOTTOM BOX
        const bottomBoxDelay = 1.7;
        this.bottomBoxWordsTL = gsap.timeline({ paused: true })
            .set(this.bottom.words, {
                opacity: 0,
                y: 15
            }).to(this.bottom.words, {
                duration: 0.5,
                y: 0,
                stagger: 0.05,
                ease: 'power2.out'
            }, `<+${bottomBoxDelay}`)
            .to(this.bottom.words, {
                duration: 0.7,
                opacity: 1,
                stagger: 0.05,
                ease: 'power2.out'
            }, `<`);



        ///////////////////////////////////////////////////////////////////////
        // BUTTON
        this.bottomBtnInset = { val: 50 };
        this.bottomBtn.style.clipPath = `inset(0% ${this.bottomBtnInset.val}% round 25px)`;

        this.btnLabel.words.forEach((word) => {
            word.style.opacity = 0;
            word.style.transform = `translate3d(0, 15px, 0)`;
        });
        this.bottomBoxBtnTL = gsap.timeline({ paused: true })
            .set(this.bottomBtnInset, {
                val: 50,
                onUpdate: () => {
                    this.bottomBtn.style.clipPath = `inset(0% ${this.bottomBtnInset.val}% round 25px)`;
                }
            }).set(this.bottomBtn, {
                opacity: 0
            }).set(this.btnLabel.words, {
                opacity: 0,
                y: 15
            }).to(this.bottomBtnInset, {
                duration: 1.2,
                val: 0,
                ease: 'power2.out',
                onUpdate: () => {
                    this.bottomBtn.style.clipPath = `inset(0% ${this.bottomBtnInset.val}% round 25px)`;
                }
            }, bottomBoxDelay + 0.65)
            .to(this.bottomBtn, {
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



        ///////////////////////////////////////////////////////////////////////
        // NOTIFICATION HEADER (BELL)
        const headerBellDelay = 3.5;
        this.bellNotificationTL = gsap.timeline({ paused: true })
            .set(this.bellBtn, {
                clipPath: 'inset(50% round 15px)',
            })
            .set(this.bellLabel, {
                clipPath: 'xywh(100% 0 100% 100% round 15px 0 15px 15px)',
            })
            .to(this.bellBtn, {
                duration: 0.5,
                clipPath: 'inset(0% round 15px)',
                ease: 'power2.out'
            }, `<+${headerBellDelay}`)
            .to(this.bellLabel, {
                duration: 1.2,
                clipPath: 'xywh(0% 0 100% 100% round 15px 0 15px 15px)',
                ease: 'power2.inOut'
            }, '<+0.3');
    }

    setAnimateOutTimelines() {
        // PER WORD
        this.outTimelines = { heading: {} };
        this.outTimelines.wordsTL = gsap.timeline({ paused: true })
            .set(this.animateOutWords, { opacity: 1 })
            .to(this.animateOutWords, {
                duration: 0.5,
                opacity: 0,
                stagger: 0.02,
                ease: 'power2.out',
                onComplete: _ => {
                    this.view.classList.remove('show');
                }
            });
    }



    //////////////////////////
    // Handlers
    addHandlers() {
        this.appState.on('updateLoveName', this.handleLoveName.bind(this));
    }

    handleLoveName() {
        // 
    }



    //////////////////////////
    // Animate IN / OUT
    animateIn() {
        console.log('animateIn LandingTransitions')
        
        this.headingSplitInChars();
        this.setAnimateInTimelines();

        this.view.classList.add('show');

        // HEADING BOX
        this.headingBoxLinesTL.restart();
        this.headingBoxCharsTL.restart();

        // BOTTOM BOX
        this.bottomBoxWordsTL.restart();
        this.bottomBoxBtnTL.restart();

        // NOTIFICATION HEADER (BELL)
        this.bellNotificationTL.play();
    }

    animateOut() {
        console.log('animateOut LandingTransitions')

        this.headingSplitInWords();
        this.setAnimateOutTimelines();

        this.outTimelines.wordsTL.restart();

        // After finishing gsap timeline or some delay, animate out.
        // this.view.classList.remove('show');
    }
}