import type { SkillGroup } from './types'

// No proficiency ratings, levels or bars. Self-assessment adds nothing a
// reviewer will trust, and a "beginner" label only ever subtracts.

export const skillGroups: SkillGroup[] = [
  {
    name: 'GenAI & Agents',
    items: [
      'RAG pipeline design',
      'Multi-agent orchestration',
      'LangChain',
      'LangGraph',
      'Google ADK',
      'MCP (Model Context Protocol)',
      'AWS Bedrock',
      'Azure OpenAI',
      'Vertex AI',
      'Prompt engineering',
      'FAISS',
      'pgvector',
      'Azure AI Search',
    ],
  },
  {
    name: 'Quantitative & Statistical Methods',
    quant: true,
    items: [
      'Time-series modelling and forecasting',
      'Walk-forward cross-validation',
      'ARIMA / VAR (statsmodels)',
      'Stationarity handling',
      'Multiple-testing correction',
      'Hypothesis testing',
      'STL decomposition',
      'EWMA',
      'PCA',
      'SHAP attribution',
      'Prediction intervals',
    ],
  },
  {
    name: 'Machine Learning',
    quant: true,
    items: [
      'scikit-learn',
      'LightGBM',
      'XGBoost',
      'Logistic regression',
      'Feature engineering',
      'Explainability',
      'Model evaluation and drift monitoring',
    ],
  },
  {
    name: 'Programming & Data',
    items: [
      'Python',
      'SQL',
      'PySpark',
      'pandas',
      'NumPy',
      'FastAPI',
      'Django',
      'REST APIs',
      'PostgreSQL',
      'DuckDB',
      'dbt',
      'Streamlit',
      'React',
      'TypeScript',
    ],
  },
  {
    name: 'Cloud & Platform',
    items: [
      'AWS (Bedrock, EC2, S3, Lambda, ECS, CloudWatch)',
      'Azure (OpenAI, AI Search)',
      'Google Cloud (Vertex AI, Cloud Run)',
      'Cloudera',
      'Docker',
      'Terraform',
      'Airflow',
      'OpenSearch',
      'Elastic Stack',
    ],
  },
  {
    name: 'Engineering Practices',
    items: [
      'Git and GitHub, main/develop branching',
      'Pull-request review',
      'Unit and integration testing',
      'CI/CD (GitHub Actions, GitLab CI, Jenkins)',
      'Reproducible pipelines',
      'AI-assisted development held to hand-written standards',
    ],
  },
  {
    name: 'BI & Visualisation',
    items: ['Power BI (dashboards, DAX)', 'Kibana', 'Matplotlib', 'Seaborn'],
  },
]
