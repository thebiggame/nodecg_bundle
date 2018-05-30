(function () {
    'use strict';

    Polymer({
        is: 'tbg-persons',

        ready() {
            this.tl = window.wipeTL;
            console.log(this.wipeTL);

			const wipeRep = nodecg.Replicant('persons');
			const metaRep = nodecg.Replicant('event');

            wipeRep.on('change', e => {
                this.handleWipe(e);
            });

			metaRep.on('change', e => {
				this.updateEvent(e);
			})

        },

        handleWipe(newVal) {
			const outerNode = document.getElementById('persons-outer');
			const innerNode = document.getElementById('persons-inner');
			const node1 = document.getElementById('persons-1');
			const data1Node = document.getElementById('persons-data-1');
			const data1descNode = document.getElementById('persons-sub-1');
			const node2 = document.getElementById('persons-2');
			const data2Node = document.getElementById('persons-data-2');
			const data2descNode = document.getElementById('persons-sub-2');
			const node3 = document.getElementById('persons-3');
			const data3Node = document.getElementById('persons-data-3');
			const data3descNode = document.getElementById('persons-sub-3');

			data1Node.textContent = newVal.person1;
			data2Node.textContent = newVal.person2;
			data3Node.textContent = newVal.person3;

			if (newVal.person1) {
				node1.style.display = '';
			} else {
				node1.style.display = 'none';
			}

			if (newVal.person2) {
				node2.style.display = '';
			} else {
				node2.style.display = 'none';
			}

			if (newVal.person3) {
				node3.style.display = '';
			} else {
				node3.style.display = 'none';
			}

			data1descNode.textContent = newVal.person1desc;
			data2descNode.textContent = newVal.person2desc;
			data3descNode.textContent = newVal.person3desc;




			if (newVal.live) {
				this.tl.add('in');
				this.tl.to(outerNode, 1, {
					top: "750px",
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
		updateEvent(newVal) {
			const eventNode = document.getElementById('persons-event-num');
			eventNode.textContent = newVal.eventNum;
		}

    });
})();
