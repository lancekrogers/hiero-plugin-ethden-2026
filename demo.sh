#!/usr/bin/env bash
# hiero-plugin-camp Demo Script
# Demonstrates all three camp commands through the Hiero CLI

set -e

echo "=== hiero-plugin-camp Demo ==="
echo ""

echo "--- Step 1: Initialize a Hedera project ---"
echo "Running: hcli camp init --name demo-project --template hedera-smart-contract"
hcli camp init --name demo-project --template hedera-smart-contract
echo ""

echo "--- Step 2: Check workspace status ---"
echo "Running: hcli camp status"
cd demo-project
hcli camp status
echo ""

echo "--- Step 3: Navigate the workspace ---"
echo "Running: hcli camp navigate demo"
hcli camp navigate --target demo
echo ""

echo "--- Demo Complete ---"
echo "Cleaning up demo project..."
cd ..
rm -rf demo-project
echo "Done! All three commands demonstrated successfully."
