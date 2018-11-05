(function () {
    'use strict';

    const pData = nodecg.Replicant('persons:data');
    const pActive = nodecg.Replicant('persons:active');

    class TbgPersons extends Polymer.Element {
        static get is() {
            return 'tbg-persons';
        }

        static get properties() {
            return {
                pData_p1: {
                    type: String,
                    reflectToAttribute: true,
                },
                pData_p1_desc: {
                    type: String,
                    reflectToAttribute: true
                },
                pData_p2: {
                    type: String,
                    reflectToAttribute: true
                },
                pData_p2_desc: {
                    type: String,
                    reflectToAttribute: true
                },
                pData_p3: {
                    type: String,
                    reflectToAttribute: true
                },
                pData_p3_desc: {
                    type: String,
                    reflectToAttribute: true
                },
                pActive: {
                    type: Boolean,
                    reflectToAttribute: true
                },
            };
        }

        ready() {
            super.ready();
            pData.on('change', newVal => {
                this.pData_p1 = newVal.person1;
                this.pData_p1_desc = newVal.person1desc;
                this.pData_p2 = newVal.person2;
                this.pData_p2_desc = newVal.person2desc;
                this.pData_p3 = newVal.person3;
                this.pData_p3_desc = newVal.person3desc;
            });
            pActive.on('change', newVal => {
                this.pActive = newVal;
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
            pActive.value = true;
            this._updateReplicants();
        }

        stop() {
            pActive.value = false;
            this._updateReplicants();
        }
        _updateReplicants() {
            // TODO can we pull this from this.pData_p* instead of with a DOM query?
            pData.value.person1 = Polymer.dom(this.root).querySelector('#pData1').value;
            pData.value.person1desc = Polymer.dom(this.root).querySelector('#pData1desc').value;
            pData.value.person2 = Polymer.dom(this.root).querySelector('#pData2').value;
            pData.value.person2desc = Polymer.dom(this.root).querySelector('#pData2desc').value;
            pData.value.person3 = Polymer.dom(this.root).querySelector('#pData3').value;
            pData.value.person3desc = Polymer.dom(this.root).querySelector('#pData3desc').value;
        }
    }

    customElements.define(TbgPersons.is, TbgPersons);
})();