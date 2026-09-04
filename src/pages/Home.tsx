import { Link } from 'react-router-dom'
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react'
import { profile } from '../content/profile'
import { featuredProjects } from '../content/projects'
import { roles } from '../content/experience'
import { skillGroups } from '../content/skills'
import { awards, certifications, degrees } from '../content/credentials'
import ProjectCard from '../components/ProjectCard'
import { SectionHeading, Tag } from '../components/ui'
import { usePageMeta } from '../lib/usePageMeta'

export default function Home() {
  usePageMeta(
    'Anthony Breeganzo Thomas — AI Engineer',
    'AI Engineer at Kyndryl. Production generative-AI systems: RAG pipeline design, multi-agent orchestration, and retrieval evaluation.',
  )

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-14 sm:pt-24">
        <p className="mb-4 font-mono text-xs tracking-wide uppercase" style={{ color: 'var(--accent)' }}>
          {profile.title} · {profile.company} · {profile.location}
        </p>
        <h1 className="max-w-3xl text-3xl leading-[1.15] font-semibold tracking-tight sm:text-[2.75rem]">
          {profile.headline}
        </h1>
        <div className="mt-6 max-w-2xl space-y-4 prose-body text-[15px]">
          {profile.summary.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            See the work <ArrowRight size={15} aria-hidden />
          </Link>
          <Link
            to="/quant"
            className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium surface transition-colors hover:border-[var(--border-strong)]"
          >
            Quantitative research
          </Link>
        </div>

        {profile.resumes.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
            <span style={{ color: 'var(--text-faint)' }}>Resume:</span>
            {profile.resumes.map((r) => (
              <a
                key={r.file}
                href={r.file}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                <Download size={13} aria-hidden /> {r.label}
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Featured work */}
      <section id="work" className="mx-auto max-w-5xl px-5 py-14" style={{ borderTop: '1px solid var(--border)' }}>
        <SectionHeading eyebrow="Selected work" title="Featured projects">
          <p>
            Six projects that carry the argument. Each one links to a longer writeup; where there is no
            repository link, the reason is stated rather than left blank.
          </p>
        </SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredProjects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        <Link
          to="/projects"
          className="mt-6 inline-flex items-center gap-1.5 text-sm hover:underline"
          style={{ color: 'var(--accent)' }}
        >
          All projects <ArrowRight size={14} aria-hidden />
        </Link>
      </section>

      {/* Experience */}
      <section id="experience" className="mx-auto max-w-5xl px-5 py-14" style={{ borderTop: '1px solid var(--border)' }}>
        <SectionHeading eyebrow="Experience" title="Where I've worked" />
        <div className="space-y-10">
          {roles.map((role) => (
            <div key={`${role.company}-${role.start}`}>
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-[15px] font-semibold">{role.title}</h3>
                <span className="text-[15px]" style={{ color: 'var(--accent)' }}>
                  {role.company}
                </span>
                <span className="ml-auto font-mono text-xs whitespace-nowrap" style={{ color: 'var(--text-faint)' }}>
                  {role.start} — {role.end}
                </span>
              </div>
              <p className="mb-3 text-xs" style={{ color: 'var(--text-faint)' }}>
                {role.location}
              </p>
              <ul className="space-y-2">
                {role.bullets.map((b) => (
                  <li key={b.slice(0, 30)} className="flex gap-2.5 text-[14px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full" style={{ background: 'var(--border-strong)' }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="mx-auto max-w-5xl px-5 py-14" style={{ borderTop: '1px solid var(--border)' }}>
        <SectionHeading eyebrow="Skills" title="What I work with">
          <p>Grouped by domain, without self-assigned proficiency levels.</p>
        </SectionHeading>
        <div className="grid gap-6 sm:grid-cols-2">
          {skillGroups.map((g) => (
            <div key={g.name}>
              <h3 className="mb-2.5 text-[13px] font-semibold">{g.name}</h3>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((i) => (
                  <Tag key={i}>{i}</Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education, awards, certifications */}
      <section id="background" className="mx-auto max-w-5xl px-5 py-14" style={{ borderTop: '1px solid var(--border)' }}>
        <SectionHeading eyebrow="Background" title="Education & recognition" />

        <div className="space-y-7">
          {degrees.map((d) => (
            <div key={d.institution}>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-[15px] font-semibold">{d.qualification}</h3>
                {d.detail && (
                  <span className="text-[13px]" style={{ color: 'var(--accent)' }}>
                    {d.detail}
                  </span>
                )}
                <span className="ml-auto font-mono text-xs whitespace-nowrap" style={{ color: 'var(--text-faint)' }}>
                  {d.start} — {d.end}
                </span>
              </div>
              <p className="mt-1 text-[14px]" style={{ color: 'var(--text-muted)' }}>
                {d.institution}
              </p>
              {d.note && (
                <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: 'var(--text-faint)' }}>
                  {d.note}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 text-[13px] font-semibold">Awards</h3>
            <ul className="space-y-3">
              {awards.map((a) => (
                <li key={a.name}>
                  <p className="text-[14px] font-medium">{a.name}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {a.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-[13px] font-semibold">Certifications</h3>
            <ul className="space-y-2">
              {certifications.map((c) => (
                <li key={c.name} className="text-[14px]" style={{ color: 'var(--text-muted)' }}>
                  {c.name}
                  {c.inProgress && (
                    <span className="ml-1.5 font-mono text-[11px]" style={{ color: 'var(--text-faint)' }}>
                      in progress
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-5xl px-5 py-14" style={{ borderTop: '1px solid var(--border)' }}>
        <SectionHeading eyebrow="Contact" title="Get in touch">
          <p>Email is the most reliable route. I'm also on LinkedIn and GitHub.</p>
        </SectionHeading>
        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            <Mail size={15} aria-hidden /> {profile.email}
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium surface transition-colors hover:border-[var(--border-strong)]"
          >
            <Linkedin size={15} aria-hidden /> LinkedIn
          </a>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium surface transition-colors hover:border-[var(--border-strong)]"
          >
            <Github size={15} aria-hidden /> GitHub
          </a>
        </div>
      </section>
    </>
  )
}
