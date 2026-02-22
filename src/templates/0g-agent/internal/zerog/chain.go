package zerog

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

// LoadKey parses a hex-encoded ECDSA private key.
func LoadKey(hexKey string) (*ecdsa.PrivateKey, error) {
	return crypto.HexToECDSA(hexKey)
}

// DialClient connects to the 0G EVM-compatible RPC endpoint.
func DialClient(ctx context.Context, rpcURL string) (*ethclient.Client, error) {
	client, err := ethclient.DialContext(ctx, rpcURL)
	if err != nil {
		return nil, fmt.Errorf("dial 0G RPC %s: %w", rpcURL, err)
	}
	return client, nil
}

// MakeTransactOpts creates a signed transaction signer for the given chain.
func MakeTransactOpts(ctx context.Context, key *ecdsa.PrivateKey, chainID *big.Int) (*bind.TransactOpts, error) {
	opts, err := bind.NewKeyedTransactorWithChainID(key, chainID)
	if err != nil {
		return nil, fmt.Errorf("make transact opts: %w", err)
	}
	opts.Context = ctx
	return opts, nil
}
