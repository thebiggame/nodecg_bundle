(function () {
    'use strict';

    const schedNow = nodecg.Replicant("schedule:now");
    const schedNext = nodecg.Replicant("schedule:next");
    const dbActive = nodecg.Replicant('databoard:active');

    class NgTbgDataboard extends Polymer.Element {
        static get is() {
            return 'tbg-databoard';
        }

        static get properties() {
            return {
                dbNow: {
                    type: String,
                    reflectToAttribute: true
                },
                dbNext: {
                    type: String,
                    reflectToAttribute: true
                },
                dbActive: {
                    type: Boolean,
                    reflectToAttribute: true
                },
            };
        }

        ready() {
            super.ready();
            schedNow.on("change", newVal => {
                this.dbNow = newVal;
            });
            schedNext.on("change", newVal => {
                this.dbNext = newVal;
            });
            dbActive.on('change', newVal => {
                this.dbActive = newVal;
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
            dbActive.value = true;
            this._updateReplicants();
        }

        stop() {
            dbActive.value = false;
            this._updateReplicants();
        }
        _updateReplicants() {
            schedNow.value = Polymer.dom(this.root).querySelector('#nowName').value;
            schedNext.value = Polymer.dom(this.root).querySelector('#nextName').value;
        }
    }

    customElements.define(NgTbgDataboard.is, NgTbgDataboard);
})();