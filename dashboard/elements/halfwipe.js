(function () {
    'use strict';

	const start = document.getElementById('start');
	const stop = document.getElementById('stop');
    const nowInput = document.getElementById('nowName');
	const nextInput = document.getElementById('nextName');
    const wipeRep = nodecg.Replicant('halfwipe');

	nowInput.addEventListener('input', e => {
		wipeRep.value.now = nowInput.value;
	});
	nextInput.addEventListener('input', e => {
		wipeRep.value.next = nextInput.value;
	});

	start.addEventListener('click', () => {
		nodecg.sendMessage('startHalfWipe');
	});

	stop.addEventListener('click', () => {
		nodecg.sendMessage('stopHalfWipe');
	});


    wipeRep.on('change', newVal => {
        // timeInput.setSeconds(newVal.time.raw);
        nowInput.value = wipeRep.value.now;
		nextInput.value = wipeRep.value.next;

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
