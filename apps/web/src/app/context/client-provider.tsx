'use client'

import { SessionContextProvider } from "./providers/session-context"
import { ThemeProvider } from "@material-tailwind/react";


export default function Provider ({
  children,
  session
}: {
  children: React.ReactNode
  session: any
  }): React.ReactNode {
  return <SessionContextProvider session={session}>
    <MaterialTailwindProvider>
      {children}
    </MaterialTailwindProvider>
  </SessionContextProvider>
}


const MaterialTailwindProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
