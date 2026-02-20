package agent

import (
	"context"
	"log"

	"github.com/{{author}}/{{projectName}}/internal/config"
	"github.com/{{author}}/{{projectName}}/internal/hcs"
	"github.com/{{author}}/{{projectName}}/internal/hts"
)

type Agent struct {
	cfg *config.Config
	hcs *hcs.Client
	hts *hts.Client
}

func New(cfg *config.Config) (*Agent, error) {
	hcsClient, err := hcs.NewClient(cfg)
	if err != nil {
		return nil, err
	}

	htsClient, err := hts.NewClient(cfg)
	if err != nil {
		return nil, err
	}

	return &Agent{cfg: cfg, hcs: hcsClient, hts: htsClient}, nil
}

func (a *Agent) Start(ctx context.Context) error {
	log.Println("agent started on", a.cfg.Network)

	<-ctx.Done()
	log.Println("agent shutting down")
	return nil
}
