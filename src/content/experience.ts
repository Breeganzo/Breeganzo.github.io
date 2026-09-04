import type { Role } from './types'

// Bullets are drawn from the two current resumes only.
// Deliberately excluded: the four unverifiable platform-era metrics from the
// previous site (35% cost reduction, 50+ applications migrated, 40% ticket
// reduction, 15% accuracy improvement), and the Elastic ML observability work.

export const roles: Role[] = [
  {
    company: 'Kyndryl',
    title: 'AI Engineer / Data Scientist',
    location: 'Bangalore, India',
    start: 'Jan 2025',
    end: 'Present',
    bullets: [
      'Built 15 agents within a ~60-agent production operations platform for a global hospitality client, using Google ADK and Vertex AI with MCP as the tool and resource layer.',
      'Architected an NDA generation and contract-redlining platform on AWS Bedrock multi-agent orchestration, enabling automated drafting, clause amendments and version tracking with LLM-based quality assurance.',
      'Delivered a RAG pipeline for a banking client using FAISS vector similarity search over sensitive financial documents, under strict data-handling protocols, with a Streamlit frontend for business users.',
      'Developed a RAG question-answering chatbot on Cloudera with user-specific session memory and privacy-compliant data isolation, integrated into a React frontend.',
      'Co-developed a LangGraph-orchestrated data quality agent — 12-node pipeline, dbt and DuckDB — validating 54 rules across six quality dimensions, raising the automated quality score from 51% to 100%.',
      'Built statistical anomaly-detection models for IT infrastructure monitoring using PCA, STL decomposition and EWMA, and presented findings to senior stakeholders through Power BI dashboards.',
      'Deployed cloud-native AI services on AWS (Docker/ECS, Lambda, S3) with CloudWatch monitoring and Terraform-managed multi-environment provisioning.',
      'Mentored junior engineers through knowledge-transfer sessions and translated data-quality and model findings into remediation plans for client engineering teams.',
    ],
  },
  {
    company: 'Zero2AI',
    title: 'AI Engineer Intern',
    location: 'London, United Kingdom',
    start: 'Jan 2024',
    end: 'Mar 2024',
    bullets: [
      'Designed a RAG-based knowledge retrieval system using LangChain and FAISS, enabling natural-language querying of course content for an AI education platform.',
      'Built prototypes for automated content generation and prompt-optimisation workflows.',
    ],
  },
  {
    company: 'Evertz',
    title: 'Software Engineer Intern',
    location: 'Bangalore, India',
    start: 'Oct 2022',
    end: 'Jul 2023',
    bullets: [
      'Built Python backend services for automated monitoring of OTT streaming platforms (NHL, NBA, MLB), processing real-time broadcast data and reducing manual error-detection effort by 20% across 10,000+ media assets.',
      'Developed REST APIs and data pipelines for media asset management, enabling automated content cataloguing and metadata extraction.',
    ],
  },
]
