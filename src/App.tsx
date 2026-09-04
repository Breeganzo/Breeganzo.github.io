import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Quant from './pages/Quant'
import NotFound from './pages/NotFound'

/**
 * Layout position of an element relative to the document.
 *
 * Walks offsetParent rather than reading getBoundingClientRect, because the
 * scroll-reveal animation applies `translateY(18px)` to exactly the cards we
 * link to, and a client rect includes that transform. Aiming at the transformed
 * box means aiming 18px away from where the element will actually come to rest,
 * and re-aiming mid-transition just chases it.
 */
function documentTop(el: HTMLElement) {
  let y = 0
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop
  return y
}

/** Scroll to top on route change, or to the hash target when one is present. */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  useEffect(() => {
    // getElementById, not querySelector: an id that is not a valid CSS
    // selector would make querySelector throw rather than miss.
    const el = hash ? document.getElementById(hash.slice(1)) : null
    if (!el) {
      window.scrollTo(0, 0)
      return
    }

    // Deliberately not scrollIntoView. Measured on this page it lands short by
    // 70-590px and sometimes refuses to move at all. The offset is read from
    // the element's own scroll-margin, so the sticky header's height lives in
    // one place — the CSS — instead of being duplicated here.
    const destination = () =>
      documentTop(el) - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0)

    const align = () => window.scrollTo({ top: destination(), behavior: 'smooth' })

    align()

    // Content above the target can still be settling when the scroll starts,
    // which leaves it aimed at where the target used to be. Re-aim twice; both
    // passes are no-ops once it is already in place.
    const settle = () => {
      if (Math.abs(window.scrollY - destination()) > 4) align()
    }
    const timers = [window.setTimeout(settle, 400), window.setTimeout(settle, 1000)]
    return () => timers.forEach(clearTimeout)

    // `key` changes on every navigation, including one to the location we are
    // already at. Without it, opening a second search result that targets the
    // same anchor does nothing at all and looks like a broken link.
  }, [pathname, hash, key])
  return null
}

export default function App() {
  return (
    <Layout>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/quant" element={<Quant />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
