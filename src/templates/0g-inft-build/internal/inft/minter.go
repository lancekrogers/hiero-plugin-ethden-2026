package inft

import (
	"context"
	"fmt"
	"math/big"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

// Minter mints ERC-7857 iNFTs on the 0G EVM chain.
type Minter struct {
	contract *bind.BoundContract
	address  common.Address
	client   *ethclient.Client
}

// NewMinter creates a Minter bound to the deployed ERC-7857 contract.
func NewMinter(client *ethclient.Client, contractAddress string) (*Minter, error) {
	addr := common.HexToAddress(contractAddress)
	parsed, err := abi.JSON(strings.NewReader(ERC7857ABI))
	if err != nil {
		return nil, fmt.Errorf("parse abi: %w", err)
	}
	contract := bind.NewBoundContract(addr, parsed, client, client, client)
	return &Minter{contract: contract, address: addr, client: client}, nil
}

// Mint mints a new iNFT with the given tokenURI (typically a 0G DA CID).
// Returns the minted token ID.
func (m *Minter) Mint(ctx context.Context, opts *bind.TransactOpts, to common.Address, tokenURI string) (*big.Int, error) {
	tx, err := m.contract.Transact(opts, "mint", to, tokenURI)
	if err != nil {
		return nil, fmt.Errorf("mint tx: %w", err)
	}
	receipt, err := bind.WaitMined(ctx, m.client, tx)
	if err != nil {
		return nil, fmt.Errorf("wait mined: %w", err)
	}
	if receipt.Status == 0 {
		return nil, fmt.Errorf("mint tx reverted: %s", tx.Hash().Hex())
	}
	return big.NewInt(int64(receipt.BlockNumber.Int64())), nil
}
