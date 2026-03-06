#!/usr/bin/env bash
# deploy.sh — Provision, deploy, and publish the Jira Clone Teams app to Azure
# Usage:
#   ./deploy.sh            # provision + deploy + publish
#   ./deploy.sh provision  # provision only
#   ./deploy.sh deploy     # deploy only (requires prior provision)
#   ./deploy.sh publish    # publish only (requires prior deploy)

set -e

CLI="npx @microsoft/teamsapp-cli"
ENV="dev"

print_step() {
  echo ""
  echo "=========================================="
  echo " $1"
  echo "=========================================="
}

run_provision() {
  print_step "PROVISION — Creating Azure resources"
  $CLI provision --env $ENV --interactive true
  echo "✓ Provision complete"
}

run_deploy() {
  print_step "DEPLOY — Building and uploading to Azure"
  $CLI deploy --env $ENV
  echo "✓ Deploy complete"
}

run_publish() {
  print_step "PUBLISH — Submitting app to Teams"
  $CLI publish --env $ENV
  echo ""
  echo "✓ Publish complete"
  echo ""
  echo "Next steps:"
  echo "  1. Go to https://admin.teams.microsoft.com/policies/manage-apps"
  echo "  2. Find 'JiraClonedev' and click Publish to approve it"
  echo "  3. In Teams: Apps → Built for your org → install Jira Clone"
}

STEP="${1:-all}"

case $STEP in
  provision) run_provision ;;
  deploy)    run_deploy ;;
  publish)   run_publish ;;
  all)
    run_provision
    run_deploy
    run_publish
    ;;
  *)
    echo "Unknown step: $STEP"
    echo "Usage: ./deploy.sh [provision|deploy|publish|all]"
    exit 1
    ;;
esac
