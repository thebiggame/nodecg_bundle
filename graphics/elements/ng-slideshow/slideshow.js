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

            const gActive = nodecg.Replicant('projector:active');

            const repInfoBody = nodecg.Replicant("event:info:body");
            const repInfoActive = nodecg.Replicant("event:info:active");

            repInfoBody.on('change', e => {
                this.handleNewInfo(e);
            });
            repInfoActive.on('change', e => {
                this.handleInfoVisibilityChange(e);
            });

            gActive.on('change', e => {
                this.handleWipe(e);
            });

            // Initialise slideshow handlers
            // this._initSlideshow();
            
            NodeCG.waitForReplicants(repSlides).then(() => {
                this.handleUpdatedSlideImages(repSlides.value);
                this._initSlideshow();
            });
            repSlides.on('change', e => {
                this.handleUpdatedSlideImages(e);
            });

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
                    borderRadius: "0px 15px 15px 0px",
                    ease: Quart.easeOut
                }, 'in+=0.2');
                this.tl.to(innerNode, 1, {
                    marginRight: "0px",
                    ease: Quart.easeOut
                }, 'in+=0.75');
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
                    left: "-10%",
                    ease: Quart.easeInOut
                }, 'out+=1.5');
                this.tl.play('out');
            }
        }

        handleNewInfo(newVal) {
            const infoNode = Polymer.dom(this.root).querySelector('#info');
            const infoBodyNode = infoNode.querySelector('#info-body');

            infoBodyNode.innerHTML = newVal;

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
                        ease: "power4.inOut",
                        onComplete: () => {
                            gsap.set(currentSlide, { x: "100%" });
                        }
                    });
    
                    gsap.to(nextSlide, {
                        duration: 1.5,
                        x: "0%",
                        ease: "power4.inOut",
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
