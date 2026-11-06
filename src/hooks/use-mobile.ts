import * as React from "react"

export function useIsMobile(mobileBreakpoint = 768) {
  // Read the width up front so the first render already picks the right layout
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(() =>
    typeof window === "undefined" ? undefined : window.innerWidth < mobileBreakpoint,
  )

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < mobileBreakpoint)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}