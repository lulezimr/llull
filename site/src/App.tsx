import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react"
import { visualIdentityProjects } from "./data/visualIdentityProjects"

const tracks = [
  {
    id: "L31JqlgTl3w",
    title: "Fading Out Inside",
    type: "Single",
    duration: "3:27",
    image: "/media/music-cover.png",
  },
  {
    id: "PH1_CMg51JU",
    title: "Numb",
    type: "Single",
    duration: "3:23",
    image: "/media/numb.jpg",
  },
  {
    id: "Fr8tx_VWbpk",
    title: "Silence",
    type: "Demo",
    duration: "3:12",
    image: "/media/silence.jpg",
  },
  {
    id: "zZs-NeIxpUA",
    title: "I Remain",
    type: "Demo",
    duration: "3:45",
    image: "/media/i-remain.jpg",
  },
]

const practices = [
  {
    number: "01",
    title: "Visual identities",
    note: "Identity systems, visual languages and communication with a clear point of view.",
    href: "/work/visual-identities/",
  },
  {
    number: "02",
    title: "Digital experiences",
    note: "Interfaces, products and visual systems designed to move naturally on screen.",
  },
  {
    number: "03",
    title: "Editorial & data",
    note: "Publications, information design and complex stories made clear and legible.",
  },
]

function subscribeMediaQuery(media: MediaQueryList, listener: () => void) {
  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }

  media.addListener(listener)
  return () => media.removeListener(listener)
}

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      className={down ? "arrow arrow--down" : "arrow"}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d={down ? "M12 3v17M5 13l7 7 7-7" : "M5 19 19 5M8 5h11v11"} />
    </svg>
  )
}

function AudioVisualizer() {
  return (
    <span className="audio-visualizer" aria-hidden="true">
      <span className="audio-visualizer__bar" />
      <span className="audio-visualizer__bar" />
      <span className="audio-visualizer__bar" />
      <span className="audio-visualizer__bar" />
      <span className="audio-visualizer__bar" />
    </span>
  )
}

function WaveField({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({ x: 0.5, y: 0.5, inside: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    let frame = 0
    let width = 0
    let height = 0
    let reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      const lines = width < 700 ? 26 : 42
      const points = 160
      const energy = active ? 1 : 0.35

      for (let line = 0; line < lines; line += 1) {
        const yBase = (height / (lines - 1)) * line
        context.beginPath()
        for (let point = 0; point <= points; point += 1) {
          const x = (width / points) * point
          const centerPull = Math.exp(
            -Math.pow((x - width * 0.52) / (width * 0.29), 2),
          )
          const pointerDistance = pointer.current.inside
            ? Math.exp(
                -Math.pow((x - pointer.current.x * width) / (width * 0.14), 2),
              )
            : 0
          const phase =
            point * 0.24 +
            line * 0.51 +
            (reducedMotion ? 0 : time * 0.0014 * energy)
          const harmonic =
            Math.sin(phase) * 10 +
            Math.sin(phase * 0.47 + line * 0.8) * 18 +
            Math.cos(phase * 1.8) * 3
          const lineCenter = (line - lines / 2) / (lines / 2)
          const envelope = Math.pow(1 - Math.min(Math.abs(lineCenter), 1), 1.8)
          const pointerWave =
            Math.sin(point * 0.42 + time * 0.003) *
            pointerDistance *
            (30 + pointer.current.y * 25)
          const y =
            yBase +
            harmonic * centerPull * envelope * energy +
            pointerWave * envelope
          if (point === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        const accent =
          line === Math.floor(lines * 0.36) || line === Math.floor(lines * 0.63)
        context.strokeStyle = accent
          ? "rgba(117, 108, 255, .82)"
          : `rgba(236, 235, 227, ${0.11 + line * 0.002})`
        context.lineWidth = accent ? 1.15 : 0.7
        context.stroke()
      }
      frame = requestAnimationFrame(draw)
    }

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
        inside: true,
      }
    }
    const onLeave = () => {
      pointer.current.inside = false
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onMotionChange = () => {
      reducedMotion = media.matches
    }

    resize()
    window.addEventListener("resize", resize)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerleave", onLeave)
    const unsubscribeMedia = subscribeMediaQuery(media, onMotionChange)
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerleave", onLeave)
      unsubscribeMedia()
    }
  }, [active])

  return <canvas ref={canvasRef} className="wave-field" aria-hidden="true" />
}

