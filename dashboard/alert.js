(function () {
    'use strict';

	const startButton = document.getElementById('start');
	const stopButton = document.getElementById('stop');
    const name = document.getElementById('alertName');
    const flair = document.getElementById('alertFlair');

	startButton.addEventListener('click', () => {
        nodecg.sendMessage('alert', {
			flair: flair.checked,
			name: name.value
		});
    });
    stopButton.addEventListener('click', () => {
    	console.log('sending leave event');
        nodecg.sendMessage('alert-end');
    });
})();
