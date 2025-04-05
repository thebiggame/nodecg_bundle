import { get as nodecg } from './util/nodecg';
import { repClock } from './util/replicants';

nodecg().log.trace('Extension clock loaded.');

function tick() {
  repClock.value = new Date().toISOString();
}

const timer = setInterval(tick, 1000);
