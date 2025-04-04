(function () {
    'use strict';

    class TbgLowerThird extends Polymer.Element {
        static get is() {
            return 'tbg-lowerthird';
        }

        ready() {
            super.ready();
            this.tl = new gsap.timeline({autoRemoveChildren: true});

            const hwData = nodecg.Replicant('lowerthird:data');
            const hwActive = nodecg.Replicant('lowerthird:active');

            hwData.on('change', e => {
                const dataNode = Polymer.dom(this.root).querySelector('#lowerthird-data-body');
                dataNode.textContent = e;
            });
            hwActive.on('change', e => {
                this.handleWipe(e);
            });
            const eventNode = Polymer.dom(this.root).querySelector('#lowerthird-event-num');
            eventNode.textContent = nodecg.bundleConfig.event_num;
        }

        handleWipe(newVal) {
            const outerNode = Polymer.dom(this.root).querySelector('#lowerthird-outer');
            const innerNode = Polymer.dom(this.root).querySelector('#lowerthird-inner');
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

    }

    customElements.define(TbgLowerThird.is, TbgLowerThird);
})();