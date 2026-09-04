#!/usr/bin/env bash
# Sets the description, homepage and topics for every repository the portfolio
# links to. Descriptions are the project taglines from src/content/projects.ts,
# so GitHub and the site cannot drift apart.
#
# Idempotent — safe to re-run. Requires `gh auth login` as Breeganzo.
set -euo pipefail

SITE="https://breeganzo.github.io"

set_repo() {
  local repo="$1" desc="$2" topics="$3" home="${4:-$SITE}"
  echo "→ $repo"
  gh repo edit "Breeganzo/$repo" --description "$desc" --homepage "$home" >/dev/null
  # shellcheck disable=SC2086
  gh repo edit "Breeganzo/$repo" $(printf -- '--add-topic %s ' $topics) >/dev/null
}

set_repo scintilla \
  "Hybrid search and grounded question answering over 3,377 arXiv preprints — with a retrieval ablation that fails CI if quality regresses." \
  "rag retrieval-augmented-generation information-retrieval hybrid-search pgvector opensearch airflow django python llm evaluation"

set_repo AlphaFlow \
  "Market-microstructure alpha research engine with a fully deterministic long-short signal, walk-forward validation and Benjamini-Hochberg correction across ~50 tickers." \
  "quantitative-finance alpha-research market-microstructure walk-forward-validation lightgbm shap fastapi react python algorithmic-trading"

set_repo de-forecast-entsoe \
  "Day-ahead electricity price forecasting for the DE-LU bidding zone from the ENTSO-E API — ~61% MAE reduction against a seasonal-naive baseline." \
  "energy-markets electricity-price-forecasting time-series-forecasting entsoe lightgbm shap python quantitative-research"

set_repo AWS_LZ_AGENT \
  "An AI consultant that turns stated business, compliance and security requirements into an AWS landing-zone architecture, with diagrams and written documentation." \
  "aws landing-zone cloud-architecture generative-ai streamlit python cloud-governance"

set_repo Self-healing-infrastructure-monitor \
  "Infrastructure monitoring that remediates recurring failure conditions — disk exhaustion, stopped instances, downed services — instead of only alerting on them." \
  "sre observability self-healing automation aws fastapi python devops"

set_repo french-on-the-fly \
  "A free French-learning app with an AI conversation partner, voice interaction and a structured A0-to-B2 curriculum." \
  "language-learning llm speech-recognition python react education generative-ai"

set_repo Vault_Q \
  "A research-guidance marketplace for life-science students, built on free tiers to run at genuinely zero platform cost." \
  "react firebase firestore marketplace education javascript github-pages"

set_repo RMD_Agent_Demo \
  "LangGraph ReAct screening agent for the University of Reading RMD-Health project — explainable, FHIR R4 compliant." \
  "langgraph react-agent healthcare fhir explainable-ai streamlit python llm"

echo
echo "Done. Topics are additive — remove any stale ones with:"
echo "  gh repo edit Breeganzo/<repo> --remove-topic <topic>"
