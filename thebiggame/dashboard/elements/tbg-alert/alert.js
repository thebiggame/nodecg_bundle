(function () {
    'use strict';

    const alertData = nodecg.Replicant('alert:data');
    const alertFlair = nodecg.Replicant('alert:flair');
    const alertDelay = nodecg.Replicant('alert:delay');

    class TbgAlert extends Polymer.Element {
        static get is() {
            return 'tbg-alert';
        }

        static get properties() {
            return {
                alertData: {
                    type: String,
                    value: '?',
                    reflectToAttribute: true
                },
                alertFlair: {
                    type: Boolean,
                    reflectToAttribute: true
                },
                alertDelay: {
                    type: Boolean,
                    reflectToAttribute: true
                },
            };
        }

        ready() {
            super.ready();
            alertData.on('change', newVal => {
                this.alertData = newVal;
            });
            alertFlair.on('change', newVal => {
                this.alertFlair = newVal;
            });
            alertDelay.on('change', newVal => {
                this.alertDelay = newVal;
            });

        }
        arm() {
            this._updateReplicants();
            console.log(this.alertData);
            function firealert(flair, name) {
                nodecg.sendMessage('alert', {
                    flair: flair,
                    name: name
                });
            }
            if (this.alertDelay) {
                setTimeout(function () {
                    firealert(this.alertFlair, this.alertData);
                }, 5000)
            } else {
                firealert(this.alertFlair, this.alertData);
            }
        }

        disarm() {
            console.log('sending leave event');
            nodecg.sendMessage('alert-end');
        }
        _updateReplicants() {
            alertData.value = Polymer.dom(this.root).querySelector('#alertDataInput').value;
            alertFlair.value = Polymer.dom(this.root).querySelector('#alertFlairInput').checked;
            alertDelay.value = Polymer.dom(this.root).querySelector('#alertDelayInput').checked;
        }
    }

    customElements.define(TbgAlert.is, TbgAlert);
})();