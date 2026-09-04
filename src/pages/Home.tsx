import { Link } from 'react-router-dom'
import { Award, ArrowRight, Download, GraduationCap, Github, Linkedin, Mail } from 'lucide-react'
import { profile } from '../content/profile'
import { featuredProjects, projects } from '../content/projects'
import { roles } from '../content/experience'
import { skillGroups } from '../content/skills'
import { awards, certifications, degrees } from '../content/credentials'
import ProjectCard from '../components/ProjectCard'
import { Badge, Card, SectionHeading, Stat, Tag, buttonProps } from '../components/ui'
import { usePageMeta } from '../lib/usePageMeta'
import { reveal, useReveal } from '../lib/useReveal'
import { useCountUp } from '../lib/useCountUp'

/** First professional role, used to derive the years figure rather than
 *  hardcoding a number that silently goes stale. */
const CAREER_START = Date.UTC(2022, 9, 1)
const yearsExperience = Math.floor((Date.now() - CAREER_START) / (365.25 * 24 * 60 * 60 * 1000))

function CountStat({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const { ref, value: shown } = useCountUp(value)
  return (
    <Stat
      value={
        <span ref={ref}>
          {shown}
          {suffix}
        </span>
      }
      label={label}
    />
  )
}

export default function Home() {
  usePageMeta(
    'Anthony Breeganzo Thomas — AI Engineer',
    'AI Engineer at Kyndryl. Production generative-AI systems: RAG pipeline design, multi-agent orchestration, and retrieval evaluation.',
  )

  const root = useReveal<HTMLDivElement>()
  const msc = degrees.find((d) => d.id === 'qmul-msc-ai')
  const mfe = degrees.find((d) => d.id === 'wqu-mfe')

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pt-12 pb-16 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <p
              {...reveal(0)}
              className="mb-4 font-mono text-xs tracking-[0.14em] uppercase text-accent"
            >
              {profile.title} · {profile.company} · {profile.location}
            </p>
            <h1
              {...reveal(1)}
              className="text-3xl leading-[1.12] font-semibold tracking-tight text-balance sm:text-[2.85rem]"
            >
              I build production generative-AI systems, and I{' '}
              <span className="gradient-text">measure whether they work</span>.
            </h1>
            <div {...reveal(2)} className="prose-body mt-6 max-w-2xl space-y-4 text-[15px]">
              {profile.summary.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <div {...reveal(3)} className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/projects" {...buttonProps('primary')}>
                See the work <ArrowRight size={15} aria-hidden />
              </Link>
              <Link to="/quant" {...buttonProps('ghost')}>
                Quantitative research
              </Link>
            </div>

            {profile.resumes.length > 0 && (
              <div
                {...reveal(4)}
                className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]"
              >
                <span className="text-faint">Download:</span>
                {profile.resumes.map((r) => (
                  <a
                    key={r.file}
                    href={r.file}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-accent hover:underline"
                  >
                    <Download size={13} aria-hidden /> {r.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div {...reveal(2)} className="mx-auto w-full max-w-xs lg:max-w-none">
            <div className="relative">
              <picture>
                <source srcSet={profile.photo.webp} type="image/webp" />
                <img
                  src={profile.photo.jpg}
                  alt={profile.photo.alt}
                  width={900}
                  height={900}
                  // Above the fold: fetched eagerly and with high priority so
                  // the hero does not settle in after first paint.
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="aspect-square w-full rounded-panel border border-line object-cover shadow-lift"
                />
              </picture>
              {profile.availability && (
                <span className="glass absolute -bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-pill px-3.5 py-1.5 text-[12px] font-medium whitespace-nowrap">
                  <span
                    aria-hidden
                    className="size-2 rounded-full"
                    style={{ background: '#22c55e', animation: 'pulse-ring 2.4s ease-out infinite' }}
                  />
                  {profile.availability}
                </span>
              )}
            </div>

            <div className="mt-8 space-y-2.5">
              {msc && (
                <Badge
                  icon={<GraduationCap size={17} />}
                  title={`${msc.qualification}${msc.detail ? ` — ${msc.detail}` : ''}`}
                  subtitle={msc.institution}
                />
              )}
              {mfe && (
                <Badge
                  icon={<GraduationCap size={17} />}
                  title={mfe.qualification}
                  subtitle={`${mfe.institution} · ${mfe.start}–${mfe.end}`}
                />
              )}
              <Badge
                icon={<Award size={17} />}
                title="Commonwealth Scholar"
                subtitle="Fully funded · Innovation & Sustainability"
              />
            </div>
          </div>
        </div>

        <div
          {...reveal(5)}
          className="glass-panel mt-14 grid grid-cols-1 gap-8 px-7 py-7 sm:grid-cols-3"
        >
          <CountStat value={yearsExperience} suffix="+" label="Years in industry" />
          <CountStat value={certifications.length} label="Certifications" />
          <CountStat value={projects.length} label="Projects documented" />
        </div>
      </section>

      {/* Featured work */}
      <section id="work" className="mx-auto max-w-5xl px-5 py-14">
        <div {...reveal(0)}>
          <SectionHeading eyebrow="Selected work" title="Featured projects">
            <p>
              Six projects that carry the argument. Each one links to a longer writeup; where there is no
              repository link, the reason is stated rather than left blank.
            </p>
          </SectionHeading>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredProjects.map((p, i) => (
            <div key={p.slug} {...reveal(i)} className="h-full">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
        <Link
          to="/projects"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
        >
          All projects <ArrowRight size={14} aria-hidden />
        </Link>
      </section>

      {/* Experience */}
      <section id="experience" className="mx-auto max-w-5xl px-5 py-14">
        <div {...reveal(0)}>
          <SectionHeading eyebrow="Experience" title="Where I've worked" />
        </div>
        {/* Timeline rail. The rail is decorative, so the markers are
            aria-hidden and the list stays a plain sequence for screen readers. */}
        <div className="space-y-8 border-l border-line pl-6 sm:pl-8">
          {roles.map((role, i) => (
            <Card key={`${role.company}-${role.start}`} {...reveal(i)} className="p-6">
              <span
                aria-hidden
                className="absolute top-8 -left-[calc(1.5rem+5px)] size-2.5 rounded-full sm:-left-[calc(2rem+5px)]"
                style={{ background: 'var(--grad-accent)' }}
              />
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-[15px] font-semibold">{role.title}</h3>
                <span className="text-[15px] text-accent">{role.company}</span>
                <span className="ml-auto font-mono text-xs whitespace-nowrap text-faint">
                  {role.start} — {role.end}
                </span>
              </div>
              <p className="mb-3 text-xs text-faint">{role.location}</p>
              <ul className="space-y-2">
                {role.bullets.map((b) => (
                  <li key={b.slice(0, 30)} className="flex gap-2.5 text-[14px] leading-relaxed text-muted">
                    <span
                      aria-hidden
                      className="mt-2 size-1 shrink-0 rounded-full bg-line-strong"
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="mx-auto max-w-5xl px-5 py-14">
        <div {...reveal(0)}>
          <SectionHeading eyebrow="Skills" title="What I work with">
            <p>Grouped by domain, without self-assigned proficiency levels.</p>
          </SectionHeading>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {skillGroups.map((g, i) => (
            <Card key={g.name} {...reveal(i)} className="p-5">
              <h3 className="mb-3 text-[13px] font-semibold">{g.name}</h3>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Education, awards, certifications */}
      <section id="background" className="mx-auto max-w-5xl px-5 py-14">
        <div {...reveal(0)}>
          <SectionHeading eyebrow="Background" title="Education & recognition" />
        </div>

        <div className="space-y-4">
          {degrees.map((d, i) => (
            <Card key={d.institution} {...reveal(i)} className="p-6">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-[15px] font-semibold">{d.qualification}</h3>
                {d.detail && <span className="text-[13px] text-accent">{d.detail}</span>}
                <span className="ml-auto font-mono text-xs whitespace-nowrap text-faint">
                  {d.start} — {d.end}
                </span>
              </div>
              <p className="mt-1 text-[14px] text-muted">{d.institution}</p>
              {d.note && <p className="mt-1.5 text-[13px] leading-relaxed text-faint">{d.note}</p>}
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card {...reveal(0)} className="p-6">
            <h3 className="mb-3 text-[13px] font-semibold">Awards</h3>
            <ul className="space-y-3">
              {awards.map((a) => (
                <li key={a.name}>
                  <p className="text-[14px] font-medium">{a.name}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{a.detail}</p>
                </li>
              ))}
            </ul>
          </Card>
          <Card {...reveal(1)} className="p-6">
            <h3 className="mb-3 text-[13px] font-semibold">Certifications</h3>
            <ul className="space-y-2">
              {certifications.map((c) => (
                <li key={c.name} className="text-[14px] text-muted">
                  {c.name}
                  {c.inProgress && (
                    <span className="ml-1.5 font-mono text-[11px] text-faint">in progress</span>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-5xl px-5 py-14">
        <div {...reveal(0)} className="glass-panel px-7 py-10 text-center">
          <p className="mb-2.5 font-mono text-xs tracking-[0.14em] uppercase text-accent">Contact</p>
          <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Let's talk about the work
          </h2>
          <p className="prose-body mx-auto mt-3 max-w-lg text-[15px]">
            Email is the most reliable route. I'm also on LinkedIn and GitHub.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={`mailto:${profile.email}`} {...buttonProps('primary')}>
              <Mail size={15} aria-hidden /> {profile.email}
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              {...buttonProps('ghost')}
            >
              <Linkedin size={15} aria-hidden /> LinkedIn
            </a>
            <a href={profile.links.github} target="_blank" rel="noreferrer" {...buttonProps('ghost')}>
              <Github size={15} aria-hidden /> GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
