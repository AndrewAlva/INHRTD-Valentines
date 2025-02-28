import SplitText from '@activetheory/split-text';
import { gsap } from "gsap";
import BaseTransitions from './BaseTransitions.js'

export default class SelectTransitions extends BaseTransitions {
    constructor() {
        super();
        this.initUI();

        this.addHandlers();
    }

    initUI() {
        this.view = document.getElementById('selectContainer');

        this.heading = {};
        this.heading.top = new SplitText('#splitSelectTop', { type: 'chars' });
        this.heading.mid = new SplitText('#splitSelectMid', { type: 'chars' });
        this.heading.bottom = new SplitText('#splitSelectBottom', { type: 'chars' });
        this.heading.top.chars.forEach((char) => { char.style.transformOrigin = 'top'; });
        this.heading.mid.chars.forEach((char) => { char.style.transformOrigin = 'bottom'; });
        this.heading.bottom.chars.forEach((char) => { char.style.transformOrigin = 'bottom'; });

        this.bottom = new SplitText('#splitSelectBottomBox', { type: 'words' });

        this.btnLabel = new SplitText('#selectBtnLabel', { type: 'words' });
        this.bottomBtn = document.getElementById('selectBtn');
        this.leftBtn = document.getElementById('prevCandy');
        this.leftArrow = document.getElementById('leftArrowVector');
        this.rightBtn = document.getElementById('nextCandy');
        this.rightArrow = document.getElementById('rightArrowVector');

        this.backBtn = document.querySelector('#selectContainer .h-back .btn');
    }

    setInitialStates()  {
        this.setConstantTimeLinesIn();
        this.setConstantTimeLinesOut();

        this.setDynamicTimelinesAnimateIn();
    }

    setConstantTimeLinesIn() {
        ///////////////////////////////////////////////////////////////////////
        // HEADING BOX
        // PER LINE
        var topLineDelay = 0.3;
        var midLineDelay = topLineDelay + 0.1;
        var bottomLineDelay = midLineDelay + 0.17;
        this.headingBoxLinesTL = gsap.timeline({ paused: true })
            .set('#splitSelectTop', { scale: 1.65 })
            .set('#splitSelectMid', { scale: 1.65 })
            .set('#splitSelectBottom', { scale: 1.65 })
            .to('#splitSelectTop', {
                duration: 1.5,
                scale: 1,
                ease: 'power2.out'
            }, topLineDelay)
            .to('#splitSelectMid', {
                duration: 1.5,
                scale: 1,
                ease: 'power2.out'
            }, `<+${midLineDelay}`)
            .to('#splitSelectBottom', {
                duration: 1.5,
                scale: 1,
                ease: 'power2.out'
            }, `<+${bottomLineDelay}`);


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
        this.bottomBoxBtnTL = gsap.timeline({ paused: true })
            .set(this.bottomBtn, {
                opacity: 0,
                clipPath: `inset(0% 50% round 25px)`
            }).set(this.btnLabel.words, {
                opacity: 0,
                y: 15
            }).to(this.bottomBtn, {
                duration: 1.2,
                clipPath: `inset(0% 0% round 25px)`,
                ease: 'power2.out',
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
        // RESTART HEADER (back button)
        const headerBackDelay = 1.5;
        this.headerBackTL = gsap.timeline({ paused: true })
            .set(this.backBtn, {
                clipPath: 'inset(50% round 15px)',
            })
            .to(this.backBtn, {
                duration: 0.5,
                clipPath: 'inset(0% round 15px)',
                ease: 'power2.out'
            }, `<+${headerBackDelay}`);
    }

    setConstantTimeLinesOut() {
        this.outTimelines = {};

        // BUTTON
        this.outTimelines.bottomBoxBtnTL = gsap.timeline({ paused: true })
            .set(this.bottomBtn, {
                clipPath: `inset(0% 0.001% round 25px)`
            }).to(this.bottomBtn, {
                duration: 0.6,
                clipPath: `inset(0% 50% round 25px)`,
                ease: 'power2.out'
            });

        // RESTART HEADER (back button)
        this.outTimelines.headerBackTL = gsap.timeline({ paused: true })
            .set(this.backBtn, {
                clipPath: 'inset(0% round 15px)',
            })
            .to(this.backBtn, {
                duration: 0.2,
                clipPath: 'inset(50% round 15px)',
                ease: 'power2.out'
            });
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

        this.heading.mid.options.type = 'words';
        this.heading.mid.split();

        this.heading.bottom.options.type = 'words';
        this.heading.bottom.split();

        this.animateOutWords = gsap.utils.toArray([
            this.heading.top.words,
            this.heading.mid.words,
            this.heading.bottom.words,
            this.bottom.words,
        ]);
        this.animateOutWords.shuffle();
    }

    setDynamicTimelinesAnimateIn() {
        ///////////////////////////////////////////////////////////////////////
        // HEADING BOX
        var topLineDelay = 0.3;
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
            }, `<+${topLineDelay}` )
            .to(this.headingBoxChars, {
                duration: 2.5,
                opacity: 1,
                stagger: 0.04,
                ease: 'power2.out'
            }, "<");
    }

    setDynamicTimelinesAnimateOut() {
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
    }



    //////////////////////////
    // Handlers
    addHandlers() {
        // 
    }



    //////////////////////////
    // Animate IN / OUT
    animateIn() {
        console.log('animateIn SelectTransitions');

        // STOP timelines animating OUT
        if (this.animatedOutOnce) {
            this.outTimelines.wordsTL.pause();
            this.outTimelines.bottomBoxBtnTL.pause();
            this.outTimelines.headerBackTL.pause();
        }

        this.headingSplitInChars();
        this.setDynamicTimelinesAnimateIn();

        this.view.classList.add('show');

        // HEADING BOX
        this.headingBoxLinesTL.restart();
        this.headingBoxCharsTL.play();

        // BOTTOM BOX
        this.bottomBoxWordsTL.restart();
        this.bottomBoxBtnTL.restart();

        // RESTART HEADER (back button)
        this.headerBackTL.restart();
    }

    animateOut() {
        console.log('animateOut SelectTransitions');

        // STOP timelines animating IN
        this.headingBoxLinesTL.pause();
        this.headingBoxCharsTL.pause();
        this.bottomBoxWordsTL.pause();
        this.bottomBoxBtnTL.pause();
        this.headerBackTL.pause();

        this.headingSplitInWords();
        this.setDynamicTimelinesAnimateOut();

        this.outTimelines.wordsTL.play();
        this.outTimelines.bottomBoxBtnTL.restart();
        this.outTimelines.headerBackTL.restart();

        this.animatedOutOnce = true;
    }
}