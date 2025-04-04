(function () {
    'use strict';

    class NgTbgdatabar extends Polymer.Element {
        static get is() {
            return 'tbg-databar';
        }

        ready() {
            super.ready();
            this.tl = new gsap.timeline({autoRemoveChildren: true});

            const gActive = nodecg.Replicant('projector:active');

            // const repInfoBody = nodecg.Replicant("event:info:body");
            // const repInfoActive = nodecg.Replicant("event:info:active");

            const musicTitle = nodecg.Replicant("music:song");
            const musicArtist = nodecg.Replicant("music:artist");

            // Initialise message slideshow handlers
            this._initSlideshow();

            const clockRep = nodecg.Replicant('clock');

            const netWANBwDown = nodecg.Replicant("network:wan:bandwidth:down");
            const netWANBwUp = nodecg.Replicant("network:wan:bandwidth:up");

            gActive.on('change', e => {
                this.handleWipe(e);
            });
            clockRep.on('change', e => {
                this.updateClock(e);
            });

            musicTitle.on('change', e => {
                this.updateMusic(e, null);
            });
            musicArtist.on('change', e => {
                this.updateMusic(null, e);
            });

            netWANBwDown.on('change', e => {
                const contentNode = Polymer.dom(this.root).querySelector('#net-bw-down-content');
                this.handleBwValue(e, contentNode);
            });
            netWANBwUp.on('change', e => {
                const contentNode = Polymer.dom(this.root).querySelector('#net-bw-up-content');
                this.handleBwValue(e, contentNode);
            });

            const eventNodes = Polymer.dom(this.root).querySelectorAll('.event-num');
            for (const eNode of eventNodes) {
                eNode.textContent = nodecg.bundleConfig.event_num;
            }
            
        }

        handleBwValue(newVal, elem) {
            if (newVal == null || elem == null) {
                return;
            }
            var content;
            if (newVal == -1) {
                // Presently unknown bandwidth data
                elem.innerText = "???";
            } else {
                let oldVal = parseInt(elem.InnerText, 10);
                if (isNaN(oldVal)) { 
                    oldVal = 0;
                }
                const target = Math.floor((newVal / 100) * 10) / 10;
                gsap.to(elem, {
                    duration: 1,
                    ease: 'power1.inOut',
                    textContent: target,
                    snap: {
                        textContent: 0.01,
                    },
                    onUpdate: function () {
                        elem.textContent = parseFloat(elem.textContent).toFixed(1);
                    },
                    onComplete: function () {
                        elem.textContent = target.toFixed(1);
                    }
                });
                if (newVal >= nodecg.bundleConfig.network.bwHighThreshold) {
                    elem.classList.add("bw-high-anim");
                } else {
                    elem.classList.remove("bw-high-anim");
                }
                
            }

            
        }

        handleWipe(newVal) {
            const outerNode = Polymer.dom(this.root).querySelector('#wipe-outer');
            const innerNode = Polymer.dom(this.root).querySelector('#wipe-inner');
            if (newVal) {
                this.tl.clear().add('in');
                this.tl.to(outerNode, 0.5, {
                    top: "990px",
                    // marginRight: "0px",
                    ease: Quart.easeOut
                }, 'in');
                this.tl.to(outerNode, 1, {
                    marginRight: "0px",
                    borderRadius: "0px 150px 150px 0px",
                    ease: Quart.easeOut
                }, 'in+=0.5');
                this.tl.to(innerNode, 1, {
                    marginRight: "0px",
                    ease: Quart.easeOut
                }, 'in+=1.0');
                this.tl.play('in');
            } else {
                this.tl.clear().add('out');
                this.tl.to(innerNode, 1, {
                    marginRight: "100%",
                    ease: Quart.easeInOut
                }, 'out');
                this.tl.to(outerNode, 1, {
                    marginRight: "1900px",
                    borderRadius: "0px 0px 0px 0px",
                    ease: Quart.easeInOut
                }, 'out+=0.5');
                this.tl.to(outerNode, 1, {
                    top: "100%",
                    ease: Quart.easeInOut
                }, 'out+=1.5');
                this.tl.play('out');
            }
        }

        updateMusic(title, artist) {
            const titleNode = Polymer.dom(this.root).querySelector('#music-title');
            const artistNode = Polymer.dom(this.root).querySelector('#music-artist');

            if (title != null) {
                titleNode.textContent = title;
            }
            if (artist != null) {
                artistNode.textContent = artist;
            }
        }

        updateClock(newVal) {
            const clockNode = Polymer.dom(this.root).querySelector('#clock');
            // const clockPeriodNode = Polymer.dom(this.root).querySelector('#clock-period');
            const dayNode = Polymer.dom(this.root).querySelector('#day');
            var period = new Date(newVal.time);
            clockNode.textContent = period.toTimeString().replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1");
            // clockPeriodNode.textContent = period.getHours() >= 12 ? 'pm' : 'am';

            if (period.getDay() == 5) {
                dayNode.textContent = '1';
            } else if (period.getDay() == 6) {
                dayNode.textContent = '2';
            } else if (period.getDay() == 0) {
                dayNode.textContent = '3';
            } else {
                dayNode.textContent = '?'
            }

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

    customElements.define(NgTbgdatabar.is, NgTbgdatabar);
})();
