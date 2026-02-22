package config

import (
	"fmt"
	"os"
)

type Config struct {
	RPCUrl          string
	PrivateKey      string
	ContractAddress string
	DAEndpoint      string
	EncryptKey      string // 32-byte hex key for AES-256-GCM
}

func Load() (*Config, error) {
	cfg := &Config{
		RPCUrl:          os.Getenv("ZG_RPC_URL"),
		PrivateKey:      os.Getenv("ZG_PRIVATE_KEY"),
		ContractAddress: os.Getenv("ZG_CONTRACT_ADDRESS"),
		DAEndpoint:      os.Getenv("ZG_DA_ENDPOINT"),
		EncryptKey:      os.Getenv("ZG_ENCRYPT_KEY"),
	}
	if cfg.RPCUrl == "" {
		return nil, fmt.Errorf("ZG_RPC_URL is required")
	}
	if cfg.PrivateKey == "" {
		return nil, fmt.Errorf("ZG_PRIVATE_KEY is required")
	}
	if cfg.ContractAddress == "" {
		return nil, fmt.Errorf("ZG_CONTRACT_ADDRESS is required")
	}
	if len(cfg.EncryptKey) != 64 {
		return nil, fmt.Errorf("ZG_ENCRYPT_KEY must be a 64-character hex string (32 bytes)")
	}
	return cfg, nil
}
