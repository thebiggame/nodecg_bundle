(function () {
    'use strict';

	const start = document.getElementById('start');
	const stop = document.getElementById('stop');
    const data1Input = document.getElementById('data1');
	const data1scoreInput = document.getElementById('data1score');
	const data2Input = document.getElementById('data2');
	const data2scoreInput = document.getElementById('data2score');
	const data1plus = document.getElementById('1plus');
	const data1minus = document.getElementById('1minus');
	const data2plus = document.getElementById('2plus');
	const data2minus = document.getElementById('2minus');
    const scoreRep = nodecg.Replicant('scoreboard');

	data1Input.addEventListener('input', e => {
		updateInputs();
	});
	data1scoreInput.addEventListener('input', e => {
		updateInputs();
	});
	data2Input.addEventListener('input', e => {
		updateInputs();
	});
	data2scoreInput.addEventListener('input', e => {
		updateInputs();
	});
	data1plus.addEventListener('click', () => {
		if (scoreRep.value.p1score) {
			scoreRep.value.p1score = (parseInt(scoreRep.value.p1score) + 1).toString()
			data1scoreInput.value = (parseInt(scoreRep.value.p1score) + 1).toString()
		} else {
			scoreRep.value.p1score = "1"
			data1scoreInput.value = "1"
		}
	});
	data1minus.addEventListener('click', () => {
		if (scoreRep.value.p1score) {
			scoreRep.value.p1score = (parseInt(scoreRep.value.p1score) - 1).toString()
			data1scoreInput.value = (parseInt(scoreRep.value.p1score) - 1).toString()
		} else {
			scoreRep.value.p1score = "-1"
			data1scoreInput.value = "-1"
		}
	});
	data2plus.addEventListener('click', () => {
		if (scoreRep.value.p2score) {
			scoreRep.value.p2score = (parseInt(scoreRep.value.p2score) + 1).toString()
			data2scoreInput.value = (parseInt(scoreRep.value.p2score) + 1).toString()
		} else {
			scoreRep.value.p2score = "1"
			data2scoreInput.value = "1"
		}
	});
	data2minus.addEventListener('click', () => {
		if (scoreRep.value.p2score) {
			scoreRep.value.p2score = (parseInt(scoreRep.value.p2score) - 1).toString()
			data2scoreInput.value = (parseInt(scoreRep.value.p2score) - 1).toString()
		} else {
			scoreRep.value.p2score = "-1"
			data2scoreInput.value = "-1"
		}
	});

	function updateInputs() {
		scoreRep.value.p1 = data1Input.value;
		scoreRep.value.p1score = data1scoreInput.value;
		scoreRep.value.p2 = data2Input.value;
		scoreRep.value.p2score = data2scoreInput.value;
	}

	start.addEventListener('click', () => {
		nodecg.sendMessage('startScoreboard');
	});

	stop.addEventListener('click', () => {
		nodecg.sendMessage('stopScoreboard');
	});


    scoreRep.on('change', newVal => {
        // timeInput.setSeconds(newVal.time.raw);
        // dataInput.value = scoreRep.value.body;
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
