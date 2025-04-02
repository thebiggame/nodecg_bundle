(function () {
    'use strict';

    const graphicActive = nodecg.Replicant('projector:active');

    class NgTbgProjAnimate extends Polymer.Element {
        static get is() {
            return 'tbg-proj-animate';
        }

        static get properties() {
            return {
                graphicActive: {
                    type: Boolean,
                    reflectToAttribute: true
                },
            };
        }

        ready() {
            super.ready();
            graphicActive.on('change', newVal => {
                this.graphicActive = newVal;
                if (newVal) {
                    Polymer.dom(this.root).querySelector('#start').setAttribute('disabled', 'true');
                    Polymer.dom(this.root).querySelector('#stop').removeAttribute('disabled');
                } else {
                    Polymer.dom(this.root).querySelector('#start').removeAttribute('disabled');
                    Polymer.dom(this.root).querySelector('#stop').setAttribute('disabled', 'true');
                }

            });

        }

        start() {
            graphicActive.value = true;
            // this._updateReplicants();
        }

        stop() {
            graphicActive.value = false;
            // this._updateReplicants();
        }
        // _updateReplicants() {
        //     schedNow.value = Polymer.dom(this.root).querySelector('#nowName').value;
        //     schedNext.value = Polymer.dom(this.root).querySelector('#nextName').value;
        // }
    }

    customElements.define(NgTbgProjAnimate.is, NgTbgProjAnimate);
})();