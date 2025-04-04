(function () {
    'use strict';

    const sData = nodecg.Replicant('scoreboard:data');
    const sActive = nodecg.Replicant('scoreboard:active');

    class TbgScoreboard extends Polymer.Element {
        static get is() {
            return 'tbg-scoreboard';
        }

        static get properties() {
            return {
                s1_name: {
                    type: String,
                    reflectToAttribute: true,
                },
                s1_score: {
                    type: Number,
                    reflectToAttribute: true
                },
                s2_name: {
                    type: String,
                    reflectToAttribute: true
                },
                s2_score: {
                    type: Number,
                    reflectToAttribute: true
                },
                sTitle: {
                    type: String,
                    reflectToAttribute: true
                },
                sActive: {
                    type: Boolean,
                    reflectToAttribute: true
                },
            };
        }

        ready() {
            super.ready();
            sData.on('change', newVal => {
                this.s1_score = newVal.team1.score;
                this.s1_name = newVal.team1.name;
                this.s2_score = newVal.team2.score;
                this.s2_name = newVal.team2.name;
                this.sTitle = newVal.title;
            });
            sActive.on('change', newVal => {
                this.sActive = newVal;
                if (newVal) {
                    Polymer.dom(this.root).querySelector('#start').setAttribute('disabled', 'true');
                    Polymer.dom(this.root).querySelector('#stop').removeAttribute('disabled');
                } else {
                    Polymer.dom(this.root).querySelector('#start').removeAttribute('disabled');
                    Polymer.dom(this.root).querySelector('#stop').setAttribute('disabled', 'true');
                }

            });
        }

        incrementTeam1Score() {
            if (this.s1_score) {
                // Reparse the variable as an integer because it sometimes ends up being a string for unknown reasons (bug?)
                this.s1_score = (parseInt(this.s1_score) + 1);
            } else {
                this.s1_score = 1;
            }
            this._updateReplicants();
        }
        decrementTeam1Score() {
            if (this.s1_score) {
                this.s1_score = (parseInt(this.s1_score) - 1);
            } else {
                this.s1_score = -1;
            }
            this._updateReplicants();
        }
        incrementTeam2Score() {
            if (this.s2_score) {
                // Reparse the variable as an integer because it sometimes ends up being a string for unknown reasons (bug?)
                this.s2_score = (parseInt(this.s2_score) + 1);
            } else {
                this.s2_score = 1;
            }
            this._updateReplicants();
        }
        decrementTeam2Score() {
            if (this.s2_score) {
                this.s2_score = (parseInt(this.s2_score) - 1);
            } else {
                this.s2_score = -1;
            }
            this._updateReplicants();
        }

        start() {
            sActive.value = true;
            this._updateReplicants();
        }

        stop() {
            sActive.value = false;
            this._updateReplicants();
        }
        _updateReplicants() {
            // TODO can we pull this from the properties instead of with a DOM query?
            sData.value.team1.score = Polymer.dom(this.root).querySelector('#data1score').value;
            sData.value.team1.name = Polymer.dom(this.root).querySelector('#data1').value;
            sData.value.team2.score = Polymer.dom(this.root).querySelector('#data2score').value;
            sData.value.team2.name = Polymer.dom(this.root).querySelector('#data2').value;
            sData.value.title = Polymer.dom(this.root).querySelector('#title').value;
        }
    }

    customElements.define(TbgScoreboard.is, TbgScoreboard);
})();