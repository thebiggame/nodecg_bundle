(function () {
    'use strict';

    const clockRep = nodecg.Replicant('clock');

	clockRep.on('change', e => {
            const clockNode = document.getElementById('clock');
            const clockPeriodNode = document.getElementById('clock-period');
            var period = new Date(e.time);
            clockNode.textContent = period.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
            clockPeriodNode.textContent = period.getHours() >= 12 ? 'pm' : 'am';
    });
})();