function MusicWave({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({ x: 0.5, y: 0.5, inside: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    let frame = 0
    let width = 0
    let height = 0
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const waveY = (
      x: number,
      time: number,
      layer: number,
      amplitude: number,
    ) => {
      const normalized = x / Math.max(width, 1)
      const cursorPull = pointer.current.inside
        ? Math.exp(-Math.pow((normalized - pointer.current.x) / 0.16, 2)) *
          (pointer.current.y - 0.5) *
          100
        : 0
      const envelope = Math.sin(normalized * Math.PI)
      return (
        height / 2 +
        Math.sin(normalized * 18 + time * (0.0011 + layer * 0.00009) + layer) *
          amplitude *
          envelope +
        Math.cos(normalized * 7 - time * 0.0007 + layer * 1.7) *
          amplitude *
          0.45 +
        cursorPull * envelope
      )
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      const motionTime = media.matches ? 0 : time
      const energy = active ? 1 : 0.42

      context.strokeStyle = "rgba(233, 232, 223, .14)"
      context.lineWidth = 1
      context.beginPath()
      context.moveTo(0, height / 2)
      context.lineTo(width, height / 2)
      context.stroke()

      const bars = width < 700 ? 46 : 92
      for (let index = 0; index < bars; index += 1) {
        const x = (index / (bars - 1)) * width
        const normalized = index / (bars - 1)
        const envelope = Math.pow(Math.sin(normalized * Math.PI), 0.65)
        const pulse =
          0.35 +
          Math.abs(
            Math.sin(index * 0.81 + motionTime * 0.0024) *
              Math.cos(index * 0.17 - motionTime * 0.0013),
          )
        const barHeight = (7 + pulse * 64 * energy) * envelope
        const highlighted = index % 11 === 0 || index % 17 === 0
        context.strokeStyle = highlighted
          ? "rgba(117, 108, 255, .9)"
          : "rgba(233, 232, 223, .32)"
        context.lineWidth = highlighted ? 2 : 1
        context.beginPath()
        context.moveTo(x, height / 2 - barHeight)
        context.lineTo(x, height / 2 + barHeight)
        context.stroke()
      }

      for (let layer = 0; layer < 7; layer += 1) {
        const amplitude = (16 + layer * 7) * energy
        context.beginPath()
        for (let x = -5; x <= width + 5; x += 5) {
          const y = waveY(x, motionTime, layer, amplitude)
          if (x === -5) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.strokeStyle =
          layer === 2
            ? "rgba(117, 108, 255, .95)"
            : layer === 5
              ? "rgba(181, 176, 255, .65)"
              : `rgba(233, 232, 223, ${0.08 + layer * 0.035})`
        context.lineWidth = layer === 2 ? 2.2 : 0.8
        context.stroke()
      }

      for (let particle = 0; particle < 28; particle += 1) {
        const progress =
          (particle / 28 +
            motionTime * (0.000015 + (particle % 4) * 0.000004)) %
          1
        const x = progress * width
        const layer = particle % 7
        const y = waveY(x, motionTime, layer, (16 + layer * 7) * energy)
        context.beginPath()
        context.arc(x, y, particle % 6 === 0 ? 2.4 : 1.1, 0, Math.PI * 2)
        context.fillStyle =
          particle % 6 === 0
            ? "rgba(117, 108, 255, .95)"
            : "rgba(233, 232, 223, .55)"
        context.fill()
      }

      frame = requestAnimationFrame(draw)
    }

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
        inside: true,
      }
    }
    const onLeave = () => {
      pointer.current.inside = false
    }

    resize()
    window.addEventListener("resize", resize)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerleave", onLeave)
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerleave", onLeave)
    }
  }, [active])

  return (
    <div className={`music-wave ${active ? "is-active" : ""}`}>
      <div className="music-wave-meta" aria-hidden="true">
        <span>AMPLITUDE / 02</span>
        <span>{active ? "LIVE FREQUENCY" : "SIGNAL RESTING"}</span>
        <span>44.1 KHZ</span>
      </div>
      <canvas
        ref={canvasRef}
        aria-label="Interactive generative audio visualization"
      />
      <div className="wave-orbit wave-orbit--one" aria-hidden="true" />
      <div className="wave-orbit wave-orbit--two" aria-hidden="true" />
    </div>
  )
}

