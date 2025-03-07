import SplitText from '@activetheory/split-text';
import { gsap } from "gsap";
import BaseTransitions from './BaseTransitions.js'

export default class ReceivedTransitions extends BaseTransitions {
    constructor() {
        super();
        this.initUI();
    }

    initUI() {
        this.view = document.getElementById('receivedContainer');

        this.heading = {};
        this.heading.top = new SplitText('#splitReceivedTop', { type: 'chars' });
        this.heading.mid = new SplitText('#splitReceivedMid', { type: 'chars' });
        this.heading.bottom = new SplitText('#splitReceivedBottom', { type: 'chars' });
        this.heading.top.chars.forEach((char) => { char.style.transformOrigin = 'top'; });
        this.heading.mid.chars.forEach((char) => { char.style.transformOrigin = 'bottom'; });
        this.heading.bottom.chars.forEach((char) => { char.style.transformOrigin = 'bottom'; });
        this.heading.hearts = document.getElementById('heartsReceived');

        this.bottom = new SplitText('#splitReceivedBottomBox', { type: 'words' });

        this.bottomBtn = document.getElementById('receivedBtn');
        this.btnLabel = new SplitText('#splitReceivedBtnLabel', { type: 'words' });
        
        this.spottyBtn = document.getElementById('receivedSpottyLink');
        this.spottyLabel = new SplitText('#receivedSpottyLabel', { type: 'words' });

        this.restartBtn = document.querySelector('#receivedContainer .h-restart .btn');

        this.tapUICircleLarge = document.querySelector('#receivedContainer .circle--lg');
        this.tapUICircleMid = document.querySelector('#receivedContainer .circle--md');
        this.tapUICircleSmall = document.querySelector('#receivedContainer .circle--sm');
        this.tapUICircleSmallBg = document.querySelector('#receivedContainer .circle--sm .circle');
    }

    setInitialStates()  {
        this.setTimelinesIn();
    }

    setTimelinesIn() {
        ///////////////////////////////////////////////////////////////////////
        // HEADING BOX
        // PER LINE
        var topLineDelay = 0.3;
        var midLineDelay = topLineDelay + 0.1;
        var bottomLineDelay = midLineDelay + 0.17;
        this.headingBoxLinesTL = gsap.timeline({ paused: true })
            .set('#splitReceivedTop', { scale: 1.65 })
            .set('#splitReceivedMid', { scale: 1.65 })
            .set('#splitReceivedBottom', { scale: 1.65 })
            .set(this.heading.hearts, { opacity: 0 })
            .to('#splitReceivedTop', {
                duration: 1.5,
                scale: 1,
                ease: 'power2.out'
            }, topLineDelay)
            .to('#splitReceivedMid', {
                duration: 1.5,
                scale: 1,
                ease: 'power2.out'
            }, `<+${midLineDelay}`)
            .to('#splitReceivedBottom', {
                duration: 1.5,
                scale: 1,
                ease: 'power2.out'
            }, `<+${bottomLineDelay}`)
            .to(this.heading.hearts, {
                duration: 0.7,
                opacity: 1,
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
            }, `<+${topLineDelay}` )
            .to(this.headingBoxChars, {
                duration: 2.5,
                opacity: 1,
                stagger: 0.04,
                ease: 'power2.out'
            }, "<");


        ///////////////////////////////////////////////////////////////////////
        // BOTTOM BOX
        const bottomBoxDelay = 1.4;
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
        // BUTTONS
        this.bottomBoxBtnsTL = gsap.timeline({ paused: true })
            .set(this.bottomBtn, {
                opacity: 0,
                clipPath: `inset(0% 50% round 25px)`
            }).set(this.btnLabel.words, {
                opacity: 0,
                y: 15


            }).to(this.bottomBtn, {
                duration: 0.9,
                clipPath: `inset(0% 0% round 25px)`,
                ease: 'power3.out',
            }, bottomBoxDelay + 0.65)
            .to(this.bottomBtn, {
                duration: 0.6,
                opacity: 1,
                ease: 'power3.out',
            }, '<')
            .to(this.btnLabel.words, {
                duration: 0.05,
                opacity: 1,
                ease: 'power3.out'
            }, `<-0.15`)
            .to(this.btnLabel.words, {
                duration: 0.7,
                y: 0,
                ease: 'power3.out'
            }, `<`);


        ///////////////////////////////////////////////////////////////////////
        // RESTART HEADER (close button)
        const headerRestartDelay = 2.3;
        this.headerRestartTL = gsap.timeline({ paused: true })
            .set(this.restartBtn, {
                clipPath: 'inset(50% round 15px)',
            })
            .to(this.restartBtn, {
                duration: 0.5,
                clipPath: 'inset(0% round 15px)',
                ease: 'power2.out'
            }, `<+${headerRestartDelay}`);


        ///////////////////////////////////////////////////////////////////////
        // TAP UI
        const tapUIDelay = 2.5;
        this.tapUITL = gsap.timeline({ paused: true })
            .set(this.tapUICircleLarge, { scale: 0, })
            .set(this.tapUICircleMid, { scale: 0, })
            .set(this.tapUICircleSmall, { clipPath: 'inset(50% round 50%)' })
            .to(this.tapUICircleLarge, {
                duration: 1.2,
                scale: 1,
                ease: 'power4.out'
            }, tapUIDelay)
            .to(this.tapUICircleMid, {
                duration: 1.2,
                scale: 1,
                ease: 'power4.out'
            }, '<+0.15')
            .to(this.tapUICircleSmall, {
                duration: 1.2,
                clipPath: 'inset(0% round 50%)',
                ease: 'power4.out'
            }, '<+0.15')
            .to(this.tapUICircleLarge, {
                duration: 0.7,
                scale: 1.2,
                ease: 'back.inOut',
                yoyo: true,
                yoyoEase: 'back.inOut',
                repeat: -1,
                repeatDelay: 0.5,
            })
            .to(this.tapUICircleMid, {
                duration: 0.7,
                scale: 1.2,
                ease: 'back.inOut',
                yoyo: true,
                yoyoEase: 'back.inOut',
                repeat: -1,
                repeatDelay: 0.5,
            }, '<+0.1')
            .to(this.tapUICircleSmallBg, {
                duration: 0.7,
                scale: 1.2,
                ease: 'back.inOut',
                yoyo: true,
                yoyoEase: 'back.inOut',
                repeat: -1,
                repeatDelay: 0.5,
                onStart: _ => {
                    gsap.set(this.tapUICircleSmall, { clipPath: 'unset' })
                }
            }, '<+0.1');
    }

