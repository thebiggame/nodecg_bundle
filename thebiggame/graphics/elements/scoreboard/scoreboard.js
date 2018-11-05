(function () {
    'use strict';

    class TbgScoreboard extends Polymer.Element {
        static get is() {
            return 'tbg-scoreboard';
        }

        ready() {
            super.ready();
            this.tl = new TimelineLite({autoRemoveChildren: true});

            const sData = nodecg.Replicant('scoreboard:data');
            const sActive = nodecg.Replicant('scoreboard:active');

            sData.on('change', e => {
                this.handleScoreUpdate(e)
            });
            sActive.on('change', e => {
                this.handleAnimate(e);
            });
            const eventNode = Polymer.dom(this.root).querySelector('#scoreboard-event-num');
            eventNode.textContent = nodecg.bundleConfig.event_num;
        }

        handleAnimate(newVal) {
            const outerNode = Polymer.dom(this.root).querySelector('#scoreboard-inner');
            const sponsorNode = Polymer.dom(this.root).querySelector('#sponsor-data');

            const slideNode = Polymer.dom(this.root).querySelector('#slideout');

            if (newVal) {
                this.tl.add('in');
                this.tl.to(outerNode, 1, {
                    top: "850px",
                    ease: Quart.easeOut
                }, 'in');
                this.tl.to(slideNode, 1, {
                    x: 0,
                    opacity: 1,
                    ease: Quart.easeOut
                }, 'in+=0.5');
                this.tl.to(sponsorNode, 1, {
                    y: 0,
                    opacity: 1,
                    ease: Quart.easeOut
                }, 'in+=2');
                this.tl.play('in');
            } else {
                this.tl.add('out');
                this.tl.to(sponsorNode, 0.5, {
                    y: -10,
                    opacity: 0,
                    ease: Quart.easeInOut
                }, 'out');
                this.tl.to(slideNode, 1, {
                    x: -50,
                    opacity: 0,
                    ease: Quart.easeInOut
                }, 'out');
                this.tl.to(outerNode, 1, {
                    top: "100%",
                    ease: Quart.easeInOut
                }, 'out+=0.25');
                this.tl.play('out');
            }
        }
        handleScoreUpdate(newVal) {
            const dataTitleNode = Polymer.dom(this.root).querySelector('#scoreboard-title');

            const dataSc1PNode = Polymer.dom(this.root).querySelector('#score-p1');
            const dataSc1ScWrapNode = Polymer.dom(this.root).querySelector('#score-p1-total');
            const dataSc1ScNode = Polymer.dom(this.root).querySelector('#scoreboard-p1-total');

            const dataSc2PNode = Polymer.dom(this.root).querySelector('#score-p2');
            const dataSc2ScWrapNode = Polymer.dom(this.root).querySelector('#score-p2-total');
            const dataSc2ScNode = Polymer.dom(this.root).querySelector('#scoreboard-p2-total');

            dataSc1PNode.textContent = newVal.team1.name;
            dataSc1ScNode.textContent = newVal.team1.score;

            dataSc2PNode.textContent = newVal.team2.name;
            dataSc2ScNode.textContent = newVal.team2.score;

            dataTitleNode.textContent = newVal.title;

            if (newVal.title) {
                dataTitleNode.style.opacity = 1;
            } else {
                dataTitleNode.style.opacity = 0;
            }

            if (newVal.p1score || newVal.p2score) {
                dataSc1ScWrapNode.setAttribute('style', 'display:block');
                dataSc2ScWrapNode.setAttribute('style', 'display:block');
            } else {
                dataSc1ScWrapNode.setAttribute('style', 'display:none !important');
                dataSc2ScWrapNode.setAttribute('style', 'display:none !important');
            }
        }
    }

    customElements.define(TbgScoreboard.is, TbgScoreboard);
})();
