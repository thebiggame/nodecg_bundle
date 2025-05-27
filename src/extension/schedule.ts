import { get as nodecg } from './util/nodecg'
import { repScheduleData } from './util/replicants'
import { Configschema, ScheduleData } from '@thebiggame/types/schemas'
import { type VEvent } from 'node-ical'

nodecg().log.trace('Extension schedule loaded.')

const config = nodecg().bundleConfig as Configschema

const ical = require('node-ical')
var icalAddress = config.schedule.icalAddress

function updateSchedule() {
  nodecg().log.debug('Updating schedule...')
  ;(async () => {
    var webEvents: VEvent[]
    try {
      webEvents = await ical.async.fromURL(icalAddress)
    } catch (error) {
      nodecg().log.error(error)
      return
    }
    // Filter for VEVENTS - we're not bothered about anything else
    const events: VEvent[] = Object.values(webEvents).filter(
      (component): component is VEvent =>
        component.type === 'VEVENT' && Date.now() <= component.end.getTime(),
    )

    // Sort the events by start datetime
    events.sort((a, b) => a.start.getTime() - b.start.getTime())

    var nextEvent
    var futureEvents = []

    for (const ev of events) {
      // Valid event, in the future.
      var event = {
        title: ev.summary,
        ts_start: ev.start.toISOString(),
        ts_end: ev.end.toISOString(),
      }
      // Is this the first event?
      if (nextEvent === undefined) {
        nextEvent = event
      } else {
        futureEvents.push(event)
      }
    }
    // Append dummy events (debugging)
    if (config.schedule.debugExtraEvents === true) {
      for (var i = 0; i < 10; i++) {
        futureEvents.push({
          title: 'Test Event',
          ts_start: new Date('2025-04-05T23:00:00.000Z').toISOString(),
          ts_end: new Date('2025-04-05T23:30:00.000Z').toISOString(),
        })
      }
    }

    var expNewData = <ScheduleData>{ now: nextEvent, upcoming: futureEvents }
    if (repScheduleData.value != expNewData) {
      repScheduleData.value = expNewData
    }
    nodecg().log.trace(expNewData)

    nodecg().log.debug('Schedule updated successfully.')
    return
  })().catch((error) => {
    nodecg().log.error(error)
  })
}

if (typeof config.schedule.icalAddress !== undefined) {
  setInterval(updateSchedule, 10000)
  updateSchedule()
}
