(function () {
    'use strict';

    const hwData = nodecg.Replicant('halfwipe:data');
    const hwActive = nodecg.Replicant('halfwipe:active');

    class TbgHalfwipe extends Polymer.Element {
        static get is() {
            return 'tbg-halfwipe';
        }

        static get properties() {
            return {
                hwNow: {
                    type: String,
                    reflectToAttribute: true
                },
                hwNext: {
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
            hwData.on('change', newVal => {
                this.hwNow = newVal.now;
                this.hwNext = newVal.next;
            });
            hwActive.on('change', newVal => {
                this.hwActive = newVal;
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
            hwActive.value = true;
            this._updateReplicants();
        }

        stop() {
            hwActive.value = false;
            this._updateReplicants();
        }
        _updateReplicants() {
            hwData.value.now = Polymer.dom(this.root).querySelector('#nowName').value;
            hwData.value.next = Polymer.dom(this.root).querySelector('#nextName').value;
        }
    }

    customElements.define(TbgHalfwipe.is, TbgHalfwipe);
})();