import SplitText from '@activetheory/split-text';
import { gsap } from "gsap";
import BaseTransitions from './BaseTransitions.js'

export default class DesktopTransitions extends BaseTransitions {
    constructor() {
        super();
        this.initUI();
    }

    initUI() {
        this.view = document.getElementById('desktopSplashContainer');

        this.heading = {};
        this.heading.top = new SplitText('#deskHeadingTop', { type: 'chars' });
        this.heading.mid = new SplitText('#deskHeadingMid', { type: 'chars' });
        this.heading.bottom = new SplitText('#deskHeadingBottom', { type: 'chars' });
        this.heading.top.chars.forEach((char) => { char.style.transformOrigin = 'top'; });
        this.heading.mid.chars.forEach((char) => { char.style.transformOrigin = 'bottom'; });
        this.heading.bottom.chars.forEach((char) => { char.style.transformOrigin = 'bottom'; });
        this.heading.hearts = document.getElementById('heartsDesktop');

        this.bottom = new SplitText('#receivedSubheading', { type: 'words' });
    }

    setInitialStates()  {
        this.setTimelinesIn();
    }
    
    setTimelinesIn() {
        ///////////////////////////////////////////////////////////////////////
        // HEADING BOX
        // PER LINE
        const topLineDelay = 0.5;
        const midLineDelay = 0.3;
        const bottomLineDelay = 0.3;
        const heartsDelay = 0.9;
        this.headingBoxLinesTL = gsap.timeline({ paused: true })
            .set('#deskHeadingTop', { scale: 1.65 })
            .set('#deskHeadingMid', { scale: 1.65 })
            .set('#deskHeadingBottom', { scale: 1.65 })
            .set(this.heading.hearts, { opacity: 0 })
            .to('#deskHeadingTop', {
                duration: 1.5,
                scale: 1,
                ease: 'power2.out'
            }, topLineDelay)
            .to('#deskHeadingMid', {
                duration: 1.5,
                scale: 1,
                ease: 'power2.out'
            }, `<+${midLineDelay}`)
            .to('#deskHeadingBottom', {
                duration: 1.5,
                scale: 1,
                ease: 'power2.out'
            }, `<+${bottomLineDelay}`)
            .to(this.heading.hearts, {
                duration: 0.7,
                opacity: 1,
                ease: 'power2.out'
            }, `<+${heartsDelay}`);

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
        const bottomBoxDelay = 2.3;
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



    //////////////////////////
    // Handlers



    //////////////////////////
    // Animate IN / OUT
    animateIn() {
        console.log('animateIn DesktopTransitions');
        this.view.classList.add('show');

        this.headingBoxLinesTL.play();
        this.headingBoxCharsTL.play();
        this.bottomBoxWordsTL.play();
    }
}