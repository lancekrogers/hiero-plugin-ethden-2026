package main

import (
	"context"
	"encoding/hex"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"

	"github.com/{{author}}/{{projectName}}/internal/config"
	zgcrypto "github.com/{{author}}/{{projectName}}/internal/crypto"
	"github.com/{{author}}/{{projectName}}/internal/da"
	"github.com/{{author}}/{{projectName}}/internal/inft"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

func main() {
	_ = godotenv.Load()

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	encKey, err := hex.DecodeString(cfg.EncryptKey)
	if err != nil {
		log.Fatalf("decode encrypt key: %v", err)
	}

	// Encrypt model weights (replace with real model bytes).
	modelWeights := []byte("stub-model-weights")
	ciphertext, nonce, err := zgcrypto.Encrypt(encKey, modelWeights)
	if err != nil {
		log.Fatalf("encrypt: %v", err)
	}
	_ = nonce // store nonce alongside ciphertext in production

	publisher := da.NewPublisher(cfg.DAEndpoint)
	cid, err := publisher.Publish(ctx, ciphertext)
	if err != nil {
		log.Fatalf("da publish: %v", err)
	}
	log.Printf("published encrypted model to DA: cid=%s", cid)

	client, err := ethclient.DialContext(ctx, cfg.RPCUrl)
	if err != nil {
		log.Fatalf("dial rpc: %v", err)
	}
	defer client.Close()

	privKey, err := crypto.HexToECDSA(cfg.PrivateKey)
	if err != nil {
		log.Fatalf("load key: %v", err)
	}

	chainID, err := client.ChainID(ctx)
	if err != nil {
		log.Fatalf("chain id: %v", err)
	}

	opts, err := bind.NewKeyedTransactorWithChainID(privKey, chainID)
	if err != nil {
		log.Fatalf("transact opts: %v", err)
	}
	opts.Context = ctx

	minter, err := inft.NewMinter(client, cfg.ContractAddress)
	if err != nil {
		log.Fatalf("new minter: %v", err)
	}

	to := common.HexToAddress(cfg.ContractAddress) // mint to self for demo
	tokenID, err := minter.Mint(ctx, opts, to, "0g-da://"+cid)
	if err != nil {
		log.Fatalf("mint: %v", err)
	}
	log.Printf("minted iNFT tokenID=%s tokenURI=0g-da://%s", tokenID.String(), cid)
}
