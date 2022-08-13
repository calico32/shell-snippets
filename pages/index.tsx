import { H1 } from '@blueprintjs/core'
import Snippet, { choice, CustomPlaceholder, Placeholder, Text } from '../components/Snippet'
import Wrapper from '../components/Wrapper'

const timecode = (
  hr: number | string,
  min: number | string,
  sec: number | string,
  ms: number | string
): string => {
  hr = Number(hr)
  min = Number(min)
  sec = Number(sec)
  ms = Number(ms)

  // TODO: normalize

  hr = hr.toString().padStart(2, '0')
  min = min.toString().padStart(2, '0')
  sec = sec.toString().padStart(2, '0')
  ms = ms.toString().padStart(3, '0')

  return `${hr}:${min}:${sec}.${ms}`
}

const Home = (): JSX.Element => {
  return (
    <Wrapper>
      <H1>shell snippets</H1>

      <Snippet
        command="ffmpeg"
        name="trim audio"
        description="trim a video from the start using ffmpeg"
      >
        <Text>ffmpeg -i </Text>
        <Placeholder name="input file" />
        <Text> -ss </Text>
        <CustomPlaceholder
          name="start time"
          inputs={{
            time: [
              {
                frame: {
                  'frame rate': 'positive',
                  'frame number': 'natural',
                },
              },
              {
                timestamp: {
                  hr: 'natural',
                  min: 'natural',
                  sec: 'natural',
                  ms: 'natural',
                },
              },
            ],
          }}
          render={(values) => {
            const { time } = values
            if ('frame' in time) {
              const { 'frame rate': frameRate, 'frame number': frameNumber } = time.frame
              // calculate timestamp (hr:mm:ss.ms) from frame number and frame rate
              let sec = frameNumber / frameRate
              const hr = Math.floor(sec / 3600)
              sec -= hr * 3600
              const min = Math.floor(sec / 60)
              sec -= min * 60
              const ms = Math.floor((sec - Math.floor(sec)) * 1000)
              sec = Math.floor(sec)
              return timecode(hr, min, sec, ms)
            } else {
              const { hr, min, sec, ms } = time.timestamp
              return timecode(hr, min, sec, ms)
            }
          }}
        />
        <Text> -c:a copy </Text>
        <Placeholder name="output file" />
      </Snippet>

      <Snippet command="ffmpeg" name="extract a frame from a video">
        <Text>ffmpeg -i </Text>
        <Placeholder name="input file" />
        <Text> -vf &quot;select=eq(n\,</Text>
        <CustomPlaceholder
          name="frame"
          inputs={{
            frame: [
              {
                'frame number': 'natural',
              },
              {
                'frame rate': 'positive',
                timestamp: {
                  hr: 'natural',
                  min: 'natural',
                  sec: 'natural',
                  frames: 'natural',
                },
              },
            ],
          }}
          render={(values) => {
            const { frame } = values
            if ('frame number' in frame) {
              return frame['frame number']
            } else {
              const { 'frame rate': frameRate } = frame
              const { hr, min, sec, frames } = frame.timestamp
              // calculate frame number from timestamp (hr:mm:ss.frame) and frame rate
              return (hr * 3600 + min * 60 + sec) * frameRate + frames
            }
          }}
        />
        <Text>)&quot; -vframes 1 </Text>
        <Placeholder name="output file" />
      </Snippet>

      <Snippet command="ffmpeg" name="convert file">
        <Text>ffmpeg -i </Text>
        <Placeholder name="input file" />
        <Text> -c:a </Text>
        <Placeholder name="audio codec" type={choice('aac', 'mp3', 'opus', 'vorbis', 'wav')} />
        <Placeholder
          name="copy video"
          type="boolean"
          render={(value) => {
            console.log('value', value)
            return value ? ' -c:v copy' : ''
          }}
        />
        <Text> </Text>
        <Placeholder name="output file" />
      </Snippet>

      <Snippet name="The FitnessGram Pacer test">
        <Text>
          The FitnessGram Pacer test is a multistage aerobic capacity test that progressively gets
          more difficult as it continues. The 20 meter Pacer test will begin in 30 seconds. Line up
          at the start. The running speed starts slowly, but gets faster each minute after you hear
          this signal *boop*. A single lap should be completed each time you hear this sound *ding*.
          Remember to run in a straight line, and run as long as possible. The second time you fail
          to complete a lap before the sound, your test is over. The test will begin on the word
          start. On your mark, get ready, start.
        </Text>
      </Snippet>
    </Wrapper>
  )
}

export default Home
