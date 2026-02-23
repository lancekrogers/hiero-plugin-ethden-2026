package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"

	"github.com/{{author}}/{{projectName}}/internal/config"
	"github.com/{{author}}/{{projectName}}/internal/zerog"
)

func main() {
	_ = godotenv.Load()

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	key, err := zerog.LoadKey(cfg.PrivateKey)
	if err != nil {
		log.Fatalf("load key: %v", err)
	}

	client, err := zerog.DialClient(ctx, cfg.RPCUrl)
	if err != nil {
		log.Fatalf("dial client: %v", err)
	}
	defer client.Close()

	compute := zerog.NewComputeBroker(cfg.ComputeEndpoint)
	storage := zerog.NewStorageClient(cfg.StorageEndpoint)

	_ = key // used when signing on-chain transactions

	log.Println("0g-agent running — press Ctrl+C to stop")
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Println("shutting down")
			return
		case <-ticker.C:
			taskID, err := compute.SubmitTask(ctx, []byte("hello-0g"))
			if err != nil {
				log.Printf("compute submit: %v", err)
				continue
			}
			cid, err := storage.Upload(ctx, []byte("result-"+taskID))
			if err != nil {
				log.Printf("storage upload: %v", err)
				continue
			}
			log.Printf("task=%s stored=%s", taskID, cid)
		}
	}
}
