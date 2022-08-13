import { IToaster } from '@blueprintjs/core'
import { createContext, useContext } from 'react'

export const ToasterContext = createContext<IToaster>(undefined!)

export const useToaster = (): IToaster => {
  const toaster = useContext(ToasterContext)
  return toaster
}
