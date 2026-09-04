import type { Award, Credential, Degree } from './types'

export const degrees: Degree[] = [
  {
    institution: 'WorldQuant University',
    qualification: 'MSc Financial Engineering',
    detail: 'In progress, part-time alongside full-time work',
    start: '2026',
    end: 'Expected 2028',
    note:
      'Completed: Financial Markets. In progress: Financial Data. Remaining coursework includes Financial Econometrics, Derivative Pricing, Stochastic Modeling, Machine Learning in Finance, Deep Learning for Finance, and Portfolio Management and Risk Management.',
  },
  {
    institution: 'Queen Mary University of London',
    qualification: 'MSc Artificial Intelligence',
    detail: 'Distinction',
    start: 'Sep 2023',
    end: 'Sep 2024',
    note: 'Fully Funded Commonwealth Masters Scholar',
  },
  {
    institution: 'Reva University, Bangalore',
    qualification: 'B.Tech Computer Science and Engineering',
    detail: 'CGPA 9.0 / 10',
    start: 'Aug 2019',
    end: 'Jul 2023',
  },
]

// Current certifications only. The previous site's "currently preparing" block
// (Solutions Architect, ML Specialty, Azure AI Engineer, Terraform Associate)
// is deliberately dropped — it appears on neither current resume.
export const certifications: Credential[] = [
  { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services' },
  { name: 'AWS Certified AI Practitioner', issuer: 'Amazon Web Services' },
  { name: 'AWS Certified Machine Learning Associate', issuer: 'Amazon Web Services', inProgress: true },
  { name: 'Claude Certified Developer — Foundations', issuer: 'Anthropic', inProgress: true },
  { name: 'Microsoft Azure Fundamentals (AZ-900)', issuer: 'Microsoft' },
  { name: 'Neural Networks and Deep Learning', issuer: 'DeepLearning.AI' },
]

export const awards: Award[] = [
  {
    name: '3rd Place, AI Innovation 2026',
    detail: 'For NightWatch AI, a seven-agent autonomous IT incident-management platform.',
  },
  {
    name: 'Fully Funded Commonwealth Masters Scholarship',
    detail: 'Awarded for MSc Artificial Intelligence at Queen Mary University of London.',
  },
  {
    name: 'Runners-up, National IET Hackathon for Sustainability',
    detail: 'National-level competition.',
  },
]
