import { profile } from '../content/profile'
import { byTrack } from '../content/projects'
import { degrees } from '../content/credentials'
import { skillGroups } from '../content/skills'
import ProjectCard from '../components/ProjectCard'
import { Card, SectionHeading, Tag } from '../components/ui'
import { usePageMeta } from '../lib/usePageMeta'
import { reveal, useReveal } from '../lib/useReveal'

export default function Quant() {
  usePageMeta(
    'Quantitative Research — Anthony Breeganzo Thomas',
    'Systematic research: market-microstructure alpha, day-ahead power price forecasting, and credit risk modelling, with walk-forward validation throughout.',
  )

  const root = useReveal<HTMLDivElement>()
  const quantProjects = byTrack('quant')
  const wqu = degrees.find((d) => d.id === 'wqu-mfe')
  const quantSkills = skillGroups.filter((g) => g.quant)

  return (
    <div ref={root}>
      <section className="mx-auto max-w-5xl px-5 pt-14 pb-12">
        <div {...reveal(0)}>
          <SectionHeading eyebrow="Quantitative research" title="A second track, run in parallel">
            {profile.quantIntro.map((p) => (
              <p key={p.slice(0, 24)} className="mb-3">
                {p}
              </p>
            ))}
          </SectionHeading>
        </div>

        {wqu && (
          <Card {...reveal(1)} className="p-6">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h3 className="text-[15px] font-semibold">{wqu.qualification}</h3>
              <span className="ml-auto font-mono text-xs whitespace-nowrap text-faint">
                {wqu.start} — {wqu.end}
              </span>
            </div>
            <p className="mt-1 text-[14px] text-muted">
              {wqu.institution} · {wqu.detail}
            </p>
            {wqu.note && <p className="mt-2 text-[13px] leading-relaxed text-faint">{wqu.note}</p>}
          </Card>
        )}
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <div {...reveal(0)}>
          <SectionHeading title="Projects" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {quantProjects.map((p, i) => (
            <div key={p.slug} {...reveal(i)} className="h-full">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <div {...reveal(0)}>
          <SectionHeading title="Methods" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {quantSkills.map((g, i) => (
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
    </div>
  )
}
