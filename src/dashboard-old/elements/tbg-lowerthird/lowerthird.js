(function () {
    'use strict';

    const ltData = nodecg.Replicant('lowerthird:data');
    const ltActive = nodecg.Replicant('lowerthird:active');

    class TbgLowerThird extends Polymer.Element {
        static get is() {
            return 'tbg-lowerthird';
        }

        static get properties() {
            return {
                ltData: {
                    type: String,
                    reflectToAttribute: true
                },
                hwActive: {
                    type: Boolean,
                    reflectToAttribute: true
                },
            };
        }

        ready() {
            super.ready();
            ltData.on('change', newVal => {
                this.ltData = newVal;
            });
            ltActive.on('change', newVal => {
                this.ltActive = newVal;
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
            ltActive.value = true;
            this._updateReplicants();
        }

        stop() {
            ltActive.value = false;
            this._updateReplicants();
        }
        _updateReplicants() {
            ltData.value = Polymer.dom(this.root).querySelector('#ltData').value;
        }
    }

    customElements.define(TbgLowerThird.is, TbgLowerThird);
})();