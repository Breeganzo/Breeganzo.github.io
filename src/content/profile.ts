export const profile = {
  name: 'Anthony Breeganzo Thomas',
  title: 'AI Engineer',
  company: 'Kyndryl',
  location: 'Bangalore, India',
  email: 'anthonybreeganzo02@gmail.com',
  links: {
    github: 'https://github.com/Breeganzo',
    linkedin: 'https://www.linkedin.com/in/breeganzo/',
  },
  // BLOCKED — intentionally empty so the resume row renders nothing until fixed.
  //
  // Both source PDFs still contain the two Elastic ML bullets that are excluded
  // from this site (the 105M-record per-API-endpoint repartitioning, and the
  // seven data-quality defects / 28-panel Kibana dashboard). Shipping them as-is
  // would republish withheld content and contradict the HTML.
  //
  // To re-enable: regenerate both PDFs without those bullets, put them in
  // public/, then restore the two entries below. `npm run audit:content`
  // fails if a PDF containing the excluded phrases is present.
  resumes: [] as { label: string; file: string }[],
  /** Hero. Kept short — the projects carry the argument. */
  headline: 'I build production generative-AI systems, and I measure whether they work.',
  summary: [
    'AI Engineer at Kyndryl, shipping generative-AI and machine-learning systems for banking, legal and telecom clients. My work is mostly RAG pipeline design, multi-agent orchestration and the unglamorous evaluation harnesses that tell you whether either is actually working.',
    'MSc Artificial Intelligence with Distinction from Queen Mary University of London, as a fully funded Commonwealth Scholar. Currently reading part-time for an MSc Financial Engineering at WorldQuant University alongside full-time work, which feeds a parallel track of quantitative research.',
  ],
  /** Short, honest note used on the quant page. */
  quantIntro: [
    'A second track, run alongside the AI engineering work rather than instead of it. The two share a substrate — Python, statistics, disciplined pipelines, and a habit of validating out-of-sample before believing anything.',
    'Everything here is built to be re-run by a reviewer: walk-forward validation rather than in-sample fitting, correction for multiple testing where many signals are screened, and published attribution so a result can be argued with.',
  ],
} as const
