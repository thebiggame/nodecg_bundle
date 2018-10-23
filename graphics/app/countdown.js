(function () {
    'use strict';

    const countRep = nodecg.Replicant('countdown:data');
    const countRepName = nodecg.Replicant('countdown:name');
	const countRepActive = nodecg.Replicant('countdown:active');
    const timeNode = document.getElementById('cdown-time');
    const nameNode = document.getElementById('cdown-name');
    const timerNode = document.getElementById('timer-outer');
    const innerNode = document.getElementById('timer-inner');

	const timeline = window.countdownTL;

    countRep.on('change', newVal => {
        timeNode.textContent = newVal.formatted;
        timeline.call(() => {
        });
        if (newVal.raw <= 60) {
            TweenLite.to(timeNode, 5, {
                color: "rgb(255, 0, 0)",
                ease: Expo.easeOut
            });
        } else {
            timeNode.style.color = "rgb(255, 255, 255)";
        }
    });
    countRepName.on('change', newVal => {
        nameNode.textContent = newVal;
    });
    countRepActive.on('change', newVal => {
        timeline.call(() => {
        });
        if (newVal) {
            timeline.add('in');
            timeline.to(timerNode, 0.75, {
                opacity: 1,
                left: "0%",
                ease: Circ.easeOut
            }, 'in');
            timeline.to(innerNode, 0.75, {
                left: "0%",
                ease: Circ.easeOut
            }, 'in+=0.3');
            timeline.play('in');
        } else {
            timeline.add('out');
            timeline.to(innerNode, 0.75, {
                left: "-100%",
                ease: Circ.easeIn
            }, 'out');
            timeline.to(timerNode, 0.75, {
                opacity: 0,
                left: "-100%",
                ease: Circ.easeIn
            }, 'out+=0.2');
            timeline.play('out');
        }
    });


    function darkener(darkenornot) {
    	const darkenNode = document.getElementById('darkener');
    	if (darkenornot) {
        	TweenLite.to(darkenNode, 2.5, {
				opacity: 0.5,
				ease: Power4.easeOut
			});
		} else {
			TweenLite.to(darkenNode, 2, {
				opacity: 0,
				ease: Sine.easeIn
			});
		}
	}
})();
