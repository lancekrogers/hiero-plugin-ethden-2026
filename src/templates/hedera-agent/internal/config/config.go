package config

import (
	"fmt"
	"os"
)

type Config struct {
	Network     string
	OperatorID  string
	OperatorKey string
}

func Load() (*Config, error) {
	network := os.Getenv("HEDERA_NETWORK")
	if network == "" {
		network = "testnet"
	}

	operatorID := os.Getenv("HEDERA_OPERATOR_ID")
	if operatorID == "" {
		return nil, fmt.Errorf("HEDERA_OPERATOR_ID is required")
	}

	operatorKey := os.Getenv("HEDERA_OPERATOR_KEY")
	if operatorKey == "" {
		return nil, fmt.Errorf("HEDERA_OPERATOR_KEY is required")
	}

	return &Config{
		Network:     network,
		OperatorID:  operatorID,
		OperatorKey: operatorKey,
	}, nil
}
