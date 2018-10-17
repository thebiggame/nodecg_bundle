(function () {
    'use strict';

	const start = document.getElementById('start');
	const stop = document.getElementById('stop');
    const data1Input = document.getElementById('data1');
	const data1descInput = document.getElementById('data1desc');
	const data2Input = document.getElementById('data2');
	const data2descInput = document.getElementById('data2desc');
	const data3Input = document.getElementById('data3');
	const data3descInput = document.getElementById('data3desc');
    const wipeRep = nodecg.Replicant('persons');

	data1Input.addEventListener('input', e => {
		updateInputs();
	});
	data1descInput.addEventListener('input', e => {
		updateInputs();
	});
	data2Input.addEventListener('input', e => {
		updateInputs();
	});
	data2descInput.addEventListener('input', e => {
		updateInputs();
	});
	data3Input.addEventListener('input', e => {
		updateInputs();
	});
	data3descInput.addEventListener('input', e => {
		updateInputs();
	});

	function updateInputs() {
		wipeRep.value.person1 = data1Input.value;
		wipeRep.value.person1desc = data1descInput.value;
		wipeRep.value.person2 = data2Input.value;
		wipeRep.value.person2desc = data2descInput.value;
		wipeRep.value.person3 = data3Input.value;
		wipeRep.value.person3desc = data3descInput.value;
	}

	start.addEventListener('click', () => {
		nodecg.sendMessage('startPersons');
	});

	stop.addEventListener('click', () => {
		nodecg.sendMessage('stopPersons');
	});


    wipeRep.on('change', newVal => {
        // timeInput.setSeconds(newVal.time.raw);
        // dataInput.value = wipeRep.value.body;
		updateInputs()

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
