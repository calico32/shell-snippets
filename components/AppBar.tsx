import { useRouter } from 'next/router'
import React from 'react'

const AppBar: React.VFC = () => {
  const router = useRouter()

  return <nav></nav>
}

export default AppBar

interface AppBarLinkProps {
  href: string
  label: string
}