function PracticeRowContent({
  practice,
}: {
  practice: typeof practices[number]
}) {
  return (
    <>
      <span>{practice.number}</span>
      <h3>{practice.title}</h3>
      <p>{practice.note}</p>
      <Arrow />
    </>
  )
}

function PortfolioHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [
    ["Work", "/work/visual-identities/"],
    ["Sound", "/#sound"],
    ["About", "/#about"],
    ["Contact", "/#contact"],
  ]

  return (
    <header className="site-header">
      <div className="brand-lockup">
        <a className="logo" href="/" aria-label="llull, home">
          llull<sup>®</sup>
        </a>
        <AudioVisualizer />
      </div>
      <p className="header-practice">
        Independent creative practice
        <br />
        Prishtina, Kosovo
      </p>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="portfolio-nav"
        onClick={() => setMenuOpen((value) => !value)}
      >
        {menuOpen ? "Close" : "Menu"}
      </button>
      <nav
        id="portfolio-nav"
        className={menuOpen ? "is-open" : ""}
        aria-label="Primary navigation"
        aria-hidden={
          !menuOpen && window.matchMedia("(max-width: 900px)").matches
        }
      >
        {links.map(([label, href], index) => (
          <a
            key={label}
            href={href}
            tabIndex={
              !menuOpen && window.matchMedia("(max-width: 900px)").matches
                ? -1
                : undefined
            }
            onClick={() => setMenuOpen(false)}
          >
            <small>0{index + 1}</small>
            {label}
          </a>
        ))}
      </nav>
    </header>
  )
}

