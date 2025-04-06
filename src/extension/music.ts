import { get as nodecg } from './util/nodecg'
import { repMusicData } from './util/replicants'
import { Configschema, MusicData } from '@thebiggame/types/schemas'
import https from 'http'

nodecg().log.trace('Extension music loaded.')

const config = nodecg().bundleConfig as Configschema

const songSource = config.music.source
let update = config.music.updateInterval // how often the title is updated, in seconds
if (update == undefined) update = 1
const apikey = config.music.apiKey // your last.fm API key (last.fm/api)

if (config.music.enabled) {
  setInterval(updateSong, config.music.updateInterval * 1000)
}

function updateSong() {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${encodeURIComponent(songSource)}&api_key=${encodeURIComponent(apikey)}&limit=2&format=json&callback=`

  // Parse the URL into its components
  const options = new URL(url)

  https
    .request(options, (response) => {
      let data = ''

      // Collect data chunks
      response.on('data', (chunk) => {
        data += chunk
      })

      // When the response is finished, parse the data
      response.on('end', () => {
        try {
          const body = JSON.parse(data) // Parse JSON response
          if (
            response.statusCode !== undefined &&
            response.statusCode >= 200 &&
            response.statusCode < 400
          ) {
            // Success!
            const track = body.recenttracks.track[0]
            if (track) {
              // Update the replicant.
              repMusicData.value = <MusicData>{
                title: track.name,
                artist: track.artist['#text'],
              }
            } else {
              nodecg().log.debug('Music: No track data found.')
            }
          } else {
            // We reached the target server, but it returned an error
            nodecg().log.error('Music: Data error.')
          }
        } catch (error) {
          nodecg().log.error('Music: Error parsing JSON:', error)
        }
      })
    })
    .on('error', (error) => {
      nodecg().log.error('Music: Request error:', error)
    })
    .end()
}
