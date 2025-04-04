(function () {
    'use strict';

    class TbgHalfwipe extends Polymer.Element {
        static get is() {
            return 'tbg-halfwipe';
        }

        ready() {
            super.ready();
            this.tl = new gsap.timeline({autoRemoveChildren: true});

            const hwData = nodecg.Replicant('halfwipe:data');
            const hwActive = nodecg.Replicant('halfwipe:active');
            const clockRep = nodecg.Replicant('clock');

            hwData.on('change', e => {
                const nowNode = Polymer.dom(this.root).querySelector('#now-body');
                const nextNode = Polymer.dom(this.root).querySelector('#next-body');
                const nextHeading = Polymer.dom(this.root).querySelector('#next-heading');

                nowNode.textContent = e.now;
                nextNode.textContent = e.next;
                if (e.next) {
                    nextHeading.style.opacity = 1;
                    nextNode.style.opacity = 1;
                } else {
                    nextNode.textContent = "Nothing";
                    nextHeading.style.opacity = 0.0001;
                    nextNode.style.opacity = 0;
                }
            });
            hwActive.on('change', e => {
                this.handleWipe(e);
            });
            clockRep.on('change', e => {
                this.updateClock(e);
            });
            const eventNode = Polymer.dom(this.root).querySelector('#event-num');
            eventNode.textContent = nodecg.bundleConfig.event_num;
        }

        handleWipe(newVal) {
            const outerNode = Polymer.dom(this.root).querySelector('#wipe-outer');
            const innerNode = Polymer.dom(this.root).querySelector('#wipe-inner');
            if (newVal) {
                this.tl.add('in');
                this.tl.to(outerNode, 1, {
                    top: "850px",
                    ease: Quart.easeOut
                }, 'in');
                this.tl.to(innerNode, 1, {
                    top: "0px",
                    ease: Quart.easeOut
                }, 'in+=0.3');
                this.tl.play('in');
            } else {
                this.tl.add('out');
                this.tl.to(innerNode, 1, {
                    top: "100%",
                    ease: Quart.easeInOut
                }, 'out');
                this.tl.to(outerNode, 1, {
                    top: "100%",
                    ease: Quart.easeInOut
                }, 'out+=0.2');
                this.tl.play('out');
            }
        }


        updateClock(newVal) {
            const clockNode = Polymer.dom(this.root).querySelector('#clock');
            const clockPeriodNode = Polymer.dom(this.root).querySelector('#clock-period');
            const dayNode = Polymer.dom(this.root).querySelector('#day');
            var period = new Date(newVal.time);
            clockNode.textContent = period.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
            clockPeriodNode.textContent = period.getHours() >= 12 ? 'pm' : 'am';

            if (period.getDay() == 5) {
                dayNode.textContent = '1/3';
            } else if (period.getDay() == 6) {
                dayNode.textContent = '2/3';
            } else if (period.getDay() == 0) {
                dayNode.textContent = '3/3';
            } else {
                dayNode.textContent = '?/3'
            }

        }
    }

    customElements.define(TbgHalfwipe.is, TbgHalfwipe);
})();
