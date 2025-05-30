import { get as nodecg } from './util/nodecg'
import {
  repMusicNow,
  repMusicNext,
  repMusicPlaybackState,
} from './util/replicants'
import { Configschema } from '@thebiggame/types/schemas'
import { PartyData } from '@thebiggame/types/external/musicparty'
import https from 'https'
import http from 'http'

nodecg().log.trace('Extension musicParty loaded.')

const config = nodecg().bundleConfig as Configschema

const mpEnabled = config.music.party?.enabled
const mpURL = config.music.party?.url
const mpID = config.music.party?.id

let update = config.music.updateInterval // how often the title is updated, in seconds
if (update == undefined) update = 1

if (mpEnabled) {
  setInterval(updateData, update * 1000)
}

function updateData() {
  const url = `${mpURL}/api/v1/parties/${encodeURIComponent(mpID!).toUpperCase()}`
  // Parse the URL into its components
  const options = new URL(url)
  const handler = mpURL?.startsWith('https') ? https : http

  handler
    .request(options, (response) => {
      let data = ''

      // Collect data chunks
      response.on('data', (chunk) => {
        data += chunk
      })

      // When the response is finished, parse the data
      response.on('end', () => {
        try {
          let body: PartyData = JSON.parse(data) // Parse JSON response
          if (
            response.statusCode !== undefined &&
            response.statusCode >= 200 &&
            response.statusCode < 400
          ) {
            // Success!
            const tNow = body.data.status.current
            const tNext = body.data.status.next
            const tStatus = body.data.status.status

            // Build the replicant
            if (tNow) {
              repMusicNow.value = {
                name: tNow.name,
                // TODO This might need updating for tracks with multiple artists.
                artist: tNow.artists[0].name,
                album_name: tNow.album.name,
                album_art: tNow.album.image_url,
                party: {
                  rating: tNow.rating,
                  userName: tNow.user,
                },
              }
            } else {
              nodecg().log.debug('MusicParty: No nowplaying data found.')
            }
            if (tNext) {
              repMusicNext.value = {
                name: tNext.name,
                // TODO This might need updating for tracks with multiple artists.
                artist: tNext.artists[0].name,
                album_name: tNext.album.name,
                album_art: tNext.album.image_url,
                party: {
                  rating: tNext.rating,
                  userName: tNext.user,
                },
              }
            } else {
              nodecg().log.trace('MusicParty: No next in queue data found.')
            }
            if (tStatus) {
              repMusicPlaybackState.value = {
                playhead: tStatus.progress,
                length: tStatus.length,
                updatedAt: tStatus.updatedAt,
              }
            }
          } else {
            // We reached the target server, but it returned an error
            nodecg().log.error('MusicParty: Data error.')
          }
        } catch (error) {
          nodecg().log.error('MusicParty: Error parsing JSON:', error)
        }
      })
    })
    .on('error', (error) => {
      nodecg().log.error('MusicParty: Request error:', error)
    })
    .end()
}
