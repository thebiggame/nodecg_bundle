(function () {
    'use strict';

    Polymer({
        is: 'tbg-halfwipe',

        ready() {
            this.tl = window.wipeTL;
            console.log(this.wipeTL);

			const wipeRep = nodecg.Replicant('halfwipe');
			const clockRep = nodecg.Replicant('clock');
			const metaRep = nodecg.Replicant('event');

            wipeRep.on('change', e => {
                this.handleWipe(e);
            });
            clockRep.on('change', e => {
            	this.updateClock(e);
			});
			metaRep.on('change', e => {
				this.updateEvent(e);
			})
        },

        handleWipe(newVal) {
			const outerNode = document.getElementById('wipe-outer');
			const innerNode = document.getElementById('wipe-inner');
			const nowNode = document.getElementById('now-body');
			const nextNode = document.getElementById('next-body');
			const nextHeading = document.getElementById('next-heading');

			nowNode.textContent = newVal.now;
			nextNode.textContent = newVal.next;
			if (newVal.next) {
				nextHeading.style.opacity = 1;
				nextNode.style.opacity = 1;
			} else {
				nextNode.textContent = "Nothing";
				nextHeading.style.opacity = 0.0001;
				nextNode.style.opacity = 0;
			}

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
        },


		updateClock(newVal) {
			const clockNode = document.getElementById('clock');
			const clockPeriodNode = document.getElementById('clock-period');
			const dayNode = document.getElementById('day');
			var period = new Date(newVal.time);
			clockNode.textContent = period.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
			clockPeriodNode.textContent = period.getHours() >= 12 ? 'pm' : 'am';

			if (period.getDay() == 5) {
				dayNode.textContent = '1/3';
			} else if (period.getDay() == 6) {
				dayNode.textContent = '2/3';
			} else if (period.getDay() == 0) {
				dayNode.textContent = '3/3';
			} else {
				dayNode.textContent = '?/3'
			}

		},
		updateEvent(newVal) {
			const eventNode = document.getElementById('event-num');
			eventNode.textContent = newVal.eventNum;
		}
    });
})();
