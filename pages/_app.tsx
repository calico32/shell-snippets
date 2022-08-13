import { Toaster } from '@blueprintjs/core'
import type { AppProps } from 'next/app'
import { useRef } from 'react'
import '../styles/globals.scss'
import { ToasterContext } from '../util/context'

function App({ Component, pageProps }: AppProps): JSX.Element {
  const toasterRef = useRef<Toaster>(null)

  return (
    <ToasterContext.Provider
      value={{
        clear: () => toasterRef.current?.clear(),
        dismiss: (key) => toasterRef.current?.dismiss(key),
        getToasts: () => toasterRef.current?.getToasts() as any,
        show: (args, key) => toasterRef.current?.show(args, key) as any,
      }}
    >
      <Toaster ref={toasterRef} />
      <Component {...pageProps} />
    </ToasterContext.Provider>
  )
}

export default App