function VisualIdentitiesPage() {
  const [activeProject, setActiveProject] =
    useState<typeof visualIdentityProjects[number] | null>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lastTriggerRef = useRef<HTMLAnchorElement>(null)
  const listingScrollPosition = useRef(0)

  const handleProjectPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 20
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 20

    const rings = event.currentTarget.querySelector<HTMLElement>(
      ".portfolio-project-image__rings--identity",
    )
    if (!rings) return

    for (const [layer, depth] of [
      ["outer", 0.35],
      ["middle", 0.55],
      ["inner", 0.75],
    ] as const) {
      rings.style.setProperty(`--${layer}-x`, `${x * depth}px`)
      rings.style.setProperty(`--${layer}-y`, `${y * depth}px`)
    }
  }

  const handleProjectPointerLeave = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const rings = event.currentTarget.querySelector<HTMLElement>(
      ".portfolio-project-image__rings--identity",
    )
    if (!rings) return

    for (const layer of ["outer", "middle", "inner"] as const) {
      rings.style.setProperty(`--${layer}-x`, "0px")
      rings.style.setProperty(`--${layer}-y`, "0px")
    }
  }

  useEffect(() => {
    if (!activeProject) return

    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setActiveProject(null)
        return
      }

      if (event.key !== "Tab" || !lightboxRef.current) return
      const focusable = lightboxRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.documentElement.style.overflow = previousOverflow
      window.scrollTo(0, listingScrollPosition.current)
      lastTriggerRef.current?.focus({ preventScroll: true })
    }
  }, [activeProject])

  return (
    <>
      <main
        className="portfolio-page portfolio-listing"
        aria-hidden={activeProject ? true : undefined}
        inert={activeProject !== null}
      >
        <PortfolioHeader />
        <section className="portfolio-content">
          <div className="section-label">
            <p>Selected visual work / 01</p>
            <p>
              Identity systems
              <br />
              and visual languages.
            </p>
          </div>
          <div className="portfolio-heading">
            <h1>
              Visual
              <br />
              <em>identities.</em>
            </h1>
            <span className="edition">
              05
              <br />
              PROJECTS
            </span>
          </div>
          <div className="portfolio-project-grid">
            {visualIdentityProjects.map((project, index) => (
              <a
                className="portfolio-project-card"
                href={`/work/visual-identities/${project.slug}/`}
                key={project.slug}
                onClick={(event) => {
                  event.preventDefault()
                  listingScrollPosition.current = window.scrollY
                  lastTriggerRef.current = event.currentTarget
                  setActiveProject(project)
                }}
              >
                <div
                  className="portfolio-project-image portfolio-project-image--identity"
                  onPointerMove={handleProjectPointerMove}
                  onPointerLeave={handleProjectPointerLeave}
                  onPointerDown={handleProjectPointerMove}
                  onPointerUp={handleProjectPointerLeave}
                  onPointerCancel={handleProjectPointerLeave}
                >
                  <img src={project.coverImage} alt={project.coverAlt} />
                  <span
                    className="portfolio-project-image__rings portfolio-project-image__rings--identity"
                    aria-hidden="true"
                  />
                  <span className="portfolio-project-image__number">
                    PROJECT / {String(index + 1).padStart(2, "0")}
                  </span>
                  <Arrow />
                </div>
                <div
                  className={`portfolio-project-copy${
                    project.description
                      ? ""
                      : " portfolio-project-copy--no-description"
                  }`}
                >
                  <h2>{project.title}</h2>
                  {project.description && <p>{project.description}</p>}
                </div>
              </a>
            ))}
          </div>
          <a className="portfolio-back-link" href="/#work">
            <Arrow down />
            <span>Back to selected work</span>
          </a>
        </section>
      </main>
      {activeProject && (
        <div
          className="portfolio-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeProject.title} project presentation`}
          ref={lightboxRef}
        >
          <button
            className="portfolio-lightbox__close"
            type="button"
            aria-label="Close project presentation"
            onClick={() => setActiveProject(null)}
            ref={closeButtonRef}
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="portfolio-lightbox__scroll">
            <BrandPresentationPage project={activeProject} overlay />
          </div>
        </div>
      )}
    </>
  )
}

function BrandPresentationPage({
  project,
  overlay = false,
}: {
  project: typeof visualIdentityProjects[number]
  overlay?: boolean
}) {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]")
    if (typeof IntersectionObserver === "undefined") {
      items.forEach((item) => item.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) =>
            entry.isIntersecting && entry.target.classList.add("is-visible"),
        ),
      { threshold: 0.12 },
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [project.slug])

  return (
    <main
      className={`portfolio-page portfolio-presentation portfolio-presentation--natural${
        overlay ? " portfolio-presentation--overlay" : ""
      }`}
    >
      {!overlay && <PortfolioHeader />}
      <section className="portfolio-content">
        {!overlay && (
          <div className="portfolio-breadcrumbs">
            <a href="/">Home</a>
            <span>/</span>
            <a href="/work/visual-identities/">Visual identities</a>
            <span>/</span>
            <span>{project.title}</span>
          </div>
        )}
        <div className="portfolio-project-intro" data-reveal>
          <div>
            <p className="section-label-text">
              {"category" in project ? project.category : "Visual identity"}
              {"year" in project && project.year ? ` / ${project.year}` : ""}
            </p>
            <h1>{project.title}</h1>
            {project.description && (
              <p className="portfolio-project-description">
                {project.description}
              </p>
            )}
          </div>
          {project.overview && (
            <p className="portfolio-project-overview">{project.overview}</p>
          )}
        </div>
        {project.details.length > 0 && (
          <div className="portfolio-project-details" data-reveal>
            {project.details.map((detail) => (
              <section key={detail.label}>
                <h2>{detail.label}</h2>
                <p>{detail.text}</p>
              </section>
            ))}
          </div>
        )}
        <div className="portfolio-visuals">
          {project.sections.map((section, index) => (
            <figure className="portfolio-visual" key={section.id} data-reveal>
              <img
                src={section.image}
                alt={section.imageAlt}
                loading={index === 0 ? "eager" : "lazy"}
              />
              {(section.title || section.description) && (
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    {section.title && <h2>{section.title}</h2>}
                    {section.description && <p>{section.description}</p>}
                  </div>
                </figcaption>
              )}
            </figure>
          ))}
        </div>
        {!overlay && (
          <a className="portfolio-back-link" href="/work/visual-identities/">
            <Arrow down />
            <span>All visual identities</span>
          </a>
        )}
      </section>
    </main>
  )
}