    setTimelinesOut() {
        this.outTimelines = {};

        // ALL WORDS
        this.outTimelines.wordsTL = gsap.timeline({ paused: true })
            .set(this.animateOutWords, { opacity: 1 })
            .to(this.heading.hearts, {
                duration: 0.4,
                opacity: 0,
                ease: 'power2.out'
            })
            .to(this.animateOutWords, {
                duration: 0.4,
                opacity: 0,
                stagger: 0.015,
                ease: 'power2.out',
                onComplete: _ => {
                    this.view.classList.remove('show');
                }
            }, '<');


        // BUTTON
        this.outTimelines.bottomBoxBtnsTL = gsap.timeline({ paused: true })
            .set(this.bottomBtn, { clipPath: `inset(0% 0.001% round 25px)` })
            .set(this.spottyBtn, { clipPath: `inset(0% 0.001% round 25px)` })
            .to(this.bottomBtn, {
                duration: 0.6,
                clipPath: `inset(0% 50% round 25px)`,
                ease: 'power3.out'
            })
            .to(this.spottyBtn, {
                duration: 0.6,
                clipPath: `inset(0% 50% round 25px)`,
                ease: 'power3.out'
            }, '<');


        // RESTART HEADER (back button)
        this.outTimelines.headerRestartTL = gsap.timeline({ paused: true })
            .set(this.restartBtn, {
                clipPath: 'inset(0% round 15px)',
            })
            .to(this.restartBtn, {
                duration: 0.2,
                clipPath: 'inset(50% round 15px)',
                ease: 'power2.out'
            });


        // TAP UI
        this.outTimelines.tapUITL = gsap.timeline({ paused: true })
            .to(this.tapUICircleSmall, {
                duration: 0.9,
                clipPath: 'inset(50% round 50%)',
                ease: 'power4.out'
            })
            .to(this.tapUICircleMid, {
                duration: 0.9,
                scale: 0,
                ease: 'power4.out'
            }, '<+0.07')
            .to(this.tapUICircleLarge, {
                duration: 0.9,
                scale: 0,
                ease: 'power4.out'
            }, '<+0.07');
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
            this.btnLabel.words,
            this.spottyLabel.words,
        ]);
        this.animateOutWords.shuffle();
    }



    //////////////////////////
    // Handlers



    //////////////////////////
    // Animate IN / OUT
    animateIn() {
        console.log('animateIn ReceivedTransitions');
        this.view.classList.add('show');

        this.headingBoxLinesTL.play();
        this.headingBoxCharsTL.play();
        this.bottomBoxWordsTL.play();
        this.bottomBoxBtnsTL.play();
        this.headerRestartTL.play();
        this.tapUITL.play();
    }

    animateOut() {
        console.log('animateOut ReceivedTransitions');

        // STOP timelines animating IN
        this.headingBoxLinesTL.pause();
        this.headingBoxCharsTL.pause();
        this.bottomBoxWordsTL.pause();
        this.bottomBoxBtnsTL.pause();
        this.headerRestartTL.pause();
        this.tapUITL.pause();

        this.headingSplitInWords();
        this.setTimelinesOut();

        this.outTimelines.wordsTL.play();
        this.outTimelines.bottomBoxBtnsTL.play();
        this.outTimelines.headerRestartTL.play();
        this.outTimelines.tapUITL.play();
    }
}