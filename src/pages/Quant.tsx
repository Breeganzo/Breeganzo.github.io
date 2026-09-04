import { profile } from '../content/profile'
import { projects } from '../content/projects'
import { degrees } from '../content/credentials'
import { skillGroups } from '../content/skills'
import ProjectCard from '../components/ProjectCard'
import { SectionHeading, Tag } from '../components/ui'
import { usePageMeta } from '../lib/usePageMeta'

export default function Quant() {
  usePageMeta(
    'Quantitative Research — Anthony Breeganzo Thomas',
    'Systematic research: market-microstructure alpha, day-ahead power price forecasting, and credit risk modelling, with walk-forward validation throughout.',
  )

  const quantProjects = projects.filter((p) => p.track === 'quant')
  const wqu = degrees.find((d) => d.institution === 'WorldQuant University')
  const quantSkills = skillGroups.filter((g) =>
    ['Quantitative & Statistical Methods', 'Machine Learning'].includes(g.name),
  )

  return (
    <>
      <section className="mx-auto max-w-5xl px-5 pt-14 pb-12">
        <SectionHeading eyebrow="Quantitative research" title="A second track, run in parallel">
          {profile.quantIntro.map((p) => (
            <p key={p.slice(0, 24)} className="mb-3">
              {p}
            </p>
          ))}
        </SectionHeading>

        {wqu && (
          <div className="rounded-lg p-5 surface">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h3 className="text-[15px] font-semibold">{wqu.qualification}</h3>
              <span className="ml-auto font-mono text-xs whitespace-nowrap" style={{ color: 'var(--text-faint)' }}>
                {wqu.start} — {wqu.end}
              </span>
            </div>
            <p className="mt-1 text-[14px]" style={{ color: 'var(--text-muted)' }}>
              {wqu.institution} · {wqu.detail}
            </p>
            {wqu.note && (
              <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--text-faint)' }}>
                {wqu.note}
              </p>
            )}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12" style={{ borderTop: '1px solid var(--border)' }}>
        <SectionHeading title="Projects" />
        <div className="grid gap-4 sm:grid-cols-2">
          {quantProjects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12" style={{ borderTop: '1px solid var(--border)' }}>
        <SectionHeading title="Methods" />
        <div className="grid gap-6 sm:grid-cols-2">
          {quantSkills.map((g) => (
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
    </>
  )
}
