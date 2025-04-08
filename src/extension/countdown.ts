import { get as nodecg } from './util/nodecg'
import { repCountdownData, repCountdownActive } from './util/replicants'

nodecg().log.trace('Extension countdown loaded.')

let timerCountdown: NodeJS.Timeout

function start() {
  repCountdownActive.value = true
  timerCountdown = setInterval(tick, 1000)
}

function stop() {
  repCountdownActive.value = false
  clearInterval(timerCountdown)
}

function tick() {
  if (repCountdownActive.value) {
    // Tick.
    if (repCountdownData.value <= 0) {
      // The countdown has ended, stop the count!
      stop()
      return
    }
    repCountdownData.value -= 1
  }
}

repCountdownActive.on('change', (e) => {
  if (e) {
    // Start
    start()
  } else {
    // Stop
    stop()
  }
})
