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
  /** Hero portrait. Both formats live in public/; the webp is preferred. */
  photo: { webp: '/profile.webp', jpg: '/profile.jpg', alt: 'Anthony Breeganzo Thomas' },
  /** Shown as a pill on the portrait. Set to null to hide it. */
  availability: 'Open to opportunities',
  /**
   * Two tracks, two documents. Both are scanned by `npm run audit:content`,
   * so a PDF containing an excluded phrase fails the build rather than
   * quietly contradicting the HTML.
   *
   * EMPTY ON PURPOSE. The current PDFs describe the Elastic ML client
   * engagement, which `audit:content` forbids from anything public. They are
   * staged (gitignored) at the repo root. To re-enable: re-export both without
   * those bullets, drop them in `public/`, restore the entries below, and
   * confirm `npm run audit:content` passes. The hero download row hides itself
   * while this list is empty.
   */
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
