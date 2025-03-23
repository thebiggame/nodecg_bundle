(function () {
    'use strict';

    const repInfoBody = nodecg.Replicant("event:info:body");
    const repInfoActive = nodecg.Replicant("event:info:active");

    class NgTbgInfo extends Polymer.Element {
        static get is() {
            return 'tbg-info';
        }

        static get properties() {
            return {
                infoBody: {
                    type: String,
                    reflectToAttribute: true
                },
                infoActive: {
                    type: Boolean,
                    reflectToAttribute: true
                },
            };
        }

        ready() {
            super.ready();
            repInfoBody.on("change", newVal => {
                this.infoBody = newVal;
            });
            repInfoActive.on('change', newVal => {
                this.infoActive = newVal;
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
            repInfoActive.value = true;
            this._updateReplicants();
        }

        stop() {
            repInfoActive.value = false;
            this._updateReplicants();
        }
        _updateReplicants() {
            repInfoBody.value = Polymer.dom(this.root).querySelector('#infoBody').value;
        }
    }

    customElements.define(NgTbgInfo.is, NgTbgInfo);
})();