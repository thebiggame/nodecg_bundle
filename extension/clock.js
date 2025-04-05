"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_1 = require("./util/nodecg");
const replicants_1 = require("./util/replicants");
(0, nodecg_1.get)().log.trace('Extension clock loaded.');
function tick() {
    replicants_1.repClock.value = new Date().toISOString();
}
const timer = setInterval(tick, 1000);
