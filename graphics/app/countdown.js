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
            timeline.clear().add('in');
            timeline.to(timerNode, 0.5, {
                opacity: 1,
                top: "50px",
                // marginRight: "0px",
                ease: Quart.easeOut
            }, 'in');
            timeline.to(timerNode, 1, {
                marginRight: "0px",
                borderRadius: "0px 150px 150px 0px",
                ease: Quart.easeOut
            }, 'in+=0.5');
            timeline.to(innerNode, 1, {
                marginRight: "0px",
                ease: Quart.easeOut
            }, 'in+=1.0');
            timeline.play('in');
        } else {
            timeline.clear().add('out');
            timeline.to(innerNode, 1, {
                marginRight: "-500px",
                ease: Quart.easeInOut
            }, 'out');
            timeline.to(timerNode, 1, {
                marginRight: "1900px",
                borderRadius: "0px 0px 0px 0px",
                ease: Quart.easeInOut
            }, 'out+=0.5');
            timeline.to(timerNode, 1, {
                top: "-500px",
                ease: Quart.easeInOut
            }, 'out+=1.5');
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
