(function () {
    'use strict';

	const start = document.getElementById('start');
	const stop = document.getElementById('stop');
    const dataInput = document.getElementById('dataName');
    const wipeRep = nodecg.Replicant('lowerthird');

	dataInput.addEventListener('input', e => {
		wipeRep.value.body = dataInput.value;
	});

	start.addEventListener('click', () => {
		nodecg.sendMessage('startLowerThird');
	});

	stop.addEventListener('click', () => {
		nodecg.sendMessage('stopLowerThird');
	});


    wipeRep.on('change', newVal => {
        // timeInput.setSeconds(newVal.time.raw);
        dataInput.value = wipeRep.value.body;

        if (newVal.live) {
            // timeInput.setAttribute('disabled', 'true');
            start.setAttribute('disabled-running', 'true');
            stop.removeAttribute('disabled');
        } else {
            // timeInput.removeAttribute('disabled');
            start.removeAttribute('disabled-running');
            stop.setAttribute('disabled', 'true');
        }

        checkStartButton();
    });

    function checkStartButton() {
        if (start.hasAttribute('disabled-invalid') || start.hasAttribute('disabled-running')) {
            start.setAttribute('disabled', 'true');
        } else {
            start.removeAttribute('disabled');
        }
    }
})();
