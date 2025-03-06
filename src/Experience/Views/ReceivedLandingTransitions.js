import SplitText from '@activetheory/split-text';
import { gsap } from "gsap";
import BaseTransitions from './BaseTransitions.js'

export default class ReceivedLandingTransitions extends BaseTransitions {
    constructor() {
        super();
        this.initUI();

        this.addHandlers();
    }

    initUI() {
        this.view = document.getElementById('receivedLandingContainer');

        this.heading = {};
        this.heading.name = new SplitText('#recipientNameLanding', { type: 'chars' });
        this.heading.dots = new SplitText('#splitReceivedDots', { type: 'chars' });
        this.heading.hearts = document.getElementById('heartsReceivedLanding');

        this.bottom = new SplitText('#splitReceivedLandingParagraph', { type: 'words' });
    }

    setInitialStates()  {
        this.setTimelinesIn();
    }

    setTimelinesIn() {
        const startDelay = 0.3;
        const bottomBoxDelay = 1;

        this.headingBoxLinesTL = gsap.timeline({ paused: true })
            .set('#headingLineRL', { scale: 1.65 })
            .set(this.heading.hearts, { opacity: 0 })
            .to('#headingLineRL', {
                duration: 1.5,
                scale: 1,
                ease: 'power2.out'
            }, startDelay)
            .to(this.heading.hearts, {
                duration: 0.7,
                opacity: 1,
                ease: 'power2.out'
            }, '<+0.8');


        this.headingBoxChars = gsap.utils.toArray([
            this.heading.name.chars,
            this.heading.dots.chars
        ]);

        this.headingBoxCharsTL = gsap.timeline({ paused: true })
            .set(this.headingBoxChars, { 
                opacity: 0,
                x: (i) => 10 * (i - ((this.headingBoxChars.length - 1) / 2)),
                y: -10,
                rotateX: -100,
            })
            .to(this.headingBoxChars, {
                duration: 0.6,
                x: 0,
                y: 0,
                rotateX: 0,
                stagger: 0.04,
                ease: 'power2.out'
            }, `<+${startDelay}` )
            .to(this.headingBoxChars, {
                duration: 2.5,
                opacity: 1,
                stagger: 0.04,
                ease: 'power2.out'
            }, "<");


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
    }

    setTimelinesOut() {
        this.outTimelines = {};

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
    }

    headingSplitInWords() {
        this.heading.name.options.type = 'words';
        this.heading.name.split();

        this.heading.dots.options.type = 'words';
        this.heading.dots.split();

        this.animateOutWords = gsap.utils.toArray([
            this.heading.name.words,
            this.heading.dots.words,
            this.bottom.words,
        ]);
        this.animateOutWords.shuffle();
    }



    //////////////////////////
    // Handlers
    addHandlers() {
        // 
    }



    //////////////////////////
    // Animate IN / OUT
    animateIn() {
        console.log('animateIn ReceivedLandingTransitions');
        this.view.classList.add('show');

        this.headingBoxLinesTL.play();
        this.headingBoxCharsTL.play();
        this.bottomBoxWordsTL.play();
    }

    animateOut() {
        console.log('animateOut ReceivedLandingTransitions');

        // STOP timelines animating IN
        this.headingBoxLinesTL.pause();
        this.headingBoxCharsTL.pause();
        this.bottomBoxWordsTL.pause();

        this.headingSplitInWords();
        this.setTimelinesOut();

        this.outTimelines.wordsTL.play();
    }
}