(function () {
    'use strict';

    class NgTbgDataboard extends Polymer.Element {
        static get is() {
            return 'tbg-databoard';
        }

        ready() {
            super.ready();
            this.tl = new gsap.timeline({autoRemoveChildren: true});

            const schedNow = nodecg.Replicant("schedule:now");
            const schedNext = nodecg.Replicant("schedule:next");
            const dbActive = nodecg.Replicant('databoard:active');

            // const repInfoBody = nodecg.Replicant("event:info:body");
            // const repInfoActive = nodecg.Replicant("event:info:active");

            const clockRep = nodecg.Replicant('clock');

            const netWANBwDown = nodecg.Replicant("network:wan:bandwidth:down");
            const netWANBwUp = nodecg.Replicant("network:wan:bandwidth:up");

            schedNow.on('change', e => {
                const nowNode = Polymer.dom(this.root).querySelector('#now-body');

                nowNode.textContent = e;
            });
            schedNext.on('change', e => {
                const nextNode = Polymer.dom(this.root).querySelector('#next-body');
                const nextHeading = Polymer.dom(this.root).querySelector('#next-heading');

                if (e) {
                    nextNode.textContent = e;
                    nextHeading.style.opacity = 1;
                    nextNode.style.opacity = 1;
                } else {
                    nextNode.textContent = "Nothing";
                    nextHeading.style.opacity = 0.0001;
                    nextNode.style.opacity = 0;
                }
            });
            dbActive.on('change', e => {
                this.handleWipe(e);
            });
            // repInfoBody.on('change', e => {
            //     this.handleNewInfo(e);
            // });
            // repInfoActive.on('change', e => {
            //     this.handleInfoVisibilityChange(e);
            // });
            clockRep.on('change', e => {
                this.updateClock(e);
            });

            netWANBwDown.on('change', e => {
                const contentNode = Polymer.dom(this.root).querySelector('#net-bw-down-content');
                this.handleBwValue(e, contentNode);
            });
            netWANBwUp.on('change', e => {
                const contentNode = Polymer.dom(this.root).querySelector('#net-bw-up-content');
                this.handleBwValue(e, contentNode);
            });

            const eventNode = Polymer.dom(this.root).querySelector('#event-num');
            eventNode.textContent = nodecg.bundleConfig.event_num;
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
                    top: "800px",
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

        // handleNewInfo(newVal) {
        //     const infoNode = Polymer.dom(this.root).querySelector('#info');
        //     const infoBodyNode = infoNode.querySelector('#info-body');

        //     infoBodyNode.textContent = newVal;

        //     if (newVal != "") {
        //         // Make sure it's visible.
        //         infoNode.classList.remove("d-none");
        //     } else {
        //         // Hide when no content.
        //         infoNode.classList.add("d-none");
        //     }
        // }
        // handleInfoVisibilityChange(newVal) {
        //     const infoNode = Polymer.dom(this.root).querySelector('#info');
        //     const schedNode = Polymer.dom(this.root).querySelector('#schedule')
        //     if (newVal) {
        //         // Make sure it's visible.
        //         schedNode.classList.add("d-none");
        //         infoNode.classList.remove("d-none")
        //         // Play the announcement chime.
        //         setTimeout(() => {
        //             nodecg.playSound('announcementCue');
        //         }, 0);
        //     } else {
        //         // Hide when no content.
        //         schedNode.classList.remove("d-none");
        //         infoNode.classList.add("d-none");
        //     }
        // }

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
    }

    customElements.define(NgTbgDataboard.is, NgTbgDataboard);
})();
