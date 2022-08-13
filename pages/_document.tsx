import { Classes, Colors } from '@blueprintjs/core'
import Document, { Head, Html, Main, NextScript } from 'next/document'
// import { h } from 'preact'

class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head />
        <body className={`${Classes.DARK}`} style={{ backgroundColor: Colors.DARK_GRAY3 }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CustomDocument
