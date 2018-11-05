(function () {
    'use strict';

    const cdData = nodecg.Replicant('countdown:data');
    const cdName = nodecg.Replicant('countdown:name');
    const cdActive = nodecg.Replicant('countdown:active');

    class TbgCountdown extends Polymer.Element {
        static get is() {
            return 'tbg-countdown';
        }

        static get properties() {
            return {
                countdownTime: {},
                countdownName: {
                    type: String,
                    reflectToAttribute: true
                },
                countdownActive: {
                    type: Boolean,
                    reflectToAttribute: true
                },
            };
        }

        ready() {
            super.ready();
            cdData.on('change', newVal => {
                this.countdownTime = newVal;
                Polymer.dom(this.root).querySelector('#countdownTimeInput').setMS(newVal.minutes, newVal.seconds);
            });
            cdName.on('change', newVal => {
                this.countdownName = newVal;
            });
            cdActive.on('change', newVal => {
                this.countdownActive = newVal;
                if (newVal) {
                    Polymer.dom(this.root).querySelector('#countdownContainer').setAttribute('disabled', 'true');
                    Polymer.dom(this.root).querySelector('#start').setAttribute('disabled', 'true');
                    Polymer.dom(this.root).querySelector('#stop').removeAttribute('disabled');
                } else {
                    Polymer.dom(this.root).querySelector('#countdownContainer').removeAttribute('disabled');
                    Polymer.dom(this.root).querySelector('#start').removeAttribute('disabled');
                    Polymer.dom(this.root).querySelector('#stop').setAttribute('disabled', 'true');
                }
                this.checkStartButton();

            });

        }

        start() {
            nodecg.sendMessage('countdown:start', Polymer.dom(this.root).querySelector('#countdownTimeInput').value);
            this._updateReplicants();
        }

        stop() {
            nodecg.sendMessage('countdown:stop');
            this._updateReplicants();
        }

        _handleTimeInvalidChanged(e) {
            if (e.detail.value) {
                this.$.start.setAttribute('disabled', 'true');
            } else {
                this.$.start.removeAttribute('disabled');
            }

            this.checkStartButton();
        }

        /**
         * Enables or disables the timer start button based on some criteria.
         * @returns {undefined}
         */
        checkStartButton() {
            if (this.shadowRoot.querySelector('#start').hasAttribute('disabled')) {
                this.shadowRoot.querySelector('#start').setAttribute('disabled', 'true');
                this.shadowRoot.querySelector('#stop').removeAttribute('disabled');
            } else {
                this.shadowRoot.querySelector('#start').removeAttribute('disabled');
                this.shadowRoot.querySelector('#stop').setAttribute('disabled', 'true');
            }
        }
        _updateReplicants() {
            cdName.value = Polymer.dom(this.root).querySelector('#countdownName').value;
        }
    }

    customElements.define(TbgCountdown.is, TbgCountdown);
})();