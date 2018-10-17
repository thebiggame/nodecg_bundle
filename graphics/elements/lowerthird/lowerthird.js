(function () {
    'use strict';

    Polymer({
        is: 'tbg-lowerthird',

        ready() {
            this.tl = window.wipeTL;
            console.log(this.wipeTL);

            const wipeRep = nodecg.Replicant('lowerthird');

            wipeRep.on('change', e => {
                this.handleWipe(e);
            });

            const eventNode = document.getElementById('lowerthird-event-num');
            eventNode.textContent = nodecg.bundleConfig.event_num;
        },

        handleWipe(newVal) {
			const outerNode = document.getElementById('lowerthird-outer');
			const innerNode = document.getElementById('lowerthird-inner');
			const dataNode = document.getElementById('lowerthird-data-body');

			dataNode.textContent = newVal.body;


			if (newVal.live) {
				this.tl.add('in');
				this.tl.to(outerNode, 1, {
					top: "850px",
					ease: Quart.easeOut
				}, 'in');
				this.tl.to(innerNode, 1, {
					top: "0px",
					ease: Quart.easeOut
				}, 'in+=0.3');
				this.tl.play('in');
			} else {
				this.tl.add('out');
				this.tl.to(innerNode, 1, {
					top: "100%",
					ease: Quart.easeInOut
				}, 'out');
				this.tl.to(outerNode, 1, {
					top: "100%",
					ease: Quart.easeInOut
				}, 'out+=0.2');
				this.tl.play('out');
			}
        }

    });
})();
