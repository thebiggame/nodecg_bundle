import { get as nodecg } from './util/nodecg'
import { repShoutboxShouts } from './util/replicants'
import { Configschema } from '@thebiggame/types/schemas'
import { parse } from 'marked'
import sanitizeHtml from 'sanitize-html'

nodecg().log.trace('Extension shouthandler loaded.')

const config = nodecg().bundleConfig as Configschema

nodecg().listenFor('shoutbox:new-discord', (e) => {
  // Quickly sanity test that this is, in fact, the expected data type.
  if ('user' in e && 'message' in e) {
    // First normalise the markdown
    const msg = parse(e.message)
    if (typeof msg === 'string') {
      e.message = sanitizeHtml(msg, {
        allowedTags: ['b', 'i', 'em', 'strong', 'u', 'a'],
        allowedAttributes: undefined,
      })
    }
    // PREPEND to the shouts replicant.
    // This way, the latest shout is always first.
    repShoutboxShouts.value.shouts.unshift(e)

    // Emit a "new shout available" message.

    nodecg().sendMessage('shoutbox:chime')
  } else {
    nodecg().log.warn(
      'Received unparseable message on shoutbox:new-discord message channel',
    )
  }
})

nodecg().listenFor('shoutbox:sort', (e) => {
  // We've been asked to sort the shoutbox chronologically.
  repShoutboxShouts.value.shouts.sort(
    (a, b) =>
      new Date(a.timestamp).getUTCMilliseconds() -
      new Date(b.timestamp).getUTCMilliseconds(),
  )
  nodecg().log.info('Shoutbox sorted.')
})
