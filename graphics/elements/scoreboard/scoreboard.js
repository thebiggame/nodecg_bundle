(function () {
    'use strict';

    Polymer({
        is: 'tbg-scoreboard',

        ready() {
            this.tl = window.wipeTL;
            console.log(this.wipeTL);

			const scoreRep = nodecg.Replicant('scoreboard');

            scoreRep.on('change', e => {
                this.handleScore(e);
            });

            const eventNode = document.getElementById('scoreboard-event-num');
            eventNode.textContent = nodecg.bundleConfig.event_num;
        },

        handleScore(newVal) {
			const outerNode = document.getElementById('scoreboard-inner');
			const sponsorNode = document.getElementById('sponsor-data');
			const dataTitleNode = document.getElementById('scoreboard-title')

			const dataSc1PNode = document.getElementById('score-p1');
			const dataSc1ScWrapNode = document.getElementById('score-p1-total');
			const dataSc1ScNode = document.getElementById('scoreboard-p1-total');

			const dataSc2PNode = document.getElementById('score-p2');
			const dataSc2ScWrapNode = document.getElementById('score-p2-total');
			const dataSc2ScNode = document.getElementById('scoreboard-p2-total');

			const slideNode = document.getElementById('slideout')

			dataSc1PNode.textContent = newVal.p1;
			dataSc1ScNode.textContent = newVal.p1score;

			dataSc2PNode.textContent = newVal.p2;
			dataSc2ScNode.textContent = newVal.p2score;

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


			if (newVal.live) {
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

    });
})();
