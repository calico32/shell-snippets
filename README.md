# shell-snippets

Quick website for shell snippets, with or without placeholders.

## Example

![](./img/card_shadow.png)

Snippets are easy to write and customizable. The example looks like this:

```tsx
<Snippet command="ffmpeg" name="extract a frame from a video">
  <Text>ffmpeg -i </Text>
  <Placeholder name="input file" type="string" /> {/* basic placeholder */}
  <Text> -vf "select=eq(n\,</Text>
  <CustomPlaceholder // customizable placeholder
    name="frame"
    
    inputs={{ 
      // declare inputs concisely with zero boilerplate
      frame: [ 
        // allow multiple options for this property
        { 'frame number': 'natural' }, 
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
    
    // turn your input values into a displayable format
    render={(values) => {
      const { frame } = values
      // rich, complete type information with no casting
      if ('frame number' in frame) { // easy type narrowing
        return frame['frame number'] // type: number
      } else {
        const { 'frame rate': frameRate } = frame // type: number
        const { hr, min, sec, frames } = frame.timestamp 
        // type: { hr: number, min: number, sec: number, frames: number }
        return (hr * 3600 + min * 60 + sec) * frameRate + frames
      }
    }}
  />
  <Text>)" -vframes 1 </Text>
  <Placeholder name="output file" />
</Snippet>
```
