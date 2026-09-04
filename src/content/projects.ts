import type { Project, Track } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// Every highlight below must be traceable to a resume, a repository, or a
// confirmed first-hand account. If a claim cannot be supported, it is removed
// rather than softened.
//
// CONFIDENTIALITY — the hospitality engagement (multi-agent-operations):
//   • Client is "a global hospitality client". No name, no country, no country
//     count, no size figures.
//   • Describe the MCP *mechanism*, never the payload. Do not write
//     "financial", "profit", "asset management", "BI" or "investment".
//   • Do NOT claim A2A / Agent2Agent / agent cards — unverified.
//   • Own contribution only: 15 agents, not the platform or the other ~45.
// ─────────────────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    slug: 'scintilla',
    name: 'Scintilla',
    tagline:
      'Hybrid search and grounded question answering over scientific preprints — built to measure its own retrieval quality in CI.',
    track: 'ai',
    status: 'in-development',
    featured: true,
    stack: ['Python', 'Django', 'PostgreSQL', 'pgvector', 'OpenSearch', 'Airflow', 'Docker'],
    repo: 'https://github.com/Breeganzo/scintilla',
    highlights: [
      'Most retrieval systems ship without ever being measured. This one compares keyword, dense and fused retrieval against a hand-built golden set, and fails the build if quality regresses.',
      'Corpus of 3,377 arXiv papers across five categories, harvested on a daily Airflow schedule, chunked against the embedding model’s own tokenizer, embedded into pgvector and indexed into OpenSearch.',
      'Golden set of 50 hand-labelled queries in five classes, 163 labelled papers, each verified against the live corpus.',
      'The headline finding is negative: hybrid retrieval did not beat plain dense retrieval on this corpus, and the honest reading of the confidence interval is that the two are indistinguishable.',
    ],
    body: [
      'Scintilla exists to answer a question most retrieval projects skip: is the clever thing actually better than the simple thing? Keyword search (BM25), dense vector search, and Reciprocal Rank Fusion of the two are swept through the same `get_retriever()` call the API uses, and scored against a golden set built by hand.',
      'The pipeline gate was deliberately chosen to be a property rather than a metric: the ingestion DAG must be runnable twice with the second run indexing nothing. That idempotence is what makes a scheduled pipeline safe to leave running unattended. A verify step asserts that no chunk is left unembedded, that the index document count equals the chunk count, and that every paper is marked indexed — and fails the run otherwise.',
      'Of the 50 golden-set queries, 40 are answerable and 10 deliberately are not. The unanswerable ones are held out of every average: recall over an empty relevant set is 0/0, so scoring them zero would penalise every mode equally for a query with no answer, and scoring them one would hand every mode a free fifth of a point.',
      'The result did not go the way I expected, and it is published as it came out. Dense retrieval leads on recall@10 and nDCG@10; hybrid edges MRR by a margin far inside the noise. On this corpus, the fusion step buys latency and complexity without buying accuracy.',
    ],
    table: {
      caption: 'Retrieval ablation — 40 answerable queries',
      columns: ['mode', 'recall@1', 'recall@5', 'recall@10', 'MRR', 'nDCG@10', 'median ms'],
      rows: [
        ['bm25', '0.100', '0.374', '0.527', '0.565', '0.473', '5'],
        ['dense', '0.166', '0.563', '0.744', '0.775', '0.691', '24'],
        ['hybrid', '0.158', '0.533', '0.682', '0.776', '0.649', '33'],
      ],
      note:
        'Dense retrieval leads on recall@10 and nDCG@10. Hybrid’s MRR lead — 0.776 against 0.775 — is far inside the confidence interval, so the two are not distinguishable. The 10 unanswerable queries are excluded from every average.',
    },
  },

  {
    slug: 'multi-agent-operations',
    name: 'Multi-Agent Operations Platform',
    tagline:
      'Fifteen production agents inside a ~60-agent operations platform for a global hospitality client, built on Google ADK.',
    track: 'ai',
    status: 'production',
    featured: true,
    stack: ['Python', 'Google ADK', 'Vertex AI', 'MCP', 'Claude Haiku', 'Claude Sonnet'],
    noRepoReason: 'Client engagement — code is not public.',
    highlights: [
      'Built 15 of approximately 60 agents across three operational domains: maintenance, food and beverage, and housekeeping. In production with real users.',
      'Hierarchical delegation: an orchestrator receives a request and routes it to the domain specialist best able to serve it, rather than a human choosing which agent to talk to.',
      'Agents expose a machine-readable description of their own capabilities, so the orchestrator routes on declared capability instead of a hard-coded branch chain — a new agent can be added without modifying the orchestrator.',
      'MCP provides a standardised tool and resource layer over internal systems, exposing operational data refreshed daily.',
      'Cost-aware model tiering: Claude Haiku serves routine and automated responses, escalating to Claude Sonnet for substantive questions. Opus was deliberately excluded as unnecessary for a retrieval-grounded assistant.',
    ],
    body: [
      'The interaction surface is a retrieval-grounded assistant. A request arrives at an orchestrator, which decides which domain specialist should handle it and delegates. Because each agent advertises what it can do, routing is a lookup over declared capability rather than a hard-coded branch chain — which is the property that makes roughly sixty agents maintainable by separate domain teams.',
      'The model choice is the decision I would defend hardest. A retrieval-grounded assistant spends most of its time on routine lookups where a small fast model is indistinguishable from a large one, so Haiku handles those and Sonnet is reserved for questions that need real reasoning. Opus was considered and rejected: for grounded question answering over a known corpus, the additional capability had nowhere to go, and it would have multiplied per-request cost for no measurable gain.',
      'Scope note, because it matters for honesty: my contribution was the agentic engineering. I did not build the data platform, the portal, or the analytics layer, and I did not build the other agents in the platform.',
    ],
  },

  {
    slug: 'nightwatch-ai',
    name: 'NightWatch AI',
    tagline:
      'A seven-agent autonomous IT incident-management system — Sense, Reason, Act, Learn.',
    track: 'ai',
    status: 'complete',
    badge: '3rd place · AI Innovation 2026',
    featured: true,
    stack: ['LangGraph', 'Azure OpenAI', 'Azure AI Search', 'FastAPI', 'Streamlit', 'ServiceNow'],
    noRepoReason: 'Internal Kyndryl ideathon entry — code is not public.',
    highlights: [
      'Seven-agent orchestration across a Sense, Reason, Act, Learn loop for automated incident triage, diagnosis and resolution.',
      'Integrated with ServiceNow and CMDB so that diagnosis runs against real configuration state rather than incident text alone.',
      'Pattern matching over an Azure AI Search vector store to recognise incidents resembling previously resolved ones.',
      'Confidence-gated auto-resolution: the system acts autonomously only above a confidence threshold and escalates to a human for critical incidents.',
      'Placed 3rd in AI Innovation 2026.',
    ],
    body: [
      'The design question behind NightWatch is when an automated system should be allowed to act on its own. The answer here is a confidence gate: the agent loop produces a diagnosis with a confidence estimate, resolves autonomously above the threshold, and routes to a human below it — with critical incidents escalated regardless. That single boundary is what separates a useful automation from an unsupervised system making changes to production.',
      'Retrieval over past incidents does the heavy lifting. Rather than reasoning about each incident from scratch, the system matches against a vector store of previously resolved cases, which both improves accuracy and gives an operator a citable precedent for why an action was proposed.',
    ],
  },

  {
    slug: 'alphaflow',
    name: 'AlphaFlow',
    tagline:
      'A market-microstructure alpha research engine with a fully deterministic trading signal.',
    track: 'quant',
    status: 'complete',
    featured: true,
    stack: ['Python', 'LightGBM', 'scikit-learn', 'SHAP', 'FastAPI', 'React', 'PostgreSQL'],
    repo: 'https://github.com/Breeganzo/AlphaFlow',
    highlights: [
      'Computes order-flow and liquidity signals from free OHLCV data and validates them with walk-forward machine learning across roughly 50 tickers.',
      'The trading signal is 100% deterministic. It is built in two tiers: a cross-sectional long-short book taking the top and bottom deciles of the directional signal, and a separate high-conviction flag for names whose information coefficient survives Benjamini-Hochberg correction.',
      'Multiple-testing correction is the point, not a footnote — screening many signals across many tickers guarantees spurious winners without it.',
      '128 passing tests, FastAPI service layer, React dashboard, Postgres persistence, and GitHub Actions cron for unattended runs.',
      'Runs end-to-end on free API tiers, so a reviewer can reproduce it without paying for data.',
    ],
    body: [
      'The design principle a reviewer should check first is that the signal is deterministic. No language model touches the trading decision — it is computed from order-flow and liquidity features, ranked cross-sectionally, and traded as a long-short book. A natural-language layer exists, but it is grounded in the results after the fact rather than participating in them.',
      'The second tier is where the statistics matter. Screening many candidate signals across many tickers will always produce some that look excellent by chance, so a name only earns the high-conviction flag if its information coefficient survives Benjamini-Hochberg false-discovery-rate correction. That is a deliberately harsh gate, and most candidates do not pass it.',
    ],
  },

  {
    slug: 'entsoe-power-forecasting',
    name: 'ENTSO-E Day-Ahead Power Price Forecasting',
    tagline:
      'Day-ahead electricity price forecasting for the DE-LU bidding zone, built straight from the regulatory API.',
    track: 'quant',
    status: 'complete',
    featured: true,
    stack: ['Python', 'statsmodels', 'LightGBM', 'scikit-learn', 'SHAP', 'PostgreSQL'],
    repo: 'https://github.com/Breeganzo/de-forecast-entsoe',
    highlights: [
      'Two years of hourly DE-LU data ingested directly from the ENTSO-E Transparency Platform REST API, then checked the way a trading desk would check it before modelling.',
      'Walk-forward day-ahead price model with engineered lagged and forward-looking load, generation and cross-border flow features.',
      'Reduced MAE by approximately 61% against a seasonal-naive baseline.',
      'SHAP attribution and empirical prediction intervals, so a forecast comes with a stated uncertainty rather than a bare number.',
      'Translates the hourly forecast into prompt-curve views, and regenerates every output from one command.',
    ],
    body: [
      'DE-LU was chosen deliberately: it is one of Europe’s most liquid power markets and carries enough wind and solar volatility to make the forecasting problem commercially meaningful rather than a curve-fitting exercise.',
      'The baseline matters as much as the model. A seasonal-naive forecast is genuinely hard to beat in power markets, which is why it is the comparison — a 61% MAE reduction against a weak baseline would mean very little.',
      'The project is built so a reviewer can run one command, regenerate every output, and inspect each assumption through logs and reports. Prediction intervals are empirical rather than assumed normal.',
    ],
  },

  {
    slug: 'data-quality-agent',
    name: 'LangGraph Data Quality Agent',
    tagline:
      'A twelve-node agent pipeline that took an enterprise reference data warehouse from 51% to 100% automated quality.',
    track: 'ai',
    status: 'production',
    featured: true,
    stack: ['LangGraph', 'dbt', 'DuckDB', 'Python', 'SQL'],
    noRepoReason: 'Client engagement — code is not public.',
    highlights: [
      'Co-developed a 12-node LangGraph-orchestrated pipeline validating 54 rules across six quality dimensions on a reference data warehouse for an Indian telecom operator.',
      'LLM-driven data healing with quarantine logic, so records that cannot be confidently repaired are isolated rather than silently altered.',
      'Raised the automated quality score from 51% to 100%.',
      'dbt and DuckDB underneath, keeping transformations version-controlled and testable rather than ad hoc.',
    ],
    body: [
      'The interesting constraint in agentic data quality is knowing when not to act. An LLM asked to repair a malformed record will almost always produce something plausible, which is precisely the failure mode — a confidently wrong repair is worse than a rejected one. The quarantine path exists so that low-confidence cases stop and wait for a human instead of entering the warehouse looking clean.',
    ],
  },

  {
    slug: 'credit-risk-scoring',
    name: 'Credit Risk Scoring',
    tagline:
      'End-to-end credit default prediction on a 300K-record retail lending dataset, built as a governance exercise.',
    track: 'quant',
    stack: ['Python', 'PySpark', 'SQL', 'LightGBM', 'XGBoost', 'SHAP', 'Power BI'],
    status: 'complete',
    noRepoReason: 'Banking analytics case study — not published.',
    highlights: [
      'PySpark feature engineering and SQL transformations over a 300K+ record retail lending dataset.',
      'LightGBM and XGBoost models with SHAP explainability, chosen for regulatory-aligned interpretability rather than raw accuracy.',
      'Power BI dashboard for model performance monitoring: AUC-ROC trends, feature drift, and default-rate segmentation by risk tier.',
      'Structured to simulate a production model-governance workflow, where explainability and drift monitoring are requirements rather than extras.',
    ],
  },

  {
    slug: 'rmd-health',
    name: 'RMD-Health',
    tagline:
      'A clinical decision-support prototype for early detection of rheumatic and musculoskeletal disease.',
    track: 'ai',
    status: 'complete',
    stack: ['Python', 'LangGraph', 'Groq', 'Streamlit', 'FHIR R4'],
    repo: 'https://github.com/Breeganzo/RMD_Agent_Demo',
    // No `demo` link: rmd-health.streamlit.app now 303-redirects to a Streamlit
    // login page, so a visitor would hit an auth wall rather than the app.
    // Restore `demo` once it is publicly reachable again.
    highlights: [
      'LangGraph ReAct agent for screening, built for the University of Reading RMD-Health project.',
      'Explainable AI throughout — in a clinical setting an unexplained recommendation is unusable regardless of accuracy.',
      'FHIR R4 compliant data handling, with documented NHS GDPR compliance.',
    ],
  },

  {
    slug: 'self-healing-infrastructure',
    name: 'Self-Healing Infrastructure Monitor',
    tagline:
      'Monitoring that remediates common failure conditions instead of only alerting on them.',
    track: 'platform',
    status: 'in-development',
    stack: ['Python', 'FastAPI', 'AWS', 'Docker'],
    repo: 'https://github.com/Breeganzo/Self-healing-infrastructure-monitor',
    highlights: [
      'Detects and automatically resolves recurring infrastructure conditions — disk exhaustion, stopped instances, downed services — before they become downtime.',
      'FastAPI service with auto-generated documentation, built in explicit phases with a stated goal per phase.',
    ],
  },

  {
    slug: 'aws-landing-zone-agent',
    name: 'AWS Landing Zone Agent',
    tagline:
      'An AI consultant that turns stated business and compliance requirements into a landing-zone architecture.',
    track: 'platform',
    status: 'complete',
    stack: ['Python', 'Streamlit', 'AWS', 'Generative AI'],
    repo: 'https://github.com/Breeganzo/AWS_LZ_AGENT',
    highlights: [
      'Generates enterprise AWS landing-zone recommendations tailored to stated business, compliance and security requirements.',
      'Produces architecture diagrams and written documentation alongside the recommendation, which is the part that makes it usable in a real consulting conversation.',
    ],
  },

  {
    slug: 'french-on-the-fly',
    name: 'French on the Fly',
    tagline:
      'A French-learning app with an AI conversation partner, voice, and a structured A0-to-B2 curriculum.',
    track: 'ai',
    status: 'in-development',
    stack: ['Python', 'React', 'Speech', 'LLM'],
    repo: 'https://github.com/Breeganzo/french-on-the-fly',
    highlights: [
      'AI conversation partner with voice interaction and pronunciation coaching.',
      'A structured nine-month curriculum from A0 to B2, rather than open-ended chat practice.',
      'Built as a free product.',
    ],
  },

  // ── Veloryn / PipelinePilot — WITHHELD ────────────────────────────────────
  // Removed under the verified-only rule. Its single claim was "live at
  // veloryn.dev", and that host does not serve: TLS verification fails and
  // plain HTTP fails too (TCP connects, nothing responds). The repository is
  // private, so nothing about it is currently verifiable by a visitor.
  //
  // Re-add once veloryn.dev serves over valid TLS. Prior content, for reuse:
  //   tagline: 'A live product and marketing surface running on Google Cloud Run.'
  //   stack:   TypeScript, Cloud Run, Cloud SQL, PostgreSQL
  //   note:    marketing site + agency-first product app, Cloud SQL persistence

  {
    slug: 'vault-q',
    name: 'Vault Q',
    tagline:
      'A research-guidance marketplace for life-science students, built to run at zero platform cost.',
    track: 'platform',
    status: 'complete',
    stack: ['React', 'Firebase', 'Firestore', 'CSS Modules'],
    repo: 'https://github.com/Breeganzo/Vault_Q',
    highlights: [
      'Topic marketplace where a purchased research topic is locked and becomes unavailable to others.',
      'UPI payments via QR code and deep link, avoiding payment-gateway fees entirely.',
      'Firebase authentication and Firestore on the free tier, deployed to GitHub Pages with CI — chosen so the running cost is genuinely zero.',
    ],
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export const byTrack = (track: Track | 'all') =>
  track === 'all' ? projects : projects.filter((p) => p.track === track)

export const findProject = (slug: string) => projects.find((p) => p.slug === slug)

export const trackLabels: Record<Track, string> = {
  ai: 'GenAI & Agents',
  quant: 'Quantitative',
  platform: 'Platform & Product',
}

export const statusLabels: Record<Project['status'], string> = {
  production: 'In production',
  'in-development': 'In development',
  complete: 'Complete',
  research: 'Research',
}
