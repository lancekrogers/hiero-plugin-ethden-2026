package config

import (
	"fmt"
	"os"
)

type Config struct {
	RPCUrl          string
	PrivateKey      string
	ComputeEndpoint string
	StorageEndpoint string
}

func Load() (*Config, error) {
	cfg := &Config{
		RPCUrl:          os.Getenv("ZG_RPC_URL"),
		PrivateKey:      os.Getenv("ZG_PRIVATE_KEY"),
		ComputeEndpoint: os.Getenv("ZG_COMPUTE_ENDPOINT"),
		StorageEndpoint: os.Getenv("ZG_STORAGE_ENDPOINT"),
	}
	if cfg.RPCUrl == "" {
		return nil, fmt.Errorf("ZG_RPC_URL is required")
	}
	if cfg.PrivateKey == "" {
		return nil, fmt.Errorf("ZG_PRIVATE_KEY is required")
	}
	return cfg, nil
}
