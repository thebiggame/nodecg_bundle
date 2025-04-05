"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_1 = require("./util/nodecg");
const replicants_1 = require("./util/replicants");
(0, nodecg_1.get)().log.trace('Extension countdown loaded.');
let timerCountdown;
function start() {
    if (replicants_1.repCountdownActive.value) {
        return;
    }
    replicants_1.repCountdownActive.value = true;
    timerCountdown = setInterval(tick, 1000);
}
function stop() {
    if (!replicants_1.repCountdownActive.value) {
        return;
    }
    replicants_1.repCountdownActive.value = false;
    clearInterval(timerCountdown);
}
function tick() {
    if (replicants_1.repCountdownActive.value) {
        // Tick.
        if (replicants_1.repCountdownData.value <= 0) {
            // The countdown has ended, stop the count!
            stop();
            return;
        }
        replicants_1.repCountdownData.value = replicants_1.repCountdownData.value--;
    }
}
replicants_1.repCountdownActive.on('change', (e) => {
    if (e) {
        // Start
        start();
    }
    else {
        // Stop
        stop();
    }
});
