(function () {
    'use strict';

    class TbgPersons extends Polymer.Element {
        static get is() {
            return 'tbg-persons';
        }

        ready() {
            super.ready();
            this.tl = new gsap.timeline({autoRemoveChildren: true});

            const pData = nodecg.Replicant('persons:data');
            const pActive = nodecg.Replicant('persons:active');

            pData.on('change', e => {
                const node1 = Polymer.dom(this.root).querySelector('#persons-1');
                const data1Node = Polymer.dom(this.root).querySelector('#persons-data-1');
                const data1descNode = Polymer.dom(this.root).querySelector('#persons-sub-1');
                const node2 = Polymer.dom(this.root).querySelector('#persons-2');
                const data2Node = Polymer.dom(this.root).querySelector('#persons-data-2');
                const data2descNode = Polymer.dom(this.root).querySelector('#persons-sub-2');
                const node3 = Polymer.dom(this.root).querySelector('#persons-3');
                const data3Node = Polymer.dom(this.root).querySelector('#persons-data-3');
                const data3descNode = Polymer.dom(this.root).querySelector('#persons-sub-3');

                data1Node.textContent = e.person1;
                data2Node.textContent = e.person2;
                data3Node.textContent = e.person3;

                if (e.person1) {
                    node1.style.display = '';
                } else {
                    node1.style.display = 'none';
                }

                if (e.person2) {
                    node2.style.display = '';
                } else {
                    node2.style.display = 'none';
                }

                if (e.person3) {
                    node3.style.display = '';
                } else {
                    node3.style.display = 'none';
                }

                data1descNode.textContent = e.person1desc;
                data2descNode.textContent = e.person2desc;
                data3descNode.textContent = e.person3desc;
            });
            pActive.on('change', e => {
                this.handleWipe(e);
            });
            const eventNode = Polymer.dom(this.root).querySelector('#persons-event-num');
            eventNode.textContent = nodecg.bundleConfig.event_num;
        }

        handleWipe(newVal) {
            const outerNode = Polymer.dom(this.root).querySelector('#persons-outer');
            const innerNode = Polymer.dom(this.root).querySelector('#persons-inner');

            if (newVal) {
                this.tl.add('in');
                this.tl.to(outerNode, 1, {
                    top: "750px",
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

    customElements.define(TbgPersons.is, TbgPersons);
})();
