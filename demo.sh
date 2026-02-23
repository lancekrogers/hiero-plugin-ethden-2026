#!/usr/bin/env bash
# hiero-plugin-camp Demo Script
# Demonstrates all three camp commands through the Hiero CLI
# Use this script while screen recording for the ETHDenver submission video.

set -e

echo "=== hiero-plugin-camp Demo ==="
echo "Hiero CLI plugin for Hedera and 0G workspace management"
echo ""

echo "--- Step 1: Initialize a Hedera dApp project ---"
echo "Running: hcli camp init --name my-hedera-dapp --template hedera-dapp"
hcli camp init --name my-hedera-dapp --template hedera-dapp
echo ""

echo "--- Step 2: Initialize a 0G agent in the same workspace ---"
echo "Running: hcli camp init --name my-0g-agent --template 0g-agent"
hcli camp init --name my-0g-agent --template 0g-agent
echo ""

echo "--- Step 3: Check workspace status ---"
echo "Running: hcli camp status --verbose"
hcli camp status --verbose
echo ""

echo "--- Step 4: Navigate to a project ---"
echo "Running: hcli camp navigate --target my-0g"
hcli camp navigate --target my-0g
echo ""

echo "--- Step 5: Show final workspace status ---"
echo "Running: hcli camp status"
hcli camp status
echo ""

echo "=== Demo Complete ==="
echo "Three commands demonstrated: init, status, navigate"
echo "Two ecosystems: Hedera (hedera-dapp) and 0G (0g-agent)"
