package hts

import (
	"github.com/hashgraph/hedera-sdk-go/v2"

	"github.com/{{author}}/{{projectName}}/internal/config"
)

type Client struct {
	hedera *hedera.Client
}

func NewClient(cfg *config.Config) (*Client, error) {
	var client *hedera.Client
	if cfg.Network == "mainnet" {
		client = hedera.ClientForMainnet()
	} else {
		client = hedera.ClientForTestnet()
	}

	operatorID, err := hedera.AccountIDFromString(cfg.OperatorID)
	if err != nil {
		return nil, err
	}

	operatorKey, err := hedera.PrivateKeyFromString(cfg.OperatorKey)
	if err != nil {
		return nil, err
	}

	client.SetOperator(operatorID, operatorKey)
	return &Client{hedera: client}, nil
}