function PortfolioRouter() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/"
  const listingPath = "/work/visual-identities"
  const project = visualIdentityProjects.find(
    (item) => pathname === `${listingPath}/${item.slug}`,
  )

  if (pathname === listingPath) return <VisualIdentitiesPage />
  if (project) return <BrandPresentationPage project={project} />
  return <HomePage />
}

function HomePage() {
  const [selectedTrack, setSelectedTrack] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [compactNav, setCompactNav] = useState(
    () => window.matchMedia("(max-width: 900px)").matches,
  )
  const track = tracks[selectedTrack]

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)")
    const updateCompactNav = () => setCompactNav(media.matches)
    const unsubscribe = subscribeMediaQuery(media, updateCompactNav)
    updateCompactNav()
    return unsubscribe
  }, [])

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]")
    if (typeof IntersectionObserver === "undefined") {
      items.forEach((item) => item.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) =>
            entry.isIntersecting && entry.target.classList.add("is-visible"),
        ),
      { threshold: 0.12 },
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  const selectTrack = (index: number) => {
    setSelectedTrack(index)
    setPlaying(true)
  }

  const navInert = compactNav && !menuOpen

  return (
    <main id="top">
      <header className="site-header">
        <div className="brand-lockup">
          <a className="logo" href="#top" aria-label="llull, home">
            llull<sup>®</sup>
          </a>
          <AudioVisualizer />
        </div>
        <p className="header-practice">
          Independent creative practice
          <br />
          Prishtina, Kosovo
        </p>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        <nav
          id="main-nav"
          className={menuOpen ? "is-open" : ""}
          aria-label="Primary navigation"
          aria-hidden={navInert}
        >
          {[
            ["Work", "work"],
            ["Sound", "sound"],
            ["About", "about"],
            ["Contact", "contact"],
          ].map(([label, id], index) => (
            <a
              key={id}
              href={`#${id}`}
              tabIndex={navInert ? -1 : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <small>0{index + 1}</small>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <WaveField active={playing} />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-meta">
          <span>DESIGNER / VISUAL ARTIST / MUSICIAN</span>
          <span>42.66667° N / 21.16667° E</span>
          <span>SIGNAL {playing ? "LIVE" : "IDLE"}</span>
        </div>
        <h1 id="hero-title" className="hero-statement">
          Ideas with <em>rhythm</em>
          <br />
          and resonance.
        </h1>
        <a
          className="signal-control"
          href="https://www.youtube.com/@llull.r"
          target="_blank"
          rel="noreferrer"
          aria-label="Visit the LLULL YouTube channel"
        >
          <span className="play-glyph" aria-hidden="true" />
          <span>Play signal</span>
          <small>LLULL channel / YouTube</small>
        </a>
        <div className="hero-foot">
          <p>
            Visual identities, digital experiences and sound,
            <br />
            built to leave a clear trace.
          </p>
          <a href="#work">
            Explore the practice <Arrow down />
          </a>
        </div>
        <p className="simulation-note">
          GENERATIVE VISUAL FIELD / REAL AUDIO VIA YOUTUBE
        </p>
      </section>

      <section className="work paper-section" id="work">
        <div className="section-label" data-reveal>
          <p>Selected visual work / 01</p>
          <p>
            Strategy, form and systems
            <br />
            across screen and print.
          </p>
        </div>
        <div className="work-heading" data-reveal>
          <h2>
            One practice.
            <br />
            <em>Multiple frequencies.</em>
          </h2>
          <span className="edition">LR—10+</span>
        </div>
        <div className="practice-list">
          {practices.map((practice) =>
            practice.href ? (
              <a
                className="practice-row"
                href={practice.href}
                key={practice.number}
                data-reveal
              >
                <PracticeRowContent practice={practice} />
              </a>
            ) : (
              <article
                className="practice-row"
                key={practice.number}
                data-reveal
              >
                <PracticeRowContent practice={practice} />
              </article>
            ),
          )}
        </div>
        <a
          className="behance-strip"
          href="https://www.behance.net/ramusa"
          target="_blank"
          rel="noreferrer"
        >
          <span>View selected visual projects</span>
          <strong>BEHANCE / RAMUSA</strong>
          <Arrow />
        </a>
      </section>

      <section className="sound" id="sound">
        <div className="section-label section-label--dark" data-reveal>
          <p>Independent music / 02</p>
          <p>
            Written and recorded
            <br />
            under the name Llull.
          </p>
        </div>
        <div className="sound-title" data-reveal>
          <h2>
            Turn the noise
            <br />
            into <em>meaning.</em>
          </h2>
          <p>Voice, guitar, tension, release.</p>
        </div>
        <MusicWave active={playing} />
        <div className="music-layout" data-reveal>
          <div className="artwork">
            <img src={track.image} alt={`Artwork for ${track.title}`} />
            <div className="artwork-stamp">
              LLULL
              <br />
              SIDE—A
            </div>
            <button type="button" onClick={() => setPlaying((value) => !value)}>
              <span
                className={playing ? "pause-glyph" : "play-glyph"}
                aria-hidden="true"
              />
              <span>{playing ? "Stop" : "Listen"}</span>
            </button>
          </div>
          <div className="track-panel">
            <div className="track-panel-head">
              <span>Index / audio works</span>
              <span>04 tracks</span>
            </div>
            {tracks.map((item, index) => (
              <button
                type="button"
                className={
                  selectedTrack === index ? "track is-selected" : "track"
                }
                key={item.id}
                onClick={() => selectTrack(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
                <small>{item.type}</small>
                <time>{item.duration}</time>
                <i aria-hidden="true" />
              </button>
            ))}
            <a
              className="channel-link"
              href="https://www.youtube.com/@llull.r"
              target="_blank"
              rel="noreferrer"
            >
              Visit the LLULL channel <Arrow />
            </a>
          </div>
        </div>
      </section>

      <section className="about paper-section" id="about">
        <div className="section-label" data-reveal>
          <p>About / 03</p>
          <p>
            One person.
            <br />
            Several ways of thinking.
          </p>
        </div>
        <h2 data-reveal>
          Form follows
          <br />
          <em>curiosity.</em>
        </h2>
        <div className="about-layout">
          <figure className="portrait" data-reveal>
            <div className="portrait-frame">
              <img src="/media/portrait.jpg" alt="Portrait of Lulezim Ramusa" />
              <span>03 — PROFILE</span>
            </div>
            <figcaption>
              <span>Lulezim Ramusa</span>
              <span>Prishtina, Kosovo</span>
            </figcaption>
          </figure>
          <div className="experience" data-reveal>
            <strong>10+</strong>
            <span>
              Years of
              <br />
              practice
            </span>
          </div>
          <div className="bio" data-reveal>
            <p>
              Lulezim Ramusa is a Senior Graphic Designer and Visual Designer
              with over 10 years of professional experience. His work combines
              strong visual thinking, conceptual development, and a practical
              understanding of digital and print media.
            </p>
            <p>
              He has worked across international and local markets, including
              Switzerland, developing visual identities, communication
              materials, digital experiences, editorial design and data
              visualization.
            </p>
            <p>
              He holds a Master’s degree in Graphic Design and Multimedia from
              the University of Prishtina and pursued graduate studies in Art at
              Hacettepe University in Ankara. As Llull, he also works as a
              vocalist, lead guitarist, composer and songwriter.
            </p>
            <p>
              Across disciplines, his practice is driven by an interest in
              visual storytelling, experimentation and authentic creative
              expression.
            </p>
          </div>
        </div>
      </section>

      <footer id="contact">
        <div className="section-label section-label--dark" data-reveal>
          <p>Contact / 04</p>
          <p>
            Have a project, collaboration
            <br />
            or unusual idea in mind?
          </p>
        </div>
        <h2 data-reveal>
          Let’s make
          <br />
          <em>something</em> resonate.
        </h2>
        <div className="footer-links" data-reveal>
          <a
            href="https://open.spotify.com/artist/0SSC8QvDtdAIgnOisG3B0K"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit the LLULL Spotify artist profile"
          >
            <span className="social-brand">
              <span className="social-mark" aria-hidden="true">
                <svg width="19" height="19" viewBox="0 0 24 24">
                  <path
                    d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                    fill="#1ed760"
                  />
                </svg>
              </span>
              Spotify
            </span>
            <Arrow />
          </a>
          <a
            href="https://www.youtube.com/@llull.r"
            target="_blank"
            rel="noreferrer"
          >
            <span className="social-brand">
              <span className="social-mark" aria-hidden="true">
                <svg width="21" height="21" viewBox="0 0 24 24">
                  <path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    fill="#ff0000"
                  />
                </svg>
              </span>
              YouTube
            </span>
            <Arrow />
          </a>
          <a
            href="https://www.behance.net/ramusa"
            target="_blank"
            rel="noreferrer"
          >
            <span className="social-brand">
              <span className="social-mark" aria-hidden="true">
                <svg width="21" height="21" viewBox="0 0 24 24">
                  <path
                    d="M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z"
                    fill="#1769ff"
                  />
                </svg>
              </span>
              Behance
            </span>
            <Arrow />
          </a>
        </div>
        <address data-reveal>
          <a href="mailto:lulezimramusa@gmail.com">
            <small>Email</small>
            <span>lulezimramusa@gmail.com</span>
          </a>
          <a href="tel:+38345312783">
            <small>Phone</small>
            <span>+383 45 312 783</span>
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=St.+Bajram+Kelmendi+Nr.+48+F4+Prishtine"
            target="_blank"
            rel="noreferrer"
          >
            <small>Address</small>
            <span>
              St. Bajram Kelmendi, Nr. 48 F4
              <br />
              Prishtine
            </span>
          </a>
        </address>
        <div className="footer-row">
          <span>© {new Date().getFullYear()} Lulezim Ramusa</span>
          <span>Design / Art / Music</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>

      {playing && (
        <aside className="sound-dock" aria-label={`Now playing ${track.title}`}>
          <div className="sound-dock-head">
            <span>NOW PLAYING / {track.title}</span>
            <button
              type="button"
              onClick={() => setPlaying(false)}
              aria-label="Stop playback"
            >
              STOP ×
            </button>
          </div>
          <iframe
            src={`https://www.youtube.com/embed/${track.id}?autoplay=1&rel=0`}
            title={`${track.title} by Llull`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </aside>
      )}
    </main>
  )
}

function App() {
  return <PortfolioRouter />
}

export default App
