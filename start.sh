#!/usr/bin/env bash
# start.sh — Start the Jira Clone Teams app locally and open in Teams
# Run this instead of F5 to avoid the VS Code browser attach error.

set -e

ENV_LOCAL="env/.env.local"
LOCAL_CONFIGS=".localConfigs"
SSL_CRT="C:/Users/jerom/.fx/certificate/localhost.crt"
SSL_KEY="C:/Users/jerom/.fx/certificate/localhost.key"
PORT=53000

# Create .localConfigs if it doesn't exist
if [ ! -f "$LOCAL_CONFIGS" ]; then
  echo "Creating $LOCAL_CONFIGS..."
  cat > "$LOCAL_CONFIGS" <<EOF
PORT=$PORT
SSL_CRT_FILE=$SSL_CRT
SSL_KEY_FILE=$SSL_KEY
EOF
fi

# Read TEAMS_APP_ID from env/.env.local
TEAMS_APP_ID=""
if [ -f "$ENV_LOCAL" ]; then
  TEAMS_APP_ID=$(grep "^TEAMS_APP_ID=" "$ENV_LOCAL" | cut -d '=' -f2)
fi

# Build the Teams URL
if [ -n "$TEAMS_APP_ID" ]; then
  TEAMS_URL="https://teams.microsoft.com/l/app/${TEAMS_APP_ID}?installAppPackage=true&webjoin=true"
else
  echo "Warning: TEAMS_APP_ID not found in $ENV_LOCAL"
  echo "Run F5 once in VS Code to sideload the app first, then use this script."
  TEAMS_URL="https://teams.microsoft.com"
fi

echo ""
echo "Starting Jira Clone on https://localhost:$PORT ..."
echo ""
echo "Teams URL: $TEAMS_URL"
echo ""

# Start the server in background
npm run dev:teamsfx &
SERVER_PID=$!

# Wait for the server to be ready
echo "Waiting for server to start..."
for i in $(seq 1 30); do
  if curl -sk "https://localhost:$PORT/tabs/home" -o /dev/null 2>/dev/null; then
    echo "Server is ready!"
    break
  fi
  sleep 1
done

# Open Teams in the default browser
echo "Opening Teams..."
start "$TEAMS_URL" 2>/dev/null || \
  open "$TEAMS_URL" 2>/dev/null || \
  echo "Open this URL in your browser: $TEAMS_URL"

echo ""
echo "Server running (PID $SERVER_PID). Press Ctrl+C to stop."
wait $SERVER_PID
