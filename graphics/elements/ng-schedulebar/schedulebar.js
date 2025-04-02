(function () {
    'use strict';

    class NgTbgschedulebar extends Polymer.Element {
        static get is() {
            return 'tbg-schedulebar';
        }

        ready() {
            super.ready();
            this.tl = new gsap.timeline({autoRemoveChildren: true});

            const schedData = nodecg.Replicant("schedule:data");

            const gActive = nodecg.Replicant('projector:active');

            this.nextTitle = "";
            this.nextTime = "";
            this.nextTimeUntil = "";

            this.schedUpcoming = [];

            // Initialise message slideshow handlers
            this._initSlideshow();

            const clockRep = nodecg.Replicant('clock');

            schedData.on('change', e => {
                this.handleScheduleData(e);
            });
            gActive.on('change', e => {
                this.handleWipe(e);
            });
        }

        handleWipe(newVal) {
            const outerNode = Polymer.dom(this.root).querySelector('#wipe-outer');
            const innerNode = Polymer.dom(this.root).querySelector('#wipe-inner');
            if (newVal) {
                this.tl.clear().add('in');
                this.tl.to(outerNode, 0.5, {
                    left: "10px",
                    // marginRight: "0px",
                    ease: Quart.easeOut
                }, 'in');
                this.tl.to(outerNode, 1, {
                    marginRight: "0px",
                    borderRadius: "0px 150px 150px 0px",
                    ease: Quart.easeOut
                }, 'in+=0.3');
                this.tl.to(innerNode, 1, {
                    marginRight: "0px",
                    ease: Quart.easeOut
                }, 'in+=0.7');
                this.tl.play('in');
            } else {
                this.tl.clear().add('out');
                this.tl.to(innerNode, 0.8, {
                    marginRight: "100%",
                    ease: Quart.easeInOut
                }, 'out');
                this.tl.to(outerNode, 0.8, {
                    marginRight: "2000px",
                    borderRadius: "0px 0px 0px 0px",
                    ease: Quart.easeInOut
                }, 'out+=0.3');
                this.tl.to(outerNode, 1, {
                    left: "-20%",
                    ease: Quart.easeInOut
                }, 'out+=1.2');
                this.tl.play('out');
            }
        }

        handleScheduleData(e) {
            // The Now pane is always displayed.
            const nowNode = Polymer.dom(this.root).querySelector('#sched-now-box');
            const nowContentNode = nowNode.querySelector('#sched-now-content');
            const nowTimeNode = nowNode.querySelector('#sched-now-time');

            this.schedUpcoming = e.upcoming;

            nowContentNode.textContent = e.now.title;
            if (Date.now() >= new Date(e.now.ts_end)) {
                this.nextTitle = e.now.title;
                this.nextTime = "Please wait";
                nowTimeNode.classList.remove("alert-secondary");
                nowTimeNode.classList.remove("alert-success");
                nowTimeNode.classList.add("alert-warning");
                nowNode.classList.remove("bg-dark");
                nowNode.classList.remove("bg-primary");
                nowNode.classList.add("bg-dark");
            } else if (new Date(e.now.ts_start) <= Date.now()) {
                this.nextTime = "Now";
                nowTimeNode.classList.remove("alert-secondary");
                nowTimeNode.classList.add("alert-success");
                nowNode.classList.remove("bg-dark");
                nowNode.classList.add("bg-primary");
            } else {
                this.nextTime = this._formatTime(e.now.ts_start);
                nowTimeNode.classList.remove("alert-success");
                nowTimeNode.classList.add("alert-secondary");
                nowNode.classList.remove("bg-primary");
                nowNode.classList.add("bg-dark");
            }
        }

        _formatTime(timestamp) {
            return new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }

        _initSlideshow() {
            const slides = Polymer.dom(this.root).querySelectorAll("#message-box .is-message");

            let currentSlideIndex = 0;

            gsap.set(slides, { y: "100%" });
            gsap.set(slides[0], { y: "0%" });
            
            const showNextSlide = () => {
                const slides = Polymer.dom(this.root).querySelectorAll("#message-box .is-message");
                const totalSlides = slides.length;
                const currentSlide = slides[currentSlideIndex];
                const nextSlideIndex = (currentSlideIndex + 1) % totalSlides;
                const nextSlide = slides[nextSlideIndex];

                if (totalSlides >= 2) {
                    // There are slides to animate between.
                    gsap.to(currentSlide, {
                        duration: 0.5,
                        y: "-100%",
                        ease: "power4.inOut",
                        onComplete: () => {
                            gsap.set(currentSlide, { y: "100%" });
                        }
                    });
    
                    gsap.to(nextSlide, {
                        duration: 0.5,
                        y: "0%",
                        ease: "power4.inOut",
                        onComplete: () => {
                            currentSlideIndex = nextSlideIndex;
                        }
                    });
                }
                
            };

            setInterval(showNextSlide, 7500);
        }
    }

    customElements.define(NgTbgschedulebar.is, NgTbgschedulebar);
})();
