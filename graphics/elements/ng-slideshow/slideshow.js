(function () {
    'use strict';

    class NgTbgSlideshow extends Polymer.Element {
        static get is() {
            return 'tbg-slideshow';
        }

        ready() {
            super.ready();
            this.tl = new gsap.timeline({autoRemoveChildren: true});

            const repSlides = nodecg.Replicant('assets:stage-slides');

            this.currentSlideIndex = 0;

            const repInfoBody = nodecg.Replicant("event:info:body");
            const repInfoActive = nodecg.Replicant("event:info:active");

            repInfoBody.on('change', e => {
                this.handleNewInfo(e);
            });
            repInfoActive.on('change', e => {
                this.handleInfoVisibilityChange(e);
            });

            // Initialise slideshow handlers
            this._initSlideshow();
            
            NodeCG.waitForReplicants(repSlides).then(() => {
                this.handleUpdatedSlideImages(repSlides.value);
            });
            repSlides.on('change', e => {
                this.handleUpdatedSlideImages(e);
            });

        }

        handleBwValue(newVal, elem) {
            if (newVal == null || elem == null) {
                return;
            }
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

        handleUpdatedSlideImages(newSlides) {
            // Yeet all existing slides
            const slideNode = Polymer.dom(this.root).querySelector("#slides");
            const assetSlides = slideNode.querySelectorAll(".is-asset-slide");
            assetSlides.forEach(element => element.remove());

            if (newSlides.length > 0) {
                // Repopulate with new slides
                newSlides.forEach(slide => {
                    var el = document.createElement("img");
                    el.classList.add("is-slide");
                    el.classList.add("is-asset-slide");
                    el.src = slide.url;
                    gsap.set(el, { x: "100%" });
                    slideNode.appendChild(el);
                });
            } else {
                // Default slide
                var el = document.createElement("b");
                    el.classList.add("is-slide");
                    el.classList.add("is-asset-slide");
                    el.textContent = "No asset slides loaded - crew, fix this!"
                    slideNode.appendChild(el);
            }
        }

        handleNewInfo(newVal) {
            const infoNode = Polymer.dom(this.root).querySelector('#info');
            const infoBodyNode = infoNode.querySelector('#info-body');

            infoBodyNode.textContent = newVal;

            if (newVal != "") {
                // Make sure it's visible.
                infoNode.classList.remove("d-none");
            } else {
                // Hide when no content.
                infoNode.classList.add("d-none");
            }
        }
        handleInfoVisibilityChange(newVal) {
            const infoNode = Polymer.dom(this.root).querySelector('#info');
            const schedNode = Polymer.dom(this.root).querySelector('#slides')
            if (newVal) {
                // Make sure it's visible.
                schedNode.classList.add("d-none");
                infoNode.classList.remove("d-none")
                // Play the announcement chime.
                setTimeout(() => {
                    nodecg.playSound('announcementCue');
                }, 0);
            } else {
                // Hide when no content.
                schedNode.classList.remove("d-none");
                infoNode.classList.add("d-none");
            }
        }


        _initSlideshow() {
            const slides = Polymer.dom(this.root).querySelectorAll("#slides .is-slide");

            let currentSlideIndex = 0;

            gsap.set(slides, { x: "100%" });
            gsap.set(slides[0], { x: "0%" });
            
            const showNextSlide = () => {
                const slides = Polymer.dom(this.root).querySelectorAll("#slides .is-slide");
                const totalSlides = slides.length;
                const currentSlide = slides[currentSlideIndex];
                const nextSlideIndex = (currentSlideIndex + 1) % totalSlides;
                const nextSlide = slides[nextSlideIndex];

                if (totalSlides >= 2) {
                    // There are slides to animate between.
                    gsap.to(currentSlide, {
                        duration: 1.5,
                        x: "-100%",
                        ease: "power4.out",
                        onComplete: () => {
                            gsap.set(currentSlide, { x: "100%" });
                        }
                    });
    
                    gsap.to(nextSlide, {
                        duration: 1.5,
                        x: "0%",
                        ease: "power4.out",
                        onComplete: () => {
                            currentSlideIndex = nextSlideIndex;
                        }
                    });
                }
                
            };

            setInterval(showNextSlide, nodecg.bundleConfig.stage.slideshow_interval * 1000);
        }
    }

    customElements.define(NgTbgSlideshow.is, NgTbgSlideshow);
})();
